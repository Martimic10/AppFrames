import type { CategoryId } from "@/components/create/types";

export type KitThemeType = "dark" | "light" | "gradient";
export type KitFontPreset = "condensed" | "editorial" | "poppins";

export type TemplateKitCategoryConfig = {
  id: CategoryId;
  tag: string;
  headline: string;
  shimmerWord?: string;
  theme: KitThemeType;
  font: KitFontPreset;
  accentVar: string;
};

export const TEMPLATE_KIT_CATEGORIES: TemplateKitCategoryConfig[] = [
  {
    id: "productivity",
    tag: "PRODUCTIVITY",
    headline: "Organize your workflow beautifully",
    theme: "light",
    font: "editorial",
    accentVar: "var(--tpl-productivity-accent)"
  },
  {
    id: "finance",
    tag: "FINANCE",
    headline: "Track your money smarter",
    shimmerWord: "money",
    theme: "dark",
    font: "editorial",
    accentVar: "var(--tpl-finance-accent)"
  },
  {
    id: "ai",
    tag: "ARTIFICIAL INTELLIGENCE",
    headline: "The future of productivity",
    theme: "gradient",
    font: "condensed",
    accentVar: "var(--tpl-ai-accent)"
  },
  {
    id: "social",
    tag: "SOCIAL",
    headline: "Connect with your community",
    theme: "gradient",
    font: "poppins",
    accentVar: "var(--tpl-social-accent)"
  },
  {
    id: "fitness",
    tag: "FITNESS",
    headline: "Train smarter every day",
    theme: "dark",
    font: "condensed",
    accentVar: "var(--tpl-fitness-accent)"
  },
  {
    id: "gaming",
    tag: "GAMING",
    headline: "Level up your experience",
    theme: "dark",
    font: "condensed",
    accentVar: "var(--tpl-gaming-accent)"
  },
  {
    id: "sports",
    tag: "SPORTS",
    headline: "Dominate every match",
    theme: "dark",
    font: "condensed",
    accentVar: "var(--tpl-sports-accent)"
  },
  {
    id: "ecommerce",
    tag: "E-COMMERCE",
    headline: "Shop smarter, sell faster",
    theme: "light",
    font: "editorial",
    accentVar: "var(--tpl-ecommerce-accent)"
  },
  {
    id: "travel",
    tag: "TRAVEL",
    headline: "Explore the world your way",
    theme: "gradient",
    font: "editorial",
    accentVar: "var(--tpl-travel-accent)"
  }
];

export function getTemplateKitCategory(id: CategoryId): TemplateKitCategoryConfig {
  return TEMPLATE_KIT_CATEGORIES.find((c) => c.id === id) ?? TEMPLATE_KIT_CATEGORIES[0];
}

export function kitFontClass(font: KitFontPreset): string {
  switch (font) {
    case "condensed":
      return "font-[family-name:var(--font-barlow-condensed)] font-bold uppercase tracking-wide";
    case "poppins":
      return "font-[family-name:var(--font-poppins)] font-black";
    default:
      return "font-[family-name:var(--font-playfair)] font-semibold";
  }
}
