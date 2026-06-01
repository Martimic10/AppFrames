import type { ReactNode } from "react";

export function HeroShell({ children }: { children: ReactNode }) {
  return (
    <div className="hero-shell relative overflow-x-hidden">
      <div className="hero-mesh" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
