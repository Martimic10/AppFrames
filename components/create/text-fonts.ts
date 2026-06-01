export type TextFontId =
  | "inter"
  | "playfair"
  | "space-grotesk"
  | "dm-sans"
  | "outfit"
  | "fraunces"
  | "bebas"
  | "jetbrains"
  | "poppins"
  | "montserrat"
  | "sora"
  | "lora"
  | "rubik"
  | "manrope"
  | "nunito"
  | "cormorant";

export const DEFAULT_TEXT_FONT_ID: TextFontId = "inter";

export type TextFontOption = {
  id: TextFontId;
  label: string;
  description: string;
  /** CSS font-family for canvas + inputs */
  family: string;
};

export const TEXT_FONT_OPTIONS: TextFontOption[] = [
  {
    id: "inter",
    label: "Inter",
    description: "Clean & modern",
    family: "var(--font-inter), ui-sans-serif, system-ui, sans-serif"
  },
  {
    id: "poppins",
    label: "Poppins",
    description: "Friendly geometric",
    family: "var(--font-poppins), ui-sans-serif, sans-serif"
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    description: "Neutral UI",
    family: "var(--font-dm-sans), ui-sans-serif, sans-serif"
  },
  {
    id: "outfit",
    label: "Outfit",
    description: "Rounded & bold",
    family: "var(--font-outfit), ui-sans-serif, sans-serif"
  },
  {
    id: "montserrat",
    label: "Montserrat",
    description: "Bold marketing",
    family: "var(--font-montserrat), ui-sans-serif, sans-serif"
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    description: "Tech & startup",
    family: "var(--font-space-grotesk), ui-sans-serif, sans-serif"
  },
  {
    id: "sora",
    label: "Sora",
    description: "Futuristic sans",
    family: "var(--font-sora), ui-sans-serif, sans-serif"
  },
  {
    id: "manrope",
    label: "Manrope",
    description: "Soft & readable",
    family: "var(--font-manrope), ui-sans-serif, sans-serif"
  },
  {
    id: "nunito",
    label: "Nunito",
    description: "Warm & approachable",
    family: "var(--font-nunito), ui-sans-serif, sans-serif"
  },
  {
    id: "rubik",
    label: "Rubik",
    description: "Playful curves",
    family: "var(--font-rubik), ui-sans-serif, sans-serif"
  },
  {
    id: "playfair",
    label: "Playfair",
    description: "Editorial serif",
    family: "var(--font-playfair), Georgia, serif"
  },
  {
    id: "fraunces",
    label: "Fraunces",
    description: "Soft display",
    family: "var(--font-fraunces), Georgia, serif"
  },
  {
    id: "lora",
    label: "Lora",
    description: "Classic serif",
    family: "var(--font-lora), Georgia, serif"
  },
  {
    id: "cormorant",
    label: "Cormorant",
    description: "Luxury editorial",
    family: "var(--font-cormorant), Georgia, serif"
  },
  {
    id: "bebas",
    label: "Bebas Neue",
    description: "Poster impact",
    family: "var(--font-bebas), Impact, sans-serif"
  },
  {
    id: "jetbrains",
    label: "JetBrains Mono",
    description: "Developer mono",
    family: "var(--font-jetbrains), ui-monospace, monospace"
  }
];

export function getFontFamily(id: TextFontId): string {
  return TEXT_FONT_OPTIONS.find((f) => f.id === id)?.family ?? TEXT_FONT_OPTIONS[0].family;
}
