import { clampTextPosition, type TextPosition } from "@/components/create/text-position";
import type { TextAlignment, TextFontWeight } from "@/components/create/text-style";

export type SlideTextBox = {
  id: string;
  text: string;
  position: TextPosition;
  textSize: number;
  alignment: TextAlignment;
  fontWeight: TextFontWeight;
  /** When null, uses the template mood headline color. */
  color: string | null;
};

export const MAX_SLIDE_TEXT_BOXES = 8;

export function createTextBox(existingCount: number, hasScreenshot: boolean): SlideTextBox {
  return {
    id: crypto.randomUUID(),
    text: "Your text here",
    position: clampTextPosition({
      x: 50,
      y: hasScreenshot ? 52 + existingCount * 6 : 42 + existingCount * 8
    }),
    textSize: 42,
    alignment: "center",
    fontWeight: "semibold",
    color: null
  };
}
