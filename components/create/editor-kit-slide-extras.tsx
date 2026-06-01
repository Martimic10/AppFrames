"use client";

import { useRef } from "react";
import { cardHeadlineSizePx } from "@/components/create/card-layout";
import { DraggableTextBox } from "@/components/create/draggable-text-box";
import { getFontFamily } from "@/components/create/text-fonts";
import {
  editorKitSlideTextColors,
  type EditorKitSlideAppearance
} from "@/components/create/editor-kit-slide-appearance";
import type { TextPosition } from "@/components/create/text-position";
import type { SlideTextBox, ScreenshotSlide } from "@/components/create/types";

type EditorKitSlideExtrasProps = {
  appearance: Pick<
    EditorKitSlideAppearance,
    "useGradient" | "gradientStyle" | "background"
  >;
  slide: ScreenshotSlide;
  selected: boolean;
  onTextBoxPositionChange: (boxId: string, position: TextPosition) => void;
  onTextBoxTextSizeChange?: (boxId: string, textSize: number) => void;
  onTextBoxRemove?: (boxId: string) => void;
};

export function EditorKitSlideExtras({
  appearance,
  slide,
  selected,
  onTextBoxPositionChange,
  onTextBoxTextSizeChange,
  onTextBoxRemove
}: EditorKitSlideExtrasProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const textBoxes = slide.textBoxes ?? [];
  const autoColors = editorKitSlideTextColors(appearance);
  const fontFamily = getFontFamily(slide.fontId ?? "inter");
  const editable = selected;

  if (textBoxes.length === 0) {
    return null;
  }

  return (
    <div ref={frameRef} className="pointer-events-none absolute inset-0 z-[16]">
      {textBoxes.map((box) => (
        <ExtraTextBox
          key={box.id}
          box={box}
          frameRef={frameRef}
          fontFamily={fontFamily}
          moodHeadlineColor={autoColors.headline}
          editable={editable}
          onPositionChange={(position) => onTextBoxPositionChange(box.id, position)}
          onTextSizeChange={
            editable && onTextBoxTextSizeChange
              ? (textSize) => onTextBoxTextSizeChange(box.id, textSize)
              : undefined
          }
          onRemove={editable && onTextBoxRemove ? () => onTextBoxRemove(box.id) : undefined}
        />
      ))}
    </div>
  );
}

function ExtraTextBox({
  box,
  frameRef,
  fontFamily,
  moodHeadlineColor,
  editable,
  onPositionChange,
  onTextSizeChange,
  onRemove
}: {
  box: SlideTextBox;
  frameRef: React.RefObject<HTMLDivElement | null>;
  fontFamily: string;
  moodHeadlineColor: string;
  editable: boolean;
  onPositionChange: (position: TextPosition) => void;
  onTextSizeChange?: (textSize: number) => void;
  onRemove?: () => void;
}) {
  return (
    <DraggableTextBox
      frameRef={frameRef}
      position={box.position}
      maxWidthPercent={78}
      alignment={box.alignment}
      editable={editable}
      text={box.text}
      fontSizePx={cardHeadlineSizePx(box.textSize, 1)}
      fontFamily={fontFamily}
      fontWeight={box.fontWeight}
      color={box.color ?? moodHeadlineColor}
      textSize={box.textSize}
      lineClamp
      onPositionChange={onPositionChange}
      onTextSizeChange={onTextSizeChange}
      onRemove={onRemove}
    />
  );
}
