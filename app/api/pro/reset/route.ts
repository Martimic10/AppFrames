import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PRO_COOKIE_NAME } from "@/lib/pro/constants";

/** Dev-only: clear Pro license cookie so you can test the free tier. */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const cookieStore = await cookies();
  cookieStore.set(PRO_COOKIE_NAME, "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return NextResponse.json({ ok: true, isPro: false });
}
