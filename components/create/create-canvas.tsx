"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CompositionLayoutId } from "@/components/create/composition-engine";
import type { EditorKitSlideAppearance } from "@/components/create/editor-kit-slide-appearance";
import { EditorKitSlideFrame } from "@/components/create/editor-kit-slide-frame";
import { DEFAULT_TEXT_FONT_ID } from "@/components/create/text-fonts";
import type { FrameStyleSettings } from "@/components/create/frame-style-settings";
import { slideGapPx, type TemplateSettings } from "@/components/create/template-settings";
import type { TextPosition } from "@/components/create/text-position";
import type { MockupPosition } from "@/components/create/mockup-position";
import type { GraphicPosition } from "@/components/create/graphic-position";
import { DEFAULT_SLIDE_TEXT_STYLE } from "@/components/create/text-style";
import { gradientToCss } from "@/components/create/style-colors";
import { SCREENSHOT_COUNT } from "@/components/create/template-slides";
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
  onSlideHeadlineChange: (index: number, value: string) => void;
  onSlideSubheadlineChange: (index: number, value: string) => void;
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
  categoryId,
  selectedTemplateId,
  templateSettings,
  appearance,
  onSlideSelect,
  onSlideTextPositionChange,
  onSlideTextSizeChange,
  onSlideHeadlineChange,
  onSlideSubheadlineChange,
  onSlideMockupPositionChange,
  onSlideGraphicPositionChange,
  onSlideGraphicRemove,
  onTextBoxPositionChange,
  onTextBoxTextSizeChange,
  onTextBoxRemove
}: {
  displaySlides: ScreenshotSlide[];
  selectedSlideIndex: number;
  categoryId: CategoryId;
  selectedTemplateId: string;
  templateSettings: TemplateSettings;
  appearance: EditorKitSlideAppearance;
  onSlideSelect: (index: number) => void;
  onSlideHeadlineChange: (index: number, value: string) => void;
  onSlideSubheadlineChange: (index: number, value: string) => void;
  onSlideMockupPositionChange: (index: number, position: MockupPosition) => void;
  onSlideTextPositionChange: (index: number, position: TextPosition) => void;
  onSlideTextSizeChange: (textSize: number) => void;
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
            <EditorKitSlideFrame
              categoryId={categoryId}
              templateId={selectedTemplateId}
              slideIndex={item}
              slide={slide}
              appearance={appearance}
              templateSettings={templateSettings}
              selected={selectedSlideIndex === item}
              onSelect={() => onSlideSelect(item)}
              onHeadlineChange={(value) => onSlideHeadlineChange(item, value)}
              onSubheadlineChange={(value) => onSlideSubheadlineChange(item, value)}
              onTextPositionChange={(position) => onSlideTextPositionChange(item, position)}
              onTextSizeChange={
                selectedSlideIndex === item ? onSlideTextSizeChange : undefined
              }
              onMockupPositionChange={(position) => onSlideMockupPositionChange(item, position)}
              onGraphicPositionChange={(position) =>
                onSlideGraphicPositionChange(item, position)
              }
              onGraphicRemove={() => onSlideGraphicRemove(item)}
              onTextBoxPositionChange={(boxId, position) =>
                onTextBoxPositionChange(item, boxId, position)
              }
              onTextBoxTextSizeChange={
                selectedSlideIndex === item
                  ? (boxId, textSize) => onTextBoxTextSizeChange(item, boxId, textSize)
                  : undefined
              }
              onTextBoxRemove={(boxId) => onTextBoxRemove(item, boxId)}
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
  onSlideHeadlineChange,
  onSlideSubheadlineChange,
  onSlideMockupPositionChange,
  onSlideTextPositionChange,
  onSlideTextSizeChange,
  onSlideGraphicPositionChange,
  onSlideGraphicRemove,
  onTextBoxPositionChange,
  onTextBoxTextSizeChange,
  onTextBoxRemove
}: CreateCanvasProps) {
  const gradientCss = gradientToCss(gradientStyle);
  const styleAccentColor = useGradient ? gradientStyle.from : background;
  const gapPx = slideGapPx(templateSettings.layoutSpacing);
  const slideAppearance: EditorKitSlideAppearance = {
    useGradient,
    gradientStyle,
    background,
    backgroundTextureId,
    styleAccentColor,
    stylePreset: templateSettings.stylePreset,
    frameStyleSettings
  };
  const templateName =
    category?.templates.find((t) => t.id === selectedTemplateId)?.name ?? "Template";

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
                Drag to pan · Scroll to zoom · Click text to edit · Drag mockup or text to move
              </div>

              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div
                  ref={rowRef}
                  className={`flex w-max max-w-none shrink-0 items-end justify-start px-8 py-12 ${
                    isDragging ? "will-change-transform" : ""
                  }`}
                  style={{
                    gap: gapPx,
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center"
                  }}
                >
                  <SlideRow
                    displaySlides={displaySlides}
                    selectedSlideIndex={selectedSlideIndex}
                    categoryId={categoryId}
                    selectedTemplateId={selectedTemplateId}
                    templateSettings={templateSettings}
                    appearance={slideAppearance}
                    onSlideSelect={onSlideSelect}
                    onSlideTextPositionChange={onSlideTextPositionChange}
                    onSlideTextSizeChange={onSlideTextSizeChange}
                    onSlideHeadlineChange={onSlideHeadlineChange}
                    onSlideSubheadlineChange={onSlideSubheadlineChange}
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
            {category.title} · {templateName} · Slide {selectedSlideIndex + 1} selected
          </p>
        ) : null}
      </div>
    </div>
  );
}
