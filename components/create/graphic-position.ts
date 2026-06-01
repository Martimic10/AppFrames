export type GraphicPosition = {
  /** Horizontal anchor as % of frame width */
  x: number;
  /** Vertical anchor as % of frame height */
  y: number;
  /** Clockwise rotation in degrees (center-anchored). */
  rotate?: number;
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

export const GRAPHIC_ROTATE_LIMITS = {
  min: -90,
  max: 90
} as const;

export const GRAPHIC_MIN_VISIBLE_RATIO = 0.5;

export const GRAPHIC_POSITION_LIMITS = {
  minX: 4,
  maxX: 96,
  minY: 5,
  maxY: 92
} as const;

export function clampGraphicSizeSlider(size: number): number {
  return Math.min(
    GRAPHIC_SIZE_SLIDER.max,
    Math.max(GRAPHIC_SIZE_SLIDER.min, Math.round(size))
  );
}

export function clampGraphicRotate(rotate: number): number {
  return Math.min(
    GRAPHIC_ROTATE_LIMITS.max,
    Math.max(GRAPHIC_ROTATE_LIMITS.min, Math.round(rotate))
  );
}

/** Visual scale for uploaded graphics (CSS transform on tilt layer). Slider 50 → 100%. */
export function graphicSizeScale(size?: number): number {
  const slider = Number.isFinite(size) ? size! : 50;
  const clamped = clampGraphicSizeSlider(slider);
  const raw = clamped / 50;
  return Math.min(GRAPHIC_SIZE_SCALE_MAX, Math.max(0.5, raw));
}

export function clampGraphicPosition(position: GraphicPosition): GraphicPosition {
  const rotate =
    position.rotate != null && Number.isFinite(position.rotate)
      ? clampGraphicRotate(position.rotate)
      : undefined;
  const scale =
    position.scale != null && Number.isFinite(position.scale)
      ? clampGraphicSizeSlider(position.scale)
      : undefined;

  const out: GraphicPosition = {
    x: Math.min(
      GRAPHIC_POSITION_LIMITS.maxX,
      Math.max(GRAPHIC_POSITION_LIMITS.minX, position.x)
    ),
    y: Math.min(
      GRAPHIC_POSITION_LIMITS.maxY,
      Math.max(GRAPHIC_POSITION_LIMITS.minY, position.y)
    )
  };
  if (rotate != null) {
    out.rotate = rotate;
  }
  if (scale != null && scale !== 50) {
    out.scale = scale;
  }
  return out;
}

function graphicBoundsPx(graphicEl: HTMLElement): { width: number; height: number } {
  const raw = Number.parseFloat(graphicEl.dataset.graphicScaleMul ?? "1");
  const scale = Number.isFinite(raw) && raw > 0 ? raw : 1;
  return {
    width: graphicEl.offsetWidth * scale,
    height: graphicEl.offsetHeight * scale
  };
}

export function clampGraphicPositionInFrame(
  position: GraphicPosition,
  frameEl: HTMLElement,
  graphicEl: HTMLElement
): GraphicPosition {
  const frameW = frameEl.offsetWidth;
  const frameH = frameEl.offsetHeight;
  if (frameW <= 0 || frameH <= 0) return clampGraphicPosition(position);

  const { width: graphicW, height: graphicH } = graphicBoundsPx(graphicEl);
  if (graphicW <= 0 || graphicH <= 0) return clampGraphicPosition(position);

  const rotateDeg = position.rotate ?? 0;
  const rad = (rotateDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const halfW = (graphicW * cos + graphicH * sin) / 2;
  const halfH = (graphicW * sin + graphicH * cos) / 2;

  const centerX = (position.x / 100) * frameW;
  const centerY = (position.y / 100) * frameH;

  const minVisible = GRAPHIC_MIN_VISIBLE_RATIO;
  const minX = halfW * minVisible;
  const maxX = frameW - halfW * minVisible;
  const minY = halfH * minVisible;
  const maxY = frameH - halfH * minVisible;

  if (minX > maxX || minY > maxY) {
    return clampGraphicPosition({
      x: 50,
      y: 50,
      rotate: rotateDeg,
      scale: position.scale
    });
  }

  const clampedCenterX = Math.min(maxX, Math.max(minX, centerX));
  const clampedCenterY = Math.min(maxY, Math.max(minY, centerY));

  return clampGraphicPosition({
    x: (clampedCenterX / frameW) * 100,
    y: (clampedCenterY / frameH) * 100,
    rotate: rotateDeg,
    scale: position.scale
  });
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

/** Rotation/scale on inner layer — host only handles translate. */
export function graphicTiltTransform(scaleMul = 1, rotateDeg = 0): string {
  const parts: string[] = [];
  if (rotateDeg) parts.push(`rotate(${rotateDeg}deg)`);
  if (scaleMul !== 1) parts.push(`scale(${scaleMul})`);
  return parts.length ? parts.join(" ") : "none";
}

export function graphicMaxWidthPercent(hasScreenshot: boolean): number {
  return hasScreenshot ? 56 : 75;
}

export function graphicMaxHeightPercent(hasScreenshot: boolean): number {
  return hasScreenshot ? 40 : 65;
}

export function sanitizeGraphicPosition(
  position: GraphicPosition | null | undefined
): GraphicPosition | null {
  if (!position) return null;
  return clampGraphicPosition(position);
}
