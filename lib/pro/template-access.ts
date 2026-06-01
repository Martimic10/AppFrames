import type { CategoryTemplate, CategoryId } from "@/components/create/types";
import { getCategoryById } from "@/components/create/category-data";

export function isProTemplate(template: CategoryTemplate): boolean {
  return template.tier === "pro";
}

export function getFirstFreeTemplateId(categoryId: CategoryId): string {
  const category = getCategoryById(categoryId);
  const free = category.templates.find((t) => t.tier === "free");
  return free?.id ?? category.templates[0]?.id ?? "";
}

export function canUseTemplate(template: CategoryTemplate, isPro: boolean): boolean {
  return isPro || !isProTemplate(template);
}
