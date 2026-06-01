"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { Move } from "lucide-react";
import { IphoneDeviceChrome } from "@/components/create/iphone-device-chrome";
import { MockupRotateHandle } from "@/components/create/mockup-rotate-handle";
import { useScreenshotAspect } from "@/components/create/use-screenshot-aspect";
import {
  clampMockupPositionInFrame,
  mockupPositionTransform,
  type MockupPosition
} from "@/components/create/mockup-position";

type DraggableSlideMockupProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  position: MockupPosition;
  widthPercent: number;
  deviceHeightRatio: number;
  scaleMul?: number;
  editable: boolean;
  showDevices: boolean;
  flatScreenshot: boolean;
  imageDataUrl: string | null;
  onPositionChange: (position: MockupPosition) => void;
};

function positionsDiffer(a: MockupPosition, b: MockupPosition): boolean {
  return (
    Math.abs(a.x - b.x) > 0.05 ||
    Math.abs(a.y - b.y) > 0.05 ||
    (a.rotate ?? 0) !== (b.rotate ?? 0)
  );
}

export function DraggableSlideMockup({
  frameRef,
  position,
  widthPercent,
  deviceHeightRatio,
  scaleMul = 1,
  editable,
  showDevices,
  flatScreenshot,
  imageDataUrl,
  onPositionChange
}: DraggableSlideMockupProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: MockupPosition;
  } | null>(null);

  const commitPosition = useCallback(
    (next: MockupPosition) => {
      const frame = frameRef.current;
      const host = hostRef.current;
      if (frame && host) {
        onPositionChange(clampMockupPositionInFrame(next, frame, host));
        return;
      }
      onPositionChange(next);
    },
    [frameRef, onPositionChange]
  );

  useLayoutEffect(() => {
    if (!editable) return;
    const frame = frameRef.current;
    const host = hostRef.current;
    if (!frame || !host) return;

    const clamped = clampMockupPositionInFrame(position, frame, host);
    if (positionsDiffer(position, clamped)) {
      onPositionChange(clamped);
    }
  }, [
    editable,
    frameRef,
    position,
    widthPercent,
    scaleMul,
    imageDataUrl,
    onPositionChange
  ]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!editable) return;
      event.stopPropagation();
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: position
      };
    },
    [editable, position]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragState.current;
      const frame = frameRef.current;
      if (!drag || drag.pointerId !== event.pointerId || !frame) return;

      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaX = ((event.clientX - drag.startX) / rect.width) * 100;
      const deltaY = ((event.clientY - drag.startY) / rect.height) * 100;

      commitPosition({
        ...drag.origin,
        x: drag.origin.x + deltaX,
        y: drag.origin.y + deltaY
      });
    },
    [commitPosition, frameRef]
  );

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragState.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const clampedWidth = Math.min(92, Math.max(28, widthPercent));
  const screenshotAspect = useScreenshotAspect(imageDataUrl);
  const showMockup = Boolean(imageDataUrl) && (showDevices || flatScreenshot);
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
      className={`absolute z-[11] touch-none outline-none focus:outline-none focus-visible:outline-none ${
        editable ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${clampedWidth}%`,
        transform: mockupPositionTransform(scaleMul, rotateDeg)
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

      <MockupRotateHandle
        frameRef={frameRef}
        hostRef={hostRef}
        position={position}
        editable={editable}
        onPositionChange={commitPosition}
      />

      {showMockup ? <IphoneDeviceChrome imageDataUrl={imageDataUrl} /> : null}
    </div>
  );
}
