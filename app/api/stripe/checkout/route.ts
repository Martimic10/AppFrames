import { NextResponse } from "next/server";
import { getLifetimeDealsStats } from "@/lib/stripe/lifetime-deals";
import { buildLifetimeLineItem, getAppUrlFromRequest, getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    let soldOut = false;
    try {
      const deals = await getLifetimeDealsStats();
      soldOut = deals.soldOut;
    } catch (error) {
      console.error("[stripe/checkout] lifetime deals stats unavailable", error);
      // Do not block checkout if scarcity stats cannot be loaded.
    }

    if (soldOut) {
      return NextResponse.json(
        { error: "Lifetime launch pricing is sold out." },
        { status: 409 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Checkout is unavailable. Add STRIPE_SECRET_KEY in your environment." },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const appUrl = getAppUrlFromRequest(request);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [buildLifetimeLineItem()],
      success_url: `${appUrl}/create?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/create`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: "always",
      metadata: { plan: "lifetime" }
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/checkout]", error);
    const message =
      error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")
        ? "Checkout is unavailable. Add STRIPE_SECRET_KEY in your environment."
        : "Checkout is unavailable. Check Stripe configuration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
