import type { CompositionLayoutId, CompositionPlan } from "@/components/create/composition-engine";

export const CARD_CONTENT_PADDING_PX = 12;
export const CARD_SECTION_GAP_PX = 8;

export type CardCompositionVariant = {
  deviceHeightRatio: number;
  deviceMaxWidthRatio: number;
  deviceTranslateXPercent: number;
  textMaxWidthPercent: number;
  headlineScaleMul: number;
  subheadlineScaleMul: number;
  glowXPercent: number;
  glowYPercent: number;
  chipJustify: "flex-start" | "center" | "flex-end";
};

const CARD_VARIANT_BY_LAYOUT: Record<
  CompositionLayoutId,
  Omit<CardCompositionVariant, "glowXPercent" | "glowYPercent">
> = {
  "floating-stack": {
    deviceHeightRatio: 0.74,
    deviceMaxWidthRatio: 0.9,
    deviceTranslateXPercent: 0,
    textMaxWidthPercent: 100,
    headlineScaleMul: 1.04,
    subheadlineScaleMul: 0.98,
    chipJustify: "flex-start"
  },
  "hero-device": {
    deviceHeightRatio: 0.76,
    deviceMaxWidthRatio: 0.9,
    deviceTranslateXPercent: 0,
    textMaxWidthPercent: 94,
    headlineScaleMul: 1.1,
    subheadlineScaleMul: 1,
    chipJustify: "center"
  },
  collage: {
    deviceHeightRatio: 0.7,
    deviceMaxWidthRatio: 0.86,
    deviceTranslateXPercent: 0,
    textMaxWidthPercent: 88,
    headlineScaleMul: 1,
    subheadlineScaleMul: 0.95,
    chipJustify: "flex-start"
  },
  "angled-perspective": {
    deviceHeightRatio: 0.73,
    deviceMaxWidthRatio: 0.87,
    deviceTranslateXPercent: 0,
    textMaxWidthPercent: 92,
    headlineScaleMul: 1.08,
    subheadlineScaleMul: 1,
    chipJustify: "flex-start"
  },
  split: {
    deviceHeightRatio: 0.71,
    deviceMaxWidthRatio: 0.88,
    deviceTranslateXPercent: 0,
    textMaxWidthPercent: 72,
    headlineScaleMul: 1.06,
    subheadlineScaleMul: 1,
    chipJustify: "flex-end"
  }
};

export function getCardCompositionVariant(
  layoutId: CompositionLayoutId,
  plan: CompositionPlan
): CardCompositionVariant {
  const base = CARD_VARIANT_BY_LAYOUT[layoutId];

  return {
    ...base,
    glowXPercent: plan.glowX,
    glowYPercent: plan.glowY
  };
}

/** Default vertical anchor for the device (used when positioning mockups). */
export function getCardDeviceHeightRatio(variant: CardCompositionVariant): number {
  return variant.deviceHeightRatio;
}

/** Uploaded screenshots use a smaller device so headlines and background breathe. */
export function getCardDeviceMaxWidthRatio(
  variant: CardCompositionVariant,
  hasScreenshot: boolean
): number {
  if (!hasScreenshot) return variant.deviceMaxWidthRatio;
  return Math.min(0.66, variant.deviceMaxWidthRatio * 0.72);
}

/** Headline size on editor cards (px). `textSize` 54 ≈ default. */
export function cardHeadlineSizePx(textSize: number, scaleMul = 1): number {
  return Math.min(24, Math.max(10, Math.round(textSize * 0.26 * scaleMul)));
}

/** Subtitle size on editor cards (px). Scales with headline via `textSize`. */
export function cardSubheadlineSizePx(textSize: number, scaleMul = 1): number {
  return Math.min(17, Math.max(8, Math.round(textSize * 0.15 * scaleMul)));
}
