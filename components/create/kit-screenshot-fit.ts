import { SCREEN_ASPECT } from "@/components/create/iphone-device-metrics";

export type KitScreenshotFit = {
  objectFit: "cover" | "contain";
  objectPosition: string;
};

/**
 * Fit uploads inside the phone glass — portrait App Store shots fill edge-to-edge;
 * very wide captures letterbox with black only (no blur).
 */
export function kitScreenshotFit(widthOverHeight: number): KitScreenshotFit {
  if (!Number.isFinite(widthOverHeight) || widthOverHeight <= 0) {
    return { objectFit: "cover", objectPosition: "top center" };
  }

  if (widthOverHeight > SCREEN_ASPECT * 1.45) {
    return { objectFit: "contain", objectPosition: "center top" };
  }

  return {
    objectFit: "cover",
    objectPosition: widthOverHeight >= SCREEN_ASPECT * 0.88 ? "top center" : "center top"
  };
}
