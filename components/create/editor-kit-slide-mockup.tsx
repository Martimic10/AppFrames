"use client";

import { DraggableSlideMockup } from "@/components/create/draggable-slide-mockup";
import {
  EDITOR_PHONE_WRAP_ASPECT,
  kitEditorMockupWidthPercent
} from "@/components/create/editor-kit-slide-metrics";
import { SCREEN_ASPECT } from "@/components/create/iphone-device-metrics";
import {
  resolveKitPortraitMockupPosition,
  type MockupPosition
} from "@/components/create/mockup-position";
import { getTemplatePickerKitVisual } from "@/components/create/template-kit-picker-variants";
import { PortraitPhoneSlot } from "@/components/landing/app-store-template-kit";
import type { CategoryId, ScreenshotSlide } from "@/components/create/types";
import "@/components/landing/app-store-template-kit.css";

/** Vertical anchor for phone zone (picker portrait layout). */
const KIT_DEVICE_HEIGHT_RATIO = 0.68;

type EditorKitSlideMockupProps = {
  frameRef: React.RefObject<HTMLDivElement | null>;
  categoryId: CategoryId;
  templateId: string;
  templateIndex: number;
  slide: ScreenshotSlide;
  showDeviceFrame: boolean;
  showUploadedMockupAsIs: boolean;
  mockupSize: number;
  selected: boolean;
  onMockupPositionChange: (position: MockupPosition) => void;
};

/** Draggable phone — same PortraitPhoneSlot as template picker. */
export function EditorKitSlideMockup({
  frameRef,
  categoryId,
  templateId,
  templateIndex,
  slide,
  showDeviceFrame,
  showUploadedMockupAsIs,
  mockupSize,
  selected,
  onMockupPositionChange
}: EditorKitSlideMockupProps) {
  const visual = getTemplatePickerKitVisual(categoryId, templateId, templateIndex);
  const hasScreenshot = Boolean(slide.imageDataUrl);
  const flatScreenshot = hasScreenshot && !showDeviceFrame && showUploadedMockupAsIs;
  const showMockup = showDeviceFrame || flatScreenshot;

  if (!showMockup) {
    return null;
  }

  const position = resolveKitPortraitMockupPosition(
    slide.mockupPosition,
    KIT_DEVICE_HEIGHT_RATIO,
    visual.phoneRotate
  );
  const editable = selected && (showDeviceFrame || flatScreenshot);
  const widthPercent = kitEditorMockupWidthPercent(
    mockupSize,
    slide.mockupPosition?.scale ?? position.scale
  );
  const isLight = visual.theme === "light";
  const accentShadow = `color-mix(in srgb, ${visual.accentColor} 42%, transparent)`;

  return (
    <div className="editor-kit-mockup-layer pointer-events-none absolute inset-0 z-[11]">
      <DraggableSlideMockup
        frameRef={frameRef}
        position={position}
        widthPercent={widthPercent}
        widthPercentForPosition={(pos) =>
          kitEditorMockupWidthPercent(mockupSize, pos.scale ?? position.scale)
        }
        deviceHeightRatio={KIT_DEVICE_HEIGHT_RATIO}
        hostAspectRatio={flatScreenshot ? SCREEN_ASPECT : EDITOR_PHONE_WRAP_ASPECT}
        scaleMul={1}
        editable={editable}
        showDevices={showDeviceFrame}
        flatScreenshot={flatScreenshot}
        imageDataUrl={slide.imageDataUrl}
        onPositionChange={onMockupPositionChange}
      >
        <div
          className={`template-kit template-kit-canvas-phone template-kit-canvas-phone--editor pointer-events-none h-full w-full ${
            hasScreenshot
              ? "template-kit-canvas-phone--has-upload"
              : "template-kit-canvas-phone--placeholder"
          }`}
          data-kit-theme={isLight ? "light" : "dark"}
        >
          <PortraitPhoneSlot
            kind={categoryId}
            light={isLight}
            rotate={visual.phoneRotate}
            accentShadow={accentShadow}
            frameColor={visual.accentColor}
            screenshotUrl={slide.imageDataUrl}
            templateId={templateId}
            showDeviceFrame={showDeviceFrame}
            showUploadedMockupAsIs={showUploadedMockupAsIs}
            compact
            editorSlot
          />
        </div>
      </DraggableSlideMockup>
    </div>
  );
}
