import {
  DEFAULT_BACKGROUND_TEXTURE_ID,
  type BackgroundTextureId
} from "@/components/create/background-textures";
import { layoutIdFromTemplate } from "@/components/create/composition-engine";
import {
  DEFAULT_FRAME_STYLE_SETTINGS,
  type FrameStyleSettings
} from "@/components/create/frame-style-settings";
import type { StagedScreenshot } from "@/components/create/image-upload";
import { DEFAULT_GRADIENT } from "@/components/create/style-colors";
import {
  DEFAULT_TEMPLATE_SETTINGS,
  type TemplateSettings
} from "@/components/create/template-settings";
import type {
  CategoryId,
  CompositionLayoutId,
  GradientStyle,
  ScreenshotSlide
} from "@/components/create/types";

const STORAGE_KEY = "appframes:checkout-editor";

/** Survives React Strict Mode remount so we only read sessionStorage once per page load. */
let bootCheckoutSnapshot: EditorCheckoutSnapshot | null | undefined;

/** Reset after writing a new snapshot so the next /create visit can restore it. */
export function resetCheckoutSnapshotBootCache(): void {
  bootCheckoutSnapshot = undefined;
}

export type EditorCheckoutSnapshot = {
  version: 2;
  categoryId: CategoryId;
  selectedTemplateId: string;
  compositionLayoutId: CompositionLayoutId;
  background: string;
  useGradient: boolean;
  gradientStyle: GradientStyle;
  backgroundTextureId: BackgroundTextureId;
  templateSettings: TemplateSettings;
  frameStyleSettings: FrameStyleSettings;
  slides: ScreenshotSlide[];
  selectedSlideIndex: number;
  stagedScreenshots: StagedScreenshot[];
  activePanel: "upload" | "templates" | "text" | "style";
};

type LegacyCheckoutSnapshot = {
  categoryId: CategoryId;
  selectedTemplateId: string;
  compositionLayoutId: CompositionLayoutId;
  background: string;
  useGradient: boolean;
  gradientStyle: GradientStyle;
};

function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && value.length > 0;
}

function migrateLegacySnapshot(raw: LegacyCheckoutSnapshot): EditorCheckoutSnapshot {
  return {
    version: 2,
    categoryId: raw.categoryId,
    selectedTemplateId: raw.selectedTemplateId,
    compositionLayoutId:
      raw.compositionLayoutId ?? layoutIdFromTemplate(raw.selectedTemplateId),
    background: raw.background,
    useGradient: raw.useGradient,
    gradientStyle: raw.gradientStyle ?? DEFAULT_GRADIENT,
    backgroundTextureId: DEFAULT_BACKGROUND_TEXTURE_ID,
    templateSettings: DEFAULT_TEMPLATE_SETTINGS,
    frameStyleSettings: DEFAULT_FRAME_STYLE_SETTINGS,
    slides: [],
    selectedSlideIndex: 0,
    stagedScreenshots: [],
    activePanel: "templates"
  };
}

function parseSnapshot(raw: unknown): EditorCheckoutSnapshot | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<EditorCheckoutSnapshot> & Partial<LegacyCheckoutSnapshot>;

  if (!isCategoryId(data.categoryId) || typeof data.selectedTemplateId !== "string") {
    return null;
  }

  if (data.version !== 2) {
    return migrateLegacySnapshot(data as LegacyCheckoutSnapshot);
  }

  return {
    version: 2,
    categoryId: data.categoryId,
    selectedTemplateId: data.selectedTemplateId,
    compositionLayoutId:
      data.compositionLayoutId ?? layoutIdFromTemplate(data.selectedTemplateId),
    background: data.background ?? "#09090b",
    useGradient: data.useGradient ?? true,
    gradientStyle: data.gradientStyle ?? DEFAULT_GRADIENT,
    backgroundTextureId: data.backgroundTextureId ?? DEFAULT_BACKGROUND_TEXTURE_ID,
    templateSettings: data.templateSettings ?? DEFAULT_TEMPLATE_SETTINGS,
    frameStyleSettings: data.frameStyleSettings ?? DEFAULT_FRAME_STYLE_SETTINGS,
    slides: Array.isArray(data.slides) ? data.slides : [],
    selectedSlideIndex:
      typeof data.selectedSlideIndex === "number" ? data.selectedSlideIndex : 0,
    stagedScreenshots: Array.isArray(data.stagedScreenshots) ? data.stagedScreenshots : [],
    activePanel:
      data.activePanel === "upload" ||
      data.activePanel === "templates" ||
      data.activePanel === "text" ||
      data.activePanel === "style"
        ? data.activePanel
        : "templates"
  };
}

export function saveEditorCheckoutSnapshot(snapshot: EditorCheckoutSnapshot): void {
  resetCheckoutSnapshotBootCache();
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...snapshot, stagedScreenshots: [] })
      );
    } catch {
      /* quota or private mode — best effort */
    }
  }
}

/** Read once per page load (Strict Mode safe) and clear storage. */
export function takeBootCheckoutSnapshot(): EditorCheckoutSnapshot | null {
  if (bootCheckoutSnapshot !== undefined) {
    return bootCheckoutSnapshot;
  }

  bootCheckoutSnapshot = readEditorCheckoutSnapshot();
  if (bootCheckoutSnapshot) {
    clearEditorCheckoutSnapshot();
  }
  return bootCheckoutSnapshot;
}

export function readEditorCheckoutSnapshot(): EditorCheckoutSnapshot | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return parseSnapshot(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearEditorCheckoutSnapshot(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
