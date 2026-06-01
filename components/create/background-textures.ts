export type BackgroundTextureId =
  | "none"
  | "dots"
  | "grid"
  | "waves"
  | "diagonal"
  | "crosshatch"
  | "rings";

export type BackgroundTexture = {
  id: BackgroundTextureId;
  name: string;
  image: string;
  size: string;
  opacity: number;
};

const waveSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48">
    <path d="M0 24 C40 4, 80 44, 120 24 S160 4, 160 24" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
    <path d="M0 38 C40 18, 80 46, 120 28 S160 18, 160 38" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  </svg>`
);

export const BACKGROUND_TEXTURES: BackgroundTexture[] = [
  { id: "none", name: "None", image: "none", size: "auto", opacity: 0 },
  {
    id: "dots",
    name: "Dots",
    image: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
    size: "14px 14px",
    opacity: 0.55
  },
  {
    id: "grid",
    name: "Grid",
    image:
      "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
    size: "22px 22px",
    opacity: 0.75
  },
  {
    id: "waves",
    name: "Wavy",
    image: `url("data:image/svg+xml,${waveSvg}")`,
    size: "160px 48px",
    opacity: 0.85
  },
  {
    id: "diagonal",
    name: "Diagonal",
    image:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 10px)",
    size: "auto",
    opacity: 0.7
  },
  {
    id: "crosshatch",
    name: "Crosshatch",
    image:
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)",
    size: "auto",
    opacity: 0.65
  },
  {
    id: "rings",
    name: "Rings",
    image:
      "repeating-radial-gradient(circle at center, transparent 0, transparent 11px, rgba(255,255,255,0.07) 11px, rgba(255,255,255,0.07) 12px)",
    size: "100% 100%",
    opacity: 0.7
  }
];

export const DEFAULT_BACKGROUND_TEXTURE_ID: BackgroundTextureId = "none";

export function getBackgroundTexture(id: BackgroundTextureId): BackgroundTexture {
  return BACKGROUND_TEXTURES.find((texture) => texture.id === id) ?? BACKGROUND_TEXTURES[0];
}

/** Preview tile in Style tab — stacks texture over solid or gradient. */
export function backgroundTexturePreviewStyle(
  textureId: BackgroundTextureId,
  useGradient: boolean,
  background: string,
  gradientCss: string
): {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
} {
  const texture = getBackgroundTexture(textureId);
  if (textureId === "none") {
    return {
      backgroundColor: useGradient ? "transparent" : background,
      backgroundImage: useGradient ? gradientCss : "none"
    };
  }

  if (useGradient) {
    return {
      backgroundColor: "transparent",
      backgroundImage: `${texture.image}, ${gradientCss}`,
      backgroundSize: `${texture.size}, auto`
    };
  }

  return {
    backgroundColor: background,
    backgroundImage: texture.image,
    backgroundSize: texture.size
  };
}
