import Link from "next/link";
import { Container } from "@/components/ui/Container";

const columns = [
  {
    title: "Unternehmen",
    links: [
      { label: "Über uns", href: "#top" },
      { label: "Referenzen", href: "#referenzen" },
      { label: "Karriere", href: "#kontakt" },
    ],
  },
  {
    title: "Leistungen",
    links: [
      { label: "Photovoltaik", href: "#vorteile" },
      { label: "Batteriespeicher", href: "#speicher" },
      { label: "Wallbox", href: "#wallbox" },
      { label: "Förderungen", href: "#foerderung" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Kontakt", href: "#kontakt" },
      { label: "Ablauf", href: "#ablauf" },
    ],
  },
];

/** Site-wide footer: sitemap columns, legal links, and contact summary. */
export function Footer() {
  return (
    <footer className="bg-anthracite pt-24 pb-10 text-gray-400">
      <Container>
        <div className="grid grid-cols-2 gap-10 border-b border-white/10 pb-16 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-solar-blue inline-block h-2.5 w-2.5 rounded-full" aria-hidden />
              <span className="text-lg font-semibold tracking-tight text-white">SONNWERK</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Photovoltaik, Speicher und Wallbox aus einer Hand – geplant, montiert und betreut von einem
              Team.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-medium text-white">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-500 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-gray-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SONNWERK GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-white">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-white">
              AGB
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
