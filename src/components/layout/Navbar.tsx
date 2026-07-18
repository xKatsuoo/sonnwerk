"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const links = [
  { href: "#vorteile", label: "Vorteile" },
  { href: "#speicher", label: "Speicher" },
  { href: "#wallbox", label: "Wallbox" },
  { href: "#foerderung", label: "Förderung" },
  { href: "#referenzen", label: "Referenzen" },
  { href: "#faq", label: "FAQ" },
];

/** Sticky, transparent-to-blurred top navigation with the primary CTA. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-white/70 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 sm:px-8 lg:px-12"
        aria-label="Hauptnavigation"
      >
        <Link href="#top" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span
            className={cn("bg-solar-blue inline-block h-2.5 w-2.5 rounded-full transition-colors")}
            aria-hidden
          />
          <span className={scrolled ? "text-ink" : "text-ink"}>SONNWERK</span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-ink text-sm font-medium text-gray-600 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="#kontakt" variant="primary" className="!px-6 !py-3 text-[13px]">
            Kostenlose Beratung
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 lg:hidden"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-4">
            <span
              className={cn(
                "bg-ink absolute top-0 left-0 h-px w-4 transition-transform duration-300",
                open && "translate-y-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "bg-ink absolute bottom-0 left-0 h-px w-4 transition-transform duration-300",
                open && "-translate-y-1.5 -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-base font-medium text-gray-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Button href="#kontakt" variant="primary" className="w-full" onClick={() => setOpen(false)}>
                Kostenlose Beratung
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
