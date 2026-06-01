"use client";

import { useCallback, useEffect, useRef } from "react";
import { graphicSizeFromDrag } from "@/components/create/graphic-size-resize";
import {
  clampGraphicPosition,
  clampGraphicPositionInFrame,
  graphicSizeScale,
  type GraphicPosition
} from "@/components/create/graphic-position";
import type { GraphicHostPaintOptions } from "@/components/create/graphic-host-paint";

type GraphicResizeHandleProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  hostRef: React.RefObject<HTMLElement | null>;
  editable: boolean;
  onInteractionStart: () => void;
  paintHost: (position: GraphicPosition, options?: GraphicHostPaintOptions) => void;
  onCommitPosition: (position: GraphicPosition) => void;
};

export function GraphicResizeHandle({
  frameRef,
  hostRef,
  position,
  editable,
  onInteractionStart,
  paintHost,
  onCommitPosition
}: GraphicResizeHandleProps & { position: GraphicPosition }) {
  const resizeState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originSize: number;
    originScaleMul: number;
    origin: GraphicPosition;
    latest: GraphicPosition;
  } | null>(null);

  const applyLive = useCallback(
    (next: GraphicPosition) => {
      const frame = frameRef.current;
      const host = hostRef.current;
      const clamped =
        frame && host ? clampGraphicPositionInFrame(next, frame, host) : next;
      const originMul = resizeState.current?.originScaleMul ?? graphicSizeScale(clamped.scale);
      paintHost(clamped, {
        kind: "resize-preview",
        originScaleMul: originMul
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
      const originSize = position.scale ?? 50;
      resizeState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originSize,
        originScaleMul: graphicSizeScale(originSize),
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

      const next = clampGraphicPosition({
        ...resize.origin,
        scale: graphicSizeFromDrag(
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
      const resize = resizeState.current;
      if (!resize || resize.pointerId !== event.pointerId) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      endResize(event.pointerId);
    },
    [endResize]
  );

  if (!editable) return null;

  return (
    <span
      data-editor-only
      data-graphic-resize-handle
      role="button"
      aria-label="Drag to resize graphic"
      className="pointer-events-auto absolute -bottom-1.5 -right-1.5 z-30 h-3.5 w-3.5 touch-none cursor-nwse-resize rounded-sm border border-white/70 bg-purple-500/85 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
