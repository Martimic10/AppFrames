import type { ThemePack } from "@/components/create/category-theme-packs";

/** Per-template art direction — merged onto the category base in getThemePack(). */
export const templatePackOverrides: Record<string, Partial<ThemePack>> = {
  // Productivity
  minimal: {
    badge: "Focus OS",
    backgroundImage:
      "radial-gradient(115% 85% at 88% 8%, rgba(124,140,255,0.34), transparent 58%), radial-gradient(90% 70% at 12% 92%, rgba(99,102,241,0.12), transparent 55%), linear-gradient(168deg, #1c2133 0%, #0a0c12 100%)"
  },
  focus: {
    badge: "Deep Work",
    backgroundImage:
      "radial-gradient(120% 90% at 72% 12%, rgba(167,139,250,0.28), transparent 60%), linear-gradient(175deg, #151822 0%, #0b0d14 55%, #12141c 100%)",
    chipPool: ["Flow State", "Zero Inbox", "Time Blocks", "Sprint Mode", "Priority Stack", "Quiet Hours"]
  },
  studio: {
    badge: "Studio Pro",
    backgroundImage:
      "radial-gradient(130% 95% at 50% 0%, rgba(124,140,255,0.22), transparent 62%), linear-gradient(180deg, #222638 0%, #10121a 100%)",
    statPool: ["Team Velocity", "Launch Board", "Client Portal", "Pipeline View"]
  },
  // Finance
  fintech: {
    badge: "Capital",
    backgroundImage:
      "radial-gradient(120% 90% at 78% 10%, rgba(45,212,191,0.32), transparent 58%), linear-gradient(165deg, #062a1f 0%, #071018 60%, #05080f 100%)"
  },
  ledger: {
    badge: "Private Wealth",
    backgroundImage:
      "radial-gradient(120% 90% at 22% 12%, rgba(251,191,36,0.32), transparent 58%), radial-gradient(95% 70% at 88% 78%, rgba(245,158,11,0.16), transparent 55%), linear-gradient(170deg, #2a1808 0%, #0f0a06 100%)",
    chipPool: ["Net Worth", "Tax Optimized", "Yield 4.2%", "Risk Balanced", "Auto Invest", "Vault Secure"]
  },
  markets: {
    badge: "Markets Live",
    backgroundImage:
      "radial-gradient(125% 100% at 68% 6%, rgba(56,189,248,0.34), transparent 55%), radial-gradient(80% 60% at 8% 88%, rgba(59,130,246,0.14), transparent 52%), linear-gradient(180deg, #0c1929 0%, #060a12 100%)",
    statPool: ["Alpha Signal", "Options Flow", "Sector Heat", "Volatility Index"]
  },
  // AI
  neural: {
    badge: "Neural Core",
    backgroundImage:
      "radial-gradient(120% 110% at 80% 8%, rgba(56,189,248,0.34), transparent 58%), radial-gradient(90% 80% at 15% 85%, rgba(168,85,247,0.2), transparent 55%), linear-gradient(180deg, #1a1230 0%, #0a0e18 100%)"
  },
  glow: {
    badge: "Copilot AI",
    backgroundImage:
      "radial-gradient(130% 95% at 50% -5%, rgba(34,211,238,0.38), transparent 62%), linear-gradient(175deg, #0f1a2e 0%, #0a1020 100%)",
    chipPool: ["GPT-4o Ready", "128k Context", "Auto Draft", "Smart Reply", "Vision On", "Agents Live"]
  },
  pulse: {
    badge: "Signal Engine",
    backgroundImage:
      "radial-gradient(115% 85% at 25% 20%, rgba(139,92,246,0.24), transparent 58%), linear-gradient(180deg, #141028 0%, #090812 100%)",
    statPool: ["Inference Graph", "Latency 42ms", "Model Router", "Guardrails On"]
  },
  // Social
  feed: {
    badge: "For You",
    backgroundImage:
      "radial-gradient(120% 90% at 82% 12%, rgba(251,113,133,0.32), transparent 60%), linear-gradient(165deg, #3a0f1f 0%, #1a1018 100%)"
  },
  stories: {
    badge: "Stories+",
    backgroundImage:
      "radial-gradient(125% 95% at 60% 0%, rgba(244,63,94,0.28), transparent 58%), radial-gradient(80% 60% at 90% 80%, rgba(251,113,133,0.16), transparent 55%), linear-gradient(180deg, #2a0a18 0%, #120810 100%)",
    chipPool: ["24h Highlights", "Polls Live", "Remix Ready", "Close Friends", "Trending Sound", "Reactions 2.4k"]
  },
  club: {
    badge: "Members Only",
    backgroundImage:
      "radial-gradient(110% 85% at 30% 10%, rgba(251,113,133,0.2), transparent 55%), linear-gradient(175deg, #2d1020 0%, #140a12 100%)",
    statPool: ["Room Active", "Creator Fund", "Subscribers", "Event RSVPs"]
  },
  // Fitness
  energy: {
    badge: "Peak Mode",
    backgroundImage:
      "radial-gradient(125% 100% at 75% 8%, rgba(132,204,22,0.3), transparent 58%), linear-gradient(175deg, #141a0e 0%, #0a0d08 100%)"
  },
  "pulse-fit": {
    badge: "HIIT Pro",
    backgroundImage:
      "radial-gradient(120% 95% at 80% 10%, rgba(251,113,133,0.36), transparent 58%), radial-gradient(70% 55% at 12% 85%, rgba(244,63,94,0.18), transparent 52%), linear-gradient(180deg, #2a0a14 0%, #12080c 100%)",
    chipPool: ["Zone 4 Active", "PR Today", "Calories 420", "Recovery 82%", "Streak 12", "VO2 Max +"]
  },
  grind: {
    badge: "Iron Club",
    backgroundImage:
      "radial-gradient(115% 90% at 75% 8%, rgba(245,158,11,0.3), transparent 58%), linear-gradient(170deg, #1a1206 0%, #0a0804 100%)",
    statPool: ["Lift Log", "Plate Math", "Split Plan", "Coach Notes"]
  },
  // Gaming
  neon: {
    badge: "Neon Arena",
    backgroundImage:
      "radial-gradient(130% 95% at 80% 10%, rgba(147,51,234,0.36), transparent 58%), linear-gradient(180deg, #180a28 0%, #080510 100%)"
  },
  arcade: {
    badge: "Arcade+",
    backgroundImage:
      "radial-gradient(120% 90% at 50% 5%, rgba(192,132,252,0.32), transparent 62%), radial-gradient(70% 50% at 95% 90%, rgba(236,72,153,0.14), transparent 55%), linear-gradient(175deg, #1a0f2a 0%, #0a0612 100%)",
    chipPool: ["High Score", "Co-op Ready", "Boss Raid", "XP Boost", "Daily Quest", "Rank S+"]
  },
  cyber: {
    badge: "Cyber District",
    backgroundImage:
      "radial-gradient(115% 85% at 15% 20%, rgba(34,211,238,0.16), transparent 55%), radial-gradient(100% 80% at 88% 70%, rgba(147,51,234,0.28), transparent 58%), linear-gradient(180deg, #0f0a1e 0%, #06040c 100%)",
    statPool: ["HUD Sync", "Loadout Ready", "Squad Online", "Mission Log"]
  },
  // Sports
  arena: {
    badge: "Matchday",
    backgroundImage:
      "radial-gradient(120% 95% at 74% 9%, rgba(59,130,246,0.32), transparent 58%), linear-gradient(180deg, #0e1a2c 0%, #0a0f1a 100%)"
  },
  pro: {
    badge: "Elite Stats",
    backgroundImage:
      "radial-gradient(125% 90% at 30% 12%, rgba(96,165,250,0.22), transparent 55%), radial-gradient(100% 75% at 85% 80%, rgba(59,130,246,0.26), transparent 58%), linear-gradient(175deg, #0c1828 0%, #070c14 100%)",
    chipPool: ["Live Score", "Win Prob 78%", "Top Form", "Possession 62%", "xG 2.4", "Clean Sheet"]
  },
  classic: {
    badge: "Heritage",
    backgroundImage:
      "radial-gradient(110% 80% at 70% 85%, rgba(59,130,246,0.14), transparent 55%), linear-gradient(170deg, #101820 0%, #0a0e14 100%)",
    statPool: ["Box Score", "Season Stats", "Hall of Fame", "Play Archive"]
  },
  // Ecommerce
  boutique: {
    badge: "Curated",
    backgroundImage:
      "radial-gradient(120% 90% at 78% 10%, rgba(245,158,11,0.32), transparent 58%), linear-gradient(175deg, #2a1808 0%, #14110d 55%, #0d0d0d 100%)"
  },
  storefront: {
    badge: "Retail Pro",
    backgroundImage:
      "radial-gradient(125% 95% at 55% 0%, rgba(251,191,36,0.28), transparent 62%), radial-gradient(80% 60% at 10% 90%, rgba(245,158,11,0.14), transparent 55%), linear-gradient(180deg, #241808 0%, #100c08 100%)",
    chipPool: ["Free Shipping", "New Drop", "Best Seller", "5-Star", "Flash Sale", "Back in Stock"]
  },
  checkout: {
    badge: "Convert+",
    backgroundImage:
      "radial-gradient(115% 85% at 85% 15%, rgba(245,158,11,0.36), transparent 60%), linear-gradient(168deg, #1f1408 0%, #0e0a06 100%)",
    statPool: ["Cart Recovery", "AOV +18%", "Checkout Rate", "Repeat Buyers"]
  },
  // Travel
  journey: {
    badge: "Trip Ready",
    backgroundImage:
      "radial-gradient(125% 100% at 72% 8%, rgba(56,189,248,0.32), transparent 58%), linear-gradient(180deg, #0c2a3a 0%, #0a1520 55%, #070a10 100%)"
  },
  wander: {
    badge: "Off Path",
    backgroundImage:
      "radial-gradient(120% 90% at 20% 15%, rgba(34,211,238,0.2), transparent 55%), radial-gradient(100% 80% at 88% 75%, rgba(56,189,248,0.26), transparent 58%), linear-gradient(175deg, #0a2430 0%, #061018 100%)",
    chipPool: ["Hidden Gems", "Direct Flights", "Local Picks", "Price Drop", "Weekend Escape", "Trail Maps"]
  },
  voyage: {
    badge: "First Class",
    backgroundImage:
      "radial-gradient(130% 95% at 55% 4%, rgba(252,211,77,0.3), transparent 62%), radial-gradient(85% 65% at 15% 90%, rgba(217,119,6,0.14), transparent 55%), linear-gradient(180deg, #1f1a0e 0%, #0c0a06 100%)",
    statPool: ["Concierge", "Lounge Access", "Private Transfer", "Miles Balance"]
  }
};

export function mergeTemplatePack(base: ThemePack, templateId: string): ThemePack {
  const override = templatePackOverrides[templateId];
  if (!override) return base;
  return {
    ...base,
    ...override,
    chipPool: override.chipPool ?? base.chipPool,
    statPool: override.statPool ?? base.statPool
  };
}
