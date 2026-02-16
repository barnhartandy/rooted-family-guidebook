import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAndRunJob } from "@/lib/generation";
import type { FormData } from "@/app/questionnaire/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  let event: Stripe.Event;

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only process paid sessions
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    try {
      // Reassemble chunked form data from metadata
      const metadata = session.metadata || {};
      const chunks = parseInt(metadata.formData_chunks || "0", 10);
      let json = "";
      for (let i = 0; i < chunks; i++) {
        json += metadata[`formData_${i}`] || "";
      }

      if (!json) {
        console.error("Webhook: No form data found in session metadata");
        return NextResponse.json({ received: true });
      }

      const formData: FormData = JSON.parse(json);
      const email = session.customer_details?.email || "";

      if (!email) {
        console.error("Webhook: No customer email in session");
        return NextResponse.json({ received: true });
      }

      // Trigger guidebook generation
      const jobId = createAndRunJob(formData, email);
      console.log(
        `Webhook: Started generation job ${jobId} for ${formData.familyName} family (${email})`
      );
    } catch (err) {
      console.error("Webhook: Error processing checkout session:", err);
    }
  }

  return NextResponse.json({ received: true });
}
