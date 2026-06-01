"use client";

import { TemplateKitPortraitSlide } from "@/components/create/template-kit-portrait-slide";
import type { CategoryId, ScreenshotSlide } from "@/components/create/types";

type TemplatePickerScreenshotPreviewProps = {
  categoryId: CategoryId;
  templateId: string;
  templateIndex: number;
  slides: ScreenshotSlide[];
};

export function TemplatePickerScreenshotPreview({
  categoryId,
  templateId,
  templateIndex,
  slides
}: TemplatePickerScreenshotPreviewProps) {
  const previewSlide = slides[0];

  return (
    <div className="category-template-picker-preview template-kit template-kit--picker-portrait flex w-full justify-center">
      <TemplateKitPortraitSlide
        categoryId={categoryId}
        templateId={templateId}
        templateIndex={templateIndex}
        headline={previewSlide.headline}
        subheadline={previewSlide.subheadline}
        screenshotUrl={previewSlide.imageDataUrl}
      />
    </div>
  );
}
