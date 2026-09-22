import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { GarageBar } from "@/components/garage/GarageBar";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";

// Police unique : Schibsted Grotesk (licence OFL, voir ./fonts/OFL.txt), variable
// 400-800, sous-ensemble latin français (~36 Ko, un seul fichier). next/font génère
// le fallback ajusté (size-adjust) : pas de décalage de mise en page au swap.
const brandFont = localFont({
  src: "./fonts/SchibstedGrotesk-latin-var.woff2",
  weight: "400 800",
  variable: "--font-brand",
  display: "swap",
  fallback: ["system-ui", "Arial"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Voiture électrique : calculateurs, comparatifs et guides | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // Icônes de marque (public/brand). /favicon.ico est servi par une réécriture (next.config.ts).
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.ico", sizes: "16x16 32x32 48x48" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={brandFont.variable}>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
        >
          Aller au contenu
        </a>
        <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
        {children}
        <Footer />
        <CookieBanner />
        <GarageBar />
        <Analytics />
      </body>
    </html>
  );
}
