"use client";

import { useState } from "react";

const TEST_DATA = {
  familyName: "Barnhart",
  location: "Austin, TX",
  description: "A creative, curious family that loves being outdoors and learning together.",
  members: [
    {
      id: "1",
      name: "Andy",
      age: "38",
      role: "parent" as const,
      occupation: "Entrepreneur",
      personalityType: "ENTP",
      interests: ["Technology", "Music", "Cooking"],
      strengths: "Creative problem-solving, adaptable",
      challenges: "Screen time management",
      additionalDetails: "",
    },
    {
      id: "2",
      name: "Sarah",
      age: "36",
      role: "parent" as const,
      occupation: "Teacher",
      personalityType: "INFJ",
      interests: ["Reading", "Gardening", "Art"],
      strengths: "Empathetic, organized",
      challenges: "Keeping up with new tech",
      additionalDetails: "",
    },
    {
      id: "3",
      name: "Liam",
      age: "10",
      role: "child" as const,
      occupation: "",
      personalityType: "Curious and energetic",
      interests: ["Gaming", "Science", "Coding"],
      strengths: "Quick learner, loves building things",
      challenges: "Gets absorbed in screens",
      additionalDetails: "",
    },
    {
      id: "4",
      name: "Nora",
      age: "7",
      role: "child" as const,
      occupation: "",
      personalityType: "Creative and social",
      interests: ["Art", "Dance", "Animals"],
      strengths: "Imaginative, kind",
      challenges: "Wants to do what older brother does online",
      additionalDetails: "",
    },
  ],
  perfectWeekend: "Farmers market in the morning, hiking or biking, cooking dinner together, board games at night.",
  traditions: "Sunday family dinners, summer camping trips, Friday movie nights.",
  financialApproach: "Balanced — we invest in experiences over things.",
  travelPreferences: "Road trips and national parks.",
  futureConcerns: ["Screen addiction", "AI replacing jobs", "Online safety", "Loss of creativity"],
  coreValues: ["Curiosity", "Kindness", "Independence", "Family time", "Creativity"],
  legacy: "We want our kids to be confident, kind humans who use technology as a tool — not a crutch.",
};

export default function TestGenerate() {
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState<string[]>([]);
  const [email, setEmail] = useState("andy@example.com");

  const runTest = async () => {
    setStatus("running");
    setMessages(["Starting generation..."]);

    try {
      const response = await fetch("/api/generate-guidebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: TEST_DATA,
          email,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              setMessages((prev) => [...prev, `[${data.status}] ${data.step}`]);
              if (data.status === "done") setStatus("done");
              if (data.status === "error") {
                setStatus("error");
                throw new Error(data.step);
              }
            } catch (e) {
              if (e instanceof Error && e.message !== "Generation failed") {
                // parse error, skip
              }
            }
          }
        }
      }

      if (status !== "error") setStatus("done");
    } catch (err) {
      setStatus("error");
      setMessages((prev) => [
        ...prev,
        `ERROR: ${err instanceof Error ? err.message : "Unknown error"}`,
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl text-warm-900">Test Generation</h1>
        <p className="mt-2 text-warm-500">
          Sends pre-filled test data directly to the generation endpoint (skips Stripe).
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-warm-700">
            Email to send guidebook to:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-warm-200 px-4 py-2 text-warm-800"
          />
        </div>

        <button
          onClick={runTest}
          disabled={status === "running"}
          className="mt-4 rounded-full bg-terra px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-terra-dark disabled:opacity-50"
        >
          {status === "running" ? "Generating..." : "Run Test Generation"}
        </button>

        {messages.length > 0 && (
          <div className="mt-6 rounded-xl border border-warm-200 bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-warm-700">Log:</h2>
            <ul className="space-y-1 font-mono text-xs text-warm-600">
              {messages.map((msg, i) => (
                <li key={i} className={msg.startsWith("ERROR") ? "text-red-500 font-bold" : ""}>
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {status === "done" && (
          <p className="mt-4 text-sage-700 font-medium">
            ✓ Done! Check {email} for the guidebook.
          </p>
        )}
      </div>
    </div>
  );
}
