import type { CategoryId, CompositionLayoutId, GradientStyle } from "@/components/create/types";

const STORAGE_KEY = "appframes:checkout-editor";

export type EditorCheckoutSnapshot = {
  categoryId: CategoryId;
  selectedTemplateId: string;
  compositionLayoutId: CompositionLayoutId;
  background: string;
  useGradient: boolean;
  gradientStyle: GradientStyle;
};

export function saveEditorCheckoutSnapshot(snapshot: EditorCheckoutSnapshot): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota or private mode */
  }
}

export function readEditorCheckoutSnapshot(): EditorCheckoutSnapshot | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EditorCheckoutSnapshot;
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
