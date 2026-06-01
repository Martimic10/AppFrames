import { createHmac, timingSafeEqual } from "crypto";
import { PRO_COOKIE_NAME } from "@/lib/pro/constants";

function getSecret(): string {
  const secret = process.env.PRO_LICENSE_SECRET ?? process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("PRO_LICENSE_SECRET or STRIPE_SECRET_KEY must be set");
  }
  return secret;
}

type LicensePayload = {
  sid: string;
  iat: number;
};

export function createProLicenseToken(sessionId: string): string {
  const payload: LicensePayload = {
    sid: sessionId,
    iat: Date.now()
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifyProLicenseToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  const expected = createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");

  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expBuf)) return false;
  } catch {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as LicensePayload;
    return Boolean(payload.sid);
  } catch {
    return false;
  }
}

export function proLicenseCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 365 * 10) {
  return {
    name: PRO_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds
  };
}
