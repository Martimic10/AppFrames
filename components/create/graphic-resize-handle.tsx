"use client";

import { useCallback, useRef } from "react";
import { graphicSizeFromDrag } from "@/components/create/graphic-size-resize";
import {
  clampGraphicPosition,
  type GraphicPosition
} from "@/components/create/graphic-position";

type GraphicResizeHandleProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  position: GraphicPosition;
  editable: boolean;
  onPositionChange: (position: GraphicPosition) => void;
};

export function GraphicResizeHandle({
  frameRef,
  position,
  editable,
  onPositionChange
}: GraphicResizeHandleProps) {
  const resizeState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originSize: number;
  } | null>(null);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (!editable) return;
      event.stopPropagation();
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      resizeState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originSize: position.scale ?? 50
      };
    },
    [editable, position.scale]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const resize = resizeState.current;
      const frame = frameRef.current;
      if (!resize || resize.pointerId !== event.pointerId || !frame) return;

      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      onPositionChange(
        clampGraphicPosition({
          ...position,
          scale: graphicSizeFromDrag(
            resize.originSize,
            resize.startX,
            resize.startY,
            event.clientX,
            event.clientY,
            rect.width,
            rect.height
          )
        })
      );
    },
    [frameRef, onPositionChange, position]
  );

  const endResize = useCallback((event: React.PointerEvent<HTMLSpanElement>) => {
    const resize = resizeState.current;
    if (!resize || resize.pointerId !== event.pointerId) return;
    resizeState.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  if (!editable) return null;

  return (
    <span
      data-editor-only
      role="button"
      aria-label="Drag to resize graphic"
      className="absolute -bottom-1.5 -right-1.5 z-10 h-3.5 w-3.5 touch-none cursor-nwse-resize rounded-sm border border-white/70 bg-purple-500/85 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endResize}
      onPointerCancel={endResize}
    />
  );
}
