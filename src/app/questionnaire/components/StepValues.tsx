"use client";

import type { FormData } from "../types";
import TagSelector from "./TagSelector";

const concernOptions = [
  "Screen addiction",
  "Online safety",
  "AI replacing jobs",
  "Loss of creativity",
  "Social media pressure",
  "Misinformation",
  "Privacy & data",
  "Cyberbullying",
  "Attention spans",
  "Academic pressure",
  "Mental health",
  "Loss of human connection",
];

const valueOptions = [
  "Kindness",
  "Curiosity",
  "Resilience",
  "Honesty",
  "Creativity",
  "Faith",
  "Independence",
  "Community",
  "Hard work",
  "Empathy",
  "Gratitude",
  "Adventure",
  "Education",
  "Family first",
  "Environmental care",
  "Equality",
];

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function StepValues({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-warm-900 md:text-3xl">
        Values &amp; priorities
      </h2>
      <p className="mt-2 text-warm-500">
        This is the heart of your guidebook. Your values shape every
        recommendation we make.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            What concerns you most about your family&rsquo;s future in the age
            of AI?
          </label>
          <p className="mb-3 text-sm text-warm-400">
            Select all that resonate with you.
          </p>
          <TagSelector
            options={concernOptions}
            selected={data.futureConcerns}
            onChange={(futureConcerns) => onChange({ futureConcerns })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            What are your family&rsquo;s core values?
          </label>
          <p className="mb-3 text-sm text-warm-400">
            Choose the values that guide your family&rsquo;s decisions.
          </p>
          <TagSelector
            options={valueOptions}
            selected={data.coreValues}
            onChange={(coreValues) => onChange({ coreValues })}
          />
        </div>

        <div>
          <label
            htmlFor="legacy"
            className="mb-1.5 block text-sm font-medium text-warm-700"
          >
            When your children look back, what do you hope they remember most?
          </label>
          <textarea
            id="legacy"
            rows={4}
            placeholder="That we always made time for each other, that they felt safe to ask hard questions..."
            value={data.legacy}
            onChange={(e) => onChange({ legacy: e.target.value })}
            className="w-full resize-none rounded-lg border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>
      </div>
    </div>
  );
}
