import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { formData } = await request.json();

    // Stripe metadata values are limited to 500 chars each.
    // Split the questionnaire data across multiple keys.
    const json = JSON.stringify(formData);
    const metadata: Record<string, string> = {
      familyName: formData.familyName || "",
      location: formData.location || "",
    };

    // Chunk the full JSON across metadata keys (max 500 chars each)
    const CHUNK_SIZE = 500;
    const chunks = Math.ceil(json.length / CHUNK_SIZE);
    for (let i = 0; i < chunks; i++) {
      metadata[`formData_${i}`] = json.slice(
        i * CHUNK_SIZE,
        (i + 1) * CHUNK_SIZE
      );
    }
    metadata.formData_chunks = String(chunks);

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "The Rooted Family Guidebook",
              description: `A personalized guidebook for the ${formData.familyName || "your"} family`,
            },
            unit_amount: 3900, // $39.00
          },
          quantity: 1,
        },
      ],
      metadata,
      allow_promotion_codes: true,
      success_url: `${origin}/generating?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/questionnaire`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
