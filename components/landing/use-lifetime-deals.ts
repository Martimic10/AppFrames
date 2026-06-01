"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LIFETIME_LAUNCH_SEGMENTS,
  LIFETIME_LAUNCH_TOTAL
} from "@/lib/pro/constants";
import type { LifetimeDealsStats } from "@/lib/stripe/lifetime-deals";

const fallbackStats: LifetimeDealsStats = {
  total: LIFETIME_LAUNCH_TOTAL,
  claimed: 0,
  remaining: LIFETIME_LAUNCH_TOTAL,
  percentLeft: 100,
  soldOut: false
};

export function claimedSegmentsForBar(claimed: number, total: number): number {
  if (claimed <= 0) return 0;
  if (claimed >= total) return LIFETIME_LAUNCH_SEGMENTS;
  return Math.min(
    LIFETIME_LAUNCH_SEGMENTS,
    Math.max(1, Math.ceil((claimed / total) * LIFETIME_LAUNCH_SEGMENTS))
  );
}

export function useLifetimeDeals() {
  const [stats, setStats] = useState<LifetimeDealsStats>(fallbackStats);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/pricing/lifetime-deals", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as LifetimeDealsStats;
      setStats(data);
    } catch {
      /* keep last stats */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  return {
    stats,
    loading,
    refresh,
    segments: LIFETIME_LAUNCH_SEGMENTS,
    claimedSegments: claimedSegmentsForBar(stats.claimed, stats.total)
  };
}
