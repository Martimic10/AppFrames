import { clampMockupScale } from "@/components/create/mockup-position";

/** Map a diagonal drag (out = bigger) to per-slide mockup scale (50 = 100%). */
export function mockupSizeFromDrag(
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
  return clampMockupScale(originSize + diagonal * scale);
}
