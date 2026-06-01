"use client";

import { useCallback, useEffect, useRef } from "react";
import { mockupSizeFromDrag } from "@/components/create/mockup-size-resize";
import {
  clampMockupPosition,
  clampMockupPositionInFrame,
  type MockupPosition
} from "@/components/create/mockup-position";
import type { MockupHostPaintOptions } from "@/components/create/mockup-host-paint";
import { EDITOR_BASE_MOCKUP_WIDTH_PERCENT } from "@/components/create/editor-kit-slide-metrics";

type MockupResizeHandleProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  hostRef: React.RefObject<HTMLElement | null>;
  position: MockupPosition;
  editable: boolean;
  onInteractionStart: () => void;
  paintHost: (position: MockupPosition, options?: MockupHostPaintOptions) => void;
  onCommitPosition: (position: MockupPosition) => void;
};

export function MockupResizeHandle({
  frameRef,
  hostRef,
  position,
  editable,
  onInteractionStart,
  paintHost,
  onCommitPosition
}: MockupResizeHandleProps) {
  const resizeState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originSize: number;
    originWidthPercent: number;
    origin: MockupPosition;
    latest: MockupPosition;
  } | null>(null);

  const applyLive = useCallback(
    (next: MockupPosition) => {
      const frame = frameRef.current;
      const host = hostRef.current;
      const clamped =
        frame && host ? clampMockupPositionInFrame(next, frame, host) : next;
      const originWidth = resizeState.current?.originWidthPercent;
      if (originWidth == null) {
        paintHost(clamped);
        return clamped;
      }
      paintHost(clamped, {
        kind: "resize-preview",
        originWidthPercent: originWidth
      });
      return clamped;
    },
    [frameRef, hostRef, paintHost]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (!editable) return;
      event.stopPropagation();
      event.preventDefault();
      onInteractionStart();
      event.currentTarget.setPointerCapture(event.pointerId);
      const host = hostRef.current;
      const widthRaw = host?.dataset.mockupWidthPercent;
      const originWidthPercent = widthRaw
        ? Number.parseFloat(widthRaw)
        : Number.NaN;
      resizeState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originSize: position.scale ?? 50,
        originWidthPercent: Number.isFinite(originWidthPercent)
          ? originWidthPercent
          : EDITOR_BASE_MOCKUP_WIDTH_PERCENT,
        origin: position,
        latest: position
      };
    },
    [editable, onInteractionStart, position]
  );

  const applyResize = useCallback(
    (clientX: number, clientY: number) => {
      const resize = resizeState.current;
      const frame = frameRef.current;
      if (!resize || !frame) return;

      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const next = clampMockupPosition({
        ...resize.origin,
        scale: mockupSizeFromDrag(
          resize.originSize,
          resize.startX,
          resize.startY,
          clientX,
          clientY,
          rect.width,
          rect.height
        )
      });

      resize.latest = applyLive(next);
    },
    [applyLive, frameRef]
  );

  const endResize = useCallback(
    (pointerId: number) => {
      const resize = resizeState.current;
      if (!resize || resize.pointerId !== pointerId) return;
      resizeState.current = null;
      onCommitPosition(resize.latest);
    },
    [onCommitPosition]
  );

  useEffect(() => {
    if (!editable) return;

    const onPointerMove = (event: PointerEvent) => {
      const resize = resizeState.current;
      if (!resize || resize.pointerId !== event.pointerId) return;
      event.preventDefault();
      applyResize(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      endResize(event.pointerId);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [applyResize, editable, endResize]);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      endResize(event.pointerId);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [endResize]
  );

  if (!editable) return null;

  return (
    <span
      data-editor-only
      data-mockup-resize-handle
      role="button"
      aria-label="Drag to resize mockup"
      className="pointer-events-auto absolute bottom-0.5 right-0.5 z-30 h-4 w-4 touch-none cursor-nwse-resize rounded-sm border border-white/80 bg-emerald-500 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
