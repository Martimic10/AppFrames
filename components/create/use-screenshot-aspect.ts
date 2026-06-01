"use client";

import { useEffect, useState } from "react";
import { SCREEN_ASPECT } from "@/components/create/iphone-device-metrics";

/** Resolve width÷height from a screenshot data URL (or keep App Store default). */
export function useScreenshotAspect(imageDataUrl: string | null): number {
  const [aspect, setAspect] = useState(SCREEN_ASPECT);

  useEffect(() => {
    if (!imageDataUrl) {
      setAspect(SCREEN_ASPECT);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled || img.naturalWidth <= 0 || img.naturalHeight <= 0) return;
      setAspect(img.naturalWidth / img.naturalHeight);
    };
    img.src = imageDataUrl;

    return () => {
      cancelled = true;
    };
  }, [imageDataUrl]);

  return aspect;
}
