"use client";

import type { FormData } from "../types";

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function StepFamilyBasics({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-warm-900 md:text-3xl">
        Tell us about your family
      </h2>
      <p className="mt-2 text-warm-500">
        We&rsquo;ll use this to personalize your guidebook from the very first
        page.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="familyName"
            className="mb-1.5 block text-sm font-medium text-warm-700"
          >
            Family name
          </label>
          <input
            id="familyName"
            type="text"
            placeholder="e.g. The Johnsons"
            value={data.familyName}
            onChange={(e) => onChange({ familyName: e.target.value })}
            className="w-full rounded-lg border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-1.5 block text-sm font-medium text-warm-700"
          >
            Where are you located?
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Portland, Oregon"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="w-full rounded-lg border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-warm-700"
          >
            Describe your family in a few sentences
          </label>
          <p className="mb-2 text-sm text-warm-400">
            What makes your family unique? What does daily life look like?
          </p>
          <textarea
            id="description"
            rows={5}
            placeholder="We're a family of four who loves hiking, board games, and long dinners together..."
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full resize-none rounded-lg border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>
      </div>
    </div>
  );
}
