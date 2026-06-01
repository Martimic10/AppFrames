"use client";

import { useRef } from "react";
import { getCategoryById } from "@/components/create/category-data";
import {
  editorKitSlideBackgroundLayers,
  editorKitSlideFrameShellStyle,
  type EditorKitSlideAppearance
} from "@/components/create/editor-kit-slide-appearance";
import { EditorKitSlideExtras } from "@/components/create/editor-kit-slide-extras";
import { EditorKitSlideGraphic } from "@/components/create/editor-kit-slide-graphic";
import { EditorKitSlideText } from "@/components/create/editor-kit-slide-text";
import { TemplateKitPortraitSlide } from "@/components/create/template-kit-portrait-slide";
import { EditorKitSlideMockup } from "@/components/create/editor-kit-slide-mockup";
import type { MockupPosition } from "@/components/create/mockup-position";
import type { GraphicPosition } from "@/components/create/graphic-position";
import type { TextPosition } from "@/components/create/text-position";
import { getTemplateThemeColors } from "@/components/create/template-theme-colors";
import type { TemplateSettings } from "@/components/create/template-settings";
import { EDITOR_SLIDE_ASPECT, EDITOR_SLIDE_WIDTH_PX } from "@/components/create/editor-kit-slide-metrics";
import type { CategoryId, ScreenshotSlide } from "@/components/create/types";
import "@/components/landing/app-store-template-kit.css";

type EditorKitSlideFrameProps = {
  categoryId: CategoryId;
  templateId: string;
  slideIndex: number;
  slide: ScreenshotSlide;
  appearance: EditorKitSlideAppearance;
  templateSettings: Pick<
    TemplateSettings,
    "showDeviceFrame" | "showUploadedMockupAsIs" | "mockupSize" | "stylePreset"
  >;
  selected: boolean;
  onSelect: () => void;
  onHeadlineChange: (value: string) => void;
  onSubheadlineChange: (value: string) => void;
  onTextPositionChange: (position: TextPosition) => void;
  onTextSizeChange?: (textSize: number) => void;
  onMockupPositionChange: (position: MockupPosition) => void;
  onGraphicPositionChange: (position: GraphicPosition) => void;
  onGraphicRemove: () => void;
  onTextBoxPositionChange: (boxId: string, position: TextPosition) => void;
  onTextBoxTextSizeChange?: (boxId: string, textSize: number) => void;
  onTextBoxRemove?: (boxId: string) => void;
};

export function EditorKitSlideFrame({
  categoryId,
  templateId,
  slideIndex,
  slide,
  appearance,
  templateSettings,
  selected,
  onSelect,
  onHeadlineChange,
  onSubheadlineChange,
  onTextPositionChange,
  onTextSizeChange,
  onMockupPositionChange,
  onGraphicPositionChange,
  onGraphicRemove,
  onTextBoxPositionChange,
  onTextBoxTextSizeChange,
  onTextBoxRemove
}: EditorKitSlideFrameProps) {
  const theme = getTemplateThemeColors(categoryId, templateId);
  const category = getCategoryById(categoryId);
  const templateIndex = Math.max(
    0,
    category.templates.findIndex((t) => t.id === templateId)
  );
  const compositionRef = useRef<HTMLDivElement>(null);
  const { base: backdropBaseStyle, texture: backdropTextureStyle } =
    editorKitSlideBackgroundLayers(appearance);
  const shellStyle = editorKitSlideFrameShellStyle(appearance, {
    selected,
    slideAccent: theme.accent
  });

  return (
    <button
      type="button"
      data-composition-card
      data-slide-index={slideIndex}
      data-selected={selected ? "true" : "false"}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`editor-kit-slide-frame block shrink-0 overflow-hidden border p-0 text-left outline-none transition-shadow ${
        selected ? "border-purple-400/50" : "border-white/[0.14] hover:border-white/25"
      }`}
      style={{
        width: EDITOR_SLIDE_WIDTH_PX,
        aspectRatio: EDITOR_SLIDE_ASPECT,
        ["--slide-accent" as string]: theme.accent,
        ...shellStyle
      }}
    >
      <div
        ref={compositionRef}
        className="composition-frame relative h-full w-full overflow-hidden rounded-[inherit]"
      >
        <div
          className="editor-kit-slide-static-layers pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          <div
            className="editor-kit-slide-backdrop absolute inset-0 rounded-[inherit]"
            style={backdropBaseStyle}
          />
          {backdropTextureStyle ? (
            <div
              className="editor-kit-slide-texture pointer-events-none absolute inset-0 rounded-[inherit]"
              style={backdropTextureStyle}
              aria-hidden
            />
          ) : null}
          <TemplateKitPortraitSlide
            className="absolute inset-0 h-full w-full"
            editorCanvas
            editorExternalBackground
            hidePortraitCopy
            hidePortraitPhone
            categoryId={categoryId}
            templateId={templateId}
            templateIndex={templateIndex}
            headline={slide.headline}
            subheadline={slide.subheadline}
            showDeviceFrame={templateSettings.showDeviceFrame}
            showUploadedMockupAsIs={templateSettings.showUploadedMockupAsIs}
          />
        </div>
        <EditorKitSlideMockup
          frameRef={compositionRef}
          categoryId={categoryId}
          templateId={templateId}
          templateIndex={templateIndex}
          slide={slide}
          showDeviceFrame={templateSettings.showDeviceFrame}
          showUploadedMockupAsIs={templateSettings.showUploadedMockupAsIs}
          mockupSize={templateSettings.mockupSize}
          selected={selected}
          onMockupPositionChange={onMockupPositionChange}
        />
        <EditorKitSlideGraphic
          imageDataUrl={slide.graphicDataUrl}
          graphicPosition={slide.graphicPosition}
          hasScreenshot={Boolean(slide.imageDataUrl)}
          selected={selected}
          onGraphicPositionChange={onGraphicPositionChange}
          onGraphicRemove={onGraphicRemove}
        />
        <EditorKitSlideText
          appearance={appearance}
          slide={slide}
          stylePreset={templateSettings.stylePreset}
          selected={selected}
          onHeadlineChange={onHeadlineChange}
          onSubheadlineChange={onSubheadlineChange}
          onTextPositionChange={onTextPositionChange}
          onTextSizeChange={onTextSizeChange}
        />
        <EditorKitSlideExtras
          appearance={appearance}
          slide={slide}
          selected={selected}
          onTextBoxPositionChange={onTextBoxPositionChange}
          onTextBoxTextSizeChange={onTextBoxTextSizeChange}
          onTextBoxRemove={onTextBoxRemove}
        />
      </div>
    </button>
  );
}
