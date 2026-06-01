import { mockupSizeScale } from "@/components/create/template-settings";

export type MockupPosition = {
  /** Horizontal anchor as % of frame width */
  x: number;
  /** Vertical anchor as % of frame height */
  y: number;
  /** Clockwise rotation in degrees (center-anchored). */
  rotate?: number;
  /** Per-slide size (30–200, 50 = 100%). Multiplied with global mockup size in the editor. */
  scale?: number;
};

/** Same range as Style → Mockup size slider. */
export const MOCKUP_SCALE_SLIDER = {
  min: 30,
  max: 200
} as const;

export function clampMockupScale(scale: number): number {
  return Math.min(
    MOCKUP_SCALE_SLIDER.max,
    Math.max(MOCKUP_SCALE_SLIDER.min, Math.round(scale))
  );
}

export const MOCKUP_ROTATE_LIMITS = {
  min: -90,
  max: 90
} as const;

/** Minimum share of the rotated mockup that must stay visible (up to ~50% may clip). */
export const MOCKUP_MIN_VISIBLE_RATIO = 0.5;

/** Fallback bounds when mockup size is not yet measured. */
export const MOCKUP_POSITION_LIMITS = {
  minX: -12,
  maxX: 112,
  minY: -8,
  maxY: 108
} as const;

export function clampMockupRotate(rotate: number): number {
  return Math.min(
    MOCKUP_ROTATE_LIMITS.max,
    Math.max(MOCKUP_ROTATE_LIMITS.min, Math.round(rotate))
  );
}

export function clampMockupPosition(position: MockupPosition): MockupPosition {
  const rotate =
    position.rotate != null && Number.isFinite(position.rotate)
      ? clampMockupRotate(position.rotate)
      : undefined;
  const scale =
    position.scale != null && Number.isFinite(position.scale)
      ? clampMockupScale(position.scale)
      : undefined;

  const out: MockupPosition = {
    x: Math.min(
      MOCKUP_POSITION_LIMITS.maxX,
      Math.max(MOCKUP_POSITION_LIMITS.minX, position.x)
    ),
    y: Math.min(
      MOCKUP_POSITION_LIMITS.maxY,
      Math.max(MOCKUP_POSITION_LIMITS.minY, position.y)
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

/** Global Style slider × optional per-slide scale (50 = 100%). */
export function effectiveMockupScaleMul(
  globalMockupSize: number,
  slideScale?: number | null
): number {
  const global = mockupSizeScale(globalMockupSize);
  const local =
    slideScale != null && Number.isFinite(slideScale)
      ? clampMockupScale(slideScale) / 50
      : 1;
  return global * local;
}

function mockupScaleMul(mockupEl: HTMLElement): number {
  const raw = Number.parseFloat(mockupEl.dataset.mockupScaleMul ?? "1");
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

function mockupBoundsPx(mockupEl: HTMLElement): { width: number; height: number } {
  const scale = mockupScaleMul(mockupEl);
  return {
    width: mockupEl.offsetWidth * scale,
    height: mockupEl.offsetHeight * scale
  };
}

/** Allow editorial clipping — mockup can bleed off edges but cannot fully disappear. */
export function clampMockupPositionInFrame(
  position: MockupPosition,
  frameEl: HTMLElement,
  mockupEl: HTMLElement
): MockupPosition {
  const frameW = frameEl.offsetWidth;
  const frameH = frameEl.offsetHeight;
  if (frameW <= 0 || frameH <= 0) return clampMockupPosition(position);

  const { width: mockupW, height: mockupH } = mockupBoundsPx(mockupEl);
  if (mockupW <= 0 || mockupH <= 0) return clampMockupPosition(position);

  const rotateDeg = position.rotate ?? 0;
  const rad = (rotateDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const halfW = (mockupW * cos + mockupH * sin) / 2;
  const halfH = (mockupW * sin + mockupH * cos) / 2;

  const centerX = (position.x / 100) * frameW;
  const centerY = (position.y / 100) * frameH;

  const minVisible = MOCKUP_MIN_VISIBLE_RATIO;
  const minX = halfW * minVisible;
  const maxX = frameW - halfW * minVisible;
  const minY = halfH * minVisible;
  const maxY = frameH - halfH * minVisible;

  if (minX > maxX || minY > maxY) {
    return clampMockupPosition({
      x: 50,
      y: 50,
      rotate: rotateDeg,
      scale: position.scale
    });
  }

  const clampedCenterX = Math.min(maxX, Math.max(minX, centerX));
  const clampedCenterY = Math.min(maxY, Math.max(minY, centerY));

  return clampMockupPosition({
    x: (clampedCenterX / frameW) * 100,
    y: (clampedCenterY / frameH) * 100,
    rotate: rotateDeg,
    scale: position.scale
  });
}

export function layoutDefaultMockupPosition(deviceHeightRatio = 0.74): MockupPosition {
  return clampMockupPosition({
    x: 50,
    y: Math.round(38 + deviceHeightRatio * 32)
  });
}

export function resolveMockupPosition(
  custom: MockupPosition | null | undefined,
  deviceHeightRatio = 0.72
): MockupPosition {
  if (custom) {
    return clampMockupPosition({
      x: custom.x,
      y: custom.y,
      rotate: custom.rotate,
      scale: custom.scale
    });
  }
  return layoutDefaultMockupPosition(deviceHeightRatio);
}

/** Default kit portrait phone anchor (centered, template tilt when unset). */
export function kitPortraitDefaultMockupPosition(
  deviceHeightRatio: number,
  templatePhoneRotate = 0
): MockupPosition {
  return clampMockupPosition({
    x: 50,
    y: Math.round(40 + deviceHeightRatio * 28),
    rotate: templatePhoneRotate
  });
}

export function resolveKitPortraitMockupPosition(
  custom: MockupPosition | null | undefined,
  deviceHeightRatio: number,
  templatePhoneRotate: number
): MockupPosition {
  if (custom) {
    return clampMockupPosition({
      x: custom.x,
      y: custom.y,
      rotate:
        custom.rotate != null && Number.isFinite(custom.rotate)
          ? custom.rotate
          : templatePhoneRotate,
      scale: custom.scale
    });
  }
  return kitPortraitDefaultMockupPosition(deviceHeightRatio, templatePhoneRotate);
}

/** Center-anchored mockup transform (translate, rotate, optional scale). */
export function mockupPositionTransform(scale = 1, rotateDeg = 0): string {
  const parts = ["translate(-50%, -50%)"];
  if (rotateDeg) parts.push(`rotate(${rotateDeg}deg)`);
  if (scale !== 1) parts.push(`scale(${scale})`);
  return parts.join(" ");
}

/** Rotation/scale on inner clip layer — host only handles translate. */
export function mockupTiltTransform(scale = 1, rotateDeg = 0): string {
  const parts: string[] = [];
  if (rotateDeg) parts.push(`rotate(${rotateDeg}deg)`);
  if (scale !== 1) parts.push(`scale(${scale})`);
  return parts.length ? parts.join(" ") : "none";
}

export function sanitizeMockupPosition(
  position: MockupPosition | null | undefined
): MockupPosition | null {
  if (!position) return null;
  return clampMockupPosition(position);
}
