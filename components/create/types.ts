import type { LucideIcon } from "lucide-react";

export type CategoryId =
  | "productivity"
  | "finance"
  | "ai"
  | "social"
  | "fitness"
  | "gaming"
  | "sports"
  | "ecommerce"
  | "travel";

import type { TextFontId } from "@/components/create/text-fonts";
import type { SlideTextBox } from "@/components/create/slide-text-box";
import type { SlideTextStyle } from "@/components/create/text-style";

export type { TextFontId };
export type { SlideTextBox } from "@/components/create/slide-text-box";
export type { StylePreset, TemplateSettings } from "@/components/create/template-settings";
export type { SlideTextStyle, TextAlignment, TextFontWeight } from "@/components/create/text-style";
export type { FrameStyleSettings } from "@/components/create/frame-style-settings";

export type ScreenshotSlide = {
  headline: string;
  subheadline: string;
  imageDataUrl: string | null;
  /** Additional draggable text boxes on this slide. */
  textBoxes: SlideTextBox[];
  fontId: TextFontId;
} & SlideTextStyle;

export type TemplateTier = "free" | "pro";

export type CategoryTemplate = {
  id: string;
  name: string;
  tier: TemplateTier;
  /** Marketing label shown on locked Pro templates */
  styleName?: string;
  popular?: boolean;
};

export type CategoryConfig = {
  id: CategoryId;
  title: string;
  description: string;
  icon: LucideIcon;
  headline: string;
  subheadline: string;
  canvasGradient: string;
  glowColor: string;
  templates: CategoryTemplate[];
  backgrounds: string[];
};

export type { GradientStyle } from "@/components/create/style-colors";
export type { BackgroundTextureId } from "@/components/create/background-textures";
export type { CompositionLayoutId } from "@/components/create/composition-engine";

export type CreateEditorState = {
  categoryId: CategoryId | null;
  slides: ScreenshotSlide[];
  selectedSlideIndex: number;
  selectedTemplateId: string;
  background: string;
  useGradient: boolean;
};
