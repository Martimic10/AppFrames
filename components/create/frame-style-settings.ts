export type FrameStyleSettings = {
  shadowDepth: number;
  cornerRadius: number;
};

export const DEFAULT_FRAME_STYLE_SETTINGS: FrameStyleSettings = {
  shadowDepth: 45,
  cornerRadius: 16
};

/** Frame drop shadow from depth slider 0–100. */
export function frameShadowCss(depth: number): string {
  const t = depth / 100;
  const blur = Math.round(12 + t * 36);
  const spread = Math.round(-4 + t * 4);
  const opacity = 0.25 + t * 0.45;
  return `0 ${Math.round(8 + t * 16)}px ${blur}px ${spread}px rgba(0,0,0,${opacity.toFixed(2)})`;
}
