import type { ScreenshotSlide } from "@/components/create/types";

export type CompositionLayoutId =
  | "floating-stack"
  | "hero-device"
  | "collage"
  | "angled-perspective"
  | "split";

export type DevicePlacement = {
  /** Index into slides array for screenshot source */
  slideIndex: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  zIndex: number;
  perspective?: number;
  rotateY?: number;
  opacity?: number;
  partialCrop?: "left" | "right" | "top" | "bottom";
};

export type TypographyPlacement = {
  variant: "behind" | "hero-overlay" | "split-left" | "split-right" | "dramatic-top";
  x: number;
  y: number;
  maxWidth: number;
  align: "left" | "center" | "right";
  headlineScale: number;
  subheadlineScale: number;
  rotate?: number;
};

export type CompositionPlan = {
  layoutId: CompositionLayoutId;
  devices: DevicePlacement[];
  typography: TypographyPlacement;
  glowX: number;
  glowY: number;
  floatPhase: number;
};

export const COMPOSITION_LAYOUT_LABELS: Record<
  CompositionLayoutId,
  { name: string; description: string }
> = {
  "floating-stack": {
    name: "Floating Stack",
    description: "Layered phones with depth and overlap"
  },
  "hero-device": {
    name: "Hero Device",
    description: "Dominant phone with satellite screens"
  },
  collage: {
    name: "Collage",
    description: "Cropped asymmetric floating screens"
  },
  "angled-perspective": {
    name: "Angled Perspective",
    description: "Dramatic 3D perspective stack"
  },
  split: {
    name: "Split",
    description: "Typography and devices in offset halves"
  }
};

/** Deterministic pseudo-random from string seed (0–1). */
function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function pick(seed: string, salt: number, min: number, max: number): number {
  return min + hashSeed(`${seed}:${salt}`) * (max - min);
}

function resolveSlideIndex(requested: number, focusIndex: number, count: number): number {
  if (count === 0) return 0;
  return ((requested % count) + count) % count;
}

/**
 * Intelligently builds a unique composition per slide focus.
 * Uses category + template + focus index as seed for subtle variation.
 */
export function buildCompositionPlan(
  layoutId: CompositionLayoutId,
  slideCount: number,
  focusIndex: number,
  seed: string
): CompositionPlan {
  const focus = resolveSlideIndex(focusIndex, focusIndex, slideCount);
  const n = Math.max(slideCount, 1);
  const glowX = pick(seed, 1, 55, 85);
  const glowY = pick(seed, 2, 15, 45);
  const floatPhase = pick(seed, 3, 0, Math.PI * 2);

  switch (layoutId) {
    case "floating-stack": {
      const rotA = pick(seed, 10, -18, -6);
      const rotB = pick(seed, 11, -8, 8);
      const rotC = pick(seed, 12, 8, 22);
      return {
        layoutId,
        glowX,
        glowY,
        floatPhase,
        typography: {
          variant: "dramatic-top",
          x: pick(seed, 20, 6, 14),
          y: pick(seed, 21, 6, 12),
          maxWidth: 78,
          align: "left",
          headlineScale: 1.08,
          subheadlineScale: 0.95,
          rotate: pick(seed, 22, -3, 2)
        },
        devices: [
          {
            slideIndex: resolveSlideIndex(focus, focus, n),
            x: 52,
            y: 38,
            rotate: rotC,
            scale: 1.05,
            zIndex: 30,
            perspective: 900
          },
          {
            slideIndex: resolveSlideIndex(focus - 1, focus, n),
            x: 18,
            y: 48,
            rotate: rotA,
            scale: 0.88,
            zIndex: 20,
            opacity: 0.92,
            partialCrop: "left"
          },
          {
            slideIndex: resolveSlideIndex(focus + 1, focus, n),
            x: 78,
            y: 52,
            rotate: rotB,
            scale: 0.82,
            zIndex: 15,
            opacity: 0.88,
            partialCrop: "right"
          },
          {
            slideIndex: resolveSlideIndex(focus + 2, focus, n),
            x: 62,
            y: 68,
            rotate: pick(seed, 13, 12, 24),
            scale: 0.72,
            zIndex: 10,
            opacity: 0.75
          }
        ]
      };
    }

    case "hero-device": {
      return {
        layoutId,
        glowX,
        glowY,
        floatPhase,
        typography: {
          variant: "behind",
          x: 6,
          y: 14,
          maxWidth: 85,
          align: "left",
          headlineScale: 1.22,
          subheadlineScale: 1,
          rotate: pick(seed, 30, -4, 0)
        },
        devices: [
          {
            slideIndex: focus,
            x: 58,
            y: 42,
            rotate: pick(seed, 31, -12, 6),
            scale: 1.18,
            zIndex: 25,
            perspective: 1100
          },
          {
            slideIndex: resolveSlideIndex(focus + 1, focus, n),
            x: 82,
            y: 58,
            rotate: pick(seed, 32, 14, 22),
            scale: 0.65,
            zIndex: 12,
            opacity: 0.85,
            partialCrop: "right"
          },
          {
            slideIndex: resolveSlideIndex(focus - 1, focus, n),
            x: 12,
            y: 62,
            rotate: pick(seed, 33, -22, -12),
            scale: 0.6,
            zIndex: 11,
            opacity: 0.8,
            partialCrop: "left"
          }
        ]
      };
    }

    case "collage": {
      return {
        layoutId,
        glowX: pick(seed, 40, 20, 50),
        glowY,
        floatPhase,
        typography: {
          variant: "hero-overlay",
          x: pick(seed, 41, 8, 20),
          y: 72,
          maxWidth: 70,
          align: "left",
          headlineScale: 1,
          subheadlineScale: 0.9
        },
        devices: [
          {
            slideIndex: focus,
            x: 45,
            y: 28,
            rotate: pick(seed, 42, -6, 4),
            scale: 1,
            zIndex: 22,
            partialCrop: "top"
          },
          {
            slideIndex: resolveSlideIndex(focus + 1, focus, n),
            x: 88,
            y: 35,
            rotate: pick(seed, 43, 16, 25),
            scale: 0.78,
            zIndex: 18,
            partialCrop: "right"
          },
          {
            slideIndex: resolveSlideIndex(focus - 1, focus, n),
            x: -8,
            y: 42,
            rotate: pick(seed, 44, -24, -14),
            scale: 0.75,
            zIndex: 17,
            partialCrop: "left"
          },
          {
            slideIndex: resolveSlideIndex(focus + 2, focus, n),
            x: 70,
            y: 72,
            rotate: pick(seed, 45, 8, 18),
            scale: 0.68,
            zIndex: 14,
            opacity: 0.9
          }
        ]
      };
    }

    case "angled-perspective": {
      const tilt = pick(seed, 50, -14, 14);
      return {
        layoutId,
        glowX,
        glowY: pick(seed, 51, 50, 75),
        floatPhase,
        typography: {
          variant: "dramatic-top",
          x: 10,
          y: 8,
          maxWidth: 80,
          align: "left",
          headlineScale: 1.15,
          subheadlineScale: 1
        },
        devices: [
          {
            slideIndex: focus,
            x: 50,
            y: 45,
            rotate: tilt,
            rotateY: pick(seed, 52, -18, -8),
            scale: 1.1,
            zIndex: 28,
            perspective: 700
          },
          {
            slideIndex: resolveSlideIndex(focus - 1, focus, n),
            x: 22,
            y: 55,
            rotate: tilt - 16,
            rotateY: -22,
            scale: 0.85,
            zIndex: 18,
            perspective: 700,
            opacity: 0.9
          },
          {
            slideIndex: resolveSlideIndex(focus + 1, focus, n),
            x: 76,
            y: 50,
            rotate: tilt + 18,
            rotateY: 16,
            scale: 0.8,
            zIndex: 16,
            perspective: 700,
            opacity: 0.88
          }
        ]
      };
    }

    case "split": {
      return {
        layoutId,
        glowX: pick(seed, 60, 70, 95),
        glowY,
        floatPhase,
        typography: {
          variant: "split-left",
          x: 6,
          y: 28,
          maxWidth: 42,
          align: "left",
          headlineScale: 1.1,
          subheadlineScale: 1
        },
        devices: [
          {
            slideIndex: focus,
            x: 72,
            y: 40,
            rotate: pick(seed, 61, 10, 20),
            scale: 1.02,
            zIndex: 24,
            perspective: 950
          },
          {
            slideIndex: resolveSlideIndex(focus + 1, focus, n),
            x: 88,
            y: 62,
            rotate: pick(seed, 62, -8, 6),
            scale: 0.7,
            zIndex: 14,
            partialCrop: "right"
          },
          {
            slideIndex: resolveSlideIndex(focus - 1, focus, n),
            x: 58,
            y: 68,
            rotate: pick(seed, 63, 18, 28),
            scale: 0.65,
            zIndex: 12,
            opacity: 0.85
          }
        ]
      };
    }

    default:
      return buildCompositionPlan("floating-stack", slideCount, focusIndex, seed);
  }
}

/** Pick layout from template id when not explicitly set. */
export function layoutIdFromTemplate(templateId: string): CompositionLayoutId {
  const map: Record<string, CompositionLayoutId> = {
    minimal: "split",
    focus: "hero-device",
    studio: "floating-stack",
    fintech: "angled-perspective",
    ledger: "split",
    markets: "collage",
    neural: "angled-perspective",
    glow: "hero-device",
    pulse: "floating-stack",
    feed: "collage",
    stories: "floating-stack",
    club: "hero-device",
    energy: "angled-perspective",
    "pulse-fit": "hero-device",
    grind: "collage",
    arcade: "collage",
    neon: "angled-perspective",
    cyber: "floating-stack",
    arena: "hero-device",
    pro: "split",
    classic: "collage",
    boutique: "split",
    storefront: "hero-device",
    checkout: "angled-perspective",
    journey: "hero-device",
    wander: "angled-perspective",
    voyage: "collage"
  };
  return map[templateId] ?? "floating-stack";
}

export function getSlideImage(
  slides: ScreenshotSlide[],
  slideIndex: number
): string | null {
  if (slides.length === 0) return null;
  const idx = ((slideIndex % slides.length) + slides.length) % slides.length;
  return slides[idx]?.imageDataUrl ?? null;
}
