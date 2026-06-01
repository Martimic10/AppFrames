"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Circle,
  ArrowRight,
  ImagePlus,
  ImageUp,
  LayoutTemplate,
  Move,
  Palette,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Type,
  X
} from "lucide-react";
import {
  collectImageFiles,
  getImageFilesFromDataTransfer,
  getImageFilesFromFileList,
  type AutoFillResult,
  type StagedScreenshot
} from "@/components/create/image-upload";
import {
  APP_STORE_SCREENSHOT_LIMIT,
  MIN_SLIDE_COUNT
} from "@/components/create/template-slides";
import type { CompositionLayoutId } from "@/components/create/composition-engine";
import {
  clampMockupPosition,
  resolveKitPortraitMockupPosition
} from "@/components/create/mockup-position";
import { getTemplatePickerKitVisual } from "@/components/create/template-kit-picker-variants";
import type { FrameStyleSettings } from "@/components/create/frame-style-settings";
import {
  getMoodStyles,
  type TemplateSettings
} from "@/components/create/template-settings";
import type { SlideTextStyle } from "@/components/create/text-style";
import {
  GRADIENT_PRESETS,
  STYLE_PALETTE,
  gradientToCss
} from "@/components/create/style-colors";
import {
  BACKGROUND_TEXTURES,
  backgroundTexturePreviewStyle,
  type BackgroundTextureId
} from "@/components/create/background-textures";
import { getFontFamily, TEXT_FONT_OPTIONS } from "@/components/create/text-fonts";
import { TEXT_COLOR_PRESETS } from "@/components/create/text-style";
import { TemplatePicker } from "@/components/create/template-picker";
import { MAX_SLIDE_TEXT_BOXES, type SlideTextBox } from "@/components/create/slide-text-box";
import { usePro } from "@/components/pro/pro-provider";
import type {
  CategoryConfig,
  GradientStyle,
  ScreenshotSlide,
  TextFontId
} from "@/components/create/types";

type CreateSidebarProps = {
  expanded: boolean;
  activePanel: "upload" | "templates" | "text" | "style";
  category: CategoryConfig | null;
  headline: string;
  subheadline: string;
  selectedSlideIndex: number;
  slideCount: number;
  slides: ScreenshotSlide[];
  stagedScreenshots: StagedScreenshot[];
  selectedTemplateId: string;
  background: string;
  useGradient: boolean;
  gradientStyle: GradientStyle;
  backgroundTextureId: BackgroundTextureId;
  onStageScreenshots: (files: File[]) => Promise<AutoFillResult>;
  onApplyStagedScreenshots: () => AutoFillResult;
  onRemoveStagedScreenshot: (id: string) => void;
  onClearStagedScreenshots: () => void;
  onReplaceScreenshot: (index: number, file: File) => void;
  onRemoveScreenshot: (index: number) => void;
  onRemoveSlide: (index: number) => void;
  onAddSlide: () => void;
  maxSlideCount: number;
  onClearScreenshots: () => void;
  fontId: TextFontId;
  onHeadlineChange: (value: string) => void;
  onSubheadlineChange: (value: string) => void;
  onFontChange: (fontId: TextFontId) => void;
  textStyle: SlideTextStyle;
  onTextStyleChange: (patch: Partial<SlideTextStyle>) => void;
  onSelectedSlideStyleChange: (patch: Partial<SlideTextStyle>) => void;
  onAddTextBox: (index: number) => void;
  onUpdateTextBox: (index: number, boxId: string, patch: Partial<SlideTextBox>) => void;
  onRemoveTextBox: (index: number, boxId: string) => void;
  frameStyleSettings: FrameStyleSettings;
  onFrameStyleSettingsChange: (settings: FrameStyleSettings) => void;
  onSlideSelect: (index: number) => void;
  onTemplateSelect: (id: string) => void;
  compositionLayoutId: CompositionLayoutId;
  onCompositionLayoutChange: (id: CompositionLayoutId) => void;
  onLockedFeatureClick?: () => void;
  templateSettings: TemplateSettings;
  onTemplateSettingsChange: (settings: TemplateSettings) => void;
  onBackgroundSelect: (color: string) => void;
  onGradientToggle: (value: boolean) => void;
  onGradientStyleChange: (gradient: GradientStyle) => void;
  onBackgroundTextureChange: (textureId: BackgroundTextureId) => void;
  onPanelChange: (panel: "upload" | "templates" | "text" | "style") => void;
};

function ColorSwatches({
  colors,
  active,
  onSelect
}: {
  colors: string[];
  active: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onSelect(color)}
          className={`aspect-square rounded-md border transition ${
            active.toLowerCase() === color.toLowerCase()
              ? "border-white ring-1 ring-white/40"
              : "border-white/10 hover:border-white/25"
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Color ${color}`}
        />
      ))}
    </div>
  );
}

const collapsedItems = [
  { icon: ImageUp, label: "Upload", panel: "upload" as const },
  { icon: LayoutTemplate, label: "Templates", panel: "templates" as const },
  { icon: Type, label: "Text", panel: "text" as const },
  { icon: Palette, label: "Style", panel: "style" as const }
];

export function CreateSidebar({
  expanded,
  activePanel,
  category,
  headline,
  subheadline,
  selectedSlideIndex,
  slideCount,
  slides,
  stagedScreenshots,
  selectedTemplateId,
  background,
  useGradient,
  gradientStyle,
  backgroundTextureId,
  onStageScreenshots,
  onApplyStagedScreenshots,
  onRemoveStagedScreenshot,
  onClearStagedScreenshots,
  onReplaceScreenshot,
  onRemoveScreenshot,
  onRemoveSlide,
  onAddSlide,
  maxSlideCount,
  onClearScreenshots,
  fontId,
  onHeadlineChange,
  onSubheadlineChange,
  onFontChange,
  textStyle,
  onTextStyleChange,
  onSelectedSlideStyleChange,
  onAddTextBox,
  onUpdateTextBox,
  onRemoveTextBox,
  frameStyleSettings,
  onFrameStyleSettingsChange,
  onSlideSelect,
  onTemplateSelect,
  compositionLayoutId: _compositionLayoutId,
  onCompositionLayoutChange: _onCompositionLayoutChange,
  templateSettings,
  onTemplateSettingsChange,
  onBackgroundSelect,
  onGradientToggle,
  onGradientStyleChange,
  onBackgroundTextureChange,
  onPanelChange,
  onLockedFeatureClick
}: CreateSidebarProps) {
  const { isPro, openUpgrade } = usePro();
  const stageInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{
    tone: "ok" | "error";
    text: string;
  } | null>(null);
  const uploadedCount = slides.filter((slide) => slide.imageDataUrl).length;

  const stageCount = stagedScreenshots.length;

  const runStagePhotos = async (rawFiles: Iterable<File>) => {
    const images = collectImageFiles(rawFiles);
    if (images.length === 0) {
      setUploadFeedback({
        tone: "error",
        text: "No supported images found. Use PNG, JPG, WebP, or HEIC."
      });
      return;
    }

    setUploadBusy(true);
    setUploadFeedback(null);
    try {
      const result = await onStageScreenshots(images);
      setUploadFeedback({
        tone: result.ok ? "ok" : "error",
        text: result.message ?? (result.ok ? "Photos added to queue." : "Could not add photos.")
      });
    } finally {
      setUploadBusy(false);
    }
  };

  const runApplyStaged = () => {
    setUploadFeedback(null);
    const result = onApplyStagedScreenshots();
    setUploadFeedback({
      tone: result.ok ? "ok" : "error",
      text: result.message ?? (result.ok ? "Applied to mockups." : "Could not apply photos.")
    });
  };
  const {
    layoutSpacing,
    stylePreset,
    showDeviceFrame,
    showUploadedMockupAsIs
  } = templateSettings;
  const { fontWeight, headlineColor, subheadlineColor } = textStyle;
  const selectedScreenshot = slides[selectedSlideIndex]?.imageDataUrl ?? null;
  const selectedTextBoxes = slides[selectedSlideIndex]?.textBoxes ?? [];
  const mockupRotatePresets = [-30, -15, 0, 15, 30, 90] as const;
  const categoryId = category?.id ?? "productivity";
  const selectedTemplateIndex = Math.max(
    0,
    category?.templates.findIndex((t) => t.id === selectedTemplateId) ?? 0
  );
  const kitPhoneRotate = getTemplatePickerKitVisual(
    categoryId,
    selectedTemplateId,
    selectedTemplateIndex
  ).phoneRotate;
  const resolvedMockupPosition = resolveKitPortraitMockupPosition(
    textStyle.mockupPosition,
    0.72,
    kitPhoneRotate
  );
  const currentMockupRotate = resolvedMockupPosition.rotate ?? 0;
  const showMockupControls = showDeviceFrame || Boolean(selectedScreenshot);

  const applyMockupRotate = (rotate: number) => {
    const base = textStyle.mockupPosition ?? {
      x: resolvedMockupPosition.x,
      y: resolvedMockupPosition.y,
      rotate: resolvedMockupPosition.rotate
    };
    onSelectedSlideStyleChange({
      mockupPosition: clampMockupPosition({ ...base, rotate })
    });
  };

  const { shadowDepth, cornerRadius } = frameStyleSettings;

  const patchTemplateSettings = (patch: Partial<TemplateSettings>) => {
    onTemplateSettingsChange({ ...templateSettings, ...patch });
  };

  const patchFrameStyle = (patch: Partial<FrameStyleSettings>) => {
    onFrameStyleSettingsChange({ ...frameStyleSettings, ...patch });
  };
  const activeFontFamily = getFontFamily(fontId);

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ width: expanded ? 320 : 72 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="relative z-20 flex h-full shrink-0 flex-col border-r border-white/10 bg-zinc-950/80 backdrop-blur-xl"
    >
      {!expanded ? (
        <div className="flex flex-1 flex-col items-center gap-3 py-6">
          {collapsedItems.map(({ icon: Icon, label, panel }) => (
            <button
              key={label}
              type="button"
              title={label}
              onClick={() => onPanelChange(panel)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                activePanel === panel
                  ? "border-purple-400/35 bg-purple-500/15 text-purple-200"
                  : "border-white/10 bg-zinc-900/60 text-zinc-400"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex h-full flex-col overflow-y-auto p-4"
        >
          <div className="mb-4 grid grid-cols-4 gap-1.5">
            {collapsedItems.map(({ icon: Icon, label, panel }) => (
              <button
                key={label}
                type="button"
                title={label}
                onClick={() => onPanelChange(panel)}
                className={`flex h-9 items-center justify-center rounded-lg border transition-colors ${
                  activePanel === panel
                    ? "border-purple-400/35 bg-purple-500/15 text-purple-200"
                    : "border-white/10 bg-zinc-900/70 text-zinc-400 hover:border-white/20"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {activePanel === "upload" ? (
            <section
              className="mb-6"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const images = getImageFilesFromDataTransfer(e.dataTransfer);
                if (images.length) void runStagePhotos(images);
              }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-zinc-300">Screenshots &amp; mockups</p>
                <span className="text-[10px] tabular-nums text-zinc-500">
                  {uploadedCount}/{slideCount} filled · {slideCount}/{maxSlideCount} slides
                </span>
              </div>

              <input
                ref={stageInputRef}
                type="file"
                multiple
                accept="image/*,.svg,.webp,.heic,.heif"
                className="hidden"
                onChange={(e) => {
                  const images = getImageFilesFromFileList(e.target.files);
                  if (images.length) void runStagePhotos(images);
                  e.currentTarget.value = "";
                }}
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*,.svg,.webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && replaceTargetIndex !== null) {
                    onReplaceScreenshot(replaceTargetIndex, file);
                  }
                  setReplaceTargetIndex(null);
                  e.currentTarget.value = "";
                }}
              />

              <button
                type="button"
                disabled={uploadBusy || slideCount === 0}
                className="mb-3 flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/12 bg-zinc-900/40 px-3 py-5 text-zinc-400 transition-colors hover:border-white/20 hover:bg-zinc-800/50 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => stageInputRef.current?.click()}
              >
                <span className="flex items-center gap-2">
                  <ImageUp className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-medium text-zinc-300">
                    {uploadBusy ? "Adding images…" : "Add screenshots"}
                  </span>
                </span>
                <span className="text-center text-[10px] leading-relaxed text-zinc-500">
                  PNG, JPG, WebP, or SVG. Queue screenshots for device mockups on your slides.
                </span>
              </button>

              {stageCount > 0 ? (
                <div className="mb-3 rounded-xl border border-white/10 bg-zinc-900/50 p-2.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-medium text-zinc-300">
                      Queue ({stageCount})
                    </p>
                    <button
                      type="button"
                      onClick={onClearStagedScreenshots}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300"
                    >
                      Clear queue
                    </button>
                  </div>
                  <p className="mb-2 text-[10px] leading-relaxed text-zinc-500">
                    Order: 1st → slide 1, 2nd → slide 2, and so on.
                  </p>
                  <ul className="max-h-36 space-y-1 overflow-y-auto">
                    {stagedScreenshots.map((item, index) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg bg-black/25 px-1.5 py-1"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-purple-500/20 text-[9px] font-semibold tabular-nums text-purple-200">
                          {index + 1}
                        </span>
                        <div className="h-8 w-6 shrink-0 overflow-hidden rounded border border-white/10 bg-zinc-950">
                          <img
                            src={item.dataUrl}
                            alt=""
                            draggable={false}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="min-w-0 flex-1 truncate text-[10px] text-zinc-400">
                          {item.name}
                        </p>
                        <button
                          type="button"
                          title="Remove from queue"
                          onClick={() => onRemoveStagedScreenshot(item.id)}
                          className="shrink-0 rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <button
                type="button"
                disabled={uploadBusy || slideCount === 0 || stageCount === 0}
                onClick={runApplyStaged}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-400/35 bg-purple-500/20 px-3 py-2.5 text-[11px] font-medium text-purple-100 transition hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply to mockups
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              {uploadFeedback ? (
                <p
                  className={`mb-3 text-[10px] leading-relaxed ${
                    uploadFeedback.tone === "ok" ? "text-emerald-400/90" : "text-amber-400/90"
                  }`}
                  role="status"
                >
                  {uploadFeedback.text}
                </p>
              ) : (
                <div className="mb-3" />
              )}

              {uploadedCount > 0 ? (
                <button
                  type="button"
                  onClick={onClearScreenshots}
                  className="mb-3 text-[10px] text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
                >
                  Clear all
                </button>
              ) : null}

              {slideCount > MIN_SLIDE_COUNT ? (
                <p className="mb-2 text-[10px] leading-relaxed text-zinc-500">
                  Fewer screenshots than slides? Remove unused slides with{" "}
                  <X className="inline h-2.5 w-2.5 align-[-1px]" aria-hidden />.
                </p>
              ) : null}

              <button
                type="button"
                onClick={onAddSlide}
                disabled={slideCount >= maxSlideCount}
                className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/12 bg-zinc-900/40 px-3 py-2 text-[11px] font-medium text-zinc-300 transition hover:border-white/20 hover:bg-zinc-800/50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Plus className="h-3.5 w-3.5" />
                Add slide
              </button>
              {slideCount >= APP_STORE_SCREENSHOT_LIMIT ? (
                <p className="mb-2 text-[10px] leading-relaxed text-zinc-500">
                  App Store allows {APP_STORE_SCREENSHOT_LIMIT} screenshots per device size; you can
                  still design more here and export the ones you need.
                </p>
              ) : null}

              <ul className="space-y-1">
                {slides.map((slide, index) => {
                  const selected = selectedSlideIndex === index;
                  return (
                    <li
                      key={index}
                      className={`flex items-center gap-2 rounded-lg px-1.5 py-1.5 ${
                        selected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSlideSelect(index)}
                        className={`h-9 w-7 shrink-0 overflow-hidden rounded-md border ${
                          selected ? "border-white/25" : "border-white/10"
                        } bg-zinc-950`}
                        title={`Slide ${index + 1}`}
                      >
                        {slide.imageDataUrl ? (
                          <img
                            src={slide.imageDataUrl}
                            alt=""
                            draggable={false}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[9px] text-zinc-600">
                            {index + 1}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onSlideSelect(index)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="text-[11px] text-zinc-300">Slide {index + 1}</p>
                        <p className="text-[10px] text-zinc-600">
                          {slide.imageDataUrl ? "Uploaded" : "Empty"}
                        </p>
                      </button>
                      <div className="flex shrink-0 items-center gap-0.5">
                        {selected ? (
                          <>
                            <button
                              type="button"
                              title="Replace screenshot"
                              onClick={() => {
                                setReplaceTargetIndex(index);
                                replaceInputRef.current?.click();
                              }}
                              className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                            >
                              <ImagePlus className="h-3.5 w-3.5" />
                            </button>
                            {slide.imageDataUrl ? (
                              <button
                                type="button"
                                title="Clear screenshot"
                                onClick={() => onRemoveScreenshot(index)}
                                className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            ) : null}
                          </>
                        ) : (
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              slide.imageDataUrl ? "bg-emerald-400/80" : "bg-zinc-700"
                            }`}
                          />
                        )}
                        {slideCount > MIN_SLIDE_COUNT ? (
                          <button
                            type="button"
                            title="Delete slide"
                            onClick={() => onRemoveSlide(index)}
                            className="rounded-md p-1.5 text-zinc-500 hover:bg-red-950/40 hover:text-red-300"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {category ? (
            <>
              {activePanel === "templates" ? (
                <section className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium text-zinc-400">
                    <LayoutTemplate className="h-3.5 w-3.5" />
                    Templates
                  </div>
                  <TemplatePicker
                    category={category}
                    selectedTemplateId={selectedTemplateId}
                    isPro={isPro}
                    onSelect={onTemplateSelect}
                    onLockedClick={() =>
                      (onLockedFeatureClick ?? openUpgrade)(
                        "Premium templates are included with AppFrames Pro."
                      )
                    }
                  />
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Layout spacing</span>
                        <span className="tabular-nums text-zinc-400">{layoutSpacing}</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={layoutSpacing}
                        onChange={(e) =>
                          patchTemplateSettings({ layoutSpacing: Number(e.target.value) })
                        }
                        className="w-full accent-purple-400"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] text-zinc-500">Preset mood</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["clean", "contrast", "editorial"] as const).map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const mood = getMoodStyles(preset);
                              patchTemplateSettings({ stylePreset: preset });
                              onTextStyleChange({
                                headlineColor: mood.headlineColor,
                                subheadlineColor: mood.subheadlineColor
                              });
                            }}
                            className={`rounded-md border px-2 py-1 text-[10px] capitalize ${
                              stylePreset === preset
                                ? "border-purple-400/40 bg-purple-500/15 text-purple-200"
                                : "border-white/10 bg-zinc-900/60 text-zinc-400"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/60 px-2.5 py-2 text-[10px] text-zinc-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Circle className="h-3.5 w-3.5" />
                        Show device mockups
                      </span>
                      <input
                        type="checkbox"
                        checked={showDeviceFrame}
                        onChange={(e) =>
                          patchTemplateSettings({ showDeviceFrame: e.target.checked })
                        }
                      />
                    </label>
                    <label
                      className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-[10px] ${
                        showDeviceFrame
                          ? "border-white/10 bg-zinc-900/40 text-zinc-500"
                          : "border-white/10 bg-zinc-900/60 text-zinc-300"
                      }`}
                    >
                      <span>Use uploaded mockup as-is</span>
                      <input
                        type="checkbox"
                        checked={showUploadedMockupAsIs}
                        disabled={showDeviceFrame}
                        onChange={(e) =>
                          patchTemplateSettings({ showUploadedMockupAsIs: e.target.checked })
                        }
                      />
                    </label>
                  </div>
                </section>
              ) : null}

              {activePanel === "text" ? (
                <section className="mb-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                    <Type className="h-3.5 w-3.5" />
                    Text
                  </div>
                  <p className="text-[10px] leading-relaxed text-zinc-500">
                    Font, colors, and weight apply to every slide.
                  </p>
                  <label className="block">
                    <span className="mb-1 block text-[10px] text-zinc-500">Font style</span>
                    <div className="relative">
                      <select
                        value={fontId}
                        onChange={(e) => onFontChange(e.target.value as TextFontId)}
                        style={{ fontFamily: activeFontFamily }}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 pr-8 text-sm text-white outline-none transition focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/20"
                      >
                        {TEXT_FONT_OPTIONS.map((font) => (
                          <option
                            key={font.id}
                            value={font.id}
                            style={{ fontFamily: font.family }}
                          >
                            {font.label} — {font.description}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                        aria-hidden
                      />
                    </div>
                  </label>
                  <div>
                    <span className="mb-1.5 block text-[10px] text-zinc-500">Text colors</span>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {TEXT_COLOR_PRESETS.map((preset) => {
                        const active =
                          preset.headline === headlineColor &&
                          preset.subheadline === subheadlineColor;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            title={preset.label}
                            onClick={() =>
                              onTextStyleChange({
                                headlineColor: preset.headline,
                                subheadlineColor: preset.subheadline
                              })
                            }
                            className={`rounded-md border px-2 py-1 text-[9px] font-medium transition ${
                              active
                                ? "border-purple-400/40 bg-purple-500/15 text-purple-100"
                                : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/20"
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-2 py-1.5">
                        <input
                          type="color"
                          value={headlineColor ?? "#ffffff"}
                          onChange={(e) =>
                            onTextStyleChange({ headlineColor: e.target.value })
                          }
                          className="h-7 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                          aria-label="Headline color"
                        />
                        <span className="text-[10px] text-zinc-400">Headline</span>
                      </label>
                      <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-2 py-1.5">
                        <input
                          type="color"
                          value={subheadlineColor ?? "#a1a1aa"}
                          onChange={(e) =>
                            onTextStyleChange({ subheadlineColor: e.target.value })
                          }
                          className="h-7 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                          aria-label="Subtitle color"
                        />
                        <span className="text-[10px] text-zinc-400">Subtitle</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["medium", "semibold", "bold"] as const).map((weight) => (
                      <button
                        key={weight}
                        type="button"
                        onClick={() => onTextStyleChange({ fontWeight: weight })}
                        className={`rounded-md border px-2 py-1 text-[10px] capitalize ${
                          fontWeight === weight
                            ? "border-purple-400/40 bg-purple-500/15 text-purple-200"
                            : "border-white/10 bg-zinc-900/60 text-zinc-400"
                        }`}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/8 pt-3">
                    <p className="mb-2 text-[10px] font-medium text-zinc-400">Copy per slide</p>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {Array.from({ length: slideCount }, (_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => onSlideSelect(index)}
                          className={`rounded-md border px-2 py-1 text-[10px] font-medium transition ${
                            selectedSlideIndex === index
                              ? "border-purple-400/40 bg-purple-500/15 text-purple-200"
                              : "border-white/10 bg-zinc-900/60 text-zinc-500 hover:border-white/20"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-[10px] text-zinc-500">Headline</span>
                    <input
                      value={headline}
                      onChange={(e) => onHeadlineChange(e.target.value)}
                      style={{ fontFamily: activeFontFamily }}
                      className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white outline-none ring-purple-400/0 transition focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/20"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] text-zinc-500">Subtitle</span>
                    <input
                      value={subheadline}
                      onChange={(e) => onSubheadlineChange(e.target.value)}
                      style={{ fontFamily: activeFontFamily }}
                      className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-300 outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
                    />
                  </label>
                  <div className="border-t border-white/8 pt-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-[10px] font-medium text-zinc-400">Extra text boxes</p>
                      <button
                        type="button"
                        disabled={selectedTextBoxes.length >= MAX_SLIDE_TEXT_BOXES}
                        onClick={() => onAddTextBox(selectedSlideIndex)}
                        className="inline-flex items-center gap-1 rounded-md border border-purple-400/30 bg-purple-500/10 px-2 py-1 text-[10px] font-medium text-purple-100 transition hover:border-purple-400/45 hover:bg-purple-500/15 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" aria-hidden />
                        Add text box
                      </button>
                    </div>
                    <p className="mb-2 text-[10px] leading-relaxed text-zinc-600">
                      Add callouts, labels, or extra copy. Drag to move, corner handle to resize.
                    </p>
                    {selectedTextBoxes.length > 0 ? (
                      <div className="space-y-2">
                        {selectedTextBoxes.map((box, boxIndex) => (
                          <div
                            key={box.id}
                            className="rounded-lg border border-white/10 bg-zinc-900/50 p-2.5"
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-medium text-zinc-400">
                                Text box {boxIndex + 1}
                              </span>
                              <button
                                type="button"
                                aria-label={`Remove text box ${boxIndex + 1}`}
                                onClick={() => onRemoveTextBox(selectedSlideIndex, box.id)}
                                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 text-zinc-500 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
                              >
                                <Trash2 className="h-3 w-3" aria-hidden />
                              </button>
                            </div>
                            <textarea
                              value={box.text}
                              rows={2}
                              onChange={(e) =>
                                onUpdateTextBox(selectedSlideIndex, box.id, {
                                  text: e.target.value
                                })
                              }
                              style={{ fontFamily: activeFontFamily }}
                              className="mb-2 w-full resize-none rounded-lg border border-white/10 bg-zinc-900/80 px-2.5 py-2 text-xs text-white outline-none transition focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/20"
                            />
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { key: "left", icon: AlignLeft },
                                { key: "center", icon: AlignCenter },
                                { key: "right", icon: AlignRight }
                              ].map(({ key, icon: Icon }) => (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() =>
                                    onUpdateTextBox(selectedSlideIndex, box.id, {
                                      alignment: key as "left" | "center" | "right"
                                    })
                                  }
                                  className={`flex items-center justify-center rounded-md border px-1.5 py-1 ${
                                    box.alignment === key
                                      ? "border-purple-400/40 bg-purple-500/15 text-purple-200"
                                      : "border-white/10 bg-zinc-900/60 text-zinc-400"
                                  }`}
                                >
                                  <Icon className="h-3 w-3" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-white/8 bg-zinc-900/40 px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <Move className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-300/80" aria-hidden />
                        <p className="text-[10px] leading-relaxed text-zinc-500">
                          Drag headline and subtitle to reposition. Drag the corner handle to
                          resize.
                        </p>
                      </div>
                      {textStyle.textPosition ? (
                        <button
                          type="button"
                          onClick={() => onSelectedSlideStyleChange({ textPosition: null })}
                          className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 transition hover:text-zinc-200"
                        >
                          <RotateCcw className="h-3 w-3" aria-hidden />
                          Reset text position
                        </button>
                      ) : null}
                    </div>
                    <div className="rounded-lg border border-white/8 bg-zinc-900/40 px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <Move className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300/80" aria-hidden />
                        <p className="text-[10px] leading-relaxed text-zinc-500">
                          Drag to move, use the top-right handle to rotate, and the bottom-right
                          green handle to resize. Push mockups partially off the edges for cropped
                          hero shots — the frame clips them cleanly.
                        </p>
                      </div>
                      {showMockupControls ? (
                        <>
                          <div className="mt-3">
                            <p className="mb-1.5 text-[10px] font-medium text-zinc-500">Rotation</p>
                            <div className="flex flex-wrap gap-1">
                              {mockupRotatePresets.map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => applyMockupRotate(preset)}
                                  className={`rounded-md border px-2 py-1 text-[10px] tabular-nums transition ${
                                    currentMockupRotate === preset
                                      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                                      : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                                  }`}
                                >
                                  {preset}°
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                      {textStyle.mockupPosition ? (
                        <button
                          type="button"
                          onClick={() => onSelectedSlideStyleChange({ mockupPosition: null })}
                          className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 transition hover:text-zinc-200"
                        >
                          <RotateCcw className="h-3 w-3" aria-hidden />
                          Reset mockup position
                        </button>
                      ) : null}
                    </div>
                  </div>
                </section>
              ) : null}

              {activePanel === "style" ? (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-zinc-300">Background</p>
                    <div className="flex rounded-lg border border-white/10 bg-zinc-900/80 p-0.5">
                      <button
                        type="button"
                        onClick={() => onGradientToggle(false)}
                        className={`rounded-md px-2 py-0.5 text-[10px] transition ${
                          !useGradient
                            ? "bg-white/10 text-white"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Solid
                      </button>
                      <button
                        type="button"
                        onClick={() => onGradientToggle(true)}
                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] transition ${
                          useGradient
                            ? "bg-white/10 text-white"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        Gradient
                      </button>
                    </div>
                  </div>

                  <div
                    className="h-10 w-full rounded-lg border border-white/10"
                    style={backgroundTexturePreviewStyle(
                      backgroundTextureId,
                      useGradient,
                      background,
                      gradientToCss(gradientStyle)
                    )}
                  />

                  <div>
                    <p className="mb-2 text-[10px] text-zinc-500">Texture</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {BACKGROUND_TEXTURES.map((texture) => (
                        <button
                          key={texture.id}
                          type="button"
                          onClick={() => onBackgroundTextureChange(texture.id)}
                          className={`overflow-hidden rounded-lg border px-1 py-1.5 text-center transition ${
                            backgroundTextureId === texture.id
                              ? "border-purple-400/45 bg-purple-500/10"
                              : "border-white/10 bg-zinc-900/50 hover:border-white/20"
                          }`}
                        >
                          <span
                            className="mb-1 block h-7 w-full rounded-md border border-white/10"
                            style={backgroundTexturePreviewStyle(
                              texture.id,
                              useGradient,
                              background,
                              gradientToCss(gradientStyle)
                            )}
                          />
                          <span className="block text-[9px] text-zinc-400">{texture.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {!useGradient ? (
                    <>
                      <label className="flex items-center gap-2">
                        <input
                          type="color"
                          value={background}
                          onChange={(e) => onBackgroundSelect(e.target.value)}
                          className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent p-0.5"
                        />
                        <input
                          type="text"
                          value={background}
                          onChange={(e) => onBackgroundSelect(e.target.value)}
                          className="flex-1 rounded-lg border border-white/10 bg-zinc-900/80 px-2 py-1.5 font-mono text-[11px] text-zinc-200 outline-none focus:border-white/25"
                          spellCheck={false}
                        />
                      </label>
                      <ColorSwatches
                        colors={[...new Set([...category.backgrounds, ...STYLE_PALETTE])]}
                        active={background}
                        onSelect={onBackgroundSelect}
                      />
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            ["from", "Start"],
                            ["via", "Middle"],
                            ["to", "End"]
                          ] as const
                        ).map(([key, label]) => (
                          <label key={key} className="block">
                            <span className="mb-1 block text-[10px] text-zinc-500">{label}</span>
                            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/60 p-1.5">
                              <input
                                type="color"
                                value={gradientStyle[key]}
                                onChange={(e) =>
                                  onGradientStyleChange({
                                    ...gradientStyle,
                                    [key]: e.target.value
                                  })
                                }
                                className="h-7 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                              />
                              <input
                                type="text"
                                value={gradientStyle[key]}
                                onChange={(e) =>
                                  onGradientStyleChange({
                                    ...gradientStyle,
                                    [key]: e.target.value
                                  })
                                }
                                className="min-w-0 flex-1 bg-transparent font-mono text-[9px] text-zinc-300 outline-none"
                                spellCheck={false}
                              />
                            </div>
                          </label>
                        ))}
                      </div>

                      <label className="block">
                        <span className="mb-1 flex items-center justify-between text-[10px] text-zinc-500">
                          <span className="inline-flex items-center gap-1">
                            <SlidersHorizontal className="h-3 w-3" />
                            Angle
                          </span>
                          <span className="tabular-nums text-zinc-400">
                            {gradientStyle.angle}°
                          </span>
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={gradientStyle.angle}
                          onChange={(e) =>
                            onGradientStyleChange({
                              ...gradientStyle,
                              angle: Number(e.target.value)
                            })
                          }
                          className="w-full accent-zinc-300"
                        />
                      </label>

                      <div>
                        <p className="mb-2 text-[10px] text-zinc-500">Presets</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {GRADIENT_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => onGradientStyleChange(preset.gradient)}
                              className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/50 px-2 py-1.5 text-left hover:border-white/20"
                            >
                              <span
                                className="h-5 w-5 shrink-0 rounded-md border border-white/10"
                                style={{ backgroundImage: gradientToCss(preset.gradient) }}
                              />
                              <span className="text-[10px] text-zinc-300">{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-[10px] text-zinc-500">Palette</p>
                        <ColorSwatches
                          colors={STYLE_PALETTE}
                          active={gradientStyle.from}
                          onSelect={(color) =>
                            onGradientStyleChange({ ...gradientStyle, from: color })
                          }
                        />
                        <p className="mt-2 mb-1 text-[9px] text-zinc-600">
                          Tap a swatch to set gradient start color
                        </p>
                      </div>
                    </>
                  )}

                  <div className="space-y-3 border-t border-white/5 pt-3">
                    <label className="block">
                      <span className="mb-1 block text-[10px] text-zinc-500">
                        Shadow ({shadowDepth}%)
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={shadowDepth}
                        onChange={(e) =>
                          patchFrameStyle({ shadowDepth: Number(e.target.value) })
                        }
                        className="w-full accent-zinc-300"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] text-zinc-500">
                        Corner radius ({cornerRadius}px)
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={32}
                        value={cornerRadius}
                        onChange={(e) =>
                          patchFrameStyle({ cornerRadius: Number(e.target.value) })
                        }
                        className="w-full accent-zinc-300"
                      />
                    </label>
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </motion.div>
      )}
    </motion.aside>
  );
}
