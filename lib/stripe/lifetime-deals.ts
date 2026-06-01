import type Stripe from "stripe";
import { LIFETIME_LAUNCH_TOTAL, PRO_LIFETIME_PRICE_CENTS } from "@/lib/pro/constants";
import { getStripe, isPaidCheckoutSession } from "@/lib/stripe";

export type LifetimeDealsStats = {
  total: number;
  claimed: number;
  remaining: number;
  percentLeft: number;
  soldOut: boolean;
};

export function isLifetimeCheckoutSession(session: Stripe.Checkout.Session): boolean {
  if (session.mode !== "payment") return false;
  if (!isPaidCheckoutSession(session)) return false;
  if (session.metadata?.plan === "lifetime") return true;
  return session.amount_total === PRO_LIFETIME_PRICE_CENTS;
}

export async function countLifetimeDealsClaimed(): Promise<number> {
  const stripe = getStripe();
  let claimed = 0;
  let startingAfter: string | undefined;

  do {
    const page = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
      starting_after: startingAfter
    });

    for (const session of page.data) {
      if (isLifetimeCheckoutSession(session)) claimed += 1;
    }

    if (!page.has_more || page.data.length === 0) break;
    startingAfter = page.data[page.data.length - 1]?.id;
  } while (startingAfter);

  return claimed;
}

export function buildLifetimeDealsStats(claimed: number): LifetimeDealsStats {
  const total = LIFETIME_LAUNCH_TOTAL;
  const cappedClaimed = Math.min(Math.max(0, claimed), total);
  const remaining = total - cappedClaimed;
  const percentLeft = total > 0 ? Math.round((remaining / total) * 100) : 0;

  return {
    total,
    claimed: cappedClaimed,
    remaining,
    percentLeft,
    soldOut: remaining <= 0
  };
}

export async function getLifetimeDealsStats(): Promise<LifetimeDealsStats> {
  const claimed = await countLifetimeDealsClaimed();
  return buildLifetimeDealsStats(claimed);
}
