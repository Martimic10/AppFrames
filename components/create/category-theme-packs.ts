import type { CategoryId } from "@/components/create/types";
import { mergeTemplatePack } from "@/components/create/template-pack-overrides";
import { getTemplateThemeColors } from "@/components/create/template-theme-colors";

export type ThemeVariation = "minimal" | "bold" | "cinematic" | "data-rich";

export type ThemePack = {
  variation: ThemeVariation;
  accent: string;
  accentSoft: string;
  badge: string;
  headlineScale: number;
  subheadlineScale: number;
  deviceOffsetX: number;
  deviceOffsetY: number;
  deviceRotate: number;
  deviceScale: number;
  deviceGlow: string;
  backgroundImage: string;
  textureImage: string;
  chipPool: string[];
  statPool: string[];
};

const templateVariationByCategory: Record<CategoryId, Record<string, ThemeVariation>> = {
  productivity: {
    minimal: "minimal",
    focus: "data-rich",
    studio: "bold"
  },
  finance: {
    fintech: "bold",
    ledger: "data-rich",
    markets: "cinematic"
  },
  ai: {
    neural: "cinematic",
    glow: "bold",
    pulse: "data-rich"
  },
  social: {
    feed: "minimal",
    stories: "bold",
    club: "cinematic"
  },
  fitness: {
    energy: "bold",
    "pulse-fit": "data-rich",
    grind: "cinematic"
  },
  gaming: {
    neon: "bold",
    arcade: "minimal",
    cyber: "cinematic"
  },
  sports: {
    arena: "cinematic",
    pro: "data-rich",
    classic: "minimal"
  },
  ecommerce: {
    boutique: "minimal",
    storefront: "bold",
    checkout: "data-rich"
  },
  travel: {
    journey: "cinematic",
    wander: "bold",
    voyage: "minimal"
  }
};

const themePackByCategory: Record<CategoryId, ThemePack> = {
  productivity: {
    variation: "minimal",
    accent: "#7c8cff",
    accentSoft: "rgba(124, 140, 255, 0.24)",
    badge: "Focus OS",
    headlineScale: 1,
    subheadlineScale: 1,
    deviceOffsetX: 8,
    deviceOffsetY: 6,
    deviceRotate: -2,
    deviceScale: 1,
    deviceGlow: "rgba(124, 140, 255, 0.34)",
    backgroundImage:
      "radial-gradient(130% 90% at 78% 15%, rgba(124,140,255,0.24), transparent 60%), linear-gradient(180deg, #191d26 0%, #0e1117 100%)",
    textureImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    chipPool: [
      "Tasks +12%",
      "Sprint Calm",
      "Ship Faster",
      "Deep Work",
      "Inbox Zero",
      "Focus Blocks"
    ],
    statPool: [
      "Weekly Planner",
      "Calendar Sync",
      "Priority Queue",
      "Team Rituals"
    ]
  },
  finance: {
    variation: "bold",
    accent: "#22c55e",
    accentSoft: "rgba(34, 197, 94, 0.22)",
    badge: "Secure Ledger",
    headlineScale: 1.04,
    subheadlineScale: 1,
    deviceOffsetX: 7,
    deviceOffsetY: 7,
    deviceRotate: -4,
    deviceScale: 1.02,
    deviceGlow: "rgba(34, 197, 94, 0.35)",
    backgroundImage:
      "radial-gradient(120% 90% at 70% 10%, rgba(45,212,191,0.22), transparent 60%), linear-gradient(165deg, #071b33 0%, #07111f 60%, #090d18 100%)",
    textureImage:
      "linear-gradient(120deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 45%), linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02))",
    chipPool: [
      "AUM +18%",
      "Low Risk",
      "Realtime Alpha",
      "Yield Watch",
      "Volatility Low",
      "Tax Smart"
    ],
    statPool: [
      "Portfolio Health",
      "Growth Trend",
      "Allocation Mix",
      "Cash Runway"
    ]
  },
  ai: {
    variation: "cinematic",
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.24)",
    badge: "Neural Engine",
    headlineScale: 1.07,
    subheadlineScale: 1.02,
    deviceOffsetX: 9,
    deviceOffsetY: 5,
    deviceRotate: -3,
    deviceScale: 1.03,
    deviceGlow: "rgba(34, 211, 238, 0.36)",
    backgroundImage:
      "radial-gradient(120% 120% at 75% 8%, rgba(56,189,248,0.26), transparent 58%), radial-gradient(120% 100% at 20% 22%, rgba(168,85,247,0.24), transparent 62%), linear-gradient(180deg, #170f2f 0%, #0b1020 100%)",
    textureImage:
      "linear-gradient(60deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 35%), radial-gradient(circle at 15% 30%, rgba(34,211,238,0.16) 0%, transparent 18%)",
    chipPool: [
      "Prompt Score 96",
      "Nodes Online",
      "Latency -28%",
      "Token Efficient",
      "Reasoning Boost",
      "Auto Compose"
    ],
    statPool: [
      "Context Window",
      "Model Routing",
      "Inference Graph",
      "Prompt Studio"
    ]
  },
  social: {
    variation: "bold",
    accent: "#fb7185",
    accentSoft: "rgba(251, 113, 133, 0.24)",
    badge: "Community Live",
    headlineScale: 1.04,
    subheadlineScale: 1.01,
    deviceOffsetX: 8,
    deviceOffsetY: 8,
    deviceRotate: -2,
    deviceScale: 1.02,
    deviceGlow: "rgba(251, 113, 133, 0.34)",
    backgroundImage:
      "radial-gradient(120% 95% at 78% 12%, rgba(251,113,133,0.28), transparent 62%), linear-gradient(165deg, #3b0b19 0%, #26111d 52%, #181421 100%)",
    textureImage:
      "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 38%), radial-gradient(circle at 85% 72%, rgba(251,113,133,0.14) 0%, transparent 22%)",
    chipPool: [
      "1.2k Reactions",
      "New Members",
      "Viral Moment",
      "DM Spikes",
      "Story Replies",
      "Live Room"
    ],
    statPool: [
      "Message Pulse",
      "Creator Spotlight",
      "Community Heat",
      "Audience Growth"
    ]
  },
  fitness: {
    variation: "cinematic",
    accent: "#a3e635",
    accentSoft: "rgba(163, 230, 53, 0.24)",
    badge: "Streak Active",
    headlineScale: 1.08,
    subheadlineScale: 1.02,
    deviceOffsetX: 10,
    deviceOffsetY: 7,
    deviceRotate: -5,
    deviceScale: 1.03,
    deviceGlow: "rgba(163, 230, 53, 0.34)",
    backgroundImage:
      "radial-gradient(125% 105% at 76% 8%, rgba(132,204,22,0.25), transparent 58%), linear-gradient(175deg, #111713 0%, #111111 58%, #1b1f10 100%)",
    textureImage:
      "linear-gradient(125deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 42%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 16px)",
    chipPool: [
      "VO2 +6%",
      "PR Streak",
      "Intensity 82",
      "HR Zone 4",
      "Consistency +",
      "Fat Burn"
    ],
    statPool: [
      "Workout Split",
      "Recovery Meter",
      "Coach Notes",
      "Streak Tracker"
    ]
  },
  gaming: {
    variation: "cinematic",
    accent: "#c084fc",
    accentSoft: "rgba(192, 132, 252, 0.24)",
    badge: "Rank Up",
    headlineScale: 1.1,
    subheadlineScale: 1.03,
    deviceOffsetX: 9,
    deviceOffsetY: 7,
    deviceRotate: -6,
    deviceScale: 1.04,
    deviceGlow: "rgba(192, 132, 252, 0.4)",
    backgroundImage:
      "radial-gradient(130% 95% at 80% 10%, rgba(147,51,234,0.3), transparent 58%), linear-gradient(180deg, #130a22 0%, #0b0b15 55%, #07070d 100%)",
    textureImage:
      "linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 30%), repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 14px)",
    chipPool: [
      "XP +420",
      "Squad Ready",
      "Ultra Mode",
      "Rank Climb",
      "Combo Chain",
      "Night Raid"
    ],
    statPool: [
      "HUD Sync",
      "Boss Timer",
      "Mission Queue",
      "Rank Ladder"
    ]
  },
  sports: {
    variation: "data-rich",
    accent: "#60a5fa",
    accentSoft: "rgba(96, 165, 250, 0.24)",
    badge: "Matchday Pro",
    headlineScale: 1.06,
    subheadlineScale: 1.01,
    deviceOffsetX: 8,
    deviceOffsetY: 6,
    deviceRotate: -3,
    deviceScale: 1.02,
    deviceGlow: "rgba(96, 165, 250, 0.34)",
    backgroundImage:
      "radial-gradient(120% 95% at 74% 9%, rgba(59,130,246,0.28), transparent 58%), linear-gradient(180deg, #0e1a2c 0%, #0d1320 60%, #0a0f1a 100%)",
    textureImage:
      "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 40%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 3px, transparent 3px 20px)",
    chipPool: [
      "Shots 14",
      "Possession 62%",
      "Win Prob 78%",
      "Pace +9%",
      "Top Form",
      "Defensive Wall"
    ],
    statPool: [
      "Live Scoreboard",
      "Team Momentum",
      "Lineup Pulse",
      "Clutch Meter"
    ]
  },
  ecommerce: {
    variation: "bold",
    accent: "#f59e0b",
    accentSoft: "rgba(245, 158, 11, 0.24)",
    badge: "Shop Live",
    headlineScale: 1.05,
    subheadlineScale: 1.01,
    deviceOffsetX: 8,
    deviceOffsetY: 7,
    deviceRotate: -3,
    deviceScale: 1.02,
    deviceGlow: "rgba(245, 158, 11, 0.34)",
    backgroundImage:
      "radial-gradient(120% 95% at 76% 10%, rgba(245,158,11,0.26), transparent 58%), linear-gradient(175deg, #2a1808 0%, #14110d 55%, #0d0d0d 100%)",
    textureImage:
      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at 88% 20%, rgba(245,158,11,0.12) 0%, transparent 20%)",
    chipPool: [
      "Cart +24%",
      "Free Shipping",
      "New Drop",
      "Best Seller",
      "Flash Sale",
      "5-Star Rated"
    ],
    statPool: [
      "Conversion Rate",
      "Order Value",
      "Wishlist Saves",
      "Repeat Buyers"
    ]
  },
  travel: {
    variation: "cinematic",
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.24)",
    badge: "Trip Ready",
    headlineScale: 1.06,
    subheadlineScale: 1.02,
    deviceOffsetX: 9,
    deviceOffsetY: 6,
    deviceRotate: -4,
    deviceScale: 1.03,
    deviceGlow: "rgba(56, 189, 248, 0.34)",
    backgroundImage:
      "radial-gradient(125% 100% at 72% 8%, rgba(56,189,248,0.28), transparent 58%), linear-gradient(180deg, #0c2a3a 0%, #0a1520 55%, #070a10 100%)",
    textureImage:
      "linear-gradient(120deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 35%), radial-gradient(circle at 20% 80%, rgba(56,189,248,0.14) 0%, transparent 22%)",
    chipPool: [
      "Direct Flights",
      "Hidden Gems",
      "Price Drop",
      "Top Rated",
      "Weekend Escape",
      "Local Picks"
    ],
    statPool: [
      "Trip Planner",
      "Saved Routes",
      "Booking Status",
      "Miles Tracker"
    ]
  }
};

function applyVariation(base: ThemePack, variation: ThemeVariation): ThemePack {
  if (variation === "minimal") {
    return {
      ...base,
      variation,
      headlineScale: base.headlineScale * 0.96,
      subheadlineScale: base.subheadlineScale * 0.98,
      deviceRotate: base.deviceRotate * 0.5,
      deviceScale: base.deviceScale * 0.98
    };
  }
  if (variation === "bold") {
    return {
      ...base,
      variation,
      headlineScale: base.headlineScale * 1.06,
      subheadlineScale: base.subheadlineScale * 1.02,
      deviceScale: base.deviceScale * 1.04
    };
  }
  if (variation === "data-rich") {
    return {
      ...base,
      variation,
      headlineScale: base.headlineScale,
      subheadlineScale: base.subheadlineScale * 0.98,
      deviceRotate: base.deviceRotate * 0.7,
      deviceOffsetY: base.deviceOffsetY + 1
    };
  }
  return { ...base, variation };
}

export function getThemePack(categoryId: CategoryId, templateId: string): ThemePack {
  const categoryBase = themePackByCategory[categoryId];
  const merged = mergeTemplatePack(categoryBase, templateId);
  const themeColors = getTemplateThemeColors(categoryId, templateId);
  const base = {
    ...merged,
    accent: themeColors.accent,
    accentSoft: themeColors.accentSoft
  };
  const variationMap = templateVariationByCategory[categoryId];
  const variation = variationMap[templateId] ?? base.variation;
  return applyVariation(base, variation);
}
