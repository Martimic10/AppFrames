"use client";

import type { CSSProperties } from "react";
import { TemplateKitCategoryCard } from "@/components/landing/app-store-template-kit";
import { getTemplatePickerKitVisual } from "@/components/create/template-kit-picker-variants";
import type { CategoryId } from "@/components/create/types";
import "@/components/landing/app-store-template-kit.css";

type TemplateKitPortraitSlideProps = {
  categoryId: CategoryId;
  templateId: string;
  templateIndex: number;
  headline: string;
  subheadline: string;
  screenshotUrl?: string | null;
  showDeviceFrame?: boolean;
  showUploadedMockupAsIs?: boolean;
  showBadge?: boolean;
  /** Tighter phone fit for /create editor slide frames */
  editorCanvas?: boolean;
  /** Hide built-in headline block (editor uses draggable overlay). */
  hidePortraitCopy?: boolean;
  hidePortraitPhone?: boolean;
  /** Style-tab backdrop is rendered on the slide frame; kit only draws template accents. */
  editorExternalBackground?: boolean;
  editorBackgroundStyle?: CSSProperties;
  className?: string;
};

/** Shared portrait kit slide — used in template picker cards and editor canvas frames. */
export function TemplateKitPortraitSlide({
  categoryId,
  templateId,
  templateIndex,
  headline,
  subheadline,
  screenshotUrl,
  showDeviceFrame = true,
  showUploadedMockupAsIs = true,
  showBadge = false,
  editorCanvas = false,
  hidePortraitCopy = false,
  hidePortraitPhone = false,
  editorExternalBackground = false,
  editorBackgroundStyle,
  className = ""
}: TemplateKitPortraitSlideProps) {
  const visual = getTemplatePickerKitVisual(categoryId, templateId, templateIndex);

  return (
    <div
      className={`template-kit template-kit-portrait-slide ${
        editorCanvas ? "template-kit--picker-portrait template-kit--editor-fill" : ""
      } ${editorCanvas && editorExternalBackground ? "template-kit--editor-external-bg" : ""} ${
        hidePortraitCopy ? "template-kit--editor-hide-copy" : ""
      } ${className}`.trim()}
    >
      {editorCanvas ? null : (
        <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
          <filter id="template-kit-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves={4}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
      )}
      <TemplateKitCategoryCard
        categoryId={categoryId}
        templateId={templateId}
        headline={headline}
        subheadline={subheadline}
        screenshotUrl={screenshotUrl}
        showDeviceFrame={showDeviceFrame}
        showUploadedMockupAsIs={showUploadedMockupAsIs}
        layout="portrait"
        editorCanvas={editorCanvas}
        hidePortraitCopy={hidePortraitCopy}
        hidePortraitPhone={hidePortraitPhone}
        interactive={false}
        hideCopy
        hideCta
        pickerVisual={{
          theme: visual.theme,
          font: visual.font,
          accentColor: visual.accentColor,
          accentSoft: visual.accentSoft,
          backgroundImage: visual.backgroundImage,
          useCategoryBackground: visual.useCategoryBackground,
          phoneRotate: visual.phoneRotate,
          phoneBleed: visual.phoneBleed,
          badge: editorCanvas || !showBadge ? undefined : visual.badge,
          shimmerWord: visual.shimmerWord
        }}
        editorExternalBackground={editorExternalBackground}
        editorBackgroundStyle={editorBackgroundStyle}
      />
    </div>
  );
}
