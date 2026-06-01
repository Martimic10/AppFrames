import { getCategoryById } from "@/components/create/category-data";
import { templatePackOverrides } from "@/components/create/template-pack-overrides";
import {
  gradientFromCategoryBackgrounds,
  type GradientStyle
} from "@/components/create/style-colors";
import type { CategoryId } from "@/components/create/types";

export type TemplateThemeColors = {
  accent: string;
  accentSoft: string;
  background: string;
  gradient: GradientStyle;
  /** Mini preview background for template picker cards */
  previewImage: string;
};

type TemplateColorDef = {
  accent: string;
  accentSoft: string;
  background: string;
  gradient: GradientStyle;
};

const templateColorById: Record<string, TemplateColorDef> = {
  // Productivity
  minimal: {
    accent: "#8b9cff",
    accentSoft: "rgba(139, 156, 255, 0.22)",
    background: "#0a0c12",
    gradient: { from: "#2a3150", via: "#151822", to: "#0a0c12", angle: 168 }
  },
  focus: {
    accent: "#c4b5fd",
    accentSoft: "rgba(196, 181, 253, 0.22)",
    background: "#0b0d14",
    gradient: { from: "#2d1f4a", via: "#151822", to: "#0b0d14", angle: 175 }
  },
  studio: {
    accent: "#5eead4",
    accentSoft: "rgba(94, 234, 212, 0.2)",
    background: "#10121a",
    gradient: { from: "#1e3a4a", via: "#222638", to: "#10121a", angle: 180 }
  },
  // Finance
  fintech: {
    accent: "#2dd4bf",
    accentSoft: "rgba(45, 212, 191, 0.22)",
    background: "#05080f",
    gradient: { from: "#0f3d32", via: "#071018", to: "#05080f", angle: 165 }
  },
  ledger: {
    accent: "#34d399",
    accentSoft: "rgba(52, 211, 153, 0.2)",
    background: "#080f0c",
    gradient: { from: "#0a2e22", via: "#051912", to: "#080f0c", angle: 170 }
  },
  markets: {
    accent: "#6ee7b7",
    accentSoft: "rgba(110, 231, 183, 0.18)",
    background: "#060d0a",
    gradient: { from: "#134e4a", via: "#0a1f1a", to: "#060d0a", angle: 180 }
  },
  // AI
  neural: {
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.22)",
    background: "#0a0e18",
    gradient: { from: "#312e81", via: "#1a1230", to: "#0a0e18", angle: 180 }
  },
  glow: {
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.24)",
    background: "#0a1020",
    gradient: { from: "#0e4a6e", via: "#0f1a2e", to: "#0a1020", angle: 175 }
  },
  pulse: {
    accent: "#a78bfa",
    accentSoft: "rgba(167, 139, 250, 0.22)",
    background: "#090812",
    gradient: { from: "#4c1d95", via: "#141028", to: "#090812", angle: 180 }
  },
  // Social
  feed: {
    accent: "#fb7185",
    accentSoft: "rgba(251, 113, 133, 0.22)",
    background: "#1a1018",
    gradient: { from: "#881337", via: "#3a0f1f", to: "#1a1018", angle: 165 }
  },
  stories: {
    accent: "#f472b6",
    accentSoft: "rgba(244, 114, 182, 0.22)",
    background: "#120810",
    gradient: { from: "#be185d", via: "#2a0a18", to: "#120810", angle: 180 }
  },
  club: {
    accent: "#e879f9",
    accentSoft: "rgba(232, 121, 249, 0.2)",
    background: "#140a12",
    gradient: { from: "#701a75", via: "#2d1020", to: "#140a12", angle: 175 }
  },
  // Fitness
  energy: {
    accent: "#a3e635",
    accentSoft: "rgba(163, 230, 53, 0.22)",
    background: "#0a0d08",
    gradient: { from: "#3f6212", via: "#141a0e", to: "#0a0d08", angle: 175 }
  },
  "pulse-fit": {
    accent: "#84cc16",
    accentSoft: "rgba(132, 204, 22, 0.22)",
    background: "#0c1008",
    gradient: { from: "#4d7c0f", via: "#1a220e", to: "#0c1008", angle: 180 }
  },
  grind: {
    accent: "#eab308",
    accentSoft: "rgba(234, 179, 8, 0.2)",
    background: "#080a06",
    gradient: { from: "#713f12", via: "#121808", to: "#080a06", angle: 170 }
  },
  // Gaming
  neon: {
    accent: "#c084fc",
    accentSoft: "rgba(192, 132, 252, 0.24)",
    background: "#080510",
    gradient: { from: "#6b21a8", via: "#180a28", to: "#080510", angle: 180 }
  },
  arcade: {
    accent: "#f472b6",
    accentSoft: "rgba(244, 114, 182, 0.22)",
    background: "#0a0612",
    gradient: { from: "#9d174d", via: "#1a0f2a", to: "#0a0612", angle: 175 }
  },
  cyber: {
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.2)",
    background: "#06040c",
    gradient: { from: "#0e7490", via: "#0f0a1e", to: "#06040c", angle: 180 }
  },
  // Sports
  arena: {
    accent: "#60a5fa",
    accentSoft: "rgba(96, 165, 250, 0.22)",
    background: "#0a0f1a",
    gradient: { from: "#1e40af", via: "#0e1a2c", to: "#0a0f1a", angle: 180 }
  },
  pro: {
    accent: "#3b82f6",
    accentSoft: "rgba(59, 130, 246, 0.22)",
    background: "#070c14",
    gradient: { from: "#1d4ed8", via: "#0c1828", to: "#070c14", angle: 175 }
  },
  classic: {
    accent: "#94a3b8",
    accentSoft: "rgba(148, 163, 184, 0.2)",
    background: "#0a0e14",
    gradient: { from: "#334155", via: "#101820", to: "#0a0e14", angle: 170 }
  },
  // Ecommerce
  boutique: {
    accent: "#fbbf24",
    accentSoft: "rgba(251, 191, 36, 0.22)",
    background: "#0d0d0d",
    gradient: { from: "#92400e", via: "#2a1808", to: "#0d0d0d", angle: 175 }
  },
  storefront: {
    accent: "#f59e0b",
    accentSoft: "rgba(245, 158, 11, 0.22)",
    background: "#100c08",
    gradient: { from: "#b45309", via: "#241808", to: "#100c08", angle: 180 }
  },
  checkout: {
    accent: "#fb923c",
    accentSoft: "rgba(251, 146, 60, 0.22)",
    background: "#0e0a06",
    gradient: { from: "#c2410c", via: "#1f1408", to: "#0e0a06", angle: 168 }
  },
  // Travel
  journey: {
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.22)",
    background: "#070a10",
    gradient: { from: "#0369a1", via: "#0c2a3a", to: "#070a10", angle: 180 }
  },
  wander: {
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.2)",
    background: "#061018",
    gradient: { from: "#0e7490", via: "#0a2430", to: "#061018", angle: 175 }
  },
  voyage: {
    accent: "#7dd3fc",
    accentSoft: "rgba(125, 211, 252, 0.2)",
    background: "#060e18",
    gradient: { from: "#0284c7", via: "#0a2030", to: "#060e18", angle: 180 }
  }
};

export function getTemplateThemeColors(
  categoryId: CategoryId,
  templateId: string
): TemplateThemeColors {
  const category = getCategoryById(categoryId);
  const fallbackBg = category.backgrounds[0] ?? "#09090b";
  const fallbackGradient = gradientFromCategoryBackgrounds(category.backgrounds);
  const colors = templateColorById[templateId];
  const overridePreview = templatePackOverrides[templateId]?.backgroundImage;

  if (!colors) {
    return {
      accent: "#a855f7",
      accentSoft: "rgba(168, 85, 247, 0.2)",
      background: fallbackBg,
      gradient: fallbackGradient,
      previewImage:
        overridePreview ??
        `linear-gradient(165deg, ${fallbackGradient.from} 0%, ${fallbackGradient.to} 100%)`
    };
  }

  return {
    ...colors,
    previewImage:
      overridePreview ??
      `linear-gradient(${colors.gradient.angle}deg, ${colors.gradient.from} 0%, ${colors.gradient.via} 50%, ${colors.gradient.to} 100%)`
  };
}
