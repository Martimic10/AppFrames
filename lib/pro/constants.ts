import type { CompositionLayoutId } from "@/components/create/composition-engine";

export const FREE_EXPORT_LIMIT = 3;
export const PRO_LIFETIME_PRICE_USD = 29;
export const PRO_LIFETIME_PRICE_CENTS = 2900;
/** Price after launch slots are claimed. */
export const PRO_LIFETIME_REGULAR_PRICE_USD = 59;

/** Launch pricing scarcity cap shown on the landing page. */
export const LIFETIME_LAUNCH_TOTAL = 200;
export const LIFETIME_LAUNCH_SEGMENTS = 20;

export const PRO_COOKIE_NAME = "appframes_pro_license";
export const EXPORTS_USED_STORAGE_KEY = "appframes_exports_used";

/** Layouts that require Pro */
export const PRO_COMPOSITION_LAYOUTS: CompositionLayoutId[] = [
  "collage",
  "angled-perspective",
  "split"
];

export const FREE_PLAN_FEATURES = [
  "3 exports",
  "Basic templates",
  "Watermarked exports",
  "Standard quality"
] as const;

export const PRO_PLAN_FEATURES = [
  "Unlimited exports",
  "Premium templates",
  "HD exports",
  "No watermark",
  "Future updates"
] as const;

export function isProCompositionLayout(layoutId: CompositionLayoutId): boolean {
  return PRO_COMPOSITION_LAYOUTS.includes(layoutId);
}
