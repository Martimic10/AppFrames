"use client";

import { useCallback, useRef } from "react";
import { RotateCw } from "lucide-react";
import {
  clampMockupPositionInFrame,
  type MockupPosition
} from "@/components/create/mockup-position";

type MockupRotateHandleProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  hostRef: React.RefObject<HTMLElement | null>;
  position: MockupPosition;
  editable: boolean;
  onPositionChange: (position: MockupPosition) => void;
};

function angleFromCenter(centerX: number, centerY: number, clientX: number, clientY: number): number {
  return (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
}

export function MockupRotateHandle({
  frameRef,
  hostRef,
  position,
  editable,
  onPositionChange
}: MockupRotateHandleProps) {
  const rotateState = useRef<{
    pointerId: number;
    startAngle: number;
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
    [frameRef, hostRef, onPositionChange]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (!editable) return;
      event.stopPropagation();
      event.preventDefault();
      const host = hostRef.current;
      if (!host) return;

      const rect = host.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      event.currentTarget.setPointerCapture(event.pointerId);
      rotateState.current = {
        pointerId: event.pointerId,
        startAngle: angleFromCenter(centerX, centerY, event.clientX, event.clientY),
        origin: position
      };
    },
    [editable, hostRef, position]
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

      commitPosition({
        ...rotate.origin,
        rotate: originRotate + delta
      });
    },
    [commitPosition, hostRef]
  );

  const endRotate = useCallback((event: React.PointerEvent<HTMLSpanElement>) => {
    const rotate = rotateState.current;
    if (!rotate || rotate.pointerId !== event.pointerId) return;
    rotateState.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  if (!editable) return null;

  return (
    <span
      data-editor-only
      role="button"
      aria-label="Drag to rotate mockup"
      className="absolute -right-2 -top-2 z-10 flex h-5 w-5 touch-none cursor-grab items-center justify-center rounded-full border border-white/70 bg-emerald-500/90 shadow-[0_0_0_1px_rgba(0,0,0,0.35)] active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endRotate}
      onPointerCancel={endRotate}
    >
      <RotateCw className="h-2.5 w-2.5 text-white" aria-hidden />
    </span>
  );
}
