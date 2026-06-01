import { EXPORTS_USED_STORAGE_KEY, FREE_EXPORT_LIMIT } from "@/lib/pro/constants";

export function readExportsUsed(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(EXPORTS_USED_STORAGE_KEY);
  const parsed = Number.parseInt(raw ?? "0", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function writeExportsUsed(count: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXPORTS_USED_STORAGE_KEY, String(Math.max(0, count)));
}

export function getExportsRemaining(isPro: boolean): number {
  if (isPro) return Number.POSITIVE_INFINITY;
  return Math.max(0, FREE_EXPORT_LIMIT - readExportsUsed());
}

/** One export action (single or ZIP batch) consumes one credit. */
export function consumeExportCredit(isPro: boolean): number {
  if (isPro) return getExportsRemaining(true);

  const used = readExportsUsed();
  if (used >= FREE_EXPORT_LIMIT) {
    return 0;
  }
  writeExportsUsed(used + 1);
  return getExportsRemaining(false);
}

export function canExport(isPro: boolean): boolean {
  return isPro || readExportsUsed() < FREE_EXPORT_LIMIT;
}
