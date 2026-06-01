import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isLifetimeCheckoutSession } from "@/lib/stripe/lifetime-deals";
import { revalidateLifetimeDealsCache } from "@/lib/stripe/revalidate-lifetime-deals";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe/webhook] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (isLifetimeCheckoutSession(session)) {
      revalidateLifetimeDealsCache();
      console.info("[stripe/webhook] Pro lifetime purchase", {
        sessionId: session.id,
        email: session.customer_details?.email
      });
    }
  }

  return NextResponse.json({ received: true });
}
