"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Sparkles } from "lucide-react";
import { getCategoryById } from "@/components/create/category-data";
import { getTemplateSlides } from "@/components/create/template-slides";
import { getTemplateThemeColors } from "@/components/create/template-theme-colors";
import { getTemplateKitCategory, kitFontClass } from "@/components/create/template-kit-config";
import { TemplatePickerScreenshotPreview } from "@/components/create/template-picker-screenshot-preview";
import { getFirstFreeTemplateId, isProTemplate } from "@/lib/pro/template-access";
import { usePro } from "@/components/pro/pro-provider";
import { ProBadge } from "@/components/pro/pro-badge";
import type { CategoryId, ScreenshotSlide } from "@/components/create/types";
import "@/components/landing/app-store-template-kit.css";

type CategoryTemplatePickerProps = {
  categoryId: CategoryId;
  slides: ScreenshotSlide[];
  selectedTemplateId: string;
  onBack: () => void;
  onPreview: (templateId: string) => void;
  onSelect: (templateId: string) => void;
  onConfirm: (templateId: string) => void;
};

function TemplatePreviewCard({
  categoryId,
  templateId,
  templateIndex,
  templateName,
  styleName,
  tier,
  slides,
  selected,
  locked,
  onSelect,
  onLockedClick,
  onHover
}: {
  categoryId: CategoryId;
  templateId: string;
  templateIndex: number;
  templateName: string;
  styleName?: string;
  tier: "free" | "pro";
  slides: ScreenshotSlide[];
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
  onLockedClick: () => void;
  onHover: () => void;
}) {
  const theme = getTemplateThemeColors(categoryId, templateId);

  return (
    <button
      type="button"
      onClick={() => (locked ? onLockedClick() : onSelect())}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={`group flex w-full max-w-[292px] flex-col overflow-hidden rounded-[24px] border text-left transition-all duration-300 ${
        selected
          ? "border-white/30 shadow-[0_0_0_3px_color-mix(in_srgb,var(--tpl-card-accent)_55%,transparent),0_24px_48px_-16px_rgba(0,0,0,0.65)]"
          : "border-white/10 hover:border-white/22 hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.55)]"
      }`}
      style={{
        ["--tpl-card-accent" as string]: theme.accent,
        background: "rgba(0,0,0,0.4)"
      }}
    >
      <div className="flex items-start justify-between gap-2 border-b border-white/8 px-3.5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{styleName ?? templateName}</p>
          {styleName && styleName !== templateName ? (
            <p className="truncate text-[10px] text-zinc-500">{templateName}</p>
          ) : null}
        </div>
        {tier === "pro" ? <ProBadge className="shrink-0" /> : null}
      </div>

      <div className="bg-black/20 px-1 py-2">
        <TemplatePickerScreenshotPreview
          categoryId={categoryId}
          templateId={templateId}
          templateIndex={templateIndex}
          slides={slides}
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/8 px-3.5 py-2.5">
        {locked ? (
          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
            <Lock className="h-3 w-3" />
            Pro template
          </span>
        ) : selected ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
            <Check className="h-3 w-3" />
            Selected
          </span>
        ) : (
          <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">
            Click to select
          </span>
        )}
        <span className="text-[10px] font-medium" style={{ color: theme.accent }}>
          {tier === "free" ? "Free" : "Pro"}
        </span>
      </div>
    </button>
  );
}

export function CategoryTemplatePicker({
  categoryId,
  slides,
  selectedTemplateId,
  onBack,
  onPreview,
  onSelect,
  onConfirm
}: CategoryTemplatePickerProps) {
  const { isPro, openUpgrade } = usePro();
  const category = getCategoryById(categoryId);
  const kit = getTemplateKitCategory(categoryId);

  useEffect(() => {
    const initialId = selectedTemplateId || getFirstFreeTemplateId(categoryId);
    onPreview(initialId);
    if (!selectedTemplateId) {
      onSelect(initialId);
    }
  }, [categoryId, onPreview, onSelect, selectedTemplateId]);

  const handleSelect = (templateId: string) => {
    const template = category.templates.find((t) => t.id === templateId);
    if (!template) return;
    if (isProTemplate(template) && !isPro) {
      openUpgrade("Unlock premium templates");
      return;
    }
    onSelect(templateId);
    onPreview(templateId);
  };

  const handleConfirm = () => {
    const id = selectedTemplateId;
    const template = category.templates.find((t) => t.id === id);
    if (!template) return;
    if (isProTemplate(template) && !isPro) {
      openUpgrade("Unlock premium templates");
      return;
    }
    onConfirm(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="template-kit relative mx-auto flex w-full max-w-6xl flex-col rounded-3xl border border-white/10 bg-zinc-950/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-8"
    >
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <filter id="template-kit-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={4}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/80 text-zinc-400 transition hover:border-white/20 hover:text-white"
          aria-label="Back to categories"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="template-kit-tag text-[10px] text-zinc-500">{kit.tag}</p>
          <h2
            className={`mt-1 text-pretty text-xl font-semibold tracking-tight text-white sm:text-2xl ${kitFontClass(kit.font)} ${
              kit.font === "condensed" ? "normal-case" : ""
            }`}
          >
            {category.title} templates
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            Pick a style — your screenshots update live on the canvas behind you.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 place-items-center gap-6 px-1 sm:mt-10 sm:grid-cols-3 sm:gap-8 sm:px-2">
        {category.templates.map((template, templateIndex) => {
          const templateSlides = getTemplateSlides(categoryId, template.id);
          const mergedSlides = templateSlides.map((slide, i) => ({
            ...slide,
            imageDataUrl: slides[i]?.imageDataUrl ?? slide.imageDataUrl,
            graphicDataUrl: slides[i]?.graphicDataUrl ?? slide.graphicDataUrl
          }));

          return (
            <TemplatePreviewCard
              key={template.id}
              categoryId={categoryId}
              templateId={template.id}
              templateIndex={templateIndex}
              templateName={template.name}
              styleName={template.styleName}
              tier={template.tier}
              slides={mergedSlides}
              selected={selectedTemplateId === template.id}
              locked={isProTemplate(template) && !isPro}
              onSelect={() => handleSelect(template.id)}
              onLockedClick={() => openUpgrade("Unlock premium templates")}
              onHover={() => onPreview(template.id)}
            />
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400/80" />
          Headlines and layouts match App Store export sizes
        </p>
        <button
          type="button"
          onClick={handleConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
        >
          Use this template
          <Check className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
