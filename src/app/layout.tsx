import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://sonnwerk.de";
const siteTitle = "SONNWERK — Photovoltaik, Speicher & Wallbox aus einer Hand";
const siteDescription =
  "SONNWERK plant, montiert und betreut Photovoltaikanlagen, Batteriespeicher und Wallboxen für Eigenheimbesitzer in Deutschland. Kostenlose Beratung, zertifizierte Montage, 25 Jahre Garantie.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s — SONNWERK",
  },
  description: siteDescription,
  keywords: [
    "Photovoltaik",
    "Solaranlage",
    "Batteriespeicher",
    "Wallbox",
    "Solarstrom",
    "PV-Anlage Deutschland",
  ],
  authors: [{ name: "SONNWERK GmbH" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "SONNWERK",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/images/pv-story-poster.jpg",
        width: 1280,
        height: 720,
        alt: "Photovoltaikanlage auf einem Einfamilienhaus, montiert von SONNWERK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/pv-story-poster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "SONNWERK GmbH",
  description: siteDescription,
  url: siteUrl,
  telephone: "+49-30-123456789",
  email: "hallo@sonnwerk.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Musterstraße 12",
    postalCode: "10115",
    addressLocality: "Berlin",
    addressCountry: "DE",
  },
  areaServed: "DE",
  priceRange: "€€",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="text-ink flex min-h-full flex-col bg-white">
        <a
          href="#main-content"
          className="bg-ink fixed top-2 left-2 z-[100] -translate-y-16 rounded-lg px-4 py-2 text-sm text-white transition-transform focus:translate-y-0"
        >
          Zum Inhalt springen
        </a>
        <SmoothScrollProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
