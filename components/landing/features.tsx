"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container, landingSectionY } from "@/components/landing/ui";
import { FeatureTabMockup } from "@/components/landing/feature-tab-mockups";

const tabs = [
  {
    id: "editor",
    label: "Editor",
    title: "Build your screenshot set",
    points: [
      "Drag & drop screen ordering",
      "Live text overlay editing",
      "Pixel-perfect spacing controls"
    ]
  },
  {
    id: "templates",
    label: "Templates",
    title: "Start with polished layouts",
    points: [
      "Premium launch templates",
      "One-click style presets",
      "Consistent brand look"
    ]
  },
  {
    id: "devices",
    label: "Devices",
    title: "Frame every device size",
    points: [
      "iPhone & iPad mockups",
      "Realistic device bezels",
      "Preview every screen size"
    ]
  },
  {
    id: "export",
    label: "Export",
    title: "Ship App Store-ready assets",
    points: [
      "Correct store dimensions",
      "HD PNG exports",
      "Batch download all screens"
    ]
  }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState<TabId>("editor");
  const active = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <section id="features" className={landingSectionY}>
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <h2 className="text-pretty text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            Everything you need to ship screenshot assets faster
          </h2>
          <p className="mt-3 text-pretty text-sm text-zinc-400 sm:mt-4 sm:text-base">
            Purpose-built tools to make your listings look premium and convert
            more downloads.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-black sm:rounded-2xl">
          {/* Tab bar */}
          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-b border-white/10 sm:grid-cols-4 sm:divide-y-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3 py-3.5 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors sm:px-4 sm:py-4 sm:text-xs sm:tracking-[0.14em] md:text-sm ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "bg-black text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 p-4 sm:gap-8 sm:p-6 md:grid-cols-2 md:items-center md:gap-10 md:p-10 lg:p-12"
            >
              <div className="flex min-w-0 items-center justify-center overflow-hidden px-0.5">
                <FeatureTabMockup tab={activeTab} />
              </div>

              <div className="min-w-0">
                <h3 className="text-pretty text-xl font-semibold text-white sm:text-2xl md:text-3xl">
                  {active.title}
                </h3>
                <ul className="mt-5 divide-y divide-white/10 sm:mt-8">
                  {active.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 py-3.5 text-sm text-zinc-300 sm:items-center sm:py-4 md:text-base"
                    >
                      <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
