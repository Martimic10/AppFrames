"use client";

import { useEffect, useState } from "react";
import { Crown, Download, Loader2, Lock, X } from "lucide-react";
import {
  APP_STORE_EXPORT_SIZES,
  DEFAULT_APP_STORE_EXPORT_SIZE_ID,
  EXPORT_QUALITY_OPTIONS,
  type AppStoreExportSizeId,
  type ExportQualityId
} from "@/components/create/app-store-export-config";
import { ProBadge } from "@/components/pro/pro-badge";
import { usePro } from "@/components/pro/pro-provider";
import { FREE_EXPORT_LIMIT } from "@/lib/pro/constants";

export type ExportDialogOptions = {
  fileName: string;
  sizeId: AppStoreExportSizeId;
  scope: "all" | "selected";
  quality: ExportQualityId;
};

type ExportDialogProps = {
  open: boolean;
  slideCount: number;
  selectedSlideIndex: number;
  defaultFileName: string;
  onClose: () => void;
  onExport: (options: ExportDialogOptions) => Promise<void>;
};

export function ExportDialog({
  open,
  slideCount,
  selectedSlideIndex,
  defaultFileName,
  onClose,
  onExport
}: ExportDialogProps) {
  const { isPro, exportsRemaining, openUpgrade } = usePro();
  const [fileName, setFileName] = useState(defaultFileName);
  const [sizeId, setSizeId] = useState<AppStoreExportSizeId>(DEFAULT_APP_STORE_EXPORT_SIZE_ID);
  const [quality, setQuality] = useState<ExportQualityId>("standard");
  const [scope, setScope] = useState<"all" | "selected">("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFileName(defaultFileName);
      setError(null);
      setScope(slideCount > 1 ? "all" : "selected");
      setQuality(isPro ? "hd" : "standard");
    }
  }, [open, defaultFileName, slideCount, isPro]);

  if (!open) return null;

  const selectedSize = APP_STORE_EXPORT_SIZES.find((s) => s.id === sizeId)!;
  const previewName =
    scope === "all" && slideCount > 1
      ? `${fileName.trim() || "app-screenshots"}-01.png … -${String(slideCount).padStart(2, "0")}.png (ZIP)`
      : `${fileName.trim() || "app-screenshots"}-${String(selectedSlideIndex + 1).padStart(2, "0")}.png`;

  const exportsLabel = isPro
    ? "Unlimited exports"
    : `${Math.min(exportsRemaining, FREE_EXPORT_LIMIT)} of ${FREE_EXPORT_LIMIT} free exports left`;

  const handleQualitySelect = (id: ExportQualityId, locked: boolean) => {
    if (locked) {
      openUpgrade("HD and 4K exports are included with AppFrames Pro.");
      return;
    }
    setQuality(id);
  };

  const handleExport = async () => {
    setBusy(true);
    setError(null);
    try {
      await onExport({ fileName, sizeId, scope, quality });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(92vh,720px)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="export-dialog-title" className="text-base font-semibold text-white">
              Export for App Store
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              PNG at Apple&apos;s required pixel dimensions — ready for App Store Connect.
            </p>
            <p
              className={`mt-2 inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-medium ${
                isPro
                  ? "border-purple-400/30 bg-purple-500/10 text-purple-200"
                  : "border-white/10 bg-zinc-900/80 text-zinc-400"
              }`}
            >
              {exportsLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-zinc-400">File name</span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="my-app-screenshots"
              disabled={busy}
              className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-sm text-white outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/20"
            />
            <span className="mt-1 block text-[10px] text-zinc-600">
              Preview: <span className="text-zinc-500">{previewName}</span>
            </span>
          </label>

          <fieldset className="space-y-2">
            <legend className="mb-1 text-[11px] font-medium text-zinc-400">Export quality</legend>
            {EXPORT_QUALITY_OPTIONS.map((option) => {
              const locked = option.pro && !isPro;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleQualitySelect(option.id, locked)}
                  className={`flex w-full cursor-pointer gap-2 rounded-lg border px-3 py-2.5 text-left transition ${
                    quality === option.id && !locked
                      ? "border-purple-400/40 bg-purple-500/10"
                      : locked
                        ? "border-purple-500/15 bg-zinc-900/30 hover:border-purple-400/30"
                        : "border-white/10 bg-zinc-900/40 hover:border-white/20"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      quality === option.id && !locked
                        ? "border-purple-400 bg-purple-500/30"
                        : "border-zinc-600"
                    }`}
                  >
                    {quality === option.id && !locked ? (
                      <span className="h-2 w-2 rounded-full bg-purple-300" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="block text-xs font-medium text-zinc-200">
                        {option.label}
                      </span>
                      {option.pro ? <ProBadge /> : null}
                      {locked ? <Lock className="h-3 w-3 text-purple-400/80" /> : null}
                    </span>
                    <span className="block text-[10px] text-zinc-500">{option.description}</span>
                  </span>
                </button>
              );
            })}
          </fieldset>

          {!isPro ? (
            <p className="rounded-lg border border-white/8 bg-zinc-900/50 px-3 py-2 text-[10px] leading-relaxed text-zinc-500">
              Free exports include a small <strong className="text-zinc-400">AppFrames</strong>{" "}
              watermark. Upgrade to remove it and unlock HD quality.
            </p>
          ) : null}

          <fieldset className="space-y-2">
            <legend className="mb-1 text-[11px] font-medium text-zinc-400">Device size</legend>
            {APP_STORE_EXPORT_SIZES.map((size) => (
              <label
                key={size.id}
                className={`flex cursor-pointer gap-2 rounded-lg border px-3 py-2.5 transition ${
                  sizeId === size.id
                    ? "border-purple-400/40 bg-purple-500/10"
                    : "border-white/10 bg-zinc-900/40 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name="export-size"
                  value={size.id}
                  checked={sizeId === size.id}
                  onChange={() => setSizeId(size.id)}
                  disabled={busy}
                  className="mt-0.5 accent-purple-400"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-zinc-200">{size.label}</span>
                  <span className="block text-[10px] text-zinc-500">{size.description}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {slideCount > 1 ? (
            <fieldset className="space-y-2">
              <legend className="mb-1 text-[11px] font-medium text-zinc-400">Slides</legend>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                  scope === "all"
                    ? "border-purple-400/40 bg-purple-500/10 text-purple-100"
                    : "border-white/10 text-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  name="export-scope"
                  checked={scope === "all"}
                  onChange={() => setScope("all")}
                  disabled={busy}
                  className="accent-purple-400"
                />
                All {slideCount} slides (ZIP download)
              </label>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                  scope === "selected"
                    ? "border-purple-400/40 bg-purple-500/10 text-purple-100"
                    : "border-white/10 text-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  name="export-scope"
                  checked={scope === "selected"}
                  onChange={() => setScope("selected")}
                  disabled={busy}
                  className="accent-purple-400"
                />
                Current slide only (slide {selectedSlideIndex + 1})
              </label>
            </fieldset>
          ) : null}

          <p className="rounded-lg border border-white/8 bg-zinc-900/50 px-3 py-2 text-[10px] leading-relaxed text-zinc-500">
            Output:{" "}
            <strong className="font-medium text-zinc-400">
              {selectedSize.width} × {selectedSize.height}px
            </strong>{" "}
            PNG. Slides are numbered in order (01, 02, …) for easy upload to App Store Connect.
          </p>

          {error ? (
            <p className="text-xs text-amber-400/90" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={busy || slideCount === 0}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-purple-400/35 bg-purple-500/20 px-4 py-2.5 text-sm font-semibold text-purple-100 hover:bg-purple-500/30 disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download
              </>
            )}
          </button>
        </div>

        {!isPro ? (
          <button
            type="button"
            onClick={() => openUpgrade("Upgrade for unlimited exports and HD quality.")}
            className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-purple-300 hover:text-purple-200"
          >
            <Crown className="h-3.5 w-3.5" />
            Upgrade to Pro
          </button>
        ) : null}
      </div>
    </div>
  );
}
