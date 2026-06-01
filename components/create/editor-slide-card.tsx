"use client";

import { memo } from "react";
import { getFontFamily } from "@/components/create/text-fonts";
import { IphoneDeviceChrome } from "@/components/create/iphone-device-chrome";
import type { TextFontId } from "@/components/create/types";

type EditorSlideCardProps = {
  headline: string;
  subheadline: string;
  fontId: TextFontId;
  imageDataUrl: string | null;
  useGradient: boolean;
  gradientCss: string;
  background: string;
  glowColor: string;
  selected?: boolean;
  onSelect: () => void;
};

export const EditorSlideCard = memo(function EditorSlideCard({
  headline,
  subheadline,
  fontId,
  imageDataUrl,
  useGradient,
  gradientCss,
  background,
  glowColor,
  selected = false,
  onSelect
}: EditorSlideCardProps) {
  const fontFamily = getFontFamily(fontId);

  return (
    <div
      role="button"
      tabIndex={0}
      data-composition-card
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`relative w-[220px] shrink-0 cursor-pointer rounded-2xl border p-3 text-left shadow-xl transition-[border-color,box-shadow] duration-200 xl:w-[260px] ${
        selected
          ? "border-purple-400/50 shadow-purple-500/15"
          : "border-white/10 shadow-black/40 hover:border-white/20"
      }`}
      style={{
        backgroundColor: useGradient ? "transparent" : background,
        backgroundImage: useGradient ? gradientCss : "none"
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        aria-hidden
      >
        <div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-3xl"
          style={{ background: glowColor }}
        />
      </div>

      <div className="relative">
        <p
          className="pointer-events-none text-sm font-bold leading-tight text-white"
          style={{ fontFamily }}
        >
          {headline}
        </p>
        <p
          className="pointer-events-none mt-1 text-[10px] leading-snug text-zinc-300"
          style={{ fontFamily }}
        >
          {subheadline}
        </p>
        {imageDataUrl ? (
          <div className="pointer-events-none mt-3">
            <IphoneDeviceChrome imageDataUrl={imageDataUrl} className="mx-auto w-[78%]" />
          </div>
        ) : (
          <p className="pointer-events-none mt-3 rounded-xl border border-dashed border-white/12 bg-black/25 px-2 py-6 text-center text-[9px] text-zinc-500">
            Upload screenshot
          </p>
        )}
      </div>
    </div>
  );
});
