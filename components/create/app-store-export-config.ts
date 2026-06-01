/** Shared export types and constants (safe for server + client imports). */

export type AppStoreExportSizeId = "iphone-6.7" | "iphone-6.9";

export type ExportQualityId = "standard" | "hd" | "4k";

export type ExportRenderOptions = {
  quality: ExportQualityId;
  watermark: boolean;
};

export const EXPORT_QUALITY_OPTIONS: {
  id: ExportQualityId;
  label: string;
  description: string;
  pro: boolean;
}[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Optimized for free tier — slightly reduced sharpness",
    pro: false
  },
  {
    id: "hd",
    label: "HD",
    description: "Full App Store resolution — crisp and store-ready",
    pro: true
  },
  {
    id: "4k",
    label: "4K",
    description: "Ultra-sharp export for marketing and large displays",
    pro: true
  }
];

export type AppStoreExportSize = {
  id: AppStoreExportSizeId;
  label: string;
  description: string;
  width: number;
  height: number;
};

export const APP_STORE_EXPORT_SIZES: AppStoreExportSize[] = [
  {
    id: "iphone-6.9",
    label: 'iPhone 6.9" (App Store primary)',
    description: "1320 × 2868 — iPhone 16 Pro Max and newer large displays",
    width: 1320,
    height: 2868
  },
  {
    id: "iphone-6.7",
    label: 'iPhone 6.7"',
    description: "1290 × 2796 — iPhone 14/15 Plus and Pro Max class",
    width: 1290,
    height: 2796
  }
];

export const DEFAULT_APP_STORE_EXPORT_SIZE_ID: AppStoreExportSizeId = "iphone-6.9";

export function getAppStoreExportSize(id: AppStoreExportSizeId): AppStoreExportSize {
  return APP_STORE_EXPORT_SIZES.find((s) => s.id === id) ?? APP_STORE_EXPORT_SIZES[0];
}

export function sanitizeExportBaseName(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return cleaned || "app-screenshots";
}

export function formatSlideExportFileName(baseName: string, slideIndex: number): string {
  const safe = sanitizeExportBaseName(baseName);
  const num = String(slideIndex + 1).padStart(2, "0");
  return `${safe}-${num}.png`;
}
