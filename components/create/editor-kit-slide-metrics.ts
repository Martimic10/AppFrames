import { effectiveMockupScaleMul } from "@/components/create/mockup-position";
import { SCREEN_ASPECT } from "@/components/create/iphone-device-metrics";

/** Picker artboard (export composition reference). */
export const PICKER_SLIDE_WIDTH_PX = 252;
export const PICKER_SLIDE_HEIGHT_PX = 512;

/** Editor canvas — same aspect as picker, scaled up for readability. */
export const EDITOR_SLIDE_UI_SCALE = 1.25;
export const EDITOR_SLIDE_WIDTH_PX = Math.round(
  PICKER_SLIDE_WIDTH_PX * EDITOR_SLIDE_UI_SCALE
);
export const EDITOR_SLIDE_HEIGHT_PX = Math.round(
  PICKER_SLIDE_HEIGHT_PX * EDITOR_SLIDE_UI_SCALE
);

export const EDITOR_SLIDE_ASPECT = `${EDITOR_SLIDE_WIDTH_PX} / ${EDITOR_SLIDE_HEIGHT_PX}` as const;

/** Rounded corners on editor + picker portrait cards. */
export const EDITOR_CARD_RADIUS_PX = 22;

/** Phone width on picker cards — 196px on a 252px-wide slide. */
export const EDITOR_PICKER_PHONE_WIDTH_PX = 196;

export const EDITOR_PICKER_PHONE_WIDTH_PERCENT =
  (EDITOR_PICKER_PHONE_WIDTH_PX / PICKER_SLIDE_WIDTH_PX) * 100;

/** Base mockup width at 100% scale — matches picker card phone (196px / 252px). */
export const EDITOR_BASE_MOCKUP_WIDTH_PERCENT = EDITOR_PICKER_PHONE_WIDTH_PERCENT;

/** Mockup slot uses App Store screenshot ratio (tall), not 1:2 wrap box. */
export const EDITOR_PHONE_WRAP_ASPECT = SCREEN_ASPECT;

/** Width % for kit editor mockup — global Style + per-slide scale. */
export function kitEditorMockupWidthPercent(
  globalMockupSize: number,
  slideScale?: number | null
): number {
  const combined = effectiveMockupScaleMul(globalMockupSize, slideScale);
  return Math.min(
    96,
    Math.max(28, EDITOR_BASE_MOCKUP_WIDTH_PERCENT * combined)
  );
}
