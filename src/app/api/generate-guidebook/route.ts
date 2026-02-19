import { runGeneration } from "@/lib/generation";
import type { FormData } from "@/app/questionnaire/types";

// Allow up to 5 minutes for Opus to generate the full guidebook
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const { formData, email } = (await request.json()) as {
      formData: FormData;
      email: string;
    };

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream status updates back to the client via SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: { status: string; step: string }) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          // Send initial metadata
          const memberNames = formData.members
            .map((m: { name: string }) => m.name)
            .filter(Boolean);
          sendEvent({
            status: "starting",
            step: JSON.stringify({
              familyName: formData.familyName || "Your",
              memberNames,
              email,
            }),
          });

          await runGeneration(formData, email, sendEvent);
        } catch (err) {
          console.error("Generate guidebook error:", err);
          const message =
            err instanceof Error ? err.message : "Failed to generate guidebook";
          sendEvent({ status: "error", step: message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Generate guidebook error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to start generation";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
