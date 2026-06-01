"use client";

import { useCallback, useRef } from "react";
import { Move, Trash2 } from "lucide-react";
import {
  clampGraphicPosition,
  graphicPositionTransform,
  graphicSizeScale,
  type GraphicPosition
} from "@/components/create/graphic-position";
import { GraphicResizeHandle } from "@/components/create/graphic-resize-handle";

type DraggableSlideGraphicProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  position: GraphicPosition;
  maxWidthPercent: number;
  maxHeightPercent: number;
  imageDataUrl: string;
  editable: boolean;
  onPositionChange: (position: GraphicPosition) => void;
  onRemove?: () => void;
};

export function DraggableSlideGraphic({
  frameRef,
  position,
  maxWidthPercent,
  maxHeightPercent,
  imageDataUrl,
  editable,
  onPositionChange,
  onRemove
}: DraggableSlideGraphicProps) {
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: GraphicPosition;
  } | null>(null);

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

      onPositionChange(
        clampGraphicPosition({
          x: drag.origin.x + deltaX,
          y: drag.origin.y + deltaY
        })
      );
    },
    [frameRef, onPositionChange]
  );

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragState.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const clampedWidth = Math.min(92, Math.max(20, maxWidthPercent));
  const clampedHeight = Math.min(92, Math.max(20, maxHeightPercent));
  const scaleMul = graphicSizeScale(position.scale);

  return (
    <div
      data-export-graphic-host
      data-graphic-width-percent={String(clampedWidth)}
      data-graphic-max-height-percent={String(clampedHeight)}
      data-graphic-scale-mul={String(scaleMul)}
      data-graphic-src={imageDataUrl}
      className={`absolute z-[12] touch-none outline-none focus:outline-none focus-visible:outline-none ${
        editable ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${clampedWidth}%`,
        maxHeight: `${clampedHeight}%`,
        transform: graphicPositionTransform(scaleMul)
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role={editable ? "group" : undefined}
      aria-label={editable ? "Drag to reposition graphic" : undefined}
    >
      {editable ? (
        <>
          <span
            data-editor-only
            className="pointer-events-none absolute -left-0.5 -top-4 z-10 inline-flex items-center gap-0.5 rounded bg-zinc-950/85 px-1 py-0.5 text-[8px] font-medium text-purple-200/80"
          >
            <Move className="h-2.5 w-2.5" aria-hidden />
            Drag
          </span>
          {onRemove ? (
            <button
              type="button"
              data-editor-only
              aria-label="Remove graphic"
              className="absolute -right-1 -top-4 z-10 inline-flex h-4 w-4 items-center justify-center rounded bg-zinc-950/90 text-red-300/90 transition hover:bg-red-950/90 hover:text-red-200"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-2.5 w-2.5" aria-hidden />
            </button>
          ) : null}
          <GraphicResizeHandle
            frameRef={frameRef}
            position={position}
            editable={editable}
            onPositionChange={onPositionChange}
          />
        </>
      ) : null}
      <img
        src={imageDataUrl}
        alt=""
        draggable={false}
        loading="eager"
        className="block h-auto max-h-full w-full select-none object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}
