"use client";

import { motion } from "framer-motion";
import { Container, landingSectionY } from "@/components/landing/ui";
import { HowItWorksGraphic } from "@/components/landing/how-it-works-graphics";

const steps = [
  {
    step: 1 as const,
    title: "Upload Screenshots",
    description:
      "Drop your raw app screens into AppFrame and organize them into a launch-ready set in seconds."
  },
  {
    step: 2 as const,
    title: "Customize Your Design",
    description:
      "Apply templates, edit headlines, and fine-tune layouts with a live preview on every device size."
  },
  {
    step: 3 as const,
    title: "Export & Launch",
    description:
      "Download App Store-ready PNGs in every required dimension and publish with confidence."
  }
];

export function HowItWorksSection() {
  return (
    <section className={landingSectionY}>
      <Container>
        <div className="mb-8 max-w-3xl sm:mb-12">
          <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]">
            How it works
          </span>
          <h2 className="mt-4 text-pretty text-2xl font-semibold tracking-tight text-white sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl">
            Built for clarity, built for speed
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`flex flex-col overflow-hidden rounded-2xl bg-[#121212] sm:rounded-3xl ${
                i === 2 ? "md:col-span-2 md:mx-auto md:max-w-md lg:col-span-1 lg:max-w-none" : ""
              }`}
            >
              <div className="flex min-h-[200px] items-center justify-center overflow-hidden px-4 pb-2 pt-6 sm:min-h-[240px] sm:px-6 sm:pt-8 md:min-h-[260px]">
                <HowItWorksGraphic step={item.step} />
              </div>
              <div className="flex flex-1 flex-col px-4 pb-6 pt-2 sm:px-6 sm:pb-8">
                <h3 className="text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
