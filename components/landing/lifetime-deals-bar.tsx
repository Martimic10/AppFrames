"use client";

import {
  PRO_LIFETIME_PRICE_USD,
  PRO_LIFETIME_REGULAR_PRICE_USD
} from "@/lib/pro/constants";
import type { LifetimeDealsStats } from "@/lib/stripe/lifetime-deals";

type LifetimeDealsBarProps = {
  stats: LifetimeDealsStats;
  loading: boolean;
};

export function LifetimeDealsBar({ stats, loading }: LifetimeDealsBarProps) {
  const fill =
    stats.total > 0 ? Math.min(100, Math.round((stats.claimed / stats.total) * 100)) : 0;

  return (
    <div className="mt-8 space-y-3 border-t border-white/[0.06] pt-8">
      <p className="text-sm font-medium tabular-nums tracking-tight text-zinc-300">
        {loading ? (
          <span className="text-zinc-500">Loading availability…</span>
        ) : (
          <>
            <span className="text-white">{stats.claimed}</span>
            <span className="text-zinc-500"> / {stats.total} spots claimed</span>
          </>
        )}
      </p>

      <div
        className="h-1 overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/[0.04]"
        aria-hidden={loading}
        role="progressbar"
        aria-valuenow={loading ? 0 : stats.claimed}
        aria-valuemin={0}
        aria-valuemax={stats.total}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500/90 via-violet-400/80 to-emerald-400/85 transition-[width] duration-700 ease-out"
          style={{ width: loading ? "0%" : `${fill}%` }}
        />
      </div>

      {loading ? null : stats.soldOut ? (
        <p className="text-sm text-zinc-300">
          Launch pricing sold out — lifetime access is now{" "}
          <span className="font-medium text-white">${PRO_LIFETIME_REGULAR_PRICE_USD}</span>.
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-zinc-200">
            <span className="tabular-nums text-white">{stats.remaining}</span> spots remaining at{" "}
            <span className="text-white">${PRO_LIFETIME_PRICE_USD}</span>
          </p>
          <p className="text-xs leading-relaxed text-zinc-500">
            Price increases to ${PRO_LIFETIME_REGULAR_PRICE_USD} after the first {stats.total}{" "}
            customers.
          </p>
        </>
      )}
    </div>
  );
}
