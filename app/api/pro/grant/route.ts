import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createProLicenseToken, proLicenseCookieOptions } from "@/lib/pro/license-token";

/** Dev-only: grant Pro lifetime license cookie for local testing. */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const token = createProLicenseToken("dev-lifetime");
  const cookieStore = await cookies();
  const opts = proLicenseCookieOptions();
  cookieStore.set(opts.name, token, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge
  });

  return NextResponse.json({ ok: true, isPro: true });
}
