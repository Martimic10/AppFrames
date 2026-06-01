import type { TextAlignment } from "@/components/create/text-style";

export type TextPosition = {
  /** Horizontal anchor as % of frame width */
  x: number;
  /** Vertical anchor as % of frame height */
  y: number;
};

export const TEXT_POSITION_LIMITS = {
  minX: 4,
  maxX: 96,
  minY: 5,
  maxY: 88
} as const;

export function clampTextPosition(position: TextPosition): TextPosition {
  return {
    x: Math.min(TEXT_POSITION_LIMITS.maxX, Math.max(TEXT_POSITION_LIMITS.minX, position.x)),
    y: Math.min(TEXT_POSITION_LIMITS.maxY, Math.max(TEXT_POSITION_LIMITS.minY, position.y))
  };
}

export function layoutDefaultTextPosition(
  alignment: TextAlignment,
  layoutX: number,
  layoutY: number,
  isCard: boolean
): TextPosition {
  if (isCard) {
    return clampTextPosition({
      x: alignment === "center" ? 50 : alignment === "right" ? 90 : 10,
      y: 14
    });
  }
  return clampTextPosition({
    x: alignment === "center" ? 50 : alignment === "right" ? 92 : layoutX,
    y: layoutY
  });
}

export function resolveTextPosition(
  custom: TextPosition | null | undefined,
  alignment: TextAlignment,
  layoutX: number,
  layoutY: number,
  isCard: boolean
): TextPosition {
  if (custom) return clampTextPosition(custom);
  return layoutDefaultTextPosition(alignment, layoutX, layoutY, isCard);
}

export function textPositionTransform(
  alignment: TextAlignment,
  rotateDeg?: number
): string | undefined {
  const parts: string[] = [];
  if (alignment === "center") parts.push("translateX(-50%)");
  else if (alignment === "right") parts.push("translateX(-100%)");
  if (rotateDeg) parts.push(`rotate(${rotateDeg}deg)`);
  return parts.length > 0 ? parts.join(" ") : undefined;
}
