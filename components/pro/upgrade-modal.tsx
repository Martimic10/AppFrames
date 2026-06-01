"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import {
  FREE_PLAN_FEATURES,
  PRO_LIFETIME_PRICE_USD,
  PRO_PLAN_FEATURES
} from "@/lib/pro/constants";

type UpgradeModalProps = {
  open: boolean;
  reason?: string | null;
  busy?: boolean;
  onClose: () => void;
  onUpgrade: () => void | Promise<void>;
  onRestore?: (email: string) => Promise<{ ok: boolean; message: string }>;
};

export function UpgradeModal({
  open,
  reason,
  busy = false,
  onClose,
  onUpgrade,
  onRestore
}: UpgradeModalProps) {
  const [restoreEmail, setRestoreEmail] = useState("");
  const [restoreBusy, setRestoreBusy] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [showRestore, setShowRestore] = useState(false);

  const handleRestore = async () => {
    if (!onRestore) return;
    setRestoreBusy(true);
    setRestoreMessage(null);
    try {
      const result = await onRestore(restoreEmail);
      setRestoreMessage(result.message);
      if (result.ok) {
        setShowRestore(false);
        onClose();
      }
    } finally {
      setRestoreBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 sm:items-center sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_32px_80px_rgba(0,0,0,0.55)] sm:max-w-xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-7 sm:px-8 sm:py-8">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                  Lifetime license
                </p>
                <h2
                  id="upgrade-modal-title"
                  className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl"
                >
                  AppFrames Pro
                </h2>
                <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                  Unlimited exports, premium templates, and HD quality — no subscription.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className="-mr-1 rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="mt-1 text-right text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
                  ${PRO_LIFETIME_PRICE_USD}
                </p>
                <p className="text-xs text-zinc-500">one-time</p>
              </div>
            </div>

            {reason ? (
              <div className="border-b border-white/10 bg-zinc-900/50 px-6 py-4 sm:px-8">
                <p className="text-sm leading-relaxed text-zinc-300 sm:text-[15px]">{reason}</p>
              </div>
            ) : null}

            <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:gap-5 sm:px-8 sm:py-7">
              <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Free</p>
                <ul className="mt-4 space-y-3">
                  {FREE_PLAN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-snug text-zinc-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-500/25 bg-zinc-900/60 p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-300">Pro</p>
                <ul className="mt-4 space-y-3">
                  {PRO_PLAN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-snug text-zinc-200">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/80" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 px-6 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-7">
              <button
                type="button"
                onClick={() => void onUpgrade()}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 disabled:opacity-60 sm:text-base"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting…
                  </>
                ) : (
                  <>Get lifetime access — ${PRO_LIFETIME_PRICE_USD}</>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="w-full rounded-xl py-3 text-sm text-zinc-500 transition hover:text-zinc-300"
              >
                Not now
              </button>

              {onRestore ? (
                <div className="pt-3">
                  {!showRestore ? (
                    <button
                      type="button"
                      onClick={() => setShowRestore(true)}
                      className="text-xs text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline sm:text-sm"
                    >
                      Already purchased? Restore access
                    </button>
                  ) : (
                    <div className="space-y-3 rounded-xl border border-white/10 bg-zinc-900/50 p-4 sm:p-5">
                      <p className="text-sm text-zinc-400">Enter the email from your receipt.</p>
                      <input
                        type="email"
                        value={restoreEmail}
                        onChange={(e) => setRestoreEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => void handleRestore()}
                        disabled={restoreBusy || !restoreEmail.trim()}
                        className="w-full rounded-lg border border-white/10 bg-zinc-900 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
                      >
                        {restoreBusy ? "Checking…" : "Restore access"}
                      </button>
                      {restoreMessage ? (
                        <p className="text-xs leading-relaxed text-zinc-500 sm:text-sm">
                          {restoreMessage}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
