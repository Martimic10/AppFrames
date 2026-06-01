import type { GradientStyle } from "@/components/create/style-colors";

function parseRgb(color: string): [number, number, number] | null {
  const value = color.trim();
  if (!value) return null;

  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return [
        Number.parseInt(hex[0] + hex[0], 16),
        Number.parseInt(hex[1] + hex[1], 16),
        Number.parseInt(hex[2] + hex[2], 16)
      ];
    }
    if (hex.length === 6) {
      return [
        Number.parseInt(hex.slice(0, 2), 16),
        Number.parseInt(hex.slice(2, 4), 16),
        Number.parseInt(hex.slice(4, 6), 16)
      ];
    }
    return null;
  }

  const rgbMatch = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgbMatch) {
    return [
      Number.parseFloat(rgbMatch[1]),
      Number.parseFloat(rgbMatch[2]),
      Number.parseFloat(rgbMatch[3])
    ];
  }

  return null;
}

function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(channelLuminance);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** True when the Style-tab backdrop reads as light (dark text for contrast). */
export function isLightSlideBackground(
  useGradient: boolean,
  background: string,
  gradientStyle: GradientStyle
): boolean {
  const samples = useGradient
    ? [gradientStyle.from, gradientStyle.via, gradientStyle.to]
    : [background];

  let total = 0;
  let count = 0;
  for (const sample of samples) {
    const rgb = parseRgb(sample);
    if (!rgb) continue;
    total += relativeLuminance(rgb);
    count += 1;
  }

  if (count === 0) return false;
  return total / count > 0.45;
}

export function slideTextColorsForBackground(isLight: boolean): {
  headline: string;
  subheadline: string;
} {
  return isLight
    ? {
        headline: "#0f172a",
        subheadline: "rgba(15, 23, 42, 0.72)"
      }
    : {
        headline: "#f8fafc",
        subheadline: "rgba(248, 250, 252, 0.78)"
      };
}
