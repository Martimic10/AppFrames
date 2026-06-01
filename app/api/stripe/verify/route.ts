import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createProLicenseToken, proLicenseCookieOptions } from "@/lib/pro/license-token";
import { isLifetimeCheckoutSession } from "@/lib/stripe/lifetime-deals";
import { revalidateLifetimeDealsCache } from "@/lib/stripe/revalidate-lifetime-deals";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sessionId?: string };
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!isLifetimeCheckoutSession(session)) {
      return NextResponse.json(
        { error: "Payment not completed", isPro: false },
        { status: 400 }
      );
    }

    revalidateLifetimeDealsCache();

    const token = createProLicenseToken(sessionId);
    const cookieStore = await cookies();
    const opts = proLicenseCookieOptions();
    cookieStore.set(opts.name, token, {
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      path: opts.path,
      maxAge: opts.maxAge
    });

    return NextResponse.json({ isPro: true });
  } catch (error) {
    console.error("[stripe/verify]", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const post = await POST(
    new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    })
  );
  return post;
}
