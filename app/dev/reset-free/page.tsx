"use client";

import { useEffect, useState } from "react";
import { EXPORTS_USED_STORAGE_KEY } from "@/lib/pro/constants";

export default function ResetFreePage() {
  const [status, setStatus] = useState<"working" | "done" | "error">("working");

  useEffect(() => {
    let cancelled = false;

    async function reset() {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem(EXPORTS_USED_STORAGE_KEY);
        }

        const res = await fetch("/api/pro/reset", { method: "POST" });
        if (!res.ok) throw new Error("Reset failed");

        if (cancelled) return;
        setStatus("done");
        window.location.replace("/create");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void reset();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-zinc-300">
      <div>
        {status === "working" ? (
          <>
            <p className="text-lg font-medium text-white">Resetting to free tier…</p>
            <p className="mt-2 text-sm text-zinc-500">
              Clearing Pro license and export count, then opening the editor.
            </p>
          </>
        ) : null}
        {status === "error" ? (
          <>
            <p className="text-lg font-medium text-white">Reset unavailable</p>
            <p className="mt-2 text-sm text-zinc-500">
              This page only works in local development. Use a private Safari window or clear
              site data for 127.0.0.1 instead.
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
