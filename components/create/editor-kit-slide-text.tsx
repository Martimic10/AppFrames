"use client";

import { useRef } from "react";
import { cardHeadlineSizePx, cardSubheadlineSizePx } from "@/components/create/card-layout";
import { DraggableSlideText } from "@/components/create/draggable-slide-text";
import { editorKitSlideTextColors } from "@/components/create/editor-kit-slide-appearance";
import type { EditorKitSlideAppearance } from "@/components/create/editor-kit-slide-appearance";
import { getMoodStyles, type StylePreset } from "@/components/create/template-settings";
import { DEFAULT_TEXT_FONT_ID, getFontFamily } from "@/components/create/text-fonts";
import { resolveKitPortraitTextPosition, type TextPosition } from "@/components/create/text-position";
import {
  DEFAULT_SLIDE_TEXT_STYLE,
  resolveHeadlineColor,
  resolveSubheadlineColor
} from "@/components/create/text-style";
import type { ScreenshotSlide } from "@/components/create/types";

type EditorKitSlideTextProps = {
  appearance: Pick<
    EditorKitSlideAppearance,
    "useGradient" | "gradientStyle" | "background"
  >;
  slide: ScreenshotSlide;
  stylePreset: StylePreset;
  selected: boolean;
  onHeadlineChange: (value: string) => void;
  onSubheadlineChange: (value: string) => void;
  onTextPositionChange: (position: TextPosition) => void;
  onTextSizeChange?: (textSize: number) => void;
};

export function EditorKitSlideText({
  appearance,
  slide,
  stylePreset,
  selected,
  onHeadlineChange,
  onSubheadlineChange,
  onTextPositionChange,
  onTextSizeChange
}: EditorKitSlideTextProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const autoColors = editorKitSlideTextColors(appearance);
  const mood = getMoodStyles(stylePreset);

  const alignment = slide.alignment ?? "center";
  const fontWeight = slide.fontWeight ?? DEFAULT_SLIDE_TEXT_STYLE.fontWeight;
  const textSize = slide.textSize ?? DEFAULT_SLIDE_TEXT_STYLE.textSize;
  const headlineColor = resolveHeadlineColor(slide.headlineColor, autoColors.headline);
  const subheadlineColor = resolveSubheadlineColor(slide.subheadlineColor, autoColors.subheadline);
  const fontFamily = getFontFamily(slide.fontId ?? DEFAULT_TEXT_FONT_ID);

  const position = resolveKitPortraitTextPosition(slide.textPosition, alignment);
  const headlinePx = cardHeadlineSizePx(textSize, 1.08);
  const subheadlinePx = cardSubheadlineSizePx(textSize, 1.05);

  return (
    <div ref={frameRef} className="pointer-events-none absolute inset-0 z-[15]">
      <DraggableSlideText
        frameRef={frameRef}
        position={position}
        maxWidthPercent={92}
        alignment={alignment}
        editable={selected}
        headline={slide.headline}
        subheadline={slide.subheadline}
        headlinePx={headlinePx}
        subheadlinePx={subheadlinePx}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        headlineColor={headlineColor}
        subheadlineColor={subheadlineColor}
        headlineTracking={mood.headlineTracking}
        lineClamp={!selected}
        textSize={textSize}
        onPositionChange={onTextPositionChange}
        onTextSizeChange={selected ? onTextSizeChange : undefined}
        onHeadlineChange={selected ? onHeadlineChange : undefined}
        onSubheadlineChange={selected ? onSubheadlineChange : undefined}
      />
    </div>
  );
}
