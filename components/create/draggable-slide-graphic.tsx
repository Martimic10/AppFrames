"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { Move, Trash2 } from "lucide-react";
import { GraphicResizeHandle } from "@/components/create/graphic-resize-handle";
import { GraphicRotateHandle } from "@/components/create/graphic-rotate-handle";
import {
  clampGraphicPositionInFrame,
  graphicSizeScale,
  graphicTiltTransform,
  type GraphicPosition
} from "@/components/create/graphic-position";
import {
  paintGraphicHost,
  setCompositionGraphicInteracting,
  type GraphicHostPaintOptions
} from "@/components/create/graphic-host-paint";

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

function positionsDiffer(a: GraphicPosition, b: GraphicPosition): boolean {
  return (
    Math.abs(a.x - b.x) > 0.05 ||
    Math.abs(a.y - b.y) > 0.05 ||
    (a.rotate ?? 0) !== (b.rotate ?? 0) ||
    (a.scale ?? 50) !== (b.scale ?? 50)
  );
}

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
  const hostRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: GraphicPosition;
  } | null>(null);

  const clampedWidth = Math.min(92, Math.max(20, maxWidthPercent));
  const clampedHeight = Math.min(92, Math.max(20, maxHeightPercent));
  const scaleMul = graphicSizeScale(position.scale);
  const rotateDeg = position.rotate ?? 0;

  const paintHost = useCallback(
    (pos: GraphicPosition, options?: GraphicHostPaintOptions) => {
      const host = hostRef.current;
      if (!host) return;
      paintGraphicHost(host, pos, clampedWidth, clampedHeight, options);
    },
    [clampedHeight, clampedWidth]
  );

  const commitPosition = useCallback(
    (next: GraphicPosition) => {
      isInteractingRef.current = false;
      setCompositionGraphicInteracting(frameRef.current, false);
      const frame = frameRef.current;
      const host = hostRef.current;
      const committed =
        frame && host ? clampGraphicPositionInFrame(next, frame, host) : next;
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
    const clamped = clampGraphicPositionInFrame(position, frame, host);
    if (positionsDiffer(position, clamped)) {
      onPositionChange(clamped);
    }
  }, [
    editable,
    frameRef,
    paintHost,
    position,
    clampedWidth,
    clampedHeight,
    scaleMul,
    rotateDeg,
    imageDataUrl,
    onPositionChange
  ]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!editable) return;
      if (
        (event.target as HTMLElement).closest(
          "[data-graphic-rotate-handle], [data-graphic-resize-handle]"
        )
      ) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      isInteractingRef.current = true;
      setCompositionGraphicInteracting(frameRef.current, true);
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
        setCompositionGraphicInteracting(frameRef.current, false);
        return;
      }

      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        isInteractingRef.current = false;
        setCompositionGraphicInteracting(frameRef.current, false);
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
    setCompositionGraphicInteracting(frameRef.current, true);
  }, [frameRef]);

  return (
    <div
      ref={hostRef}
      data-export-graphic-host
      data-graphic-width-percent={String(clampedWidth)}
      data-graphic-max-height-percent={String(clampedHeight)}
      data-graphic-scale-mul={String(scaleMul)}
      data-graphic-rotate={String(rotateDeg)}
      data-mockup-rotate={String(rotateDeg)}
      data-graphic-src={imageDataUrl}
      className={`editor-kit-graphic-host absolute z-[12] touch-none outline-none focus:outline-none focus-visible:outline-none ${
        editable
          ? "pointer-events-auto cursor-grab active:cursor-grabbing"
          : "pointer-events-none"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${clampedWidth}%`,
        maxHeight: `${clampedHeight}%`,
        transform: "translate(-50%, -50%)"
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
              className="pointer-events-auto absolute -right-1 -top-4 z-10 inline-flex h-4 w-4 items-center justify-center rounded bg-zinc-950/90 text-red-300/90 transition hover:bg-red-950/90 hover:text-red-200"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-2.5 w-2.5" aria-hidden />
            </button>
          ) : null}
        </>
      ) : null}

      <div
        className="editor-kit-graphic-tilt h-full w-full"
        data-graphic-tilt
        style={{
          transform: graphicTiltTransform(scaleMul, rotateDeg),
          transformOrigin: "center center"
        }}
      >
        <img
          src={imageDataUrl}
          alt=""
          draggable={false}
          loading="eager"
          className="block h-auto max-h-full w-full select-none object-contain"
        />
      </div>

      <GraphicRotateHandle
        frameRef={frameRef}
        hostRef={hostRef}
        position={position}
        editable={editable}
        onInteractionStart={beginInteraction}
        paintHost={paintHost}
        onCommitPosition={commitPosition}
      />
      <GraphicResizeHandle
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
