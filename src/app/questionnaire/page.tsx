"use client";

import { useState } from "react";
import Link from "next/link";
import { type FormData, initialFormData } from "./types";
import ProgressBar from "./components/ProgressBar";
import StepFamilyBasics from "./components/StepFamilyBasics";
import StepFamilyMembers from "./components/StepFamilyMembers";
import StepHomeLifestyle from "./components/StepHomeLifestyle";
import StepValues from "./components/StepValues";
import StepReview from "./components/StepReview";

const TOTAL_STEPS = 5;

export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialFormData);

  function update(partial: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLastStep = step === TOTAL_STEPS - 1;

  async function handleCheckout() {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: data }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <nav className="border-b border-warm-200/60 bg-warm-50">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-warm-500 transition-colors hover:text-warm-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to home
          </Link>
          <span className="font-serif text-sm font-medium text-warm-700">
            Rooted Family
          </span>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-8 md:py-12">
        <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 0 && (
          <StepFamilyBasics data={data} onChange={update} />
        )}
        {step === 1 && (
          <StepFamilyMembers data={data} onChange={update} />
        )}
        {step === 2 && (
          <StepHomeLifestyle data={data} onChange={update} />
        )}
        {step === 3 && <StepValues data={data} onChange={update} />}
        {step === 4 && <StepReview data={data} />}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-warm-200/60 pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-2 rounded-full border border-warm-200 bg-white px-6 py-3 text-sm font-medium text-warm-600 transition-colors hover:border-warm-300 hover:text-warm-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}

          {isLastStep ? (
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="rounded-full bg-terra px-8 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-terra-dark hover:shadow-md disabled:opacity-60"
            >
              {isSubmitting ? "Redirecting..." : "Generate Guidebook"}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 rounded-full bg-terra px-8 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-terra-dark hover:shadow-md"
            >
              Continue
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
