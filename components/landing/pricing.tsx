"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { LifetimeDealsBar } from "@/components/landing/lifetime-deals-bar";
import { useLifetimeDeals } from "@/components/landing/use-lifetime-deals";
import { CheckoutButton } from "@/components/pro/checkout-button";
import { Button, Container, landingSectionY, SectionHeading } from "@/components/landing/ui";
import { PRO_LIFETIME_PRICE_USD } from "@/lib/pro/constants";

const freeFeatures = [
  "3 free exports",
  "Basic templates",
  "Watermarked exports",
  "Standard quality"
];

const lifetimeFeatures = [
  "Unlimited exports",
  "Premium templates",
  "HD exports",
  "No watermark",
  "Future updates included"
];

export function PricingSection() {
  const { stats, loading } = useLifetimeDeals();

  return (
    <section id="pricing" className={landingSectionY}>
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans built for indie app launches"
        />
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5 sm:rounded-3xl sm:p-8">
            <p className="text-sm uppercase tracking-[0.14em] text-zinc-400">Free</p>
            <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">$0</h3>
            <p className="mt-1 text-zinc-400">Perfect for testing the workflow.</p>
            <ul className="mt-7 space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-zinc-300">
                  <Check className="h-4 w-4 text-zinc-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button href="/create" className="mt-8 w-full">
              Start Free
            </Button>
          </article>

          <motion.article
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212]/95 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:rounded-3xl sm:p-8"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/[0.07] via-transparent to-emerald-500/[0.05]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-500/[0.07] blur-3xl"
              aria-hidden
            />

            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1 text-[11px] font-medium tracking-wide text-purple-200/90 backdrop-blur-sm">
                Founding Member
              </span>

              <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">
                ${PRO_LIFETIME_PRICE_USD}{" "}
                <span className="text-xl font-medium text-zinc-400 sm:text-2xl">
                  Lifetime Access
                </span>
              </h3>

              <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-zinc-400">
                One payment. Unlimited App Store screenshots forever — built for indie developers
                shipping multiple launches.
              </p>

              <ul className="mt-7 space-y-3">
                {lifetimeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
                      <Check className="h-3 w-3 text-emerald-400/90" strokeWidth={2.5} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <LifetimeDealsBar stats={stats} loading={loading} />

              <CheckoutButton
                className="mt-8 w-full shadow-[0_0_28px_rgba(167,139,250,0.12)] hover:shadow-[0_0_32px_rgba(167,139,250,0.18)]"
                soldOut={!loading && stats.soldOut}
              >
                {stats.soldOut ? "Sold out" : "Claim Lifetime Access"}
              </CheckoutButton>
            </div>
          </motion.article>
        </div>
      </Container>
    </section>
  );
}
