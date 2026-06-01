"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { Move } from "lucide-react";
import { IphoneDeviceChrome } from "@/components/create/iphone-device-chrome";
import { MockupResizeHandle } from "@/components/create/mockup-resize-handle";
import { MockupRotateHandle } from "@/components/create/mockup-rotate-handle";
import { useScreenshotAspect } from "@/components/create/use-screenshot-aspect";
import { DEVICE_CHASSIS_ASPECT } from "@/components/create/iphone-device-metrics";
import {
  clampMockupPositionInFrame,
  mockupPositionTransform,
  mockupTiltTransform,
  type MockupPosition
} from "@/components/create/mockup-position";
import {
  paintMockupHost,
  setCompositionMockupInteracting,
  type MockupHostPaintOptions
} from "@/components/create/mockup-host-paint";

type DraggableSlideMockupProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  position: MockupPosition;
  widthPercent: number;
  deviceHeightRatio: number;
  scaleMul?: number;
  editable: boolean;
  showDevices?: boolean;
  flatScreenshot?: boolean;
  imageDataUrl?: string | null;
  children?: React.ReactNode;
  hostAspectRatio?: number;
  /** Recompute host width when scale changes during resize. */
  widthPercentForPosition?: (position: MockupPosition) => number;
  onPositionChange: (position: MockupPosition) => void;
};

function positionsDiffer(a: MockupPosition, b: MockupPosition): boolean {
  return (
    Math.abs(a.x - b.x) > 0.05 ||
    Math.abs(a.y - b.y) > 0.05 ||
    (a.rotate ?? 0) !== (b.rotate ?? 0) ||
    (a.scale ?? 50) !== (b.scale ?? 50)
  );
}

export function DraggableSlideMockup({
  frameRef,
  position,
  widthPercent,
  deviceHeightRatio,
  scaleMul = 1,
  editable,
  showDevices = true,
  flatScreenshot = false,
  imageDataUrl = null,
  children,
  hostAspectRatio = children != null ? DEVICE_CHASSIS_ASPECT : undefined,
  widthPercentForPosition,
  onPositionChange
}: DraggableSlideMockupProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: MockupPosition;
  } | null>(null);

  const widthForPosition = useCallback(
    (pos: MockupPosition) => {
      const raw = widthPercentForPosition?.(pos) ?? widthPercent;
      return Math.min(96, Math.max(28, raw));
    },
    [widthPercent, widthPercentForPosition]
  );

  const clampedWidth = widthForPosition(position);

  const paintHost = useCallback(
    (pos: MockupPosition, options?: MockupHostPaintOptions) => {
      const host = hostRef.current;
      if (!host) return;
      paintMockupHost(host, pos, widthForPosition(pos), scaleMul, options);
    },
    [scaleMul, widthForPosition]
  );

  const commitPosition = useCallback(
    (next: MockupPosition) => {
      isInteractingRef.current = false;
      setCompositionMockupInteracting(frameRef.current, false);
      const frame = frameRef.current;
      const host = hostRef.current;
      const committed =
        frame && host ? clampMockupPositionInFrame(next, frame, host) : next;
      paintHost(committed);
      onPositionChange(committed);
    },
    [frameRef, onPositionChange, paintHost]
  );

  useLayoutEffect(() => {
    if (isInteractingRef.current) return;
    const frame = frameRef.current;
    const host = hostRef.current;
    if (!host) return;

    paintHost(position);

    if (!editable || !frame) return;
    const clamped = clampMockupPositionInFrame(position, frame, host);
    if (positionsDiffer(position, clamped)) {
      onPositionChange(clamped);
    }
  }, [
    editable,
    frameRef,
    paintHost,
    position,
    clampedWidth,
    scaleMul,
    position.rotate,
    position.scale,
    imageDataUrl,
    onPositionChange
  ]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!editable) return;
      if (
        (event.target as HTMLElement).closest(
          "[data-mockup-rotate-handle], [data-mockup-resize-handle]"
        )
      ) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      isInteractingRef.current = true;
      setCompositionMockupInteracting(frameRef.current, true);
      dragState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: position
      };
    },
    [editable, frameRef, position]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      paintHost(drag.origin, { kind: "drag", dragPx: { x: deltaX, y: deltaY } });
    },
    [paintHost]
  );

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const frame = frameRef.current;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      dragState.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      if (!frame) {
        isInteractingRef.current = false;
        setCompositionMockupInteracting(frameRef.current, false);
        return;
      }

      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        isInteractingRef.current = false;
        setCompositionMockupInteracting(frameRef.current, false);
        return;
      }

      commitPosition({
        ...drag.origin,
        x: drag.origin.x + (deltaX / rect.width) * 100,
        y: drag.origin.y + (deltaY / rect.height) * 100
      });
    },
    [commitPosition, frameRef]
  );

  const beginInteraction = useCallback(() => {
    isInteractingRef.current = true;
    setCompositionMockupInteracting(frameRef.current, true);
  }, [frameRef]);

  const screenshotAspect = useScreenshotAspect(imageDataUrl);
  const showMockup = children != null || (Boolean(imageDataUrl) && (showDevices || flatScreenshot));
  const rotateDeg = position.rotate ?? 0;

  return (
    <div
      ref={hostRef}
      data-export-device-host
      data-device-height-ratio={String(deviceHeightRatio)}
      data-mockup-width-percent={String(clampedWidth)}
      data-mockup-scale-mul={String(scaleMul)}
      data-mockup-rotate={String(rotateDeg)}
      data-image-aspect={String(screenshotAspect)}
      data-screenshot-src={imageDataUrl ?? ""}
      data-has-upload={imageDataUrl ? "true" : "false"}
      className={`editor-kit-mockup-host absolute z-[11] touch-none outline-none focus:outline-none focus-visible:outline-none ${
        editable
          ? "pointer-events-auto cursor-grab active:cursor-grabbing"
          : "pointer-events-none"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${clampedWidth}%`,
        height: hostAspectRatio != null ? "auto" : undefined,
        aspectRatio: hostAspectRatio != null ? String(hostAspectRatio) : undefined,
        transform: children != null ? "translate(-50%, -50%)" : mockupPositionTransform(scaleMul, rotateDeg)
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role={editable ? "group" : undefined}
      aria-label={editable ? "Drag to reposition screenshot mockup" : undefined}
    >
      {editable ? (
        <span
          data-editor-only
          className="pointer-events-none absolute -left-0.5 -top-4 z-10 inline-flex items-center gap-0.5 rounded bg-zinc-950/85 px-1 py-0.5 text-[8px] font-medium text-purple-200/80"
        >
          <Move className="h-2.5 w-2.5" aria-hidden />
          Drag
        </span>
      ) : null}

      {showMockup ? (
        children != null ? (
          <div
            className="editor-kit-mockup-tilt h-full w-full"
            data-mockup-tilt
            style={{
              transform: mockupTiltTransform(scaleMul, rotateDeg)
            }}
          >
            {children}
          </div>
        ) : (
          <IphoneDeviceChrome imageDataUrl={imageDataUrl} />
        )
      ) : null}

      <MockupRotateHandle
        frameRef={frameRef}
        hostRef={hostRef}
        position={position}
        editable={editable}
        onInteractionStart={beginInteraction}
        paintHost={paintHost}
        onCommitPosition={commitPosition}
      />
      <MockupResizeHandle
        frameRef={frameRef}
        hostRef={hostRef}
        position={position}
        editable={editable}
        onInteractionStart={beginInteraction}
        paintHost={paintHost}
        onCommitPosition={commitPosition}
      />
    </div>
  );
}
