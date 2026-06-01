import type { TextPosition } from "@/components/create/text-position";
import type { MockupPosition } from "@/components/create/mockup-position";
import type { GraphicPosition } from "@/components/create/graphic-position";

export type { TextPosition } from "@/components/create/text-position";
export type { MockupPosition } from "@/components/create/mockup-position";
export type TextFontWeight = "medium" | "semibold" | "bold";
export type TextAlignment = "left" | "center" | "right";

export type SlideTextStyle = {
  fontWeight: TextFontWeight;
  alignment: TextAlignment;
  textSize: number;
  /** When null, headline uses the template mood color. */
  headlineColor: string | null;
  /** When null, subtitle uses the template mood color. */
  subheadlineColor: string | null;
  /** Custom headline + subtitle position (% of slide). Null uses layout defaults. */
  textPosition: TextPosition | null;
  /** Custom screenshot mockup position (% of slide, center-anchored). */
  mockupPosition: MockupPosition | null;
  /** Custom graphic overlay position (% of slide, center-anchored). */
  graphicPosition: GraphicPosition | null;
};

export const DEFAULT_SLIDE_TEXT_STYLE: SlideTextStyle = {
  fontWeight: "semibold",
  alignment: "left",
  textSize: 54,
  headlineColor: null,
  subheadlineColor: null,
  textPosition: null,
  mockupPosition: null,
  graphicPosition: null
};

export const TEXT_COLOR_PRESETS = [
  {
    id: "auto",
    label: "Auto",
    headline: null as string | null,
    subheadline: null as string | null
  },
  { id: "white", label: "White", headline: "#ffffff", subheadline: "#e4e4e7" },
  { id: "soft", label: "Soft", headline: "#f4f4f5", subheadline: "#a1a1aa" },
  { id: "purple", label: "Purple", headline: "#f5f3ff", subheadline: "#c4b5fd" },
  { id: "mint", label: "Mint", headline: "#ecfdf5", subheadline: "#6ee7b7" },
  { id: "gold", label: "Gold", headline: "#fffbeb", subheadline: "#fcd34d" },
  { id: "ink", label: "Ink", headline: "#18181b", subheadline: "#52525b" }
] as const;

export function resolveHeadlineColor(
  custom: string | null | undefined,
  moodColor: string
): string {
  return custom?.trim() ? custom : moodColor;
}

export function resolveSubheadlineColor(
  custom: string | null | undefined,
  moodColor: string
): string {
  return custom?.trim() ? custom : moodColor;
}

export const TEXT_SIZE_SLIDER_MIN = 32;
export const TEXT_SIZE_SLIDER_MAX = 96;

export function fontWeightToNumber(weight: TextFontWeight): number {
  switch (weight) {
    case "bold":
      return 700;
    case "medium":
      return 500;
    default:
      return 600;
  }
}

/** Headline font size (px) for editor card previews. */
export function headlineSizePx(textSize: number, isCard: boolean): number {
  const scale = isCard ? 0.25 : 0.5;
  return Math.max(isCard ? 10 : 16, Math.round(textSize * scale));
}

export function subheadlineSizePx(textSize: number, isCard: boolean): number {
  return Math.max(isCard ? 8 : 11, Math.round(headlineSizePx(textSize, isCard) * 0.6));
}
