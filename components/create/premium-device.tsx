"use client";

import { motion } from "framer-motion";
import { IphoneDeviceChrome } from "@/components/create/iphone-device-chrome";
import type { DevicePlacement } from "@/components/create/composition-engine";

type PremiumDeviceProps = {
  imageDataUrl: string | null;
  placement: DevicePlacement;
  selected?: boolean;
  interactive?: boolean;
  onSelect?: () => void;
  floatPhase?: number;
  baseWidth?: number;
  animated?: boolean;
};

export function PremiumDevice({
  imageDataUrl,
  placement,
  selected = false,
  interactive = false,
  onSelect,
  floatPhase = 0,
  baseWidth = 140,
  animated = false
}: PremiumDeviceProps) {
  const width = baseWidth * placement.scale;
  const {
    x,
    y,
    rotate,
    zIndex,
    perspective = 1000,
    rotateY = 0,
    opacity = 1,
    partialCrop
  } = placement;

  const cropStyle: React.CSSProperties = {};
  if (partialCrop === "left") cropStyle.clipPath = "inset(0 18% 0 0)";
  if (partialCrop === "right") cropStyle.clipPath = "inset(0 0 0 18%)";
  if (partialCrop === "top") cropStyle.clipPath = "inset(12% 0 0 0)";
  if (partialCrop === "bottom") cropStyle.clipPath = "inset(0 0 12% 0)";

  const floatY = Math.sin(floatPhase + zIndex * 0.4) * 6;

  const style = {
    left: `${x}%`,
    top: `${y}%`,
    zIndex,
    opacity,
    width,
    transform: `translate(-50%, -50%) rotate(${rotate}deg) rotateY(${rotateY}deg)`,
    perspective: `${perspective}px`,
    ...cropStyle
  } as const;

  const inner = (
    <div
      className={
        selected ? "rounded-[1.65rem] ring-2 ring-purple-400/60 ring-offset-2 ring-offset-transparent" : ""
      }
    >
      <IphoneDeviceChrome imageDataUrl={imageDataUrl} />
    </div>
  );

  if (interactive) {
    return (
      <motion.button
        type="button"
        data-slide-card
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onSelect?.();
        }}
        className="absolute origin-center border-0 bg-transparent p-0"
        style={style}
        whileHover={{ scale: 1.04 }}
      >
        {inner}
      </motion.button>
    );
  }

  if (animated) {
    return (
      <motion.div
        className="absolute origin-center"
        style={style}
        animate={{ y: [floatY, floatY - 5, floatY] }}
        transition={{
          duration: 4 + zIndex * 0.3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <div className="absolute origin-center" style={style}>
      {inner}
    </div>
  );
}
