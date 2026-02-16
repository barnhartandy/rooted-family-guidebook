"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ServerStatus =
  | "pending"
  | "generating"
  | "formatting"
  | "sending"
  | "done"
  | "error";

interface JobState {
  status: ServerStatus;
  step: string;
  familyName: string;
  memberNames: string[];
  email: string;
  error?: string;
}

// Build the list of simulated chapter messages from member names
function buildChapterMessages(memberNames: string[]): string[] {
  const messages = [
    "Analyzing your family\u2019s unique profile...",
    "Writing your honest assessment...",
    "Mapping out your 3-phase transition plan...",
  ];
  for (const name of memberNames) {
    messages.push(`Crafting ${name}\u2019s chapter...`);
  }
  messages.push(
    "Writing your family playbook...",
    "Drafting your technology agreement...",
    "Curating resources and recommendations...",
    "Writing your closing letter..."
  );
  return messages;
}

export default function GeneratingClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [phase, setPhase] = useState<
    "verifying" | "starting" | "generating" | "formatting" | "sending" | "done" | "error"
  >("verifying");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [chapterMessages, setChapterMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const triggered = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycle through chapter messages during the "generating" phase
  useEffect(() => {
    if (phase === "generating" && chapterMessages.length > 0) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          const next = prev + 1;
          if (next >= chapterMessages.length) {
            // Loop back, staying on the last few messages
            return Math.max(0, chapterMessages.length - 3);
          }
          return next;
        });
      }, 8000);
      messageRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [phase, chapterMessages]);

  // Animate progress bar smoothly
  useEffect(() => {
    const targets: Record<string, number> = {
      verifying: 5,
      starting: 10,
      generating: 15, // Will be overridden by message-based progress
      formatting: 85,
      sending: 95,
      done: 100,
      error: 0,
    };

    if (phase === "generating" && chapterMessages.length > 0) {
      // Progress from 15% to 80% based on message index
      const pct = 15 + (currentMessageIndex / chapterMessages.length) * 65;
      setProgress(Math.min(pct, 80));
    } else {
      setProgress(targets[phase] ?? 0);
    }
  }, [phase, currentMessageIndex, chapterMessages.length]);

  const startGeneration = useCallback(async () => {
    if (!sessionId || triggered.current) return;
    triggered.current = true;

    try {
      // 1. Retrieve session data from Stripe
      setPhase("verifying");
      const sessionRes = await fetch(
        `/api/session?session_id=${encodeURIComponent(sessionId)}`
      );
      const sessionData = await sessionRes.json();

      if (sessionData.error) {
        throw new Error(sessionData.error);
      }

      setFamilyName(sessionData.formData?.familyName || "");
      setEmail(sessionData.email || "");

      const memberNames = (sessionData.formData?.members || [])
        .map((m: { name: string }) => m.name)
        .filter(Boolean);
      setChapterMessages(buildChapterMessages(memberNames));

      // 2. Start the generation job
      setPhase("starting");
      const genRes = await fetch("/api/generate-guidebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: sessionData.formData,
          email: sessionData.email,
        }),
      });
      const genData = await genRes.json();

      if (genData.error) {
        throw new Error(genData.error);
      }

      const { jobId } = genData;
      setPhase("generating");

      // 3. Poll for status
      pollRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch(
            `/api/generate-guidebook?jobId=${encodeURIComponent(jobId)}`
          );
          const pollData: JobState = await pollRes.json();

          if (pollData.status === "formatting") {
            setPhase("formatting");
          } else if (pollData.status === "sending") {
            setPhase("sending");
          } else if (pollData.status === "done") {
            setPhase("done");
            if (pollRef.current) clearInterval(pollRef.current);
          } else if (pollData.status === "error") {
            throw new Error(pollData.error || "Generation failed");
          }
        } catch (err) {
          if (pollRef.current) clearInterval(pollRef.current);
          setErrorMessage(
            err instanceof Error ? err.message : "An unexpected error occurred."
          );
          setPhase("error");
        }
      }, 3000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setPhase("error");
    }
  }, [sessionId]);

  useEffect(() => {
    startGeneration();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (messageRef.current) clearInterval(messageRef.current);
    };
  }, [startGeneration]);

  const currentMessage =
    chapterMessages[currentMessageIndex] || "Writing your guidebook...";

  const phaseDisplay: Record<string, string> = {
    verifying: "Verifying your payment...",
    starting: "Starting your guidebook...",
    generating: currentMessage,
    formatting: "Formatting your guidebook...",
    sending: "Sending to your inbox...",
    done: "",
    error: "",
  };

  return (
    <div className="mx-auto w-full max-w-lg text-center">
      {/* Status icon */}
      {phase === "done" ? (
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sage-600/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-sage-700"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      ) : phase === "error" ? (
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-red-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
      ) : (
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-warm-200 border-t-terra" />
      )}

      {/* Family name */}
      {familyName && phase !== "error" && (
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-sage-600">
          The {familyName} Family Guidebook
        </p>
      )}

      {/* Title */}
      <h1 className="font-serif text-3xl font-medium text-warm-900 md:text-4xl">
        {phase === "done"
          ? "Your guidebook is on its way!"
          : phase === "error"
            ? "Something went wrong"
            : "Generating your guidebook"}
      </h1>

      {/* Subtitle */}
      {phase === "done" ? (
        <p className="mt-4 text-lg leading-relaxed text-warm-500">
          We&rsquo;ve sent your personalized guidebook to your email.
          Check your inbox (and spam folder, just in case).
        </p>
      ) : phase === "error" ? (
        <p className="mt-4 text-lg leading-relaxed text-warm-500">
          {errorMessage}
        </p>
      ) : (
        <p className="mt-4 text-lg leading-relaxed text-warm-500">
          We&rsquo;re crafting a personalized field guide just for your family.
          This usually takes a couple of minutes.
        </p>
      )}

      {/* Progress bar and status message (not shown for done/error) */}
      {phase !== "done" && phase !== "error" && (
        <div className="mt-10">
          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-warm-200">
            <div
              className="h-full rounded-full bg-terra transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current step message */}
          <p
            key={phaseDisplay[phase]}
            className="mt-4 animate-fade-in text-sm font-medium text-warm-600"
          >
            {phaseDisplay[phase]}
          </p>

          {/* Chapter checklist during generation */}
          {phase === "generating" && chapterMessages.length > 0 && (
            <div className="mt-6 rounded-xl border border-warm-200 bg-white px-5 py-4 text-left">
              <ul className="space-y-2">
                {chapterMessages.map((msg, i) => (
                  <li
                    key={msg}
                    className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                      i < currentMessageIndex
                        ? "text-warm-400"
                        : i === currentMessageIndex
                          ? "text-warm-800 font-medium"
                          : "text-warm-300"
                    }`}
                  >
                    {i < currentMessageIndex ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 shrink-0 text-sage-600"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : i === currentMessageIndex ? (
                      <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-warm-200 border-t-terra" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-warm-200" />
                    )}
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Email confirmation on success */}
      {phase === "done" && email && (
        <div className="mt-8 rounded-xl border border-sage-600/20 bg-sage-600/5 px-6 py-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-3 h-8 w-8 text-sage-600"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <p className="text-sm text-warm-600">
            Sent to <span className="font-semibold text-warm-800">{email}</span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8">
        {phase === "error" && (
          <button
            onClick={() => {
              triggered.current = false;
              setPhase("verifying");
              setErrorMessage("");
              setCurrentMessageIndex(0);
              setProgress(0);
              startGeneration();
            }}
            className="mr-4 inline-block rounded-full bg-terra px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-terra-dark hover:shadow-md"
          >
            Try again
          </button>
        )}

        <Link
          href="/"
          className="inline-block text-sm font-medium text-terra transition-colors hover:text-terra-dark"
        >
          {phase === "done" ? "Back to home" : "\u2190 Back to home"}
        </Link>
      </div>
    </div>
  );
}
