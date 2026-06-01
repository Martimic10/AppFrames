import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FREE_EXPORT_LIMIT, PRO_COOKIE_NAME } from "@/lib/pro/constants";
import { verifyProLicenseToken } from "@/lib/pro/license-token";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PRO_COOKIE_NAME)?.value;
  const isPro = verifyProLicenseToken(token);

  return NextResponse.json({
    isPro,
    exportsLimit: FREE_EXPORT_LIMIT
  });
}
