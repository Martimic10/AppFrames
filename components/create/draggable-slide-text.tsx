"use client";

import { useCallback, useEffect, useRef } from "react";
import { Move } from "lucide-react";
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

type DraggableSlideTextProps = {
  frameRef: React.RefObject<HTMLElement | null>;
  position: TextPosition;
  maxWidthPercent: number;
  alignment: TextAlignment;
  rotateDeg?: number;
  editable: boolean;
  headline: string;
  subheadline: string;
  headlinePx: number;
  subheadlinePx: number;
  fontFamily: string;
  fontWeight: TextFontWeight;
  headlineColor: string;
  subheadlineColor: string;
  headlineTracking?: string;
  lineClamp?: boolean;
  textSize: number;
  onPositionChange: (position: TextPosition) => void;
  onTextSizeChange?: (textSize: number) => void;
  onHeadlineChange?: (value: string) => void;
  onSubheadlineChange?: (value: string) => void;
};

export function DraggableSlideText({
  frameRef,
  position,
  maxWidthPercent,
  alignment,
  rotateDeg,
  editable,
  headline,
  subheadline,
  headlinePx,
  subheadlinePx,
  fontFamily,
  fontWeight,
  headlineColor,
  subheadlineColor,
  headlineTracking,
  lineClamp = false,
  textSize,
  onPositionChange,
  onTextSizeChange,
  onHeadlineChange,
  onSubheadlineChange
}: DraggableSlideTextProps) {
  const inlineEdit = editable && Boolean(onHeadlineChange && onSubheadlineChange);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!inlineEdit || !headlineRef.current) return;
    if (document.activeElement === headlineRef.current) return;
    if (headlineRef.current.textContent !== headline) {
      headlineRef.current.textContent = headline;
    }
  }, [headline, inlineEdit]);

  useEffect(() => {
    if (!inlineEdit || !subheadlineRef.current) return;
    if (document.activeElement === subheadlineRef.current) return;
    if (subheadlineRef.current.textContent !== subheadline) {
      subheadlineRef.current.textContent = subheadline;
    }
  }, [subheadline, inlineEdit]);

  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: TextPosition;
  } | null>(null);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!editable || inlineEdit) return;
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
    [editable, inlineEdit, position]
  );

  const handleDragHandlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!editable || !inlineEdit) return;
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
    [editable, inlineEdit, position]
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
      className={`absolute z-[12] outline-none focus:outline-none focus-visible:outline-none ${
        editable
          ? inlineEdit
            ? "pointer-events-auto touch-none"
            : "touch-none cursor-grab active:cursor-grabbing"
          : "pointer-events-none"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        maxWidth: `${maxWidthPercent}%`,
        textAlign: alignment,
        transform: textPositionTransform(alignment, rotateDeg)
      }}
      onPointerDown={inlineEdit ? undefined : handlePointerDown}
      onPointerMove={inlineEdit ? undefined : handlePointerMove}
      onPointerUp={inlineEdit ? undefined : endDrag}
      onPointerCancel={inlineEdit ? undefined : endDrag}
      role={editable ? "group" : undefined}
      aria-label={editable ? "Drag to reposition headline and subtitle" : undefined}
    >
      {editable ? (
        <div
          data-editor-only
          className={`absolute -left-1 inline-flex items-center gap-0.5 rounded bg-zinc-950/90 px-1 py-0.5 text-[8px] font-medium text-purple-200/90 ${
            inlineEdit
              ? "-top-6 cursor-grab active:cursor-grabbing"
              : "pointer-events-none -top-5"
          }`}
          onPointerDown={inlineEdit ? handleDragHandlePointerDown : undefined}
          onPointerMove={inlineEdit ? handlePointerMove : undefined}
          onPointerUp={inlineEdit ? endDrag : undefined}
          onPointerCancel={inlineEdit ? endDrag : undefined}
        >
          <Move className="h-2.5 w-2.5" aria-hidden />
          Drag
        </div>
      ) : null}
      {onTextSizeChange ? (
        <TextResizeHandle
          frameRef={frameRef}
          textSize={textSize}
          editable={editable}
          onTextSizeChange={onTextSizeChange}
        />
      ) : null}
      <h2
        ref={headlineRef}
        contentEditable={inlineEdit}
        suppressContentEditableWarning={inlineEdit}
        className={`leading-[0.95] outline-none ${lineClamp && !inlineEdit ? "line-clamp-3" : ""} ${
          inlineEdit ? "cursor-text rounded px-0.5 ring-0 focus:ring-1 focus:ring-purple-400/50" : ""
        }`}
        style={{
          fontFamily,
          fontSize: headlinePx,
          fontWeight: fontWeightToNumber(fontWeight),
          color: headlineColor,
          letterSpacing: headlineTracking
        }}
        onClick={(e) => inlineEdit && e.stopPropagation()}
        onInput={(e) => onHeadlineChange?.(e.currentTarget.textContent ?? "")}
      >
        {headline}
      </h2>
      <p
        ref={subheadlineRef}
        contentEditable={inlineEdit}
        suppressContentEditableWarning={inlineEdit}
        className={`mt-0.5 leading-snug outline-none ${lineClamp && !inlineEdit ? "line-clamp-2" : ""} ${
          inlineEdit ? "cursor-text rounded px-0.5 ring-0 focus:ring-1 focus:ring-purple-400/50" : ""
        }`}
        style={{
          fontFamily,
          fontSize: subheadlinePx,
          color: subheadlineColor,
          fontWeight: 500
        }}
        onClick={(e) => inlineEdit && e.stopPropagation()}
        onInput={(e) => onSubheadlineChange?.(e.currentTarget.textContent ?? "")}
      >
        {subheadline}
      </p>
    </div>
  );
}
