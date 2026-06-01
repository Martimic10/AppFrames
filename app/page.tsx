import { Navbar } from "@/components/landing/navbar";
import { HeroShell } from "@/components/landing/hero-shell";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { ShowcaseSection } from "@/components/landing/showcase";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { PricingSection } from "@/components/landing/pricing";
import { CtaSection } from "@/components/landing/cta";
import { FaqSection } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-zinc-950 text-zinc-50">
      <Navbar />
      <HeroShell>
        <HeroSection />
      </HeroShell>
      <FeaturesSection />
      <ShowcaseSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
