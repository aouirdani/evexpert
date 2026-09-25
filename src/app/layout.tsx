import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { GarageBar } from "@/components/garage/GarageBar";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { getGa4MeasurementId } from "@/config/analytics";

// Police unique : Schibsted Grotesk (licence OFL, voir ./fonts/OFL.txt), variable
// 400-800, sous-ensemble latin français (~36 Ko, un seul fichier).
// `display: "optional"` (pas "swap") : malgré le fallback ajusté (size-adjust), un texte en
// `balance`/`pretty` (H1, chapô du hero) reste assez sensible aux écarts de métrique résiduels
// pour que le swap change parfois le nombre de lignes et décale ce qui suit (CLS non nul,
// confirmé en production avant toute refonte — bissection commit par commit, voir historique de
// la branche). "optional" supprime le swap après le premier rendu : jamais de décalage, au prix
// (rare, connexion très lente) d'un premier rendu en police de repli sur cette page précise.
const brandFont = localFont({
  src: "./fonts/SchibstedGrotesk-latin-var.woff2",
  weight: "400 800",
  variable: "--font-brand",
  display: "optional",
  fallback: ["system-ui", "Arial"],
  adjustFontFallback: "Arial",
});

// Refonte UI (direction hybride, voir .claude/skills/evexpert-ui) : IBM Plex Mono pour les
// chiffres et les libellés de donnée uniquement (utilitaires `num`/`tabular`/`unit`/`label`/
// `text-data-*` dans globals.css) — jamais les surtitres `.eyebrow`, qui restent en Schibsted
// Grotesk. Sous-ensemble latin, 3 graisses (régulier/demi-gras/gras : ce sont exactement les
// trois poids déjà utilisés avec ces utilitaires sur le site, relevé par grep avant ce choix —
// pas une de plus). `display: "optional"` pour la même raison que `brandFont` ci-dessus.
const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal"],
  variable: "--font-plex-mono",
  display: "optional",
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
    <html lang="fr" className={`${brandFont.variable} ${monoFont.variable}`}>
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
        <Analytics ga4Id={getGa4MeasurementId()} />
      </body>
    </html>
  );
}
