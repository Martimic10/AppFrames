import Image from "next/image";

function UploadGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[min(100%,280px)] rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">Drop zone</span>
        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          3 added
        </span>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-dashed border-white/15 bg-zinc-900/50 p-2">
        <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="relative flex h-[120px] items-center justify-center sm:h-[150px]">
          <Image
            src="/upload-mockup.png"
            alt="Upload screenshots mockup"
            width={325}
            height={555}
            className="h-full w-auto rounded-lg border border-white/10 object-contain shadow-[0_18px_30px_-20px_rgba(16,185,129,0.7)]"
          />
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {["Home.png", "Onboarding.png", "Paywall.png"].map((file, i) => (
          <div
            key={file}
            className="flex items-center gap-2 rounded-lg bg-zinc-900/80 px-2.5 py-1.5"
          >
            <div
              className={`h-1.5 flex-1 rounded-full ${
                i < 2 ? "bg-emerald-400/70" : "bg-white/20"
              }`}
            />
            <span className="text-[9px] text-zinc-500">{file}</span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[1.65rem] bg-emerald-400/10 blur-2xl" />
    </div>
  );
}

function CustomizeGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[min(100%,280px)] scale-[0.92] sm:scale-100">
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0a]">
        <span className="text-lg font-semibold text-white">AF</span>
      </div>
      <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-emerald-400/80" />
      <div className="absolute right-4 top-8 h-2.5 w-2.5 rounded-full bg-amber-300/80" />
      <div className="absolute bottom-6 left-6 h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
      <div className="absolute bottom-2 right-2 rounded-lg border border-white/10 bg-zinc-900/90 px-2 py-1.5">
        <p className="text-[9px] text-zinc-500">Template</p>
        <p className="text-[10px] font-medium text-white">Minimal Dark</p>
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-zinc-900/90 p-1.5">
        <div className="h-10 w-6 rounded-md bg-gradient-to-b from-zinc-600 to-zinc-800" />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-zinc-900/90 p-1.5">
        <div className="h-10 w-6 rounded-md bg-gradient-to-b from-zinc-500 to-zinc-700" />
      </div>
    </div>
  );
}

function ExportGraphic() {
  return (
    <div className="mx-auto w-full max-w-[min(100%,300px)] sm:max-w-[320px]">
      <Image
        src="/export-mockup2.png"
        alt="AppFrames export dialog with App Store dimensions and download options"
        width={430}
        height={449}
        className="h-auto w-full rounded-2xl object-contain"
      />
    </div>
  );
}

export function HowItWorksGraphic({ step }: { step: 1 | 2 | 3 }) {
  if (step === 1) return <UploadGraphic />;
  if (step === 2) return <CustomizeGraphic />;
  return <ExportGraphic />;
}
