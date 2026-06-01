"use client";

import { memo, useRef, type CSSProperties } from "react";
import { DraggableSlideMockup } from "@/components/create/draggable-slide-mockup";
import { DraggableSlideText } from "@/components/create/draggable-slide-text";
import { DraggableTextBox } from "@/components/create/draggable-text-box";
import { resolveMockupPosition } from "@/components/create/mockup-position";
import type { MockupPosition } from "@/components/create/mockup-position";
import { resolveTextPosition } from "@/components/create/text-position";
import type { TextPosition } from "@/components/create/text-position";
import {
  buildCompositionPlan,
  getSlideImage,
  type CompositionLayoutId
} from "@/components/create/composition-engine";
import { getFontFamily } from "@/components/create/text-fonts";
import {
  frameShadowCss,
  type FrameStyleSettings
} from "@/components/create/frame-style-settings";
import {
  cardAccentWashOpacity,
  cardThemeOverlayImage,
  cardThemeOverlayOpacity,
  framePaddingPx,
  getMoodStyles,
  mockupSizeScale,
  type StylePreset
} from "@/components/create/template-settings";
import {
  headlineSizePx,
  resolveHeadlineColor,
  resolveSubheadlineColor,
  subheadlineSizePx,
  type TextAlignment,
  type TextFontWeight
} from "@/components/create/text-style";
import {
  CARD_CONTENT_PADDING_PX,
  cardHeadlineSizePx,
  cardSubheadlineSizePx,
  getCardCompositionVariant,
  getCardDeviceHeightRatio,
  getCardDeviceMaxWidthRatio
} from "@/components/create/card-layout";
import { getThemePack } from "@/components/create/category-theme-packs";
import {
  getBackgroundTexture,
  type BackgroundTextureId
} from "@/components/create/background-textures";
import { IphoneDeviceChrome } from "@/components/create/iphone-device-chrome";
import { CardTemplatePlaceholderMockup } from "@/components/create/card-template-placeholder-mockup";
import { getTemplatePickerKitVisual, kitCanvasTextColors } from "@/components/create/template-kit-picker-variants";
import { TemplateKitFrameBackground } from "@/components/landing/app-store-template-kit";
import { PremiumDevice } from "@/components/create/premium-device";
import type { CategoryId, ScreenshotSlide, SlideTextBox, TextFontId } from "@/components/create/types";

type CompositionFrameProps = {
  slides: ScreenshotSlide[];
  focusIndex: number;
  headline: string;
  subheadline: string;
  fontId: TextFontId;
  layoutId: CompositionLayoutId;
  compositionSeed: string;
  useGradient: boolean;
  gradientCss: string;
  styleAccentColor?: string;
  background: string;
  glowColor: string;
  backgroundTextureId?: BackgroundTextureId;
  stylePreset?: StylePreset;
  layoutSpacing?: number;
  mockupSize?: number;
  fontWeight?: TextFontWeight;
  alignment?: TextAlignment;
  textSize?: number;
  headlineColor?: string | null;
  subheadlineColor?: string | null;
  frameStyle?: Pick<FrameStyleSettings, "shadowDepth" | "cornerRadius">;
  showDevices?: boolean;
  showUploadedMockupAsIs?: boolean;
  categoryId?: CategoryId;
  templateId?: string;
  textPosition?: TextPosition | null;
  mockupPosition?: MockupPosition | null;
  selected?: boolean;
  interactive?: boolean;
  onSelect?: () => void;
  onTextPositionChange?: (position: TextPosition) => void;
  onTextSizeChange?: (textSize: number) => void;
  onMockupPositionChange?: (position: MockupPosition) => void;
  textBoxes?: SlideTextBox[];
  onTextBoxPositionChange?: (boxId: string, position: TextPosition) => void;
  onTextBoxTextSizeChange?: (boxId: string, textSize: number) => void;
  onTextBoxRemove?: (boxId: string) => void;
  slideIndex?: number;
  className?: string;
  /** Overrides default width class on the outer wrapper (e.g. picker previews). */
  frameWidthClass?: string;
  size?: "hero" | "thumb" | "card";
};

export const CompositionFrame = memo(function CompositionFrame({
  slides,
  focusIndex,
  headline,
  subheadline,
  fontId,
  layoutId,
  compositionSeed,
  useGradient,
  gradientCss,
  styleAccentColor,
  background,
  glowColor,
  backgroundTextureId = "none",
  stylePreset = "clean",
  layoutSpacing = 60,
  mockupSize = 50,
  fontWeight = "semibold",
  alignment = "left",
  textSize = 54,
  headlineColor = null,
  subheadlineColor = null,
  frameStyle,
  showDevices = true,
  showUploadedMockupAsIs = true,
  categoryId = "productivity",
  templateId = "minimal",
  textPosition = null,
  mockupPosition = null,
  selected = false,
  interactive = false,
  onSelect,
  onTextPositionChange,
  onTextSizeChange,
  onMockupPositionChange,
  textBoxes = [],
  onTextBoxPositionChange,
  onTextBoxTextSizeChange,
  onTextBoxRemove,
  slideIndex,
  className = "",
  frameWidthClass,
  size = "hero"
}: CompositionFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const plan = buildCompositionPlan(
    layoutId,
    slides.length || 7,
    focusIndex,
    `${compositionSeed}:${focusIndex}`
  );

  const mood = getMoodStyles(stylePreset);
  const isCard = size === "card";
  const innerPad = isCard ? CARD_CONTENT_PADDING_PX : framePaddingPx(layoutSpacing);
  const cardVariant = isCard ? getCardCompositionVariant(layoutId, plan) : null;
  const cardHeadlinePx = cardHeadlineSizePx(textSize, cardVariant?.headlineScaleMul ?? 1);
  const cardSubheadlinePx = cardSubheadlineSizePx(textSize, cardVariant?.subheadlineScaleMul ?? 1);
  const fontFamily = getFontFamily(fontId);
  const headlinePx = headlineSizePx(textSize, isCard);
  const subPx = subheadlineSizePx(textSize, isCard);
  const shadowDepth = frameStyle?.shadowDepth ?? 45;
  const cornerRadius = frameStyle?.cornerRadius ?? 16;
  const focusScreenshot = getSlideImage(slides, focusIndex);
  const themePack = getThemePack(categoryId, templateId);
  const kitVisual = isCard ? getTemplatePickerKitVisual(categoryId, templateId, focusIndex) : null;
  const hasScreenshot = Boolean(focusScreenshot);
  const useKitTemplateLook = isCard && !hasScreenshot && Boolean(kitVisual);
  const kitTextColors = useKitTemplateLook && kitVisual ? kitCanvasTextColors(kitVisual) : null;

  const resolvedHeadlineColor = useKitTemplateLook
    ? (headlineColor ?? kitTextColors!.headline)
    : resolveHeadlineColor(headlineColor, mood.headlineColor);
  const resolvedSubheadlineColor = useKitTemplateLook
    ? (subheadlineColor ?? kitTextColors!.subheadline)
    : resolveSubheadlineColor(subheadlineColor, mood.subheadlineColor);
  const scaledHeadlinePx = Math.round(headlinePx * themePack.headlineScale);
  const scaledSubPx = Math.round(subPx * themePack.subheadlineScale);
  const accentColor = styleAccentColor ?? themePack.accent;
  /** Screenshot without iPhone chrome — keeps card headline and template chrome. */
  const flatScreenshotInCard =
    !showDevices && showUploadedMockupAsIs && Boolean(focusScreenshot);
  const typo = plan.typography;
  const resolvedTextPosition = resolveTextPosition(
    textPosition,
    alignment,
    typo.x,
    typo.y,
    isCard
  );
  const textMaxWidthPercent = isCard
    ? (cardVariant?.textMaxWidthPercent ?? 100)
    : typo.variant === "split-left"
      ? 42
      : typo.maxWidth;
  const textEditable = interactive && selected && Boolean(onTextPositionChange);
  const themeOverlayImage = cardThemeOverlayImage(
    useGradient,
    gradientCss,
    background,
    themePack.backgroundImage,
    hasScreenshot
  );
  const themeOverlayOpacity = useKitTemplateLook
    ? 0
    : cardThemeOverlayOpacity(hasScreenshot, useGradient);
  const accentWashOpacity = useKitTemplateLook ? 0.06 : cardAccentWashOpacity(hasScreenshot);
  const mockupScale = mockupSizeScale(mockupSize);
  const cardDeviceHeightRatio = cardVariant
    ? getCardDeviceHeightRatio(cardVariant)
    : 0.72;
  const cardDeviceMaxWidthRatio = cardVariant
    ? getCardDeviceMaxWidthRatio(cardVariant, hasScreenshot)
    : 0.88;
  const resolvedMockupPosition = resolveMockupPosition(
    mockupPosition,
    cardDeviceHeightRatio
  );
  const mockupWidthPercent = Math.min(
    94,
    Math.round(cardDeviceMaxWidthRatio * 100 * mockupScale * (hasScreenshot ? 1 : 1.18))
  );
  const mockupEditable =
    interactive &&
    selected &&
    Boolean(onMockupPositionChange) &&
    hasScreenshot &&
    (showDevices || flatScreenshotInCard);
  const textBoxEditable =
    interactive && selected && Boolean(onTextBoxPositionChange);
  const backgroundTexture = getBackgroundTexture(backgroundTextureId);
  const frameShellStyle = {
    aspectRatio: "9 / 19.5" as const,
    padding: innerPad,
    borderRadius: cornerRadius,
    boxShadow: useKitTemplateLook
      ? `${frameShadowCss(shadowDepth)}, inset 0 1px 0 rgba(255,255,255,0.12), 0 28px 56px -18px rgba(0,0,0,0.45)`
      : `${frameShadowCss(shadowDepth)}, inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.04)`,
    backgroundColor: useKitTemplateLook ? "#0a0a0c" : useGradient ? "transparent" : background,
    backgroundImage: useKitTemplateLook ? "none" : useGradient ? gradientCss : "none"
  };

  const frameBorderClass = selected
    ? useKitTemplateLook
      ? "border-white/25"
      : "border-purple-400/45"
    : useKitTemplateLook
      ? "border-white/12"
      : "border-white/10";

  const backgroundTextureLayer =
    backgroundTextureId !== "none" ? (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: backgroundTexture.image,
          backgroundSize: backgroundTexture.size,
          opacity: backgroundTexture.opacity
        }}
        aria-hidden
      />
    ) : null;

  /** Stable card layout with non-overlapping zones (text, preview, metadata). */
  const slideMockup =
    isCard && hasScreenshot && (showDevices || flatScreenshotInCard) ? (
      <DraggableSlideMockup
        frameRef={frameRef}
        position={resolvedMockupPosition}
        widthPercent={mockupWidthPercent}
        deviceHeightRatio={cardDeviceHeightRatio}
        editable={mockupEditable}
        showDevices={showDevices}
        flatScreenshot={flatScreenshotInCard}
        imageDataUrl={focusScreenshot}
        onPositionChange={onMockupPositionChange ?? (() => {})}
      />
    ) : null;

  const slideTemplatePlaceholder =
    isCard && !hasScreenshot && showDevices ? (
      <CardTemplatePlaceholderMockup
        categoryId={categoryId}
        templateId={templateId}
        position={resolvedMockupPosition}
        widthPercent={mockupWidthPercent}
        mockupSize={mockupSize}
        screenshotUrl={focusScreenshot}
      />
    ) : null;

  const slideText = (
    <DraggableSlideText
      frameRef={frameRef}
      position={resolvedTextPosition}
      maxWidthPercent={textMaxWidthPercent}
      alignment={alignment}
      rotateDeg={isCard ? undefined : typo.rotate}
      editable={textEditable}
      headline={headline}
      subheadline={subheadline}
      headlinePx={isCard ? cardHeadlinePx : scaledHeadlinePx}
      subheadlinePx={isCard ? cardSubheadlinePx : scaledSubPx}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      headlineColor={resolvedHeadlineColor}
      subheadlineColor={resolvedSubheadlineColor}
      headlineTracking={mood.headlineTracking}
      lineClamp={isCard}
      textSize={textSize}
      onPositionChange={onTextPositionChange ?? (() => {})}
      onTextSizeChange={textEditable ? onTextSizeChange : undefined}
    />
  );

  const extraTextBoxes = textBoxes.map((box) => (
    <DraggableTextBox
      key={box.id}
      frameRef={frameRef}
      position={box.position}
      maxWidthPercent={78}
      alignment={box.alignment}
      editable={textBoxEditable}
      text={box.text}
      fontSizePx={
        isCard
          ? cardHeadlineSizePx(box.textSize, 1)
          : Math.round(headlineSizePx(box.textSize, false) * themePack.headlineScale)
      }
      fontFamily={fontFamily}
      fontWeight={box.fontWeight}
      color={resolveHeadlineColor(box.color, mood.headlineColor)}
      textSize={box.textSize}
      lineClamp={isCard}
      onPositionChange={(position) => onTextBoxPositionChange?.(box.id, position)}
      onTextSizeChange={
        textBoxEditable && onTextBoxTextSizeChange
          ? (size) => onTextBoxTextSizeChange(box.id, size)
          : undefined
      }
      onRemove={
        textBoxEditable && onTextBoxRemove ? () => onTextBoxRemove(box.id) : undefined
      }
    />
  ));

  const cardFrameStyle: CSSProperties = {
    ...frameShellStyle,
    ...(selected && useKitTemplateLook
      ? { boxShadow: `${frameShellStyle.boxShadow}, 0 0 0 2px color-mix(in srgb, ${accentColor} 55%, transparent)` }
      : {})
  };

  const cardFrame = (
    <div
      ref={frameRef}
      className={`composition-frame relative flex h-full flex-col overflow-hidden border ${frameBorderClass} ${className}`}
      style={cardFrameStyle}
    >
      {backgroundTextureLayer && !useKitTemplateLook ? backgroundTextureLayer : null}
      {useKitTemplateLook && kitVisual ? (
        <TemplateKitFrameBackground categoryId={categoryId} visual={kitVisual} />
      ) : themeOverlayOpacity > 0 ? (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            backgroundImage: themeOverlayImage,
            opacity: themeOverlayOpacity
          }}
          aria-hidden
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: accentColor, opacity: accentWashOpacity }}
        aria-hidden
      />
      {slideMockup}
      {slideTemplatePlaceholder}
      {slideText}
      {extraTextBoxes}
    </div>
  );

  const headlineBehind = typo.variant === "behind";
  const deviceBaseWidth = size === "hero" ? 150 : 72;
  const sortedDevices = [...plan.devices].sort((a, b) => a.zIndex - b.zIndex);

  const cinematicFrame = (
    <div
      ref={frameRef}
      className={`composition-frame relative overflow-hidden border ${frameBorderClass} ${className}`}
      style={frameShellStyle}
    >
      {backgroundTextureLayer}
      <div className="pointer-events-none absolute inset-0 composition-atmosphere" aria-hidden>
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${plan.glowX}%`,
            top: `${plan.glowY}%`,
            width: "55%",
            height: "45%",
            transform: "translate(-50%, -50%)",
            background: glowColor,
            opacity: mood.glowMultiplier
          }}
        />
        <div className="composition-vignette absolute inset-0" />
        <div className="composition-noise absolute inset-0 opacity-[0.12]" />
      </div>

      {headlineBehind ? slideText : null}

      {showDevices ? (
        <div className="absolute inset-0">
          {sortedDevices
            .filter((placement) => getSlideImage(slides, placement.slideIndex))
            .map((placement) => (
              <PremiumDevice
                key={`${placement.slideIndex}-${placement.zIndex}`}
                imageDataUrl={getSlideImage(slides, placement.slideIndex)}
                placement={placement}
                selected={placement.slideIndex === focusIndex}
                interactive={false}
                animated
                floatPhase={plan.floatPhase + placement.zIndex * 0.2}
                baseWidth={deviceBaseWidth}
              />
            ))}
        </div>
      ) : showUploadedMockupAsIs && focusScreenshot ? (
        <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center p-6">
          <IphoneDeviceChrome
            imageDataUrl={focusScreenshot}
            className="max-h-full max-w-full"
            imageClassName="block h-auto max-h-full w-auto max-w-full select-none"
          />
        </div>
      ) : null}

      {!headlineBehind ? slideText : null}
    </div>
  );

  const frame = isCard ? cardFrame : cinematicFrame;

  const widthClass =
    frameWidthClass ??
    (size === "card"
      ? "w-[264px] xl:w-[300px]"
      : size === "thumb"
        ? "max-w-[120px]"
        : "max-w-[320px] xl:max-w-[360px]");

  if (interactive && onSelect) {
    return (
      <div
        role="button"
        tabIndex={0}
        data-composition-card
        data-slide-index={slideIndex}
        data-selected={selected ? "true" : "false"}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        className={`block shrink-0 cursor-pointer overflow-hidden text-left outline-none transition-transform hover:scale-[1.02] hover:-translate-y-0.5 focus:outline-none focus-visible:outline-none ${widthClass}`}
      >
        {frame}
      </div>
    );
  }

  return <div className={`shrink-0 ${widthClass}`}>{frame}</div>;
});
