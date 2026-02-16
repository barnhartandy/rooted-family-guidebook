"use client";

import type { FormData } from "../types";

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function StepHomeLifestyle({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-warm-900 md:text-3xl">
        Home &amp; lifestyle
      </h2>
      <p className="mt-2 text-warm-500">
        Help us understand the rhythm of your family life so your guidebook
        feels like it was written just for you.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="perfectWeekend"
            className="mb-1.5 block text-sm font-medium text-warm-700"
          >
            Describe your perfect weekend together
          </label>
          <textarea
            id="perfectWeekend"
            rows={4}
            placeholder="Saturday morning pancakes, afternoon at the park, movie night..."
            value={data.perfectWeekend}
            onChange={(e) => onChange({ perfectWeekend: e.target.value })}
            className="w-full resize-none rounded-lg border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div>
          <label
            htmlFor="traditions"
            className="mb-1.5 block text-sm font-medium text-warm-700"
          >
            What traditions or rituals does your family hold dear?
          </label>
          <textarea
            id="traditions"
            rows={4}
            placeholder="Friday pizza night, annual camping trip, Sunday phone-free dinners..."
            value={data.traditions}
            onChange={(e) => onChange({ traditions: e.target.value })}
            className="w-full resize-none rounded-lg border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div>
          <label
            htmlFor="financialApproach"
            className="mb-1.5 block text-sm font-medium text-warm-700"
          >
            How would you describe your family&rsquo;s approach to finances?
          </label>
          <p className="mb-2 text-sm text-warm-400">
            This helps us tailor the guidebook&rsquo;s recommendations around
            tools and resources.
          </p>
          <textarea
            id="financialApproach"
            rows={3}
            placeholder="We're savers who prioritize experiences over things..."
            value={data.financialApproach}
            onChange={(e) => onChange({ financialApproach: e.target.value })}
            className="w-full resize-none rounded-lg border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div>
          <label
            htmlFor="travelPreferences"
            className="mb-1.5 block text-sm font-medium text-warm-700"
          >
            What does travel look like for your family?
          </label>
          <textarea
            id="travelPreferences"
            rows={3}
            placeholder="Road trips to national parks, visiting family across the country, staycations..."
            value={data.travelPreferences}
            onChange={(e) => onChange({ travelPreferences: e.target.value })}
            className="w-full resize-none rounded-lg border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>
      </div>
    </div>
  );
}
