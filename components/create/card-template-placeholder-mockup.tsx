"use client";

import { KitPhoneMockup } from "@/components/landing/app-store-template-kit";
import { DEVICE_CHASSIS_ASPECT } from "@/components/create/iphone-device-metrics";
import {
  mockupPositionTransform,
  type MockupPosition
} from "@/components/create/mockup-position";
import { getTemplatePickerKitVisual } from "@/components/create/template-kit-picker-variants";
import { mockupSizeScale } from "@/components/create/template-settings";
import type { CategoryId } from "@/components/create/types";
import "@/components/landing/app-store-template-kit.css";

type CardTemplatePlaceholderMockupProps = {
  categoryId: CategoryId;
  templateId: string;
  position: MockupPosition;
  widthPercent: number;
  mockupSize?: number;
  screenshotUrl?: string | null;
};

/** Features-kit phone preview on canvas cards before the user uploads screenshots. */
export function CardTemplatePlaceholderMockup({
  categoryId,
  templateId,
  position,
  widthPercent,
  mockupSize = 50,
  screenshotUrl
}: CardTemplatePlaceholderMockupProps) {
  const visual = getTemplatePickerKitVisual(categoryId, templateId, 0);
  const isLight = visual.theme === "light";
  const accentShadow = `color-mix(in srgb, ${visual.accentColor} 42%, transparent)`;
  const rotate = position.rotate ?? 0;
  const scale = mockupSizeScale(mockupSize);

  return (
    <div
      className="template-kit template-kit-canvas-phone pointer-events-none absolute z-[11]"
      data-template-placeholder-mockup
      data-kit-theme={isLight ? "light" : "dark"}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${Math.min(92, Math.max(32, widthPercent))}%`,
        aspectRatio: `${DEVICE_CHASSIS_ASPECT}`,
        transform: mockupPositionTransform(scale, rotate)
      }}
    >
      <KitPhoneMockup
        kind={categoryId}
        light={isLight}
        rotate={visual.phoneRotate}
        accentShadow={accentShadow}
        screenshotUrl={screenshotUrl}
        templateId={templateId}
        realistic
      />
    </div>
  );
}
