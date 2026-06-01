import {
  getThemePack,
  templateVariationByCategory,
  type ThemeVariation
} from "@/components/create/category-theme-packs";
import {
  getTemplateKitCategory,
  type KitFontPreset,
  type KitThemeType
} from "@/components/create/template-kit-config";
import { getTemplateThemeColors } from "@/components/create/template-theme-colors";
import { templatePackOverrides } from "@/components/create/template-pack-overrides";
import type { TextFontId } from "@/components/create/text-fonts";
import type { CategoryId } from "@/components/create/types";

export type TemplatePickerKitVisual = {
  theme: KitThemeType;
  font: KitFontPreset;
  accentColor: string;
  accentSoft: string;
  backgroundImage: string;
  useCategoryBackground: boolean;
  phoneRotate: number;
  phoneBleed: boolean;
  badge?: string;
  shimmerWord?: string;
};

function themeForVariation(
  categoryTheme: KitThemeType,
  variation: ThemeVariation
): KitThemeType {
  if (variation === "minimal" && categoryTheme === "light") return "light";
  if (variation === "bold") return "gradient";
  if (variation === "cinematic") return "dark";
  if (variation === "data-rich") return "dark";
  return categoryTheme;
}

function fontForVariation(
  categoryFont: KitFontPreset,
  variation: ThemeVariation,
  categoryId: CategoryId
): KitFontPreset {
  if (variation === "data-rich") return "condensed";
  if (variation === "bold" && (categoryId === "ai" || categoryId === "gaming")) {
    return "condensed";
  }
  if (variation === "bold" && categoryId === "social") return "poppins";
  if (variation === "cinematic") return "editorial";
  return categoryFont;
}

function phoneRotateForVariation(variation: ThemeVariation, templateIndex: number): number {
  const base =
    variation === "minimal" ? 4 : variation === "bold" ? -7 : variation === "data-rich" ? 1 : -3;
  return base + (templateIndex % 2 === 0 ? 2 : -2);
}

/** Per-template Features-kit look for the create-flow picker (portrait). */
export function getTemplatePickerKitVisual(
  categoryId: CategoryId,
  templateId: string,
  templateIndex: number
): TemplatePickerKitVisual {
  const kit = getTemplateKitCategory(categoryId);
  const theme = getTemplateThemeColors(categoryId, templateId);
  const pack = getThemePack(categoryId, templateId);
  const variation =
    templateVariationByCategory[categoryId]?.[templateId] ?? "minimal";
  const override = templatePackOverrides[templateId];

  return {
    theme: themeForVariation(kit.theme, variation),
    font: fontForVariation(kit.font, variation, categoryId),
    accentColor: theme.accent,
    accentSoft: theme.accentSoft,
    backgroundImage: pack.backgroundImage,
    useCategoryBackground: variation === "minimal" && kit.theme === "light",
    phoneRotate: phoneRotateForVariation(variation, templateIndex),
    phoneBleed: variation === "bold" || variation === "cinematic",
    shimmerWord: kit.shimmerWord
  };
}

export function kitFontToTextFontId(font: KitFontPreset): TextFontId {
  if (font === "poppins") return "poppins";
  if (font === "condensed") return "bebas";
  return "playfair";
}

export function kitCanvasTextColors(visual: TemplatePickerKitVisual): {
  headline: string;
  subheadline: string;
} {
  const isLight = visual.theme === "light";
  return {
    headline: isLight ? "#0f172a" : "#f8fafc",
    subheadline: isLight ? "rgba(15, 23, 42, 0.72)" : "rgba(248, 250, 252, 0.78)"
  };
}

/** Workspace background when the kit uses the category artboard (e.g. productivity light grid). */
export function kitCanvasBackgroundColor(categoryId: CategoryId, visual: TemplatePickerKitVisual): string {
  if (visual.useCategoryBackground && categoryId === "productivity") return "#f4f6f8";
  if (visual.useCategoryBackground && categoryId === "ecommerce") return "#fdfaf5";
  return "#09090b";
}
