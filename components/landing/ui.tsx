import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

/** Shared vertical rhythm for landing sections */
export const landingSectionY = "py-14 sm:py-20 lg:py-24";

export function Container({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400 sm:mb-4 sm:text-sm sm:tracking-[0.18em]">
        {eyebrow}
      </p>
      <h2 className="text-pretty text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-pretty text-sm leading-relaxed text-zinc-300 sm:mt-4 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className = ""
}: ButtonProps) {
  const base =
    "inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:w-auto";
  const styles =
    variant === "primary"
      ? "bg-white text-zinc-900 hover:-translate-y-0.5 hover:bg-zinc-200"
      : "border border-zinc-700 bg-zinc-900/80 text-white hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-800";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
