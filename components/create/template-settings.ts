export type StylePreset = "clean" | "contrast" | "editorial";

export type TemplateSettings = {
  layoutSpacing: number;
  /** Device mockup scale in cards; 50 = 100%, 30 = smaller, 100 = 200%. */
  mockupSize: number;
  stylePreset: StylePreset;
  showDeviceFrame: boolean;
  showUploadedMockupAsIs: boolean;
};

export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  layoutSpacing: 60,
  /** 38 ≈ 76% visual scale — more background visible for a premium App Store look. */
  mockupSize: 38,
  stylePreset: "clean",
  showDeviceFrame: true,
  showUploadedMockupAsIs: true
};

/** Background layer inside the card (under text + mockup). */
export function cardThemeOverlayImage(
  useGradient: boolean,
  gradientCss: string,
  background: string,
  themeBackgroundImage: string,
  hasScreenshot: boolean
): string {
  if (useGradient) return gradientCss;
  if (hasScreenshot) {
    return `linear-gradient(180deg, ${background} 0%, ${background} 100%)`;
  }
  // Category themes stack radial + linear; radial reads as a glow behind the phone.
  const linearOnly = themeBackgroundImage
    .split(/,(?=\s*linear-gradient)/i)
    .find((part) => part.trim().startsWith("linear-gradient"));
  return linearOnly?.trim() ?? themeBackgroundImage;
}

/** Theme overlay on card frames — keeps Style tab colors on screenshot slides too. */
export function cardThemeOverlayOpacity(
  hasScreenshot: boolean,
  useGradient: boolean
): number {
  if (hasScreenshot) return 0;
  if (useGradient) return 0.58;
  return 0.78;
}

export function cardAccentWashOpacity(hasScreenshot: boolean): number {
  return hasScreenshot ? 0 : 0.12;
}

/** Max mockup scale (slider 200 → 400%). */
export const MOCKUP_SIZE_SCALE_MAX = 4;

/** Slider 50 = 100% visual scale. */
export const MOCKUP_SIZE_SLIDER = {
  min: 30,
  max: 200
} as const;

/**
 * Visual scale for the device mockup (CSS transform). Slider 50 → 100%.
 */
export function mockupSizeScale(mockupSize: number): number {
  const size = Number.isFinite(mockupSize) ? mockupSize : DEFAULT_TEMPLATE_SETTINGS.mockupSize;
  const clamped = Math.min(
    MOCKUP_SIZE_SLIDER.max,
    Math.max(MOCKUP_SIZE_SLIDER.min, size)
  );
  const raw = clamped / 50;
  return Math.min(MOCKUP_SIZE_SCALE_MAX, Math.max(0.72, raw));
}

/** Canvas gap between slides (px) from spacing slider 20–100. */
export function slideGapPx(layoutSpacing: number): number {
  const t = (layoutSpacing - 20) / 80;
  return Math.round(12 + t * 20);
}

/** Inner padding on each App Store frame card. */
export function framePaddingPx(layoutSpacing: number): number {
  const t = (layoutSpacing - 20) / 80;
  return Math.round(8 + t * 12);
}

export type MoodStyles = {
  headlineWeight: number;
  headlineColor: string;
  subheadlineColor: string;
  glowMultiplier: number;
  headlineTracking: string;
};

export function getMoodStyles(preset: StylePreset): MoodStyles {
  switch (preset) {
    case "contrast":
      return {
        headlineWeight: 700,
        headlineColor: "#ffffff",
        subheadlineColor: "#e4e4e7",
        glowMultiplier: 1.35,
        headlineTracking: "-0.02em"
      };
    case "editorial":
      return {
        headlineWeight: 500,
        headlineColor: "#f4f4f5",
        subheadlineColor: "#a1a1aa",
        glowMultiplier: 0.85,
        headlineTracking: "0.01em"
      };
    default:
      return {
        headlineWeight: 600,
        headlineColor: "#ffffff",
        subheadlineColor: "#d4d4d8",
        glowMultiplier: 1,
        headlineTracking: "-0.01em"
      };
  }
}
