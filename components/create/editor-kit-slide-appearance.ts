import type { CSSProperties } from "react";
import type { BackgroundTextureId } from "@/components/create/background-textures";
import {
  backgroundTexturePreviewStyle,
  getBackgroundTexture
} from "@/components/create/background-textures";
import type { FrameStyleSettings } from "@/components/create/frame-style-settings";
import { frameShadowCss } from "@/components/create/frame-style-settings";
import type { StylePreset } from "@/components/create/template-settings";
import type { GradientStyle } from "@/components/create/types";
import { gradientToCss } from "@/components/create/style-colors";
import {
  isLightSlideBackground,
  slideTextColorsForBackground
} from "@/components/create/slide-background-contrast";

export type EditorKitSlideAppearance = {
  useGradient: boolean;
  gradientStyle: GradientStyle;
  background: string;
  backgroundTextureId: BackgroundTextureId;
  styleAccentColor: string;
  stylePreset: StylePreset;
  frameStyleSettings: FrameStyleSettings;
};

export type EditorKitSlideBackgroundLayers = {
  base: CSSProperties;
  texture: CSSProperties | null;
};

/** Base fill + optional texture overlay (matches composition-frame opacity behavior). */
export function editorKitSlideBackgroundLayers(
  appearance: Pick<
    EditorKitSlideAppearance,
    "useGradient" | "gradientStyle" | "background" | "backgroundTextureId"
  >
): EditorKitSlideBackgroundLayers {
  const gradientCss = gradientToCss(appearance.gradientStyle);
  const textureId = appearance.backgroundTextureId;

  if (textureId === "none") {
    return {
      base: {
        backgroundColor: appearance.useGradient ? "transparent" : appearance.background,
        backgroundImage: appearance.useGradient ? gradientCss : "none"
      },
      texture: null
    };
  }

  const texture = getBackgroundTexture(textureId);

  if (appearance.useGradient) {
    return {
      base: {
        backgroundColor: "transparent",
        backgroundImage: gradientCss
      },
      texture: {
        backgroundImage: texture.image,
        backgroundSize: texture.size,
        opacity: texture.opacity
      }
    };
  }

  return {
    base: {
      backgroundColor: appearance.background
    },
    texture: {
      backgroundImage: texture.image,
      backgroundSize: texture.size,
      opacity: texture.opacity
    }
  };
}

/** Single-div background (Style tab previews, kit card fill when not using external layers). */
/** Default headline/subheadline when slide colors are set to Auto (null). */
export function editorKitSlideTextColors(
  appearance: Pick<
    EditorKitSlideAppearance,
    "useGradient" | "gradientStyle" | "background"
  >
): { headline: string; subheadline: string } {
  const isLight = isLightSlideBackground(
    appearance.useGradient,
    appearance.background,
    appearance.gradientStyle
  );
  return slideTextColorsForBackground(isLight);
}

export function editorKitSlideBackgroundStyle(
  appearance: Pick<
    EditorKitSlideAppearance,
    "useGradient" | "gradientStyle" | "background" | "backgroundTextureId"
  >
): CSSProperties {
  const gradientCss = gradientToCss(appearance.gradientStyle);
  return backgroundTexturePreviewStyle(
    appearance.backgroundTextureId,
    appearance.useGradient,
    appearance.background,
    gradientCss
  );
}

export function editorKitSlideFrameShellStyle(
  appearance: EditorKitSlideAppearance,
  options: { selected: boolean; slideAccent: string }
): CSSProperties {
  const { cornerRadius, shadowDepth } = appearance.frameStyleSettings;
  const baseShadow = frameShadowCss(shadowDepth);
  const selectedRing = options.selected
    ? `, 0 0 0 2px color-mix(in srgb, ${options.slideAccent} 50%, transparent)`
    : "";

  return {
    borderRadius: cornerRadius,
    ["--editor-card-radius" as string]: `${cornerRadius}px`,
    backgroundColor: "transparent",
    boxShadow: `${baseShadow}, inset 0 1px 0 rgba(255,255,255,0.08)${selectedRing}`
  };
}
