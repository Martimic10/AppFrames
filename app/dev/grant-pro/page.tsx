"use client";

import { useEffect, useState } from "react";

export default function GrantProPage() {
  const [status, setStatus] = useState<"working" | "done" | "error">("working");

  useEffect(() => {
    let cancelled = false;

    async function grant() {
      try {
        const res = await fetch("/api/pro/grant", { method: "POST" });
        if (!res.ok) throw new Error("Grant failed");

        if (cancelled) return;
        setStatus("done");
        window.location.replace("/create");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void grant();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-zinc-300">
      <div>
        {status === "working" ? (
          <>
            <p className="text-lg font-medium text-white">Enabling Pro lifetime…</p>
            <p className="mt-2 text-sm text-zinc-500">
              Setting your local Pro license, then opening the editor.
            </p>
          </>
        ) : null}
        {status === "error" ? (
          <>
            <p className="text-lg font-medium text-white">Grant unavailable</p>
            <p className="mt-2 text-sm text-zinc-500">
              This page only works in local development. Ensure PRO_LICENSE_SECRET or
              STRIPE_SECRET_KEY is set in .env.local.
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
