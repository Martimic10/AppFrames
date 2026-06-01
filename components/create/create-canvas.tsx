"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CompositionFrame } from "@/components/create/composition-frame";
import {
  COMPOSITION_LAYOUT_LABELS,
  type CompositionLayoutId
} from "@/components/create/composition-engine";
import { DEFAULT_TEXT_FONT_ID } from "@/components/create/text-fonts";
import type { FrameStyleSettings } from "@/components/create/frame-style-settings";
import {
  DEFAULT_TEMPLATE_SETTINGS,
  slideGapPx,
  type TemplateSettings
} from "@/components/create/template-settings";
import type { TextPosition } from "@/components/create/text-position";
import type { MockupPosition } from "@/components/create/mockup-position";
import type { GraphicPosition } from "@/components/create/graphic-position";
import { DEFAULT_SLIDE_TEXT_STYLE } from "@/components/create/text-style";
import { SCREENSHOT_COUNT } from "@/components/create/template-slides";
import { gradientToCss } from "@/components/create/style-colors";
import type { BackgroundTextureId } from "@/components/create/background-textures";
import type {
  CategoryConfig,
  CategoryId,
  GradientStyle,
  ScreenshotSlide
} from "@/components/create/types";
import { Move } from "lucide-react";

type CreateCanvasProps = {
  category: CategoryConfig | null;
  slides: ScreenshotSlide[];
  selectedSlideIndex: number;
  compositionLayoutId: CompositionLayoutId;
  compositionSeed: string;
  templateSettings: TemplateSettings;
  frameStyleSettings: FrameStyleSettings;
  categoryId: CategoryId;
  selectedTemplateId: string;
  background: string;
  useGradient: boolean;
  gradientStyle: GradientStyle;
  backgroundTextureId: BackgroundTextureId;
  focused: boolean;
  dimmed: boolean;
  onSlideSelect: (index: number) => void;
  onSlideTextPositionChange: (index: number, position: TextPosition) => void;
  onSlideTextSizeChange: (textSize: number) => void;
  onSlideMockupPositionChange: (index: number, position: MockupPosition) => void;
  onSlideGraphicPositionChange: (index: number, position: GraphicPosition) => void;
  onSlideGraphicRemove: (index: number) => void;
  onTextBoxPositionChange: (index: number, boxId: string, position: TextPosition) => void;
  onTextBoxTextSizeChange: (index: number, boxId: string, textSize: number) => void;
  onTextBoxRemove: (index: number, boxId: string) => void;
};

const SlideRow = memo(function SlideRow({
  displaySlides,
  selectedSlideIndex,
  compositionLayoutId,
  compositionSeed,
  templateSettings,
  frameStyleSettings,
  categoryId,
  selectedTemplateId,
  useGradient,
  gradientCss,
  styleAccentColor,
  background,
  backgroundTextureId,
  glowColor,
  onSlideSelect,
  onSlideTextPositionChange,
  onSlideTextSizeChange,
  onSlideMockupPositionChange,
  onSlideGraphicPositionChange,
  onSlideGraphicRemove,
  onTextBoxPositionChange,
  onTextBoxTextSizeChange,
  onTextBoxRemove
}: {
  displaySlides: ScreenshotSlide[];
  selectedSlideIndex: number;
  compositionLayoutId: CompositionLayoutId;
  compositionSeed: string;
  templateSettings: TemplateSettings;
  frameStyleSettings: FrameStyleSettings;
  categoryId: CategoryId;
  selectedTemplateId: string;
  useGradient: boolean;
  gradientCss: string;
  styleAccentColor: string;
  background: string;
  backgroundTextureId: BackgroundTextureId;
  glowColor: string;
  onSlideSelect: (index: number) => void;
  onSlideTextPositionChange: (index: number, position: TextPosition) => void;
  onSlideTextSizeChange: (textSize: number) => void;
  onSlideMockupPositionChange: (index: number, position: MockupPosition) => void;
  onSlideGraphicPositionChange: (index: number, position: GraphicPosition) => void;
  onSlideGraphicRemove: (index: number) => void;
  onTextBoxPositionChange: (index: number, boxId: string, position: TextPosition) => void;
  onTextBoxTextSizeChange: (index: number, boxId: string, textSize: number) => void;
  onTextBoxRemove: (index: number, boxId: string) => void;
}) {
  const center = Math.floor(displaySlides.length / 2);

  return (
    <>
      {displaySlides.map((slide, item) => {
        const lift = item === center ? 0 : 4;
        return (
          <div
            key={item}
            className="shrink-0"
            style={{ transform: `translateY(${lift}px)` }}
          >
            <CompositionFrame
              slides={displaySlides}
              focusIndex={item}
              headline={slide.headline}
              subheadline={slide.subheadline}
              fontId={slide.fontId}
              layoutId={compositionLayoutId}
              compositionSeed={compositionSeed}
              useGradient={useGradient}
              gradientCss={gradientCss}
              styleAccentColor={styleAccentColor}
              background={background}
              backgroundTextureId={backgroundTextureId}
              glowColor={glowColor}
              stylePreset={templateSettings.stylePreset}
              layoutSpacing={templateSettings.layoutSpacing}
              mockupSize={templateSettings.mockupSize ?? DEFAULT_TEMPLATE_SETTINGS.mockupSize}
              fontWeight={slide.fontWeight ?? DEFAULT_SLIDE_TEXT_STYLE.fontWeight}
              alignment={slide.alignment ?? DEFAULT_SLIDE_TEXT_STYLE.alignment}
              textSize={slide.textSize ?? DEFAULT_SLIDE_TEXT_STYLE.textSize}
              headlineColor={slide.headlineColor ?? DEFAULT_SLIDE_TEXT_STYLE.headlineColor}
              subheadlineColor={
                slide.subheadlineColor ?? DEFAULT_SLIDE_TEXT_STYLE.subheadlineColor
              }
              graphicDataUrl={slide.graphicDataUrl}
              frameStyle={frameStyleSettings}
              showDevices={templateSettings.showDeviceFrame}
              showUploadedMockupAsIs={templateSettings.showUploadedMockupAsIs}
              categoryId={categoryId}
              templateId={selectedTemplateId}
              textPosition={slide.textPosition ?? null}
              mockupPosition={slide.mockupPosition ?? null}
              graphicPosition={slide.graphicPosition ?? null}
              textBoxes={slide.textBoxes ?? []}
              selected={selectedSlideIndex === item}
              interactive
              slideIndex={item}
              size="card"
              onSelect={() => onSlideSelect(item)}
              onTextPositionChange={
                selectedSlideIndex === item
                  ? (position) => onSlideTextPositionChange(item, position)
                  : undefined
              }
              onTextSizeChange={
                selectedSlideIndex === item ? onSlideTextSizeChange : undefined
              }
              onMockupPositionChange={
                selectedSlideIndex === item
                  ? (position) => onSlideMockupPositionChange(item, position)
                  : undefined
              }
              onGraphicPositionChange={
                selectedSlideIndex === item
                  ? (position) => onSlideGraphicPositionChange(item, position)
                  : undefined
              }
              onGraphicRemove={
                selectedSlideIndex === item ? () => onSlideGraphicRemove(item) : undefined
              }
              onTextBoxPositionChange={
                selectedSlideIndex === item
                  ? (boxId, position) => onTextBoxPositionChange(item, boxId, position)
                  : undefined
              }
              onTextBoxTextSizeChange={
                selectedSlideIndex === item
                  ? (boxId, size) => onTextBoxTextSizeChange(item, boxId, size)
                  : undefined
              }
              onTextBoxRemove={
                selectedSlideIndex === item
                  ? (boxId) => onTextBoxRemove(item, boxId)
                  : undefined
              }
            />
          </div>
        );
      })}
    </>
  );
});

export function CreateCanvas({
  category,
  slides,
  selectedSlideIndex,
  compositionLayoutId,
  compositionSeed,
  templateSettings,
  frameStyleSettings,
  categoryId,
  selectedTemplateId,
  background,
  useGradient,
  gradientStyle,
  backgroundTextureId,
  focused,
  dimmed,
  onSlideSelect,
  onSlideTextPositionChange,
  onSlideTextSizeChange,
  onSlideMockupPositionChange,
  onSlideGraphicPositionChange,
  onSlideGraphicRemove,
  onTextBoxPositionChange,
  onTextBoxTextSizeChange,
  onTextBoxRemove
}: CreateCanvasProps) {
  const gradientCss = gradientToCss(gradientStyle);
  const styleAccentColor = useGradient ? gradientStyle.from : background;
  const glowColor = category?.glowColor ?? "rgba(168, 85, 247, 0.25)";
  const gapPx = slideGapPx(templateSettings.layoutSpacing);

  const displaySlides = useMemo(
    () =>
      slides.length > 0
        ? slides
        : Array.from({ length: SCREENSHOT_COUNT }, () => ({
            headline: "Your headline here",
            subheadline: "Your subtitle appears here",
            imageDataUrl: null,
            graphicDataUrl: null,
            textBoxes: [],
            fontId: DEFAULT_TEXT_FONT_ID,
            ...DEFAULT_SLIDE_TEXT_STYLE
          })),
    [slides]
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const [fitZoom, setFitZoom] = useState(1);
  const [userZoom, setUserZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const canvasPaddingX = 64;
  const zoom = fitZoom * userZoom;

  const clampUserZoom = (value: number) => Math.min(2, Math.max(0.5, value));

  const recomputeFitZoom = useCallback(() => {
    const viewport = viewportRef.current;
    const row = rowRef.current;
    if (!viewport || !row) return;

    const availableWidth = viewport.clientWidth - canvasPaddingX;
    const contentWidth = row.scrollWidth;
    if (availableWidth <= 0 || contentWidth <= 0) return;

    const nextFit = Math.min(1, availableWidth / contentWidth);
    setFitZoom(nextFit);
  }, []);

  useLayoutEffect(() => {
    const measure = () => recomputeFitZoom();
    measure();
    const frame = requestAnimationFrame(measure);

    const viewport = viewportRef.current;
    const row = rowRef.current;
    if (!viewport || !row) {
      return () => cancelAnimationFrame(frame);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(row);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [displaySlides.length, gapPx, recomputeFitZoom]);

  useEffect(() => {
    setPan({ x: 0, y: 0 });
    setUserZoom(1);
  }, [displaySlides.length, gapPx]);

  const handleZoom = useCallback((delta: number) => {
    setUserZoom((prev) => clampUserZoom(prev + delta));
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const target = event.target as HTMLElement;
      if (target.closest("[data-composition-card]")) return;
      if (target.closest("button")) return;

      event.preventDefault();
      isPanning.current = true;
      setIsDragging(true);
      panStart.current = {
        x: event.clientX,
        y: event.clientY,
        panX: pan.x,
        panY: pan.y
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [pan.x, pan.y]
  );

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    event.preventDefault();
    setPan({
      x: panStart.current.panX + (event.clientX - panStart.current.x),
      y: panStart.current.panY + (event.clientY - panStart.current.y)
    });
  }, []);

  const onPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    isPanning.current = false;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const showEditor = category && focused;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className="relative flex min-h-0 flex-1 flex-col p-4 transition-opacity duration-300"
        style={{ opacity: dimmed ? 0.35 : 1 }}
      >
        <div
          ref={viewportRef}
          data-canvas-surface
          onWheel={
            showEditor
              ? (event) => {
                  event.preventDefault();
                  handleZoom(event.deltaY > 0 ? -0.08 : 0.08);
                }
              : undefined
          }
          onPointerDown={showEditor ? onPointerDown : undefined}
          onPointerMove={showEditor ? onPointerMove : undefined}
          onPointerUp={showEditor ? onPointerUp : undefined}
          onPointerLeave={showEditor ? onPointerUp : undefined}
          onPointerCancel={showEditor ? onPointerUp : undefined}
          onDragStart={(event) => event.preventDefault()}
          className={`relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c] ${
            showEditor ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
          }`}
        >
          {showEditor ? (
            <>
              <div className="pointer-events-none absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/90 px-3 py-1.5 text-[11px] text-zinc-400">
                <Move className="h-3.5 w-3.5" />
                Drag to pan · Scroll to zoom · Click slide to edit
              </div>

              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div
                  ref={rowRef}
                  className="flex w-max max-w-none shrink-0 items-end justify-start px-8 py-12 will-change-transform"
                  style={{
                    gap: gapPx,
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center"
                  }}
                >
                  <SlideRow
                    displaySlides={displaySlides}
                    selectedSlideIndex={selectedSlideIndex}
                    compositionLayoutId={compositionLayoutId}
                    compositionSeed={compositionSeed}
                    templateSettings={templateSettings}
                    frameStyleSettings={frameStyleSettings}
                    categoryId={categoryId}
                    selectedTemplateId={selectedTemplateId}
                    useGradient={useGradient}
                    gradientCss={gradientCss}
                    styleAccentColor={styleAccentColor}
                    background={background}
                    backgroundTextureId={backgroundTextureId}
                    glowColor={glowColor}
                    onSlideSelect={onSlideSelect}
                    onSlideTextPositionChange={onSlideTextPositionChange}
                    onSlideTextSizeChange={onSlideTextSizeChange}
                    onSlideMockupPositionChange={onSlideMockupPositionChange}
                    onSlideGraphicPositionChange={onSlideGraphicPositionChange}
                    onSlideGraphicRemove={onSlideGraphicRemove}
                    onTextBoxPositionChange={onTextBoxPositionChange}
                    onTextBoxTextSizeChange={onTextBoxTextSizeChange}
                    onTextBoxRemove={onTextBoxRemove}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-zinc-600">Select a category to start</p>
            </div>
          )}
        </div>

        {category ? (
          <p className="mt-3 shrink-0 text-center text-xs text-zinc-500">
            {category.title} · {COMPOSITION_LAYOUT_LABELS[compositionLayoutId].name} · Slide{" "}
            {selectedSlideIndex + 1} selected
          </p>
        ) : null}
      </div>
    </div>
  );
}
