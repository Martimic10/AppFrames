import { TEXT_SIZE_SLIDER_MAX, TEXT_SIZE_SLIDER_MIN } from "@/components/create/text-style";

export function clampSlideTextSize(size: number): number {
  return Math.min(
    TEXT_SIZE_SLIDER_MAX,
    Math.max(TEXT_SIZE_SLIDER_MIN, Math.round(size))
  );
}

/** Map a diagonal drag (out = bigger) to slide textSize units. */
export function slideTextSizeFromDrag(
  originSize: number,
  startX: number,
  startY: number,
  clientX: number,
  clientY: number,
  frameWidth: number,
  frameHeight: number
): number {
  const deltaX = clientX - startX;
  const deltaY = clientY - startY;
  const diagonal = (deltaX + deltaY) * 0.5;
  const scale = 120 / Math.min(frameWidth, frameHeight);
  return clampSlideTextSize(originSize + diagonal * scale);
}
