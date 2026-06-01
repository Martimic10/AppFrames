"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container, landingSectionY } from "@/components/landing/ui";

export function CtaSection() {
  return (
    <section className={landingSectionY}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cta-banner relative overflow-hidden rounded-xl bg-black sm:rounded-2xl"
        >
          <div className="cta-banner-glow" aria-hidden="true" />
          <div className="cta-banner-grain" aria-hidden="true" />

          <div className="relative flex flex-col items-stretch justify-between gap-6 px-5 py-8 sm:gap-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:px-12 md:py-12">
            <div className="min-w-0 max-w-xl">
              <h2 className="text-pretty text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
                Ready to get started?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:mt-3 md:text-base">
                Start free today. Launch your App Store listing with screenshots
                that look like you hired a designer.
              </p>
            </div>

            <Link
              href="/create"
              className="inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 sm:w-auto"
            >
              Get started
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
