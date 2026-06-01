"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Crown } from "lucide-react";
import { ProBadge } from "@/components/pro/pro-badge";
import { usePro } from "@/components/pro/pro-provider";
import { FREE_EXPORT_LIMIT } from "@/lib/pro/constants";

type CreateTopBarProps = {
  onOpenExport?: () => void;
  exportDisabled?: boolean;
};

export function CreateTopBar({ onOpenExport, exportDisabled = false }: CreateTopBarProps) {
  const { isPro, exportsRemaining, openUpgrade } = usePro();

  const exportHint = isPro
    ? null
    : `${Math.min(exportsRemaining, FREE_EXPORT_LIMIT)} free export${exportsRemaining === 1 ? "" : "s"} left`;

  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b border-white/10 bg-zinc-900/70 px-3 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 shrink items-center gap-1.5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-1.5 text-lg font-semibold tracking-tight text-white sm:text-xl"
        >
          <Image
            src="/AppFrames-logo.PNG"
            alt="AppFrames logo"
            width={44}
            height={44}
            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
          />
          <span className="truncate">AppFrames</span>
        </Link>
        {isPro ? (
          <ProBadge size="md" className="hidden shrink-0 sm:inline-flex" aria-hidden />
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {exportHint ? (
          <span className="hidden text-[10px] text-zinc-500 md:inline">{exportHint}</span>
        ) : null}
        <button
          type="button"
          onClick={onOpenExport}
          disabled={exportDisabled}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900/80 px-2.5 py-2 text-xs font-semibold text-white transition-all hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5 sm:text-sm"
        >
          Export
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        {!isPro ? (
          <button
            type="button"
            onClick={() => openUpgrade()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-2.5 py-2 text-xs font-semibold text-purple-200 transition-all hover:border-purple-400/50 hover:bg-purple-500/15 sm:px-3.5 sm:text-sm"
          >
            <Crown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Upgrade</span>
          </button>
        ) : null}
      </div>
    </header>
  );
}
