"use client";

import { motion } from "framer-motion";
import { Button, Container } from "@/components/landing/ui";
import { HeroMockup } from "@/components/landing/hero-mockup";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative pb-12 pt-28 sm:pb-16 sm:pt-32 md:pb-24 md:pt-36 lg:pb-28 lg:pt-44"
    >
      <Container>
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="mx-auto w-full max-w-3xl px-1 sm:px-0 lg:max-w-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-balance text-[1.65rem] font-semibold leading-[1.12] tracking-tight text-white min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Create stunning App Store screenshots in minutes.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-300 sm:mt-5 sm:text-base md:mt-6 md:text-lg">
              Upload your screenshots, customize beautiful layouts, and export
              launch-ready App Store assets instantly.
            </p>
            <div className="mx-auto mt-7 flex w-full max-w-sm flex-col gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 md:mt-10 md:gap-4">
              <Button href="/create">Start Free</Button>
              <Button href="#pricing" variant="secondary">
                Get Lifetime Access
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 w-full min-w-0 sm:mt-12 md:mt-14 lg:mt-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <HeroMockup />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
