import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createProLicenseToken,
  proLicenseCookieOptions
} from "@/lib/pro/license-token";
import { getStripe, isPaidCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }

    const stripe = getStripe();
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });

    const paid = sessions.data.find(
      (session) =>
        isPaidCheckoutSession(session) &&
        session.customer_details?.email?.toLowerCase() === email
    );

    if (!paid?.id) {
      return NextResponse.json(
        {
          ok: false,
          message: "No lifetime purchase found for this email. Use the same email as checkout."
        },
        { status: 404 }
      );
    }

    const token = createProLicenseToken(paid.id);
    const cookieStore = await cookies();
    const opts = proLicenseCookieOptions();
    cookieStore.set(opts.name, token, {
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      path: opts.path,
      maxAge: opts.maxAge
    });

    return NextResponse.json({
      ok: true,
      message: "Pro access restored on this device.",
      isPro: true
    });
  } catch (error) {
    console.error("[stripe/restore]", error);
    return NextResponse.json({ error: "Restore failed" }, { status: 500 });
  }
}
