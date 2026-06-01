"use client";

import { useLayoutEffect, useRef } from "react";

const HANDLED_KEY = "appframes:checkout-handled";

type CheckoutReturnHandlerProps = {
  pendingSessionId?: string | null;
  onReturn: (sessionId: string) => void;
};

function readSessionIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("checkout") !== "success") return null;
  return params.get("session_id")?.trim() ?? null;
}

function markHandled(sessionId: string): boolean {
  try {
    const key = `${HANDLED_KEY}:${sessionId}`;
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}

export function CheckoutReturnHandler({
  pendingSessionId,
  onReturn
}: CheckoutReturnHandlerProps) {
  const onReturnRef = useRef(onReturn);
  onReturnRef.current = onReturn;

  useLayoutEffect(() => {
    const sessionId = pendingSessionId ?? readSessionIdFromUrl();
    if (!sessionId) return;
    if (!markHandled(sessionId)) return;

    window.history.replaceState(null, "", window.location.pathname);
    void onReturnRef.current(sessionId);
  }, [pendingSessionId]);

  return null;
}
