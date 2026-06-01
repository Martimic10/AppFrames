"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GatedTemplateCard } from "@/components/pro/gated-template-card";
import { getTemplateThemeColors } from "@/components/create/template-theme-colors";
import type { CategoryConfig } from "@/components/create/types";

type TemplatePickerProps = {
  category: CategoryConfig;
  selectedTemplateId: string;
  isPro: boolean;
  onSelect: (templateId: string) => void;
  onLockedClick: () => void;
};

export function TemplatePicker({
  category,
  selectedTemplateId,
  isPro,
  onSelect,
  onLockedClick
}: TemplatePickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const useCarousel = category.templates.length > 3;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el || !useCarousel) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [category.id, category.templates.length, useCarousel]);

  useEffect(() => {
    if (!useCarousel) return;
    const el = scrollRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>(`[data-template-id="${selectedTemplateId}"]`);
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedTemplateId, category.id, useCarousel]);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] text-zinc-500">
          {category.templates.length} layouts · {category.title}
        </p>
        {useCarousel ? (
          <div className="flex shrink-0 gap-0.5">
            <button
              type="button"
              onClick={() => scrollBy(-108)}
              disabled={!canScrollLeft}
              className="rounded-md border border-white/10 p-1 text-zinc-500 transition hover:border-white/20 hover:text-zinc-300 disabled:cursor-default disabled:opacity-30"
              aria-label="Previous templates"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(108)}
              disabled={!canScrollRight}
              className="rounded-md border border-white/10 p-1 text-zinc-500 transition hover:border-white/20 hover:text-zinc-300 disabled:cursor-default disabled:opacity-30"
              aria-label="Next templates"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        className={
          useCarousel
            ? "flex gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            : "grid grid-cols-3 gap-2"
        }
      >
        {category.templates.map((template) => (
          <div
            key={template.id}
            data-template-id={template.id}
            className={useCarousel ? "w-[30%] min-w-[92px] max-w-[100px] shrink-0" : "min-w-0"}
          >
            <GatedTemplateCard
              template={template}
              theme={getTemplateThemeColors(category.id, template.id)}
              selected={selectedTemplateId === template.id}
              isPro={isPro}
              onSelect={() => onSelect(template.id)}
              onLockedClick={onLockedClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
