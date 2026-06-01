"use client";

import { Lock } from "lucide-react";
import type { TemplateThemeColors } from "@/components/create/template-theme-colors";
import type { CategoryTemplate } from "@/components/create/types";
import { ProBadge } from "@/components/pro/pro-badge";
import { isProTemplate } from "@/lib/pro/template-access";

type GatedTemplateCardProps = {
  template: CategoryTemplate;
  theme: TemplateThemeColors;
  selected: boolean;
  isPro: boolean;
  onSelect: () => void;
  onLockedClick: () => void;
};

function displayLines(template: CategoryTemplate): {
  title: string;
  subtitle: string | null;
} {
  const hasStyleName = Boolean(template.styleName && template.styleName !== template.name);
  if (hasStyleName) {
    return { title: template.styleName!, subtitle: template.name };
  }
  if (template.popular) {
    return { title: template.name, subtitle: "Popular" };
  }
  return { title: template.name, subtitle: null };
}

export function GatedTemplateCard({
  template,
  theme,
  selected,
  isPro,
  onSelect,
  onLockedClick
}: GatedTemplateCardProps) {
  const locked = isProTemplate(template) && !isPro;
  const pro = isProTemplate(template);
  const { title, subtitle } = displayLines(template);

  return (
    <button
      type="button"
      onClick={() => (locked ? onLockedClick() : onSelect())}
      style={
        selected && !locked
          ? {
              borderColor: `${theme.accent}99`,
              backgroundColor: theme.accentSoft,
              boxShadow: `0 0 0 1px ${theme.accent}55 inset`
            }
          : undefined
      }
      className={`flex h-full w-full min-w-0 flex-col rounded-lg border px-2 py-2 text-left transition-colors ${
        selected && !locked
          ? ""
          : locked
            ? "border-white/8 bg-zinc-900/40 hover:border-white/15"
            : "border-white/10 bg-zinc-900/55 hover:border-white/18 hover:bg-zinc-900/70"
      }`}
    >
      <div
        className="mb-1.5 h-8 w-full shrink-0 overflow-hidden rounded-md border border-white/10"
        style={{ backgroundImage: theme.previewImage }}
        aria-hidden
      />
      <div className="flex min-w-0 items-start justify-between gap-1">
        <span
          className={`truncate text-[10px] font-medium leading-tight ${
            locked ? "text-zinc-500" : selected ? "text-zinc-100" : "text-zinc-300"
          }`}
          title={title}
        >
          {title}
        </span>
        {pro ? <ProBadge className="mt-px shrink-0" /> : null}
      </div>

      {subtitle ? (
        <span
          className={`mt-0.5 truncate text-[9px] leading-tight ${
            subtitle === "Popular" ? "font-medium text-emerald-500/85" : "text-zinc-500"
          }`}
        >
          {subtitle}
        </span>
      ) : (
        <span className="mt-0.5 block h-[13px]" aria-hidden />
      )}

      {locked ? (
        <span className="mt-1 inline-flex items-center gap-0.5 text-[9px] text-zinc-500">
          <Lock className="h-2.5 w-2.5 shrink-0" />
          Pro
        </span>
      ) : null}
    </button>
  );
}
