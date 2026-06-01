import { Container } from "@/components/landing/ui";
import { Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Templates", href: "#showcase" },
    { label: "Pricing", href: "#pricing" }
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "FAQ", href: "#faq" }
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" }
  ]
};

const socialLinks = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "Instagram", href: "#", icon: Instagram }
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-12 sm:py-14">
      <Container>
        <div className="flex flex-col items-center gap-10 sm:gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center justify-center gap-1.5 lg:justify-start">
            <Image
              src="/AppFrames-logo.PNG"
              alt="AppFrames logo"
              width={64}
              height={64}
              className="h-11 w-11 object-contain sm:h-14 sm:w-14"
            />
            <span className="text-lg font-semibold text-white sm:text-xl">AppFrames</span>
          </div>

          <div className="grid w-full max-w-xs grid-cols-1 gap-8 text-center sm:max-w-none sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0 sm:text-left md:gap-x-16 lg:w-auto">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p className="text-sm font-medium text-white">{title}</p>
                <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/5 pt-8 text-center sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-8 sm:text-left">
          <p className="text-xs text-zinc-600 sm:text-sm">
            © {new Date().getFullYear()} AppFrames. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-zinc-500 transition-colors hover:text-zinc-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
