import { NextResponse } from "next/server";
import { jobs, createAndRunJob } from "@/lib/generation";
import type { FormData } from "@/app/questionnaire/types";

// -- API routes --

export async function POST(request: Request) {
  try {
    const { formData, email } = (await request.json()) as {
      formData: FormData;
      email: string;
    };

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const jobId = createAndRunJob(formData, email);

    return NextResponse.json({ jobId });
  } catch (err) {
    console.error("Generate guidebook error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to start generation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const job = jobs.get(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: job.status,
    step: job.step,
    familyName: job.familyName,
    memberNames: job.memberNames,
    email: job.email,
    error: job.error,
  });
}
