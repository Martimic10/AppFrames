"use client";

import { useCallback, useRef } from "react";
import { RotateCw } from "lucide-react";
import {
  clampMockupPositionInFrame,
  type MockupPosition
} from "@/components/create/mockup-position";
import type { MockupHostPaintOptions } from "@/components/create/mockup-host-paint";

type MockupRotateHandleProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  hostRef: React.RefObject<HTMLElement | null>;
  position: MockupPosition;
  editable: boolean;
  onInteractionStart: () => void;
  paintHost: (position: MockupPosition, options?: MockupHostPaintOptions) => void;
  onCommitPosition: (position: MockupPosition) => void;
};

function angleFromCenter(centerX: number, centerY: number, clientX: number, clientY: number): number {
  return (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
}

export function MockupRotateHandle({
  frameRef,
  hostRef,
  position,
  editable,
  onInteractionStart,
  paintHost,
  onCommitPosition
}: MockupRotateHandleProps) {
  const rotateState = useRef<{
    pointerId: number;
    startAngle: number;
    origin: MockupPosition;
    latest: MockupPosition;
  } | null>(null);

  const applyLive = useCallback(
    (next: MockupPosition) => {
      const frame = frameRef.current;
      const host = hostRef.current;
      const clamped =
        frame && host ? clampMockupPositionInFrame(next, frame, host) : next;
      paintHost(clamped, { kind: "rotate-preview" });
      return clamped;
    },
    [frameRef, hostRef, paintHost]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (!editable) return;
      event.stopPropagation();
      event.preventDefault();
      const host = hostRef.current;
      if (!host) return;

      onInteractionStart();
      const rect = host.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      event.currentTarget.setPointerCapture(event.pointerId);
      rotateState.current = {
        pointerId: event.pointerId,
        startAngle: angleFromCenter(centerX, centerY, event.clientX, event.clientY),
        origin: position,
        latest: position
      };
    },
    [editable, hostRef, onInteractionStart, position]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const rotate = rotateState.current;
      const host = hostRef.current;
      if (!rotate || rotate.pointerId !== event.pointerId || !host) return;

      const rect = host.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = angleFromCenter(centerX, centerY, event.clientX, event.clientY);
      const delta = currentAngle - rotate.startAngle;
      const originRotate = rotate.origin.rotate ?? 0;

      rotate.latest = applyLive({
        ...rotate.origin,
        rotate: originRotate + delta
      });
    },
    [applyLive, hostRef]
  );

  const endRotate = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const rotate = rotateState.current;
      if (!rotate || rotate.pointerId !== event.pointerId) return;
      rotateState.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      onCommitPosition(rotate.latest);
    },
    [onCommitPosition]
  );

  if (!editable) return null;

  return (
    <span
      data-editor-only
      data-mockup-rotate-handle
      role="button"
      aria-label="Drag to rotate mockup"
      className="pointer-events-auto absolute -right-2 -top-2 z-30 flex h-5 w-5 touch-none cursor-grab items-center justify-center rounded-full border border-white/70 bg-emerald-500/90 shadow-[0_0_0_1px_rgba(0,0,0,0.35)] active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endRotate}
      onPointerCancel={endRotate}
    >
      <RotateCw className="h-2.5 w-2.5 text-white" aria-hidden />
    </span>
  );
}
