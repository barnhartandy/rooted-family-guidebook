import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 402 }
      );
    }

    // Reassemble the chunked form data from metadata
    const metadata = session.metadata || {};
    const chunks = parseInt(metadata.formData_chunks || "0", 10);
    let json = "";
    for (let i = 0; i < chunks; i++) {
      json += metadata[`formData_${i}`] || "";
    }

    const formData = json ? JSON.parse(json) : null;
    const email = session.customer_details?.email || "";

    return NextResponse.json({ formData, email });
  } catch (err) {
    console.error("Session retrieval error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
