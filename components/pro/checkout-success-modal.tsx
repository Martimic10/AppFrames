"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { PRO_PLAN_FEATURES } from "@/lib/pro/constants";

type CheckoutSuccessModalProps = {
  open: boolean;
  status: "loading" | "ok" | "error";
  onClose: () => void;
};

export function CheckoutSuccessModal({ open, status, onClose }: CheckoutSuccessModalProps) {
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
          aria-labelledby="checkout-success-title"
          onClick={status === "loading" ? undefined : onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-500/25 bg-zinc-950 shadow-[0_32px_80px_rgba(0,0,0,0.55)] sm:max-w-xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-7 sm:px-8 sm:py-8">
              <div className="min-w-0">
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
                    <h2
                      id="checkout-success-title"
                      className="mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl"
                    >
                      Activating Pro…
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                      Confirming your payment. This only takes a moment.
                    </p>
                  </>
                ) : status === "ok" ? (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-500/15">
                      <Check className="h-7 w-7 text-emerald-300" />
                    </div>
                    <h2
                      id="checkout-success-title"
                      className="mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl"
                    >
                      You&apos;re Pro!
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                      Payment successful. Everything below is unlocked on this device.
                    </p>
                  </>
                ) : (
                  <>
                    <h2
                      id="checkout-success-title"
                      className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
                    >
                      Couldn&apos;t verify payment
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                      Try restoring with your checkout email from Upgrade → Already purchased.
                    </p>
                  </>
                )}
              </div>
              {status !== "loading" ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="-mr-1 rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {status === "ok" ? (
              <div className="px-6 py-6 sm:px-8 sm:py-7">
                <div className="rounded-xl border border-emerald-500/25 bg-zinc-900/60 p-5 sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-200/90">
                    Unlocked
                  </p>
                  <ul className="mt-4 space-y-3">
                    {PRO_PLAN_FEATURES.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-snug text-zinc-200"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/80" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {status !== "loading" ? (
              <div className="border-t border-white/10 px-6 pb-7 pt-2 sm:px-8 sm:pb-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:text-base"
                >
                  {status === "ok" ? "Continue in editor" : "Back to editor"}
                </button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
