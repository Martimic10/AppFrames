import {
  GRAPHIC_SIZE_SLIDER,
  clampGraphicSizeSlider
} from "@/components/create/graphic-position";

/** Map a diagonal drag (out = bigger) to graphic size slider units (50 = 100%). */
export function graphicSizeFromDrag(
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
  return clampGraphicSizeSlider(originSize + diagonal * scale);
}

export { GRAPHIC_SIZE_SLIDER, clampGraphicSizeSlider };
