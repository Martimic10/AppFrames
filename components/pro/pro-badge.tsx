import { Crown } from "lucide-react";

type ProBadgeProps = {
  className?: string;
  size?: "sm" | "md";
};

const baseClass =
  "inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900/80 font-semibold text-white";

export function ProBadge({ className = "", size = "sm" }: ProBadgeProps) {
  const sizeClass =
    size === "md"
      ? "gap-1.5 px-2.5 py-2 text-xs"
      : "gap-1 px-1.5 py-0.5 text-[9px]";

  const iconClass = size === "md" ? "h-3.5 w-3.5" : "h-2.5 w-2.5";

  return (
    <span className={`${baseClass} ${sizeClass} ${className}`}>
      <Crown className={`${iconClass} shrink-0`} aria-hidden />
      Pro
    </span>
  );
}
