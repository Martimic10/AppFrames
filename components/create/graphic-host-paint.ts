import {
  graphicSizeScale,
  graphicTiltTransform,
  type GraphicPosition
} from "@/components/create/graphic-position";
import { setCompositionMockupInteracting } from "@/components/create/mockup-host-paint";

export type GraphicHostPaintOptions =
  | { kind: "drag"; dragPx: { x: number; y: number } }
  | { kind: "rotate-preview" }
  | { kind: "resize-preview"; originScaleMul: number };

/** Reuses mockup smear guard — disables backdrop-invalidating effects on static layers. */
export function setCompositionGraphicInteracting(
  frame: HTMLElement | null,
  interacting: boolean
): void {
  setCompositionMockupInteracting(frame, interacting);
}

/**
 * Paint graphic host geometry. During interaction use preview modes so left/top/width
 * are not updated every pointer frame (prevents bg smear).
 */
export function paintGraphicHost(
  host: HTMLElement,
  pos: GraphicPosition,
  widthPercent: number,
  maxHeightPercent: number,
  options?: GraphicHostPaintOptions
): void {
  const tilt = host.querySelector<HTMLElement>("[data-graphic-tilt]");
  const hasTilt = Boolean(tilt);
  const rotateDeg = pos.rotate ?? 0;
  const scaleMul = graphicSizeScale(pos.scale);

  if (options?.kind === "drag") {
    const { x, y } = options.dragPx;
    if (hasTilt && tilt) {
      host.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      tilt.style.transform = graphicTiltTransform(scaleMul, rotateDeg);
    }
    return;
  }

  if (options?.kind === "rotate-preview" && hasTilt && tilt) {
    host.style.transform = "translate(-50%, -50%)";
    tilt.style.transform = graphicTiltTransform(scaleMul, rotateDeg);
    return;
  }

  if (options?.kind === "resize-preview" && hasTilt && tilt) {
    const origin = options.originScaleMul > 0 ? options.originScaleMul : scaleMul;
    const previewScale = origin > 0 ? scaleMul / origin : 1;
    host.style.transform = "translate(-50%, -50%)";
    tilt.style.transform = graphicTiltTransform(origin * previewScale, rotateDeg);
    return;
  }

  const clampedWidth = Math.min(92, Math.max(20, widthPercent));
  const clampedHeight = Math.min(92, Math.max(20, maxHeightPercent));

  host.style.left = `${pos.x}%`;
  host.style.top = `${pos.y}%`;
  host.style.width = `${clampedWidth}%`;
  host.style.maxHeight = `${clampedHeight}%`;

  if (hasTilt && tilt) {
    host.style.transform = "translate(-50%, -50%)";
    tilt.style.transform = graphicTiltTransform(scaleMul, rotateDeg);
    return;
  }

  host.style.transform = "translate(-50%, -50%)";
}
