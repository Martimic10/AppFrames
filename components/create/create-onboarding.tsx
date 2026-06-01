"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CategoryOnboarding } from "@/components/create/category-onboarding";
import { CategoryTemplatePicker } from "@/components/create/category-template-picker";
import { getFirstFreeTemplateId } from "@/lib/pro/template-access";
import type { CategoryId, ScreenshotSlide } from "@/components/create/types";

type CreateOnboardingProps = {
  slides: ScreenshotSlide[];
  selectedTemplateId: string;
  onCategoryPreview: (categoryId: CategoryId, templateId: string) => void;
  onTemplatePreview: (templateId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onComplete: (categoryId: CategoryId, templateId: string) => void;
};

export function CreateOnboarding({
  slides,
  selectedTemplateId,
  onCategoryPreview,
  onTemplatePreview,
  onTemplateSelect,
  onComplete
}: CreateOnboardingProps) {
  const [step, setStep] = useState<"category" | "templates">("category");
  const [pendingCategoryId, setPendingCategoryId] = useState<CategoryId | null>(null);

  return (
    <AnimatePresence mode="wait">
      {step === "category" ? (
        <CategoryOnboarding
          key="category"
          onSelect={(id) => {
            setPendingCategoryId(id);
            setStep("templates");
            onCategoryPreview(id, getFirstFreeTemplateId(id));
          }}
        />
      ) : pendingCategoryId ? (
        <CategoryTemplatePicker
          key="templates"
          categoryId={pendingCategoryId}
          slides={slides}
          selectedTemplateId={selectedTemplateId}
          onBack={() => setStep("category")}
          onPreview={onTemplatePreview}
          onSelect={onTemplateSelect}
          onConfirm={(templateId) => onComplete(pendingCategoryId, templateId)}
        />
      ) : null}
    </AnimatePresence>
  );
}
