import {
  mockupPositionTransform,
  mockupTiltTransform,
  type MockupPosition
} from "@/components/create/mockup-position";

export type MockupHostPaintOptions =
  | { kind: "drag"; dragPx: { x: number; y: number } }
  | { kind: "resize-preview"; originWidthPercent: number }
  | { kind: "rotate-preview" };

function tiltTransformWithPreviewScale(
  scaleMul: number,
  rotateDeg: number,
  previewScale: number
): string {
  const base = mockupTiltTransform(scaleMul, rotateDeg);
  if (previewScale === 1) return base;
  if (!base || base === "none") return `scale(${previewScale})`;
  return `${base} scale(${previewScale})`;
}

/** Toggle while dragging/resizing — disables backdrop-invalidating effects in CSS. */
export function setCompositionMockupInteracting(
  frame: HTMLElement | null,
  interacting: boolean
): void {
  if (!frame) return;
  frame.classList.toggle("is-mockup-interacting", interacting);
  if (interacting) {
    frame.dataset.mockupInteracting = "true";
  } else {
    delete frame.dataset.mockupInteracting;
  }
}

/**
 * Paint mockup host geometry. During interaction use preview modes so left/top/width
 * and CSS filters on ancestors are not updated every pointer frame (prevents bg smear).
 */
export function paintMockupHost(
  host: HTMLElement,
  pos: MockupPosition,
  widthPercent: number,
  scaleMul: number,
  options?: MockupHostPaintOptions
): void {
  const tilt = host.querySelector<HTMLElement>("[data-mockup-tilt]");
  const hasTilt = Boolean(tilt);
  const rotateDeg = pos.rotate ?? 0;

  if (options?.kind === "drag") {
    const { x, y } = options.dragPx;
    if (hasTilt && tilt) {
      host.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      tilt.style.transform = mockupTiltTransform(scaleMul, rotateDeg);
    } else {
      const base = mockupPositionTransform(scaleMul, rotateDeg);
      host.style.transform = `${base} translate(${x}px, ${y}px)`;
    }
    return;
  }

  if (options?.kind === "rotate-preview" && hasTilt && tilt) {
    host.style.transform = "translate(-50%, -50%)";
    tilt.style.transform = mockupTiltTransform(scaleMul, rotateDeg);
    return;
  }

  if (options?.kind === "resize-preview" && hasTilt && tilt) {
    const targetWidth = Math.min(96, Math.max(28, widthPercent));
    const originWidth = Math.min(
      96,
      Math.max(28, options.originWidthPercent)
    );
    const previewScale = originWidth > 0 ? targetWidth / originWidth : 1;
    host.style.transform = "translate(-50%, -50%)";
    tilt.style.transform = tiltTransformWithPreviewScale(
      scaleMul,
      rotateDeg,
      previewScale
    );
    return;
  }

  const clampedWidth = Math.min(96, Math.max(28, widthPercent));
  host.style.left = `${pos.x}%`;
  host.style.top = `${pos.y}%`;
  host.style.width = `${clampedWidth}%`;

  if (hasTilt && tilt) {
    host.style.transform = "translate(-50%, -50%)";
    tilt.style.transform = mockupTiltTransform(scaleMul, rotateDeg);
    return;
  }

  host.style.transform = mockupPositionTransform(scaleMul, rotateDeg);
}
