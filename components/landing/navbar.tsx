"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6">
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={`mx-auto max-w-6xl rounded-xl border border-white/10 bg-[#0b0b0d]/95 px-3 ring-1 ring-white/5 backdrop-blur-xl sm:rounded-2xl sm:px-4 md:px-6 ${
          scrolled ? "shadow-[0_12px_35px_rgba(0,0,0,0.42)]" : "shadow-[0_8px_24px_rgba(0,0,0,0.26)]"
        }`}
      >
        <div className="grid h-12 grid-cols-[1fr_auto] items-center sm:h-14 md:grid-cols-[1fr_auto_1fr]">
          <a
            href="/"
            className="flex min-w-0 items-center gap-1 text-lg font-semibold tracking-tight text-white sm:gap-1.5 sm:text-xl md:text-2xl"
          >
            <Image
              src="/AppFrames-logo.PNG"
              alt="AppFrames logo"
              width={52}
              height={52}
              className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10 md:h-12 md:w-12"
            />
            <span className="truncate">AppFrames</span>
          </a>
          <ul className="hidden items-center justify-center gap-5 md:col-start-2 md:flex lg:gap-8">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`transition-colors hover:text-white ${
                    scrolled ? "text-[1.03rem] text-zinc-100/95" : "text-sm text-zinc-200/95"
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="col-start-2 row-start-1 flex items-center justify-self-end gap-2 md:col-start-3">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="hidden md:block">
              <a
                href="/create"
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold transition-all duration-300 ${
                  scrolled
                    ? "border border-zinc-200/70 bg-white text-sm text-zinc-900 hover:bg-zinc-100"
                    : "border border-zinc-200/70 bg-white text-xs text-zinc-900 hover:bg-zinc-200 md:text-sm"
                }`}
              >
                Start Free
              </a>
            </motion.div>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70 text-zinc-200 sm:h-10 sm:w-10 sm:rounded-xl md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="border-t border-white/10 py-3 md:hidden"
            >
              <ul className="space-y-1 pb-3 text-center">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-2.5 py-2 text-sm text-zinc-200 hover:bg-white/5"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="/create"
                onClick={() => setMobileOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200/70 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                Start Free
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
