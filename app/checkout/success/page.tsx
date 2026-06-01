"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Legacy Stripe success URL — forward to the editor with the same query params. */
export default function CheckoutSuccessRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const target = sessionId
      ? `/create?checkout=success&session_id=${encodeURIComponent(sessionId)}`
      : "/create";
    router.replace(target);
  }, [router, sessionId]);

  return null;
}
