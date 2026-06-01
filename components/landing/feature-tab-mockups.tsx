import Image from "next/image";
import { AppStoreTemplateKit } from "@/components/landing/app-store-template-kit";

const EDITOR_MOCKUP_WIDTH = 1483;
const EDITOR_MOCKUP_HEIGHT = 1187;

const EXPORT_MOCKUP_WIDTH = 450;
const EXPORT_MOCKUP_HEIGHT = 604;

function FeatureMockupFrame({
  src,
  alt,
  width,
  height,
  sizes,
  className = "max-w-full sm:max-w-xl lg:max-w-2xl",
  glow = true
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      {glow ? (
        <div
          className="absolute -inset-4 rounded-3xl bg-emerald-400/15 blur-2xl sm:-inset-8 sm:blur-3xl"
          aria-hidden
        />
      ) : null}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-[0_24px_56px_rgba(0,0,0,0.45)] ring-1 ring-white/5">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}

function EditorMockup() {
  return (
    <FeatureMockupFrame
      src="/Editor-mockup.png"
      alt="AppFrames screenshot editor with slides and styling controls"
      width={EDITOR_MOCKUP_WIDTH}
      height={EDITOR_MOCKUP_HEIGHT}
      sizes="(max-width: 768px) 92vw, (max-width: 1280px) 42vw, 640px"
    />
  );
}

function TemplatesMockup() {
  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div
        className="absolute -inset-4 rounded-3xl bg-emerald-400/12 blur-2xl sm:-inset-8 sm:blur-3xl"
        aria-hidden
      />
      <div className="relative max-h-[520px] overflow-y-auto overflow-x-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-3 sm:max-h-[560px] sm:p-4">
        <AppStoreTemplateKit compact />
      </div>
    </div>
  );
}

function DevicesMockup() {
  return (
    <div className="relative w-full max-w-full sm:max-w-md">
      <div
        className="absolute -inset-4 rounded-3xl bg-emerald-400/15 blur-2xl sm:-inset-6 sm:blur-3xl"
        aria-hidden
      />
      <div className="relative flex items-end justify-center gap-2 rounded-2xl border border-zinc-700/90 bg-zinc-950 px-4 py-6 shadow-[0_24px_56px_rgba(0,0,0,0.45)] ring-1 ring-white/5 sm:gap-4 sm:px-6 sm:py-8">
        <div className="rounded-[1.2rem] border border-white/10 bg-zinc-900 p-1.5">
          <div className="h-28 w-14 rounded-[0.9rem] bg-gradient-to-b from-zinc-600 to-zinc-800" />
        </div>
        <div className="rounded-[1.4rem] border border-emerald-400/30 bg-zinc-900 p-2 ring-1 ring-emerald-400/20">
          <div className="h-36 w-[4.5rem] rounded-[1rem] bg-gradient-to-b from-zinc-500 to-zinc-800" />
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-2">
          <div className="h-24 w-16 rounded-lg bg-gradient-to-b from-zinc-600 to-zinc-800" />
        </div>
      </div>
    </div>
  );
}

function ExportMockup() {
  return (
    <FeatureMockupFrame
      src="/Export-mockup.png"
      alt="AppFrames export panel with App Store dimensions and download options"
      width={EXPORT_MOCKUP_WIDTH}
      height={EXPORT_MOCKUP_HEIGHT}
      sizes="(max-width: 768px) 72vw, (max-width: 1280px) 28vw, 360px"
      className="mx-auto max-w-full sm:max-w-sm md:max-w-md"
      glow={false}
    />
  );
}

export function FeatureTabMockup({ tab }: { tab: string }) {
  switch (tab) {
    case "editor":
      return <EditorMockup />;
    case "templates":
      return <TemplatesMockup />;
    case "devices":
      return <DevicesMockup />;
    case "export":
      return <ExportMockup />;
    default:
      return <EditorMockup />;
  }
}
