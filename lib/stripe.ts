import Stripe from "stripe";
import { PRO_LIFETIME_PRICE_CENTS } from "@/lib/pro/constants";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

/** Use the host from the incoming request so Stripe returns to the same origin (127.0.0.1 vs localhost). */
export function getAppUrlFromRequest(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return getAppUrl();

  const cleanHost = host.split(",")[0]!.trim();
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (cleanHost.includes("localhost") || cleanHost.startsWith("127.0.0.1") ? "http" : "https");

  return `${proto}://${cleanHost}`;
}

export function isPaidCheckoutSession(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid" || session.status === "complete";
}

export function buildLifetimeLineItem(): Stripe.Checkout.SessionCreateParams.LineItem {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (priceId) {
    return { price: priceId, quantity: 1 };
  }

  return {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: PRO_LIFETIME_PRICE_CENTS,
      product_data: {
        name: "AppFrames Pro — Lifetime",
        description:
          "Unlimited HD exports, premium templates, no watermark, future updates"
      }
    }
  };
}
