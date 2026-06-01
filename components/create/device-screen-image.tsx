"use client";

import { memo, useCallback } from "react";

type DeviceScreenImageProps = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  onAspectRatio?: (widthOverHeight: number) => void;
};

/**
 * Intrinsic width sizing — parent height follows the screenshot pixels (no aspect-ratio gap).
 */
export const DeviceScreenImage = memo(function DeviceScreenImage({
  src,
  className = "block h-auto w-full select-none",
  style,
  onAspectRatio
}: DeviceScreenImageProps) {
  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      if (img.naturalWidth <= 0 || img.naturalHeight <= 0) return;
      onAspectRatio?.(img.naturalWidth / img.naturalHeight);
    },
    [onAspectRatio]
  );

  return (
    <img
      src={src}
      data-export-screenshot
      alt=""
      draggable={false}
      loading="eager"
      decoding="async"
      onLoad={handleLoad}
      className={`pointer-events-none ${className}`}
      style={style}
    />
  );
});
