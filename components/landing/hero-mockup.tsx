import Image from "next/image";

const HERO_MOCKUP_WIDTH = 1510;
const HERO_MOCKUP_HEIGHT = 1210;

export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-6xl">
      <div
        className="pointer-events-none absolute -inset-x-2 bottom-0 top-[20%] rounded-3xl bg-gradient-to-b from-transparent via-emerald-400/[0.06] to-emerald-400/14 blur-2xl sm:-inset-x-4 sm:blur-3xl md:-inset-x-8 md:top-[22%] md:rounded-[2.5rem]"
        aria-hidden
      />
      <div className="relative z-[1] mx-auto w-full min-w-0 max-w-[1200px] overflow-hidden rounded-xl border border-zinc-700/90 bg-zinc-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] drop-shadow-[0_16px_40px_rgba(0,0,0,0.45)] sm:rounded-2xl sm:drop-shadow-[0_28px_72px_rgba(0,0,0,0.55)]">
        <Image
          src="/hero-mockup1.png"
          alt="AppFrames editor with App Store screenshot slides"
          width={HERO_MOCKUP_WIDTH}
          height={HERO_MOCKUP_HEIGHT}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1200px"
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}
