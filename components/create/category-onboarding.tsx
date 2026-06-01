"use client";

import { categories } from "@/components/create/category-data";
import type { CategoryId } from "@/components/create/types";

type CategoryOnboardingProps = {
  onSelect: (id: CategoryId) => void;
};

export function CategoryOnboarding({ onSelect }: CategoryOnboardingProps) {
  return (
    <div className="relative mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50 md:p-8">
      <div className="relative text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Choose your app category
        </h2>
        <p className="mt-2 text-sm text-zinc-400 md:text-base">
          We&apos;ll generate screenshot styles tailored to your app.
        </p>
      </div>

      <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-4 text-left transition-colors hover:border-white/20 hover:bg-zinc-900"
          >
            <div className="relative">
              <div className="mb-3 inline-flex rounded-xl border border-white/10 bg-zinc-900/80 p-2.5 transition-colors group-hover:border-white/20">
                <category.icon className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-white" />
              </div>
              <p className="font-semibold text-white">{category.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {category.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
