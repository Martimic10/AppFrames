"use client";

import { memo } from "react";
import { IphoneDeviceChrome } from "@/components/create/iphone-device-chrome";
import { DEVICE_CHASSIS_ASPECT } from "@/components/create/iphone-device-metrics";

type IphoneMockupProps = {
  imageDataUrl: string | null;
  className?: string;
  rotate?: number;
  fillHeight?: boolean;
  style?: React.CSSProperties;
};

export const IphoneMockup = memo(function IphoneMockup({
  imageDataUrl,
  className = "",
  rotate = 0,
  fillHeight = false,
  style
}: IphoneMockupProps) {
  const existingTransform = style?.transform ? `${style.transform} ` : "";
  const transform =
    `${existingTransform}${rotate ? `rotate(${rotate}deg)` : ""}`.trim() || undefined;

  const wrapClass = fillHeight
    ? `absolute inset-0 ${className}`
    : `relative mx-auto w-[78%] ${className}`;

  const wrapStyle: React.CSSProperties = fillHeight
    ? { ...style, ...(transform ? { transform } : {}) }
    : {
        ...style,
        ...(transform ? { transform } : {}),
        aspectRatio: `${DEVICE_CHASSIS_ASPECT}`
      };

  return (
    <div className={wrapClass} style={wrapStyle}>
      <IphoneDeviceChrome
        imageDataUrl={imageDataUrl}
        fill={fillHeight}
        className="h-full w-full"
      />
    </div>
  );
});
