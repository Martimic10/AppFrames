"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCategoryById } from "@/components/create/category-data";
import { CategoryOnboarding } from "@/components/create/category-onboarding";
import { CreateCanvas } from "@/components/create/create-canvas";
import { CreateSidebar } from "@/components/create/create-sidebar";
import {
  buildAppStoreZip,
  captureFrameAsAppStoreBlob,
  downloadBlob,
  formatSlideExportFileName,
  getAppStoreExportSize,
  getCompositionFrameElement,
  scrollCompositionCardIntoView,
  sanitizeExportBaseName
} from "@/components/create/app-store-export";
import { CreateTopBar } from "@/components/create/create-top-bar";
import { ExportDialog, type ExportDialogOptions } from "@/components/create/export-dialog";
import {
  createSlideFromTemplate,
  getTemplateSlides,
  MAX_SLIDE_COUNT,
  MIN_SLIDE_COUNT
} from "@/components/create/template-slides";
import { layoutIdFromTemplate } from "@/components/create/composition-engine";
import {
  DEFAULT_GRADIENT,
} from "@/components/create/style-colors";
import {
  DEFAULT_BACKGROUND_TEXTURE_ID,
  type BackgroundTextureId
} from "@/components/create/background-textures";
import { getTemplateThemeColors } from "@/components/create/template-theme-colors";
import {
  DEFAULT_FRAME_STYLE_SETTINGS,
  type FrameStyleSettings
} from "@/components/create/frame-style-settings";
import {
  DEFAULT_TEMPLATE_SETTINGS,
  type TemplateSettings
} from "@/components/create/template-settings";
import {
  isImageFile,
  readFileAsDataUrl,
  readImageFilesWithMeta,
  type AutoFillResult,
  type StagedScreenshot
} from "@/components/create/image-upload";
import type { TextPosition } from "@/components/create/text-position";
import { clampGraphicPosition, type GraphicPosition } from "@/components/create/graphic-position";
import {
  sanitizeMockupPosition,
  type MockupPosition
} from "@/components/create/mockup-position";
import { DEFAULT_SLIDE_TEXT_STYLE } from "@/components/create/text-style";
import {
  createTextBox,
  MAX_SLIDE_TEXT_BOXES,
  type SlideTextBox
} from "@/components/create/slide-text-box";
import { clampSlideTextSize } from "@/components/create/text-size-resize";
import {
  clearEditorCheckoutSnapshot,
  readEditorCheckoutSnapshot,
  saveEditorCheckoutSnapshot
} from "@/lib/pro/editor-checkout-session";
import { usePro } from "@/components/pro/pro-provider";
import { isProCompositionLayout } from "@/lib/pro/constants";
import { consumeExportCredit } from "@/lib/pro/export-storage";
import { getFirstFreeTemplateId } from "@/lib/pro/template-access";
import type {
  CategoryId,
  CompositionLayoutId,
  GradientStyle,
  ScreenshotSlide,
  SlideTextStyle
} from "@/components/create/types";

export function CreateWorkspace() {
  const { isPro, canExport, openUpgrade, syncExportsRemaining, registerCheckoutPrepare } =
    usePro();
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [activePanel, setActivePanel] = useState<"upload" | "templates" | "text" | "style">(
    "upload"
  );
  const [slides, setSlides] = useState<ScreenshotSlide[]>([]);
  const [stagedScreenshots, setStagedScreenshots] = useState<StagedScreenshot[]>([]);
  const slidesRef = useRef(slides);
  slidesRef.current = slides;
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [background, setBackground] = useState("#09090b");
  const [useGradient, setUseGradient] = useState(true);
  const [gradientStyle, setGradientStyle] = useState<GradientStyle>(DEFAULT_GRADIENT);
  const [backgroundTextureId, setBackgroundTextureId] = useState<BackgroundTextureId>(
    DEFAULT_BACKGROUND_TEXTURE_ID
  );
  const [compositionLayoutId, setCompositionLayoutId] =
    useState<CompositionLayoutId>("floating-stack");
  const [templateSettings, setTemplateSettings] = useState<TemplateSettings>(
    DEFAULT_TEMPLATE_SETTINGS
  );
  const [frameStyleSettings, setFrameStyleSettings] = useState<FrameStyleSettings>(
    DEFAULT_FRAME_STYLE_SETTINGS
  );
  const [exportOpen, setExportOpen] = useState(false);

  const category = categoryId ? getCategoryById(categoryId) : null;
  const hasSelectedCategory = categoryId !== null;

  const loadTemplate = useCallback((id: CategoryId, templateId: string) => {
    let nextSlideCount = 1;

    setSlides((prev) => {
      const templateSlides = getTemplateSlides(id, templateId);
      nextSlideCount =
        prev.length === 0
          ? templateSlides.length
          : Math.min(MAX_SLIDE_COUNT, Math.max(MIN_SLIDE_COUNT, prev.length));

      return Array.from({ length: nextSlideCount }, (_, index) => {
        const slide = templateSlides[index] ?? templateSlides[templateSlides.length - 1];
        const prevSlide = prev[index];
        return {
          ...slide,
          imageDataUrl: prevSlide?.imageDataUrl ?? null,
          fontId: prevSlide?.fontId ?? slide.fontId,
          fontWeight: prevSlide?.fontWeight ?? slide.fontWeight,
          alignment: prevSlide?.alignment ?? slide.alignment,
          textSize: prevSlide?.textSize ?? slide.textSize,
          headlineColor: prevSlide?.headlineColor ?? slide.headlineColor,
          subheadlineColor: prevSlide?.subheadlineColor ?? slide.subheadlineColor,
          textPosition: prevSlide?.textPosition ?? slide.textPosition ?? null,
          mockupPosition: prevSlide?.mockupPosition ?? slide.mockupPosition ?? null,
          graphicPosition: prevSlide?.graphicPosition ?? slide.graphicPosition ?? null,
          graphicDataUrl: prevSlide?.graphicDataUrl ?? null,
          textBoxes: prevSlide?.textBoxes ?? []
        };
      });
    });

    setSelectedSlideIndex((sel) => Math.min(sel, Math.max(0, nextSlideCount - 1)));
  }, []);

  const restoreEditorSnapshot = useCallback(
    (snapshot: NonNullable<ReturnType<typeof readEditorCheckoutSnapshot>>) => {
      const next = getCategoryById(snapshot.categoryId);
      setCategoryId(snapshot.categoryId);
      setSelectedTemplateId(snapshot.selectedTemplateId);
      setCompositionLayoutId(snapshot.compositionLayoutId);
      setBackground(snapshot.background);
      setGradientStyle(snapshot.gradientStyle);
      setUseGradient(snapshot.useGradient);
      setStagedScreenshots([]);
      setActivePanel("templates");
      loadTemplate(snapshot.categoryId, snapshot.selectedTemplateId);
      if (!next.backgrounds.includes(snapshot.background)) {
        setBackground(next.backgrounds[0] ?? snapshot.background);
      }
    },
    [loadTemplate]
  );

  const handleCategorySelect = useCallback(
    (id: CategoryId) => {
      const next = getCategoryById(id);
      const firstTemplateId = getFirstFreeTemplateId(id);
      const theme = getTemplateThemeColors(id, firstTemplateId);
      setCategoryId(id);
      setStagedScreenshots([]);
      setActivePanel("upload");
      setSelectedTemplateId(firstTemplateId);
      setCompositionLayoutId(layoutIdFromTemplate(firstTemplateId));
      setBackground(theme.background);
      setGradientStyle(theme.gradient);
      setUseGradient(true);
      loadTemplate(id, firstTemplateId);
    },
    [loadTemplate]
  );

  useEffect(() => {
    const snapshot = readEditorCheckoutSnapshot();
    if (snapshot) {
      restoreEditorSnapshot(snapshot);
      clearEditorCheckoutSnapshot();
    }
  }, [restoreEditorSnapshot]);

  useEffect(() => {
    registerCheckoutPrepare(() => {
      if (!categoryId || !selectedTemplateId) return;
      saveEditorCheckoutSnapshot({
        categoryId,
        selectedTemplateId,
        compositionLayoutId,
        background,
        useGradient,
        gradientStyle
      });
    });
    return () => registerCheckoutPrepare(null);
  }, [
    registerCheckoutPrepare,
    categoryId,
    selectedTemplateId,
    compositionLayoutId,
    background,
    useGradient,
    gradientStyle
  ]);

  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      if (!categoryId) return;
      const theme = getTemplateThemeColors(categoryId, templateId);
      setSelectedTemplateId(templateId);
      setCompositionLayoutId(layoutIdFromTemplate(templateId));
      setBackground(theme.background);
      setGradientStyle(theme.gradient);
      loadTemplate(categoryId, templateId);
    },
    [categoryId, loadTemplate]
  );

  const updateSelectedSlide = useCallback(
    (field: "headline" | "subheadline", value: string) => {
      setSlides((prev) =>
        prev.map((slide, index) =>
          index === selectedSlideIndex ? { ...slide, [field]: value } : slide
        )
      );
    },
    [selectedSlideIndex]
  );

  const updateAllSlidesFont = useCallback((fontId: ScreenshotSlide["fontId"]) => {
    setSlides((prev) => prev.map((slide) => ({ ...slide, fontId })));
  }, []);

  const updateAllSlidesTextStyle = useCallback((patch: Partial<SlideTextStyle>) => {
    setSlides((prev) => prev.map((slide) => ({ ...slide, ...patch })));
  }, []);

  const updateSelectedSlideStyle = useCallback(
    (patch: Partial<SlideTextStyle>) => {
      setSlides((prev) =>
        prev.map((slide, index) =>
          index === selectedSlideIndex ? { ...slide, ...patch } : slide
        )
      );
    },
    [selectedSlideIndex]
  );

  const handleSlideTextPositionChange = useCallback(
    (index: number, position: TextPosition) => {
      setSlides((prev) =>
        prev.map((slide, i) => (i === index ? { ...slide, textPosition: position } : slide))
      );
    },
    []
  );

  const handleSlideMockupPositionChange = useCallback(
    (index: number, position: MockupPosition) => {
      const sanitized = sanitizeMockupPosition(position);
      setSlides((prev) =>
        prev.map((slide, i) =>
          i === index ? { ...slide, mockupPosition: sanitized } : slide
        )
      );
    },
    []
  );

  const handleSlideGraphicPositionChange = useCallback(
    (index: number, position: GraphicPosition) => {
      const sanitized = clampGraphicPosition(position);
      setSlides((prev) =>
        prev.map((slide, i) => (i === index ? { ...slide, graphicPosition: sanitized } : slide))
      );
    },
    []
  );

  const handleAddTextBox = useCallback((index: number) => {
    setSlides((prev) =>
      prev.map((slide, i) => {
        if (i !== index) return slide;
        const boxes = slide.textBoxes ?? [];
        if (boxes.length >= MAX_SLIDE_TEXT_BOXES) return slide;
        return {
          ...slide,
          textBoxes: [
            ...boxes,
            createTextBox(boxes.length, Boolean(slide.imageDataUrl))
          ]
        };
      })
    );
  }, []);

  const handleUpdateTextBox = useCallback(
    (index: number, boxId: string, patch: Partial<SlideTextBox>) => {
      setSlides((prev) =>
        prev.map((slide, i) => {
          if (i !== index) return slide;
          return {
            ...slide,
            textBoxes: (slide.textBoxes ?? []).map((box) =>
              box.id === boxId ? { ...box, ...patch } : box
            )
          };
        })
      );
    },
    []
  );

  const handleRemoveTextBox = useCallback((index: number, boxId: string) => {
    setSlides((prev) =>
      prev.map((slide, i) => {
        if (i !== index) return slide;
        return {
          ...slide,
          textBoxes: (slide.textBoxes ?? []).filter((box) => box.id !== boxId)
        };
      })
    );
  }, []);

  const handleTextBoxPositionChange = useCallback(
    (index: number, boxId: string, position: TextPosition) => {
      handleUpdateTextBox(index, boxId, { position });
    },
    [handleUpdateTextBox]
  );

  const handleSlideTextSizeChange = useCallback(
    (textSize: number) => {
      updateAllSlidesTextStyle({ textSize: clampSlideTextSize(textSize) });
    },
    [updateAllSlidesTextStyle]
  );

  const handleTextBoxTextSizeChange = useCallback(
    (index: number, boxId: string, textSize: number) => {
      handleUpdateTextBox(index, boxId, { textSize: clampSlideTextSize(textSize) });
    },
    [handleUpdateTextBox]
  );

  const selectedSlide = slides[selectedSlideIndex];
  const slideTextStyle: SlideTextStyle = {
    fontWeight: selectedSlide?.fontWeight ?? DEFAULT_SLIDE_TEXT_STYLE.fontWeight,
    alignment: selectedSlide?.alignment ?? DEFAULT_SLIDE_TEXT_STYLE.alignment,
    textSize: selectedSlide?.textSize ?? DEFAULT_SLIDE_TEXT_STYLE.textSize,
    headlineColor: selectedSlide?.headlineColor ?? DEFAULT_SLIDE_TEXT_STYLE.headlineColor,
    subheadlineColor:
      selectedSlide?.subheadlineColor ?? DEFAULT_SLIDE_TEXT_STYLE.subheadlineColor,
    textPosition: selectedSlide?.textPosition ?? DEFAULT_SLIDE_TEXT_STYLE.textPosition,
    mockupPosition: selectedSlide?.mockupPosition ?? DEFAULT_SLIDE_TEXT_STYLE.mockupPosition,
    graphicPosition: selectedSlide?.graphicPosition ?? DEFAULT_SLIDE_TEXT_STYLE.graphicPosition
  };

  const handleStageScreenshots = useCallback(async (files: File[]): Promise<AutoFillResult> => {
    const slideCount = slidesRef.current.length;
    if (slideCount === 0) {
      return {
        ok: false,
        filled: 0,
        slideCount: 0,
        message: "Pick a category first to create slides."
      };
    }

    const incoming = await readImageFilesWithMeta(files);
    if (incoming.length === 0) {
      return {
        ok: false,
        filled: 0,
        slideCount,
        message: "No supported images found. Try PNG, JPG, or WebP."
      };
    }

    setStagedScreenshots((prev) => [
      ...prev,
      ...incoming.map((item) => ({
        id: crypto.randomUUID(),
        name: item.name,
        dataUrl: item.dataUrl
      }))
    ]);

    return {
      ok: true,
      filled: incoming.length,
      slideCount,
      message: `Added ${incoming.length} photo${incoming.length === 1 ? "" : "s"} to your queue. Click Apply when ready.`
    };
  }, []);

  const handleRemoveStagedScreenshot = useCallback((id: string) => {
    setStagedScreenshots((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearStagedScreenshots = useCallback(() => {
    setStagedScreenshots([]);
  }, []);

  const handleApplyStagedScreenshots = useCallback((): AutoFillResult => {
    const slideCount = slidesRef.current.length;
    const staged = stagedScreenshots;

    if (slideCount === 0) {
      return {
        ok: false,
        filled: 0,
        slideCount: 0,
        message: "Pick a category first to create slides."
      };
    }

    if (staged.length === 0) {
      return {
        ok: false,
        filled: 0,
        slideCount,
        message: "Add photos first, then apply them to your mockups."
      };
    }

    if (!categoryId) {
      return {
        ok: false,
        filled: 0,
        slideCount,
        message: "Pick a category first to create slides."
      };
    }

    const templateSlides = getTemplateSlides(categoryId, selectedTemplateId);
    const targetSlideCount = Math.min(MAX_SLIDE_COUNT, staged.length);
    const slidesAdded = Math.max(0, targetSlideCount - slideCount);

    setSlides((prev) => {
      const next = prev.map((s) => ({ ...s }));
      while (next.length < targetSlideCount) {
        next.push(createSlideFromTemplate(templateSlides, next.length));
      }
      const count = Math.min(next.length, staged.length);
      for (let i = 0; i < count; i++) {
        next[i].imageDataUrl = staged[i].dataUrl;
      }
      return next;
    });
    setStagedScreenshots([]);
    setSelectedSlideIndex(0);

    const finalSlideCount = targetSlideCount;
    const count = Math.min(finalSlideCount, staged.length);
    const unused = staged.length - count;
    const cappedByMax = staged.length > MAX_SLIDE_COUNT;

    let message: string;
    if (cappedByMax) {
      message = `Added slides up to the ${MAX_SLIDE_COUNT}-slide limit and applied ${count} photos. ${unused} extra photo${unused === 1 ? "" : "s"} were not used.`;
    } else if (slidesAdded > 0 && unused > 0) {
      message = `Added ${slidesAdded} slide${slidesAdded === 1 ? "" : "s"} and applied ${count} photos. ${unused} extra photo${unused === 1 ? "" : "s"} were not used.`;
    } else if (slidesAdded > 0) {
      message = `Added ${slidesAdded} slide${slidesAdded === 1 ? "" : "s"} and applied all ${count} photos.`;
    } else if (unused > 0) {
      message = `Applied ${count} photos. ${unused} extra photo${unused === 1 ? "" : "s"} were not used.`;
    } else if (staged.length < slideCount) {
      message = `Applied ${count} photo${count === 1 ? "" : "s"} to slides 1–${count}. Remove unused slides if you need fewer mockups.`;
    } else {
      message = `Applied all ${count} photos to your mockups.`;
    }

    return { ok: true, filled: count, slideCount: finalSlideCount, message };
  }, [stagedScreenshots, categoryId, selectedTemplateId]);

  const handleAddSlide = useCallback(() => {
    if (!categoryId) return;
    const currentLength = slidesRef.current.length;
    if (currentLength >= MAX_SLIDE_COUNT) return;
    setSelectedSlideIndex(currentLength);
    setSlides((prev) => {
      if (prev.length >= MAX_SLIDE_COUNT) return prev;
      const templateSlides = getTemplateSlides(categoryId, selectedTemplateId);
      return [...prev, createSlideFromTemplate(templateSlides, prev.length)];
    });
  }, [categoryId, selectedTemplateId]);

  const handleRemoveSlide = useCallback((index: number) => {
    setSlides((prev) => {
      if (prev.length <= MIN_SLIDE_COUNT) return prev;
      const next = prev.filter((_, i) => i !== index);
      setSelectedSlideIndex((sel) =>
        sel >= next.length ? Math.max(0, next.length - 1) : sel > index ? sel - 1 : sel
      );
      return next;
    });
  }, []);

  const handleRemoveScreenshot = useCallback((index: number) => {
    setSlides((prev) =>
      prev.map((slide, i) => (i === index ? { ...slide, imageDataUrl: null } : slide))
    );
  }, []);

  const handleClearScreenshots = useCallback(() => {
    setSlides((prev) => prev.map((slide) => ({ ...slide, imageDataUrl: null })));
  }, []);

  const handleReplaceScreenshot = useCallback(
    async (index: number, file: File) => {
      if (!isImageFile(file)) return;
      const dataUrl = await readFileAsDataUrl(file);
      setSlides((prev) =>
        prev.map((slide, i) => (i === index ? { ...slide, imageDataUrl: dataUrl } : slide))
      );
    },
    []
  );

  const handleSetSlideGraphic = useCallback(async (index: number, file: File) => {
    if (!isImageFile(file)) return;
    const dataUrl = await readFileAsDataUrl(file);
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === index ? { ...slide, graphicDataUrl: dataUrl, graphicPosition: null } : slide
      )
    );
  }, []);

  const handleRemoveSlideGraphic = useCallback((index: number) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === index ? { ...slide, graphicDataUrl: null, graphicPosition: null } : slide
      )
    );
  }, []);

  const defaultExportFileName = useMemo(() => {
    const categoryPart = category?.title ?? categoryId ?? "app";
    const templatePart = selectedTemplateId || "screenshots";
    return sanitizeExportBaseName(`${categoryPart}-${templatePart}`);
  }, [category?.title, categoryId, selectedTemplateId]);

  const handleCompositionLayoutChange = useCallback(
    (layoutId: CompositionLayoutId) => {
      if (!isPro && isProCompositionLayout(layoutId)) {
        openUpgrade("Advanced composition layouts are included with AppFrames Pro.");
        return;
      }
      setCompositionLayoutId(layoutId);
    },
    [isPro, openUpgrade]
  );

  const handleOpenExport = useCallback(() => {
    if (!canExport) {
      openUpgrade(
        "You've used all 3 free exports. Upgrade to Pro for unlimited HD exports."
      );
      return;
    }
    setExportOpen(true);
  }, [canExport, openUpgrade]);

  const handleAppStoreExport = useCallback(
    async (options: ExportDialogOptions) => {
      if (!categoryId) {
        throw new Error("Select a category before exporting.");
      }

      if (!isPro && !canExport) {
        openUpgrade(
          "You've used all 3 free exports. Upgrade to Pro for unlimited HD exports."
        );
        return;
      }

      const slideCount = slidesRef.current.length;
      if (slideCount === 0) {
        throw new Error("No slides to export.");
      }

      const size = getAppStoreExportSize(options.sizeId);
      const baseName = sanitizeExportBaseName(options.fileName);
      const indices =
        options.scope === "all"
          ? Array.from({ length: slideCount }, (_, index) => index)
          : [selectedSlideIndex];

      const files: { name: string; blob: Blob }[] = [];

      for (const index of indices) {
        scrollCompositionCardIntoView(index);
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        const frame = getCompositionFrameElement(index);
        if (!frame) {
          throw new Error(
            `Could not capture slide ${index + 1}. Scroll it into view or reset canvas zoom.`
          );
        }
        const blob = await captureFrameAsAppStoreBlob(frame, size, {
          quality: isPro ? options.quality : "standard",
          watermark: !isPro
        });
        files.push({
          name: formatSlideExportFileName(baseName, index),
          blob
        });
      }

      if (files.length === 1) {
        downloadBlob(files[0].blob, files[0].name);
      } else {
        const zipBlob = await buildAppStoreZip(files);
        downloadBlob(zipBlob, `${baseName}-app-store-screenshots.zip`);
      }

      if (!isPro) {
        consumeExportCredit(false);
        syncExportsRemaining();
      }
    },
    [categoryId, selectedSlideIndex, isPro, canExport, openUpgrade, syncExportsRemaining]
  );

  return (
    <div className="relative h-screen overflow-hidden bg-[#09090b] text-zinc-50">
      <div className="h-full px-3 pb-3 pt-3 md:px-4 md:pb-4">
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/30">
          <CreateTopBar
            onOpenExport={handleOpenExport}
            exportDisabled={!hasSelectedCategory}
          />
          <ExportDialog
            open={exportOpen}
            slideCount={slides.length}
            selectedSlideIndex={selectedSlideIndex}
            defaultFileName={defaultExportFileName}
            onClose={() => setExportOpen(false)}
            onExport={handleAppStoreExport}
          />
          <div className="relative flex min-h-0 flex-1">
            <CreateSidebar
              expanded={hasSelectedCategory}
              activePanel={activePanel}
              category={category}
              headline={selectedSlide?.headline ?? ""}
              subheadline={selectedSlide?.subheadline ?? ""}
              selectedSlideIndex={selectedSlideIndex}
              slideCount={slides.length}
              slides={slides}
              selectedTemplateId={selectedTemplateId}
              background={background}
              useGradient={useGradient}
              gradientStyle={gradientStyle}
              backgroundTextureId={backgroundTextureId}
              stagedScreenshots={stagedScreenshots}
              onStageScreenshots={handleStageScreenshots}
              onApplyStagedScreenshots={handleApplyStagedScreenshots}
              onRemoveStagedScreenshot={handleRemoveStagedScreenshot}
              onClearStagedScreenshots={handleClearStagedScreenshots}
              onReplaceScreenshot={handleReplaceScreenshot}
              onSetSlideGraphic={handleSetSlideGraphic}
              onRemoveSlideGraphic={handleRemoveSlideGraphic}
              onRemoveScreenshot={handleRemoveScreenshot}
              onRemoveSlide={handleRemoveSlide}
              onAddSlide={handleAddSlide}
              maxSlideCount={MAX_SLIDE_COUNT}
              onClearScreenshots={handleClearScreenshots}
              fontId={selectedSlide?.fontId ?? "inter"}
              onHeadlineChange={(value) => updateSelectedSlide("headline", value)}
              onSubheadlineChange={(value) => updateSelectedSlide("subheadline", value)}
              onFontChange={updateAllSlidesFont}
              textStyle={slideTextStyle}
              onTextStyleChange={updateAllSlidesTextStyle}
              onSelectedSlideStyleChange={updateSelectedSlideStyle}
              onAddTextBox={handleAddTextBox}
              onUpdateTextBox={handleUpdateTextBox}
              onRemoveTextBox={handleRemoveTextBox}
              frameStyleSettings={frameStyleSettings}
              onFrameStyleSettingsChange={setFrameStyleSettings}
              onSlideSelect={setSelectedSlideIndex}
              onTemplateSelect={handleTemplateSelect}
              compositionLayoutId={compositionLayoutId}
              onCompositionLayoutChange={handleCompositionLayoutChange}
              templateSettings={templateSettings}
              onTemplateSettingsChange={setTemplateSettings}
              onBackgroundSelect={setBackground}
              onGradientToggle={setUseGradient}
              onGradientStyleChange={setGradientStyle}
              onBackgroundTextureChange={setBackgroundTextureId}
              onPanelChange={setActivePanel}
            />

            <CreateCanvas
              category={category}
              slides={slides}
              selectedSlideIndex={selectedSlideIndex}
              compositionLayoutId={compositionLayoutId}
              compositionSeed={`${categoryId ?? "default"}:${selectedTemplateId}`}
              templateSettings={templateSettings}
              frameStyleSettings={frameStyleSettings}
              categoryId={categoryId ?? "productivity"}
              selectedTemplateId={selectedTemplateId}
              background={background}
              useGradient={useGradient}
              gradientStyle={gradientStyle}
              backgroundTextureId={backgroundTextureId}
              focused={hasSelectedCategory}
              dimmed={!hasSelectedCategory}
              onSlideSelect={setSelectedSlideIndex}
              onSlideTextPositionChange={handleSlideTextPositionChange}
              onSlideTextSizeChange={handleSlideTextSizeChange}
              onSlideMockupPositionChange={handleSlideMockupPositionChange}
              onSlideGraphicPositionChange={handleSlideGraphicPositionChange}
              onSlideGraphicRemove={handleRemoveSlideGraphic}
              onTextBoxPositionChange={handleTextBoxPositionChange}
              onTextBoxTextSizeChange={handleTextBoxTextSizeChange}
              onTextBoxRemove={handleRemoveTextBox}
            />
          </div>
        </div>
      </div>

      {!hasSelectedCategory ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#09090b]/80 px-4 pt-16">
          <CategoryOnboarding onSelect={handleCategorySelect} />
        </div>
      ) : null}
    </div>
  );
}
