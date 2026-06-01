"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type CheckoutButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  soldOut?: boolean;
};

export function CheckoutButton({
  children,
  className = "",
  variant = "primary",
  soldOut = false
}: CheckoutButtonProps) {
  const [busy, setBusy] = useState(false);

  const base =
    variant === "primary"
      ? "bg-white text-zinc-900 hover:bg-zinc-200"
      : "border border-zinc-700 bg-zinc-900/80 text-white hover:border-zinc-500 hover:bg-zinc-800";

  const handleClick = async () => {
    if (soldOut) return;
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        alert(data.error ?? "Checkout unavailable. Add Stripe keys to .env.local");
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      alert("Could not connect to checkout.");
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={busy || soldOut}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:opacity-60 sm:w-auto ${base} ${className}`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
