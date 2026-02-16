"use client";

import type { FormData } from "../types";

interface Props {
  data: FormData;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-warm-200 bg-white p-6">
      <h3 className="mb-4 font-serif text-lg font-medium text-warm-800">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="mb-3 last:mb-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-warm-400">
        {label}
      </dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm text-warm-700">
        {value}
      </dd>
    </div>
  );
}

function Tags({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-3 last:mb-0">
      <dt className="mb-1.5 text-xs font-medium uppercase tracking-wide text-warm-400">
        {label}
      </dt>
      <dd className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-terra/10 px-3 py-1 text-xs text-terra"
          >
            {item}
          </span>
        ))}
      </dd>
    </div>
  );
}

export default function StepReview({ data }: Props) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-warm-900 md:text-3xl">
        Review your answers
      </h2>
      <p className="mt-2 text-warm-500">
        Take a moment to make sure everything looks right. You can go back to
        edit any section.
      </p>

      <div className="mt-8 space-y-6">
        {/* Family Basics */}
        <Section title="Family Basics">
          <dl>
            <Field label="Family name" value={data.familyName} />
            <Field label="Location" value={data.location} />
            <Field label="About your family" value={data.description} />
          </dl>
        </Section>

        {/* Family Members */}
        <Section title="Family Members">
          {data.members.length === 0 ? (
            <p className="text-sm italic text-warm-400">
              No family members added.
            </p>
          ) : (
            <div className="space-y-4">
              {data.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg bg-warm-50 p-4"
                >
                  <p className="mb-2 font-medium text-warm-800">
                    {member.name || "Unnamed"}{" "}
                    {member.role && (
                      <span className="text-sm font-normal text-warm-400">
                        &middot; {member.role}
                      </span>
                    )}{" "}
                    {member.age && (
                      <span className="text-sm font-normal text-warm-400">
                        &middot; age {member.age}
                      </span>
                    )}
                  </p>
                  <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    <Field label="Occupation" value={member.occupation} />
                    <Field
                      label="Personality"
                      value={member.personalityType}
                    />
                    <Field label="Strengths" value={member.strengths} />
                    <Field label="Challenges" value={member.challenges} />
                  </dl>
                  <Tags label="Interests" items={member.interests} />
                  {member.additionalDetails && (
                    <Field label="Details" value={member.additionalDetails} />
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Home & Lifestyle */}
        <Section title="Home & Lifestyle">
          <dl>
            <Field label="Perfect weekend" value={data.perfectWeekend} />
            <Field label="Traditions" value={data.traditions} />
            <Field
              label="Financial approach"
              value={data.financialApproach}
            />
            <Field
              label="Travel preferences"
              value={data.travelPreferences}
            />
          </dl>
        </Section>

        {/* Values & Priorities */}
        <Section title="Values & Priorities">
          <Tags label="Concerns about the future" items={data.futureConcerns} />
          <Tags label="Core values" items={data.coreValues} />
          <Field label="Legacy" value={data.legacy} />
        </Section>
      </div>
    </div>
  );
}
