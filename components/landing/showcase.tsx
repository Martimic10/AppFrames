"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container, landingSectionY, SectionHeading } from "@/components/landing/ui";

function UploadedScreenshot() {
  return (
    <div className="mx-auto w-full max-w-[min(100%,220px)] sm:max-w-[240px]">
      <div className="overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <Image
          src="/Your-upload-mockup.png"
          alt="Uploaded app screenshot"
          width={325}
          height={555}
          className="h-auto w-full object-cover object-top"
        />
      </div>
      <p className="mt-4 text-center text-sm text-zinc-500">Your upload</p>
    </div>
  );
}

function AppStoreReady() {
  return (
    <div className="mx-auto w-full max-w-[min(100%,240px)] sm:max-w-[260px]">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] ring-1 ring-emerald-400/20">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-400/[0.04] via-transparent to-transparent"
          aria-hidden
        />
        <Image
          src="/showcase-mockup2.png"
          alt="App Store ready slide with headline and device mockup"
          width={414}
          height={828}
          className="relative block h-auto w-full object-cover object-top"
        />
      </div>
      <p className="mt-4 text-center text-sm font-medium text-emerald-300/90">
        App Store ready
      </p>
    </div>
  );
}

export function ShowcaseSection() {
  return (
    <section id="showcase" className={landingSectionY}>
      <Container>
        <SectionHeading
          eyebrow="Showcase"
          title="Upload once. Export a full slide."
          description="Drop your screenshots in—AppFrames adds the headline, layout, and device frame for you."
        />

        <div className="mt-2 flex flex-col items-stretch gap-5 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex w-full min-w-0 justify-center sm:w-auto sm:flex-1 sm:basis-[200px]"
          >
            <UploadedScreenshot />
          </motion.div>

          <div
            className="flex shrink-0 items-center justify-center py-0 sm:px-1"
            aria-hidden
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 sm:h-11 sm:w-11">
              <ArrowRight className="h-4 w-4 rotate-90 sm:rotate-0" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="flex w-full min-w-0 justify-center sm:w-auto sm:flex-1 sm:basis-[220px]"
          >
            <AppStoreReady />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
