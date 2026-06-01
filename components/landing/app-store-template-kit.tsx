"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent
} from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { categories } from "@/components/create/category-data";
import { KitPhoneScreenshotFill } from "@/components/create/kit-phone-screenshot-fill";
import type { CategoryId } from "@/components/create/types";
import "./app-store-template-kit.css";

/* ─── Filter & typography ─── */

type FilterId = "all" | "dark" | "light" | "gradient";
type FontPreset = "condensed" | "editorial" | "poppins";
type ScreenKind =
  | "productivity"
  | "finance"
  | "ai"
  | "social"
  | "fitness"
  | "gaming"
  | "sports"
  | "ecommerce"
  | "travel";

type KitCategory = {
  id: CategoryId;
  tag: string;
  headline: string;
  shimmerWord?: string;
  theme: FilterId;
  font: FontPreset;
  accentVar: string;
  phoneRotate?: number;
  phoneBleed?: boolean;
  cardOverflowVisible?: boolean;
};

const KIT_CATEGORIES: KitCategory[] = [
  {
    id: "productivity",
    tag: "PRODUCTIVITY",
    headline: "Organize your workflow beautifully",
    theme: "light",
    font: "editorial",
    accentVar: "var(--tpl-productivity-accent)",
    phoneRotate: 2
  },
  {
    id: "finance",
    tag: "FINANCE",
    headline: "Track your money smarter",
    shimmerWord: "money",
    theme: "dark",
    font: "editorial",
    accentVar: "var(--tpl-finance-accent)",
    phoneRotate: -2
  },
  {
    id: "ai",
    tag: "ARTIFICIAL INTELLIGENCE",
    headline: "The future of productivity",
    theme: "gradient",
    font: "condensed",
    accentVar: "var(--tpl-ai-accent)",
    phoneBleed: true
  },
  {
    id: "social",
    tag: "SOCIAL",
    headline: "Connect with your community",
    theme: "gradient",
    font: "poppins",
    accentVar: "var(--tpl-social-accent)",
    phoneRotate: 3,
    cardOverflowVisible: true
  },
  {
    id: "fitness",
    tag: "FITNESS",
    headline: "Train smarter every day",
    theme: "dark",
    font: "condensed",
    accentVar: "var(--tpl-fitness-accent)"
  },
  {
    id: "gaming",
    tag: "GAMING",
    headline: "Level up your experience",
    theme: "dark",
    font: "condensed",
    accentVar: "var(--tpl-gaming-accent)",
    phoneRotate: -4,
    phoneBleed: true,
    cardOverflowVisible: true
  },
  {
    id: "sports",
    tag: "SPORTS",
    headline: "Dominate every match",
    theme: "dark",
    font: "condensed",
    accentVar: "var(--tpl-sports-accent)",
    phoneRotate: 3,
    cardOverflowVisible: true
  },
  {
    id: "ecommerce",
    tag: "E-COMMERCE",
    headline: "Shop smarter, sell faster",
    theme: "light",
    font: "editorial",
    accentVar: "var(--tpl-ecommerce-accent)",
    phoneRotate: -2.5
  },
  {
    id: "travel",
    tag: "TRAVEL",
    headline: "Explore the world your way",
    theme: "gradient",
    font: "editorial",
    accentVar: "var(--tpl-travel-accent)",
    phoneRotate: -3,
    cardOverflowVisible: true
  }
];

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "gradient", label: "Gradient" }
];

function fontClass(font: FontPreset): string {
  switch (font) {
    case "condensed":
      return "font-[family-name:var(--font-barlow-condensed)] font-bold uppercase tracking-wide";
    case "poppins":
      return "font-[family-name:var(--font-poppins)] font-black";
    default:
      return "font-[family-name:var(--font-playfair)] font-semibold";
  }
}

/* ─── Phone chrome ─── */

function StatusBar({ light }: { light?: boolean }) {
  const fg = light ? "text-zinc-800" : "text-white/90";
  return (
    <div
      className={`flex items-center justify-between px-3.5 pt-2.5 text-[11px] font-semibold ${fg}`}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1" aria-hidden>
        <span className={`h-[5px] w-[3px] rounded-sm ${light ? "bg-zinc-700" : "bg-white/80"}`} />
        <span className={`h-[7px] w-[3px] rounded-sm ${light ? "bg-zinc-700" : "bg-white/80"}`} />
        <span className={`h-[9px] w-[3px] rounded-sm ${light ? "bg-zinc-700" : "bg-white/80"}`} />
        <span className={`h-[11px] w-[3px] rounded-sm ${light ? "bg-zinc-700" : "bg-white"}`} />
        <span
          className={`ml-1 h-2.5 w-5 rounded-[3px] border ${light ? "border-zinc-600" : "border-white/70"}`}
        >
          <span
            className={`block h-full w-[70%] rounded-[2px] ${light ? "bg-zinc-700" : "bg-white/90"}`}
          />
        </span>
      </div>
    </div>
  );
}

function BottomNav({ light }: { light?: boolean }) {
  const base = light ? "bg-zinc-300" : "bg-white/35";
  return (
    <div
      className={`absolute inset-x-0 bottom-0 flex items-center justify-around border-t px-4 py-2.5 ${
        light ? "border-zinc-200/80 bg-white/90" : "border-white/10 bg-black/40"
      }`}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-4 w-4 rounded-md ${base} ${i === 0 ? (light ? "bg-zinc-800" : "bg-white/90") : ""}`}
        />
      ))}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-violet-300"
          style={{
            animation: "tpl-typing-bounce 1.2s ease infinite",
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}
    </span>
  );
}

function CountUp({
  target,
  prefix = "",
  suffix = ""
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const t0 = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <span>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

function PhoneScreen({
  kind,
  light,
  screenshotUrl,
  templateId
}: {
  kind: ScreenKind;
  light?: boolean;
  screenshotUrl?: string | null;
  templateId?: string;
}) {
  if (screenshotUrl) {
    return (
      <div className="template-kit-phone-screen-inner template-kit-phone-screen-inner--shot">
        <KitPhoneScreenshotFill src={screenshotUrl} />
      </div>
    );
  }
  const text = light ? "text-zinc-800" : "text-white";
  const muted = light ? "text-zinc-500" : "text-white/55";
  const panel = light ? "bg-white/80 border-zinc-200/80" : "bg-white/8 border-white/10";

  return (
    <div
      className={`template-kit-phone-screen-inner relative flex h-full min-h-0 flex-col pb-10 text-[11px] leading-snug sm:text-[12px] ${text}`}
    >
      <StatusBar light={light} />
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 overflow-hidden px-2.5 pb-1 pt-0.5">
        {kind === "productivity" && templateId === "focus" && (
          <>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${muted}`}>
              Focus block
            </p>
            <div className={`rounded-xl border px-3 py-3 ${panel}`}>
              <p className="text-lg font-semibold">90 min</p>
              <p className={`mt-1 text-[11px] ${muted}`}>Deep work · no notifications</p>
            </div>
            {["Inbox closed", "Slack paused"].map((t) => (
              <div
                key={t}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${panel}`}
              >
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="text-[11px]">{t}</span>
              </div>
            ))}
          </>
        )}
        {kind === "productivity" && templateId === "studio" && (
          <>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${muted}`}>
              Workspace
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {["Roadmap", "Clients", "Sprints", "Assets"].map((t) => (
                <div key={t} className={`rounded-lg border px-2 py-2 text-[10px] font-medium ${panel}`}>
                  {t}
                </div>
              ))}
            </div>
            <div className={`mt-1 h-12 rounded-lg border ${panel}`} />
          </>
        )}
        {kind === "productivity" && templateId !== "focus" && templateId !== "studio" && (
          <>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${muted}`}>Today</p>
            {["Ship v2.0", "Review designs", "Export assets"].map((t, i) => (
              <div
                key={t}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${panel}`}
              >
                <span
                  className={`h-3.5 w-3.5 shrink-0 rounded border ${
                    i === 0 ? "border-emerald-400 bg-emerald-500/40" : "border-white/20"
                  }`}
                />
                <span className={i === 0 ? "font-medium" : ""}>{t}</span>
              </div>
            ))}
          </>
        )}
        {kind === "finance" && templateId === "ledger" && (
          <>
            <p className={`text-[10px] uppercase tracking-wider text-amber-200/80`}>Net worth</p>
            <p className="text-2xl font-semibold tabular-nums text-amber-50">
              <CountUp target={2840000} prefix="$" />
            </p>
            <div className={`mt-2 space-y-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-2`}>
              {["Vault", "Yield 4.2%"].map((t) => (
                <p key={t} className="text-[10px] text-amber-100/90">
                  {t}
                </p>
              ))}
            </div>
          </>
        )}
        {kind === "finance" && templateId === "markets" && (
          <>
            <p className={`text-[10px] uppercase tracking-wider ${muted}`}>Live markets</p>
            <div className={`h-16 rounded-lg border ${panel}`} />
            <div className="flex justify-between text-[10px]">
              <span className="text-emerald-400">S&P +1.2%</span>
              <span className={muted}>Vol 18.4</span>
            </div>
          </>
        )}
        {kind === "finance" && templateId !== "ledger" && templateId !== "markets" && (
          <>
            <p className={`text-[10px] uppercase tracking-wider ${muted}`}>Portfolio</p>
            <p className="text-2xl font-semibold tabular-nums">
              <CountUp target={128450} prefix="$" />
            </p>
            <p className={`text-[11px] ${muted}`}>+12.4% this month</p>
            <div className={`mt-2 h-14 rounded-lg border ${panel}`} />
          </>
        )}
        {kind === "ai" && (
          <div className="space-y-2">
            <div className={`max-w-[85%] rounded-xl rounded-bl-sm border px-2.5 py-2 ${panel}`}>
              Summarize my launch deck
            </div>
            <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-violet-600/90 px-2.5 py-2 text-white">
              Here&apos;s a tight 3-bullet version…
            </div>
            <TypingDots />
          </div>
        )}
        {kind === "social" && (
          <>
            {[1, 2].map((n) => (
              <div key={n} className={`rounded-xl border p-2.5 ${panel}`}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-gradient-to-br from-rose-400 to-orange-400" />
                  <span className="text-[11px] font-semibold">@creator{n}</span>
                </div>
                <div className={`h-10 rounded-lg ${light ? "bg-zinc-100" : "bg-white/10"}`} />
              </div>
            ))}
          </>
        )}
        {kind === "fitness" && (
          <>
            <p className="text-3xl font-bold tabular-nums">8,420</p>
            <p className={`text-[11px] ${muted}`}>steps today</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-red-500" />
            </div>
          </>
        )}
        {kind === "gaming" && (
          <>
            <p className="text-[10px] uppercase tracking-wider text-violet-300">Level 42</p>
            <p className="text-xl font-bold">Raid Boss</p>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-400" />
            </div>
            <p className={`text-[11px] ${muted}`}>XP 12,400 / 14,000</p>
          </>
        )}
        {kind === "sports" && (
          <>
            <p className="text-center text-4xl font-bold tabular-nums">24 – 21</p>
            <p className={`text-center text-[11px] ${muted}`}>Q4 · 2:14 left</p>
          </>
        )}
        {kind === "ecommerce" && (
          <div className={`rounded-xl border p-2 ${panel}`}>
            <div className={`mb-2 h-20 rounded-lg ${light ? "bg-amber-100" : "bg-white/12"}`} />
            <p className="font-semibold">Ceramic Mug</p>
            <p className={`text-[11px] ${muted}`}>$24.00</p>
          </div>
        )}
        {kind === "travel" && (
          <>
            <p className="text-lg font-semibold">Kyoto</p>
            <p className={`text-[11px] ${muted}`}>Apr 12 – Apr 19</p>
            <div className={`mt-2 h-24 rounded-xl ${light ? "bg-sky-100" : "bg-sky-500/20"}`} />
          </>
        )}
      </div>
      <BottomNav light={light} />
    </div>
  );
}

function PhoneMockup({
  kind,
  light,
  rotate = 0,
  accentShadow,
  frameColor,
  screenshotUrl,
  templateId,
  realistic = false,
  compact = false,
  editorSlot = false
}: {
  kind: ScreenKind;
  light?: boolean;
  rotate?: number;
  accentShadow: string;
  frameColor?: string;
  screenshotUrl?: string | null;
  templateId?: string;
  realistic?: boolean;
  /** Editor canvas: no extra scale — keeps mockup inside the slide */
  compact?: boolean;
  /** /create slide overlay — no side buttons or inner rotate (host handles transform). */
  editorSlot?: boolean;
}) {
  const pro = realistic;
  const proTransform = editorSlot
    ? undefined
    : compact
      ? `rotate(${rotate}deg)`
      : `scale(1.02) rotate(${rotate}deg)`;

  return (
    <div
      className={`template-kit-phone-wrap ${
        pro ? "template-kit-phone-wrap--realistic template-kit-phone-wrap--pro" : ""
      } ${compact ? "template-kit-phone-wrap--compact" : ""} ${
        editorSlot ? "template-kit-phone-wrap--editor-slot" : ""
      }`}
      style={{
        transform: editorSlot
          ? undefined
          : pro
            ? proTransform
            : `translateY(-8px) rotate(${rotate}deg)`,
        ["--tpl-phone-shadow" as string]: accentShadow,
        ["--tpl-phone-frame" as string]: frameColor ?? "#5b3d8f"
      }}
    >
      {pro && !editorSlot ? (
        <>
          <span className="template-kit-phone-side-btn template-kit-phone-side-btn--mute" aria-hidden />
          <span
            className="template-kit-phone-side-btn template-kit-phone-side-btn--vol-up"
            aria-hidden
          />
          <span
            className="template-kit-phone-side-btn template-kit-phone-side-btn--vol-down"
            aria-hidden
          />
          <span
            className="template-kit-phone-side-btn template-kit-phone-side-btn--power"
            aria-hidden
          />
        </>
      ) : null}
      <div
        className={`template-kit-phone ${pro ? "template-kit-phone--realistic template-kit-phone--pro" : ""}`}
      >
        <div
          className={`template-kit-phone-screen ${pro ? "template-kit-phone-screen--realistic template-kit-phone-screen--pro" : ""} ${
            screenshotUrl ? "template-kit-phone-screen--has-shot" : ""
          }`}
        >
          <PhoneScreen
            kind={kind}
            light={light}
            screenshotUrl={screenshotUrl}
            templateId={templateId}
          />
        </div>
      </div>
    </div>
  );
}

export function PortraitPhoneSlot({
  kind,
  light,
  rotate,
  accentShadow,
  frameColor,
  screenshotUrl,
  templateId,
  showDeviceFrame = true,
  showUploadedMockupAsIs = true,
  compact = false,
  editorSlot = false
}: {
  kind: ScreenKind;
  light?: boolean;
  rotate: number;
  accentShadow: string;
  frameColor: string;
  screenshotUrl?: string | null;
  templateId?: string;
  showDeviceFrame?: boolean;
  showUploadedMockupAsIs?: boolean;
  compact?: boolean;
  editorSlot?: boolean;
}) {
  const hasScreenshot = Boolean(screenshotUrl);
  const flatScreenshot = hasScreenshot && !showDeviceFrame && showUploadedMockupAsIs;
  const showPlaceholder = !hasScreenshot && showDeviceFrame;
  const displayRotate = compact ? rotate * 0.85 : rotate;
  const flatTransform =
    editorSlot ? undefined : compact ? `rotate(${displayRotate}deg)` : `rotate(${rotate}deg)`;

  if (flatScreenshot && screenshotUrl) {
    return (
      <div
        className="template-kit-portrait-phone-flat template-kit-portrait-phone-flat--shot"
        style={flatTransform ? { transform: flatTransform } : undefined}
        data-export-device-host={editorSlot ? undefined : true}
        data-screenshot-src={screenshotUrl}
        data-mockup-width-percent="70"
      >
        <KitPhoneScreenshotFill src={screenshotUrl} className="h-full w-full" />
      </div>
    );
  }

  if (hasScreenshot && !showDeviceFrame) {
    return null;
  }

  if (!showDeviceFrame) {
    return null;
  }

  return (
    <PhoneMockup
      kind={kind}
      light={light}
      rotate={editorSlot ? 0 : displayRotate}
      accentShadow={accentShadow}
      frameColor={frameColor}
      screenshotUrl={showPlaceholder ? null : screenshotUrl}
      templateId={templateId}
      realistic
      compact={compact}
      editorSlot={editorSlot}
    />
  );
}

export { PhoneMockup as KitPhoneMockup };

/* ─── Category card backgrounds ─── */

function CategoryBackground({ cat }: { cat: KitCategory }) {
  const id = cat.id;

  if (id === "productivity") {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background: "var(--tpl-productivity-bg)",
            backgroundImage:
              "radial-gradient(circle, rgba(15,23,42,0.08) 1px, transparent 1px)",
            backgroundSize: "14px 14px"
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-1"
          style={{ background: "var(--tpl-productivity-accent)" }}
        />
      </>
    );
  }

  if (id === "finance") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: "var(--tpl-finance-bg)",
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(212,175,55,0.06) 0, rgba(212,175,55,0.06) 1px, transparent 1px, transparent 10px)"
        }}
      />
    );
  }

  if (id === "ai") {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1a0533 0%, #0c0618 40%, #2d1b69 100%)",
            backgroundSize: "200% 200%",
            animation: "tpl-ai-gradient 12s ease infinite"
          }}
        />
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-500/40"
          style={{ animation: "tpl-ai-pulse 3.5s ease-out infinite" }}
        />
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/25"
          style={{ animation: "tpl-ai-pulse 3.5s ease-out infinite 1.2s" }}
        />
      </>
    );
  }

  if (id === "social") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #f43f5e 0%, #fb923c 35%, #a855f7 70%, #ec4899 100%)",
          animation: "tpl-social-hue 18s linear infinite"
        }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/25"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              left: `${(i * 17) % 92}%`,
              top: `${(i * 23) % 88}%`
            }}
          />
        ))}
      </div>
    );
  }

  if (id === "fitness") {
    return (
      <>
        <div className="absolute inset-0 bg-[var(--tpl-fitness-bg)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)"
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-1"
          style={{
            background: "var(--tpl-fitness-accent)",
            animation: "tpl-fitness-pulse 2.5s ease-in-out infinite"
          }}
        />
      </>
    );
  }

  if (id === "gaming") {
    return (
      <div className="absolute inset-0 bg-[var(--tpl-gaming-bg)]">
        {[
          { w: 6, left: "12%", top: "18%", delay: "0s", color: "#c084fc" },
          { w: 8, left: "78%", top: "22%", delay: "0.8s", color: "#f472b6" },
          { w: 5, left: "65%", top: "68%", delay: "1.4s", color: "#a78bfa" },
          { w: 7, left: "22%", top: "72%", delay: "0.4s", color: "#e879f9" },
          { w: 4, left: "48%", top: "12%", delay: "1.1s", color: "#818cf8" },
          { w: 6, left: "88%", top: "55%", delay: "1.8s", color: "#f0abfc" }
        ].map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              width: p.w,
              height: p.w,
              left: p.left,
              top: p.top,
              background: p.color,
              animation: `tpl-particle-float 5s ease-in-out infinite ${p.delay}`
            }}
          />
        ))}
      </div>
    );
  }

  if (id === "sports") {
    return <div className="absolute inset-0 bg-[var(--tpl-sports-bg)]" />;
  }

  if (id === "ecommerce") {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, #fdfaf5 0%, #ffffff 55%, #fff7ed 100%)"
          }}
        />
        <div
          className="absolute inset-y-0 left-[42%] w-px bg-stone-300/60"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-[42%] top-0 w-[58%] bg-gradient-to-l from-white/40 to-transparent"
          aria-hidden
        />
      </>
    );
  }

  if (id === "travel") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(145deg, #7dd3fc 0%, #fdba74 45%, #fef3c7 100%)",
          backgroundSize: "220% 220%",
          animation: "tpl-travel-gradient 14s ease infinite"
        }}
      >
        <span
          className="absolute left-[10%] top-[15%] h-16 w-28 rounded-full bg-white/35 blur-2xl"
          style={{ animation: "tpl-cloud-drift 9s ease-in-out infinite" }}
        />
        <span
          className="absolute right-[8%] top-[40%] h-20 w-32 rounded-full bg-white/25 blur-2xl"
          style={{ animation: "tpl-cloud-drift 11s ease-in-out infinite 2s" }}
        />
      </div>
    );
  }

  return null;
}

function SportsTicker() {
  const text =
    "LAL 112 — BOS 108  ·  NYK 99 — MIA 101  ·  GSW 118 — PHX 115  ·  ";
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/10 bg-black/75 py-1.5">
      <div
        className="flex whitespace-nowrap font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-wider text-white/70"
        style={{ animation: "tpl-ticker 22s linear infinite" }}
      >
        <span>{text}</span>
        <span aria-hidden>{text}</span>
      </div>
    </div>
  );
}

/* ─── Template card ─── */

export type TemplateKitPickerVisual = {
  theme: FilterId;
  font: FontPreset;
  accentColor: string;
  accentSoft: string;
  backgroundImage: string;
  useCategoryBackground: boolean;
  phoneRotate: number;
  phoneBleed: boolean;
  badge?: string;
  shimmerWord?: string;
};

export type TemplateKitCategoryCardProps = {
  categoryId: CategoryId;
  templateId?: string;
  headline?: string;
  subheadline?: string;
  screenshotUrl?: string | null;
  showDeviceFrame?: boolean;
  showUploadedMockupAsIs?: boolean;
  editorCanvas?: boolean;
  hidePortraitCopy?: boolean;
  hidePortraitPhone?: boolean;
  active?: boolean;
  interactive?: boolean;
  hideCopy?: boolean;
  hideCta?: boolean;
  layout?: "landscape" | "portrait";
  pickerVisual?: TemplateKitPickerVisual;
  /** Style tab background — replaces pack/category art in the editor. */
  editorBackgroundStyle?: CSSProperties;
  /** Backdrop is rendered on the slide frame; kit draws template accents only. */
  editorExternalBackground?: boolean;
  onSelect?: () => void;
  onMouseEnter?: () => void;
};

function PackBackground({ image }: { image: string }) {
  return <div className="absolute inset-0" style={{ background: image }} aria-hidden />;
}

/** Full-bleed template art direction for editor canvas cards (matches Features kit). */
export function TemplateKitFrameBackground({
  categoryId,
  visual
}: {
  categoryId: CategoryId;
  visual: TemplateKitPickerVisual;
}) {
  const cat = KIT_CATEGORIES.find((c) => c.id === categoryId) ?? KIT_CATEGORIES[0];

  return (
    <>
      {visual.useCategoryBackground ? (
        <CategoryBackground cat={cat} />
      ) : (
        <PackBackground image={visual.backgroundImage} />
      )}
      {!visual.useCategoryBackground && visual.theme === "gradient" ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(95% 75% at 50% 8%, ${visual.accentSoft}, transparent 70%)`
          }}
          aria-hidden
        />
      ) : null}
      <div
        className="template-kit-card__noise"
        style={{
          background: "rgba(128,128,128,0.4)",
          filter: "url(#template-kit-noise)",
          opacity: visual.theme === "light" ? 0.03 : 0.045
        }}
        aria-hidden
      />
    </>
  );
}

export function TemplateKitCategoryCard({
  categoryId,
  templateId,
  headline,
  subheadline,
  screenshotUrl,
  showDeviceFrame = true,
  showUploadedMockupAsIs = true,
  editorCanvas = false,
  hidePortraitCopy = false,
  hidePortraitPhone = false,
  active = false,
  interactive = true,
  hideCopy = false,
  hideCta = false,
  layout = "landscape",
  pickerVisual,
  editorBackgroundStyle,
  editorExternalBackground = false,
  onSelect,
  onMouseEnter
}: TemplateKitCategoryCardProps) {
  const cat = KIT_CATEGORIES.find((c) => c.id === categoryId) ?? KIT_CATEGORIES[0];
  const meta = categories.find((c) => c.id === categoryId)!;
  const cardTheme = pickerVisual?.theme ?? cat.theme;
  const isLight = cardTheme === "light";
  const cardFont = pickerVisual?.font ?? cat.font;
  const accent = pickerVisual?.accentColor ?? cat.accentVar;
  const accentIsVar = accent.startsWith("var(");
  const displayHeadline = headline ?? cat.headline;
  const displaySubheadline = subheadline ?? meta.subheadline;
  const shimmerWord = pickerVisual?.shimmerWord ?? cat.shimmerWord;
  const phoneRotate = pickerVisual?.phoneRotate ?? cat.phoneRotate ?? 0;
  const phoneBleed = pickerVisual?.phoneBleed ?? cat.phoneBleed ?? false;
  const isPortrait = layout === "portrait";

  const resolvedText =
    cat.id === "finance"
      ? "var(--tpl-finance-text)"
      : cat.id === "ecommerce"
        ? "var(--tpl-ecommerce-text)"
        : cat.id === "travel"
          ? "var(--tpl-travel-text)"
          : isLight
            ? "var(--tpl-productivity-text)"
            : "#f8fafc";

  const [copied, setCopied] = useState(false);

  const copyStyle = useCallback(async () => {
    const snippet = `/* ${meta.title} */\n--accent: ${cat.accentVar};\nbackground: ${meta.canvasGradient};`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, [cat.accentVar, meta.canvasGradient, meta.title]);

  const headlineParts = shimmerWord
    ? displayHeadline.split(new RegExp(`(${shimmerWord})`, "i"))
    : [displayHeadline];

  const accentShadow = accentIsVar
    ? `color-mix(in srgb, ${accent} 45%, transparent)`
    : `color-mix(in srgb, ${accent} 45%, transparent)`;

  const shellProps = interactive
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick: onSelect,
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.();
          }
        }
      }
    : {
        onMouseEnter
      };

  return (
    <article
      {...shellProps}
      className={`template-kit-card group ${interactive ? "cursor-pointer" : "pointer-events-none"} ${active ? "is-active" : ""} ${
        cat.cardOverflowVisible ? "overflow-visible" : "overflow-hidden"
      }`}
      style={{
        ["--tpl-card-accent" as string]: accent,
        boxShadow: editorCanvas
            ? "none"
            : isLight
              ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 16px 40px -16px rgba(15,23,42,0.12)"
              : `0 20px 48px -16px ${accentShadow}, inset 0 0 0 1px color-mix(in srgb, ${accent} 20%, transparent)`
      }}
    >
      {editorCanvas ? (
        editorExternalBackground ? null : editorBackgroundStyle ? (
          <div
            className="pointer-events-none absolute inset-0"
            style={editorBackgroundStyle}
            aria-hidden
          />
        ) : pickerVisual ? (
          pickerVisual.useCategoryBackground ? (
            <CategoryBackground cat={cat} />
          ) : (
            <PackBackground image={pickerVisual.backgroundImage} />
          )
        ) : null
      ) : editorBackgroundStyle ? null : pickerVisual &&
        !pickerVisual.useCategoryBackground ? (
        <PackBackground image={pickerVisual.backgroundImage} />
      ) : (
        <CategoryBackground cat={cat} />
      )}
      {editorCanvas &&
      pickerVisual &&
      !pickerVisual.useCategoryBackground &&
      cardTheme === "gradient" &&
      (editorExternalBackground || !editorBackgroundStyle) ? (
        <div
          className={`pointer-events-none absolute inset-0 ${
            editorExternalBackground ? "opacity-35" : "opacity-80"
          }`}
          style={{
            background: `radial-gradient(90% 70% at 50% 0%, ${pickerVisual.accentSoft}, transparent 65%)`
          }}
          aria-hidden
        />
      ) : null}
      {!editorCanvas &&
      !editorBackgroundStyle &&
      pickerVisual &&
      !pickerVisual.useCategoryBackground &&
      cardTheme === "gradient" ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(90% 70% at 50% 0%, ${pickerVisual.accentSoft}, transparent 65%)`
          }}
          aria-hidden
        />
      ) : null}

      {editorCanvas ? null : (
        <div
          className="template-kit-card__noise"
          style={{ background: "rgba(128,128,128,0.4)", filter: "url(#template-kit-noise)" }}
        />
      )}

      {!hideCopy ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            void copyStyle();
          }}
          className="template-kit-copy-btn absolute right-4 top-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm hover:bg-black/55"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy Style"}
        </button>
      ) : null}

      {pickerVisual?.badge ? (
        <span
          className={`absolute z-40 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
            isPortrait ? "left-2.5 top-2.5" : "right-3 top-3"
          }`}
          style={{
            color: accent,
            borderColor: pickerVisual.accentSoft,
            background: "rgba(0,0,0,0.4)"
          }}
        >
          {pickerVisual.badge}
        </span>
      ) : null}

      {isPortrait ? (
        <div className="template-kit-portrait-body relative z-10 flex h-full flex-col">
          <div className="template-kit-portrait-phone relative flex min-h-0 flex-1 items-center justify-center overflow-visible px-1 pt-1">
            {!hidePortraitPhone ? (
              <PortraitPhoneSlot
                kind={cat.id as ScreenKind}
                light={isLight}
                rotate={phoneRotate}
                accentShadow={accentShadow}
                frameColor={accent}
                screenshotUrl={screenshotUrl}
                templateId={templateId}
                showDeviceFrame={showDeviceFrame}
                showUploadedMockupAsIs={showUploadedMockupAsIs}
                compact={editorCanvas}
              />
            ) : null}
          </div>
          <div
            className={`template-kit-portrait-copy flex shrink-0 flex-col items-center px-3 pb-4 pt-2 text-center ${
              isLight ? "template-kit-portrait-copy--light" : "template-kit-portrait-copy--dark"
            }`}
          >
            {!hidePortraitCopy ? (
              <>
                <h3
                  className={`template-kit-headline line-clamp-3 text-pretty leading-[1.1] ${fontClass(cardFont)}`}
                  style={{
                    color: resolvedText,
                    textShadow: isLight
                      ? "0 1px 0 rgba(255,255,255,0.6)"
                      : "0 2px 16px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.8)"
                  }}
                >
                  {headlineParts.map((part, i) =>
                    shimmerWord && part.toLowerCase() === shimmerWord.toLowerCase() ? (
                      <span key={i} className="template-kit-shimmer">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </h3>
                <p
                  className="mt-1.5 line-clamp-2 max-w-[232px] text-[10px] leading-snug"
                  style={{
                    color: isLight ? "rgba(15,23,42,0.72)" : "rgba(248,250,252,0.78)",
                    textShadow: isLight ? "none" : "0 1px 8px rgba(0,0,0,0.65)"
                  }}
                >
                  {displaySubheadline}
                </p>
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex h-full">
          <div
            className={`relative flex shrink-0 items-center justify-center ${
              phoneBleed ? "w-[48%] overflow-visible" : "w-[46%] overflow-visible"
            }`}
          >
            <PhoneMockup
              kind={cat.id as ScreenKind}
              light={isLight}
              rotate={phoneRotate}
              accentShadow={accentShadow}
              screenshotUrl={screenshotUrl}
              templateId={templateId}
            />
          </div>

          <div
            className={`flex min-w-0 flex-1 flex-col justify-center pr-8 ${
              cat.id === "sports" ? "pb-10" : ""
            } ${cat.id === "ecommerce" ? "pl-2" : "pl-4"}`}
          >
            <span
              className="template-kit-tag mb-3 inline-flex w-fit rounded-full border px-2.5 py-1"
              style={{
                color: accent,
                borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
                background: `color-mix(in srgb, ${accent} 12%, transparent)`
              }}
            >
              {cat.tag}
            </span>

            <h3
              className={`template-kit-headline text-pretty leading-[1.05] ${fontClass(cardFont)} ${
                isLight ? "" : "drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
              }`}
              style={{
                color: resolvedText,
                fontSize: "clamp(32px, 4.2vw, 44px)"
              }}
            >
              {headlineParts.map((part, i) =>
                shimmerWord && part.toLowerCase() === shimmerWord.toLowerCase() ? (
                  <span key={i} className="template-kit-shimmer">
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </h3>

            <p
              className="mt-3 max-w-[240px] text-sm leading-relaxed"
              style={{ color: isLight ? "rgba(15,23,42,0.55)" : "rgba(248,250,252,0.55)" }}
            >
              {displaySubheadline}
            </p>

            {!hideCta ? (
              <span
                className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                style={{
                  borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
                  color: accent,
                  background: `color-mix(in srgb, ${accent} 10%, transparent)`
                }}
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            ) : null}
          </div>
        </div>
      )}

      {cat.id === "sports" && !isPortrait ? <SportsTicker /> : null}
    </article>
  );
}

function TemplateCard({
  cat,
  active,
  onSelect
}: {
  cat: KitCategory;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <TemplateKitCategoryCard
      categoryId={cat.id}
      active={active}
      onSelect={onSelect}
    />
  );
}

/* ─── Main export ─── */

export function AppStoreTemplateKit({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState<CategoryId>("productivity");

  const visible = useMemo(() => {
    if (filter === "all") return KIT_CATEGORIES;
    return KIT_CATEGORIES.filter((c) => c.theme === filter);
  }, [filter]);

  return (
    <div className={`template-kit ${compact ? "template-kit--compact" : ""}`}>
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <filter id="template-kit-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={4}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <header className="mb-8 text-center md:mb-10">
        <p className="font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          App Store Template Kit
        </p>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">9 Premium Categories</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`template-kit-filter-btn rounded-full border px-4 py-1.5 text-xs font-medium ${
                filter === f.id
                  ? "border-white/25 bg-white text-zinc-900"
                  : "border-white/10 bg-zinc-900/80 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div
        className={`mx-auto grid justify-items-center gap-6 ${
          compact
            ? "max-w-full"
            : "max-w-[min(100%,1280px)] sm:grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {visible.map((cat) => (
          <div
            key={cat.id}
            className="template-kit-card-enter w-full"
            style={{ maxWidth: "var(--tpl-card-w)" }}
          >
            <TemplateCard
              cat={cat}
              active={activeId === cat.id}
              onSelect={() => setActiveId(cat.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
