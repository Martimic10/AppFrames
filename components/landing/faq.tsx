"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container, landingSectionY, SectionHeading } from "@/components/landing/ui";

const faqItems = [
  {
    question: "Do I need design experience?",
    answer:
      "No. AppFrame is built for non-designers with polished templates, sensible defaults, and simple drag-and-drop controls."
  },
  {
    question: "Can I export App Store sizes?",
    answer:
      "Yes. You can generate ready-to-publish outputs for common App Store screenshot sizes without manual resizing."
  },
  {
    question: "Will more templates be added?",
    answer:
      "Absolutely. New premium templates and visual styles are added regularly and included in your plan."
  },
  {
    question: "Is the lifetime deal permanent?",
    answer:
      "Yes. Lifetime access is a one-time payment for all current features plus future updates."
  }
];

export function FaqSection() {
  const [openItem, setOpenItem] = useState<number | null>(0);
  return (
    <section id="faq" className={landingSectionY}>
      <Container>
        <SectionHeading eyebrow="FAQ" title="Answers before you launch" />
        <div className="mx-auto max-w-3xl space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openItem === idx;
            return (
              <article
                key={item.question}
                className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/75"
              >
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left sm:items-center sm:px-5 sm:py-4"
                  onClick={() => setOpenItem(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span className="text-left text-sm font-medium text-white sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform sm:mt-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24 }}
                    >
                      <p className="px-4 pb-4 text-sm leading-relaxed text-zinc-300 sm:px-5 sm:pb-5 sm:text-base">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
