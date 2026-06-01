export type GraphicPosition = {
  /** Horizontal anchor as % of frame width */
  x: number;
  /** Vertical anchor as % of frame height */
  y: number;
  /** Size slider; 50 = 100% visual scale. */
  scale?: number;
};

/** Max graphic scale (slider 200 → 400%). */
export const GRAPHIC_SIZE_SCALE_MAX = 4;

/** Slider 50 = 100% visual scale. */
export const GRAPHIC_SIZE_SLIDER = {
  min: 25,
  max: 200
} as const;

export function clampGraphicSizeSlider(size: number): number {
  return Math.min(
    GRAPHIC_SIZE_SLIDER.max,
    Math.max(GRAPHIC_SIZE_SLIDER.min, Math.round(size))
  );
}

/** Visual scale for uploaded graphics (CSS transform). Slider 50 → 100%. */
export function graphicSizeScale(size?: number): number {
  const slider = Number.isFinite(size) ? size! : 50;
  const clamped = clampGraphicSizeSlider(slider);
  const raw = clamped / 50;
  return Math.min(GRAPHIC_SIZE_SCALE_MAX, Math.max(0.5, raw));
}

export const GRAPHIC_POSITION_LIMITS = {
  minX: 4,
  maxX: 96,
  minY: 5,
  maxY: 92
} as const;

export function clampGraphicPosition(position: GraphicPosition): GraphicPosition {
  const scale =
    position.scale != null && Number.isFinite(position.scale)
      ? clampGraphicSizeSlider(position.scale)
      : undefined;

  return {
    x: Math.min(GRAPHIC_POSITION_LIMITS.maxX, Math.max(GRAPHIC_POSITION_LIMITS.minX, position.x)),
    y: Math.min(GRAPHIC_POSITION_LIMITS.maxY, Math.max(GRAPHIC_POSITION_LIMITS.minY, position.y)),
    ...(scale != null && scale !== 50 ? { scale } : {})
  };
}

export function layoutDefaultGraphicPosition(hasScreenshot: boolean): GraphicPosition {
  return clampGraphicPosition({
    x: 50,
    y: hasScreenshot ? 38 : 50
  });
}

export function resolveGraphicPosition(
  custom: GraphicPosition | null | undefined,
  hasScreenshot: boolean
): GraphicPosition {
  if (custom) return clampGraphicPosition(custom);
  return layoutDefaultGraphicPosition(hasScreenshot);
}

/** Center-anchored graphic layer with optional scale. */
export function graphicPositionTransform(scaleMul = 1): string {
  if (scaleMul === 1) return "translate(-50%, -50%)";
  return `translate(-50%, -50%) scale(${scaleMul})`;
}

export function graphicMaxWidthPercent(hasScreenshot: boolean): number {
  return hasScreenshot ? 56 : 75;
}

export function graphicMaxHeightPercent(hasScreenshot: boolean): number {
  return hasScreenshot ? 40 : 65;
}
