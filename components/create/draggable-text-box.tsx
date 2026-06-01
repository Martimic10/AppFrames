"use client";

import { useCallback, useRef } from "react";
import { Move, Trash2 } from "lucide-react";
import {
  clampTextPosition,
  type TextPosition,
  textPositionTransform
} from "@/components/create/text-position";
import { TextResizeHandle } from "@/components/create/text-resize-handle";
import {
  fontWeightToNumber,
  type TextAlignment,
  type TextFontWeight
} from "@/components/create/text-style";

type DraggableTextBoxProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  position: TextPosition;
  maxWidthPercent: number;
  alignment: TextAlignment;
  editable: boolean;
  text: string;
  fontSizePx: number;
  fontFamily: string;
  fontWeight: TextFontWeight;
  color: string;
  textSize: number;
  lineClamp?: boolean;
  onPositionChange: (position: TextPosition) => void;
  onTextSizeChange?: (textSize: number) => void;
  onRemove?: () => void;
};

export function DraggableTextBox({
  frameRef,
  position,
  maxWidthPercent,
  alignment,
  editable,
  text,
  fontSizePx,
  fontFamily,
  fontWeight,
  color,
  textSize,
  lineClamp = false,
  onPositionChange,
  onTextSizeChange,
  onRemove
}: DraggableTextBoxProps) {
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: TextPosition;
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
        clampTextPosition({
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

  return (
    <div
      className={`absolute z-[13] touch-none outline-none focus:outline-none focus-visible:outline-none ${
        editable ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        maxWidth: `${maxWidthPercent}%`,
        textAlign: alignment,
        transform: textPositionTransform(alignment)
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role={editable ? "group" : undefined}
      aria-label={editable ? "Drag to reposition text box" : undefined}
    >
      {editable ? (
        <>
          <span
            data-editor-only
            className="pointer-events-none absolute -left-1 -top-5 inline-flex items-center gap-0.5 rounded bg-zinc-950/90 px-1 py-0.5 text-[8px] font-medium text-purple-200/90"
          >
            <Move className="h-2.5 w-2.5" aria-hidden />
            Drag
          </span>
          {onRemove ? (
            <button
              type="button"
              data-editor-only
              aria-label="Remove text box"
              className="absolute -right-1 -top-5 z-10 inline-flex h-4 w-4 items-center justify-center rounded bg-zinc-950/90 text-red-300/90 transition hover:bg-red-950/90 hover:text-red-200"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-2.5 w-2.5" aria-hidden />
            </button>
          ) : null}
          {onTextSizeChange ? (
            <TextResizeHandle
              frameRef={frameRef}
              textSize={textSize}
              editable={editable}
              onTextSizeChange={onTextSizeChange}
            />
          ) : null}
        </>
      ) : null}
      <p
        className={`leading-snug ${lineClamp ? "line-clamp-3" : ""}`}
        style={{
          fontFamily,
          fontSize: fontSizePx,
          fontWeight: fontWeightToNumber(fontWeight),
          color
        }}
      >
        {text}
      </p>
    </div>
  );
}
