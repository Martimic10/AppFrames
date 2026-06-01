import { IphoneDeviceChrome } from "@/components/create/iphone-device-chrome";

export { APP_STORE_SCREEN_RATIO } from "@/components/create/iphone-device-metrics";

type DeviceScreenFrameProps = {
  imageDataUrl: string | null;
  className?: string;
};

export function DeviceScreenFrame({ imageDataUrl, className = "" }: DeviceScreenFrameProps) {
  return (
    <div className={`mx-auto mt-4 w-[86%] ${className}`}>
      <IphoneDeviceChrome imageDataUrl={imageDataUrl} />
    </div>
  );
}
