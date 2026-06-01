import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Container } from "@/components/landing/ui";

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-400">{children}</div>
    </section>
  );
}

export function LegalPageShell({ title, lastUpdated, children }: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <article className="pb-8 pt-28 sm:pb-12 sm:pt-32">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
          <header className="mt-6 max-w-3xl border-b border-white/10 pb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-zinc-500">Last updated: {lastUpdated}</p>
          </header>
          <div className="max-w-3xl py-10">{children}</div>
        </Container>
      </article>
      <Footer />
    </main>
  );
}
