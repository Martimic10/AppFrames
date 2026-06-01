"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { DeviceScreenImage } from "@/components/create/device-screen-image";
import { kitScreenshotFit } from "@/components/create/kit-screenshot-fit";
import { SCREEN_ASPECT } from "@/components/create/iphone-device-metrics";

type KitPhoneScreenshotFillProps = {
  src: string;
  className?: string;
};

/** Uploaded screenshot inside the kit phone — full image, no overlays or backdrop. */
export const KitPhoneScreenshotFill = memo(function KitPhoneScreenshotFill({
  src,
  className = ""
}: KitPhoneScreenshotFillProps) {
  const [aspect, setAspect] = useState(SCREEN_ASPECT);

  const fit = useMemo(() => kitScreenshotFit(aspect), [aspect]);

  const onAspectRatio = useCallback((widthOverHeight: number) => {
    setAspect(widthOverHeight);
  }, []);

  const imgStyle = useMemo(
    (): React.CSSProperties => ({
      objectFit: fit.objectFit,
      objectPosition: fit.objectPosition
    }),
    [fit]
  );

  return (
    <div className={`template-kit-phone-screen-shot ${className}`.trim()}>
      <DeviceScreenImage
        src={src}
        onAspectRatio={onAspectRatio}
        className="template-kit-phone-screen-shot__img"
        style={imgStyle}
      />
    </div>
  );
});
