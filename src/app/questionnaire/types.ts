export interface FamilyMember {
  id: string;
  name: string;
  age: string;
  role: "parent" | "child" | "partner" | "";
  occupation: string;
  personalityType: string;
  interests: string[];
  strengths: string;
  challenges: string;
  additionalDetails: string;
}

export interface FormData {
  // Step 1 - Family Basics
  familyName: string;
  location: string;
  description: string;

  // Step 2 - Family Members
  members: FamilyMember[];

  // Step 3 - Home & Lifestyle
  perfectWeekend: string;
  traditions: string;
  financialApproach: string;
  travelPreferences: string;

  // Step 4 - Values & Priorities
  futureConcerns: string[];
  coreValues: string[];
  legacy: string;
}

export const initialFormData: FormData = {
  familyName: "",
  location: "",
  description: "",
  members: [],
  perfectWeekend: "",
  traditions: "",
  financialApproach: "",
  travelPreferences: "",
  futureConcerns: [],
  coreValues: [],
  legacy: "",
};

export function createEmptyMember(): FamilyMember {
  return {
    id: crypto.randomUUID(),
    name: "",
    age: "",
    role: "",
    occupation: "",
    personalityType: "",
    interests: [],
    strengths: "",
    challenges: "",
    additionalDetails: "",
  };
}
