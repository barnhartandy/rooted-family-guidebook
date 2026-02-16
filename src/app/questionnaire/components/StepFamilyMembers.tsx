"use client";

import type { FormData, FamilyMember } from "../types";
import { createEmptyMember } from "../types";
import TagSelector from "./TagSelector";

const interestOptions = [
  "Reading",
  "Sports",
  "Music",
  "Art",
  "Gaming",
  "Cooking",
  "Science",
  "Nature",
  "Technology",
  "Writing",
  "Animals",
  "Travel",
  "Photography",
  "Dance",
  "Theater",
  "Crafts",
  "Coding",
  "Gardening",
];

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function StepFamilyMembers({ data, onChange }: Props) {
  function addMember() {
    onChange({ members: [...data.members, createEmptyMember()] });
  }

  function removeMember(id: string) {
    onChange({ members: data.members.filter((m) => m.id !== id) });
  }

  function updateMember(id: string, updates: Partial<FamilyMember>) {
    onChange({
      members: data.members.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-warm-900 md:text-3xl">
        Who&rsquo;s in your family?
      </h2>
      <p className="mt-2 text-warm-500">
        Add each family member so we can tailor guidance to every age and stage.
      </p>

      <div className="mt-8 space-y-6">
        {data.members.map((member, index) => (
          <MemberCard
            key={member.id}
            member={member}
            index={index}
            onUpdate={(updates) => updateMember(member.id, updates)}
            onRemove={() => removeMember(member.id)}
          />
        ))}

        <button
          type="button"
          onClick={addMember}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-warm-200 px-4 py-4 text-sm font-medium text-warm-500 transition-colors hover:border-warm-300 hover:text-warm-700"
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
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add a family member
        </button>
      </div>
    </div>
  );
}

function MemberCard({
  member,
  index,
  onUpdate,
  onRemove,
}: {
  member: FamilyMember;
  index: number;
  onUpdate: (updates: Partial<FamilyMember>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-warm-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-warm-800">
          {member.name || `Person ${index + 1}`}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-warm-400 transition-colors hover:text-red-500"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            Name
          </label>
          <input
            type="text"
            placeholder="First name"
            value={member.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-300 focus:border-terra focus:bg-white focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            Age
          </label>
          <input
            type="text"
            placeholder="e.g. 12"
            value={member.age}
            onChange={(e) => onUpdate({ age: e.target.value })}
            className="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-300 focus:border-terra focus:bg-white focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            Role
          </label>
          <select
            value={member.role}
            onChange={(e) =>
              onUpdate({ role: e.target.value as FamilyMember["role"] })
            }
            className="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-warm-800 focus:border-terra focus:bg-white focus:outline-none focus:ring-1 focus:ring-terra"
          >
            <option value="">Select role</option>
            <option value="parent">Parent</option>
            <option value="partner">Partner</option>
            <option value="child">Child</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            Occupation
          </label>
          <input
            type="text"
            placeholder="e.g. Teacher, Student"
            value={member.occupation}
            onChange={(e) => onUpdate({ occupation: e.target.value })}
            className="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-300 focus:border-terra focus:bg-white focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            Personality type
          </label>
          <input
            type="text"
            placeholder="e.g. Introvert, ENFP, The Adventurer"
            value={member.personalityType}
            onChange={(e) => onUpdate({ personalityType: e.target.value })}
            className="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-300 focus:border-terra focus:bg-white focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-warm-700">
            Interests
          </label>
          <TagSelector
            options={interestOptions}
            selected={member.interests}
            onChange={(interests) => onUpdate({ interests })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            Strengths
          </label>
          <input
            type="text"
            placeholder="What are they great at?"
            value={member.strengths}
            onChange={(e) => onUpdate({ strengths: e.target.value })}
            className="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-300 focus:border-terra focus:bg-white focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            Challenges
          </label>
          <input
            type="text"
            placeholder="Where do they need support?"
            value={member.challenges}
            onChange={(e) => onUpdate({ challenges: e.target.value })}
            className="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-300 focus:border-terra focus:bg-white focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-warm-700">
            Additional details
          </label>
          <textarea
            rows={2}
            placeholder="Anything else we should know about this person?"
            value={member.additionalDetails}
            onChange={(e) => onUpdate({ additionalDetails: e.target.value })}
            className="w-full resize-none rounded-lg border border-warm-200 bg-warm-50 px-4 py-2.5 text-sm text-warm-800 placeholder:text-warm-300 focus:border-terra focus:bg-white focus:outline-none focus:ring-1 focus:ring-terra"
          />
        </div>
      </div>
    </div>
  );
}
