"use client";

import { memo } from "react";
import { DeviceScreenImage } from "@/components/create/device-screen-image";
import { DEVICE_CHASSIS_ASPECT } from "@/components/create/iphone-device-metrics";

type IphoneDeviceChromeProps = {
  imageDataUrl: string | null;
  className?: string;
  imageClassName?: string;
  onImageAspect?: (widthOverHeight: number) => void;
};

/** Screenshot only — no device bezel or frame border. */
export const IphoneDeviceChrome = memo(function IphoneDeviceChrome({
  imageDataUrl,
  className = "",
  imageClassName = "block h-auto w-full select-none",
  onImageAspect
}: IphoneDeviceChromeProps) {
  if (!imageDataUrl) {
    return (
      <div
        className={`relative w-full ${className}`}
        style={{ aspectRatio: `${DEVICE_CHASSIS_ASPECT}` }}
        data-device-chassis
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-white/15 bg-zinc-950/50 p-4 text-center">
          <span className="text-[10px] font-medium text-zinc-400">Upload screenshot</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} data-device-chassis>
      <DeviceScreenImage
        src={imageDataUrl}
        className={imageClassName}
        onAspectRatio={onImageAspect}
      />
    </div>
  );
});
