// Central brand & site configuration.
// Change these values to rebrand the entire platform.

const DEFAULT_SITE_URL = "https://evexpert.fr";

/** Reads an env var; empty or whitespace-only values are treated as absent. */
function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Resolves the public site origin. Never returns an empty or invalid URL, so
 * `new URL(siteUrl)` and `${siteUrl}/path` are always safe. Falls back to the
 * production domain when NEXT_PUBLIC_SITE_URL is missing, empty or malformed.
 */
function resolveSiteUrl(raw: string | undefined): string {
  const value = readEnv(raw);
  if (!value) return DEFAULT_SITE_URL;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return DEFAULT_SITE_URL;
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteConfig = {
  name: "EVExpert",
  tagline: "Comprendre. Comparer. Calculer.",
  description:
    "Comparez les voitures électriques, calculez le coût de recharge, l'autonomie et le coût réel d'utilisation. Guides et données sur la mobilité électrique.",
  // Public base URL used for canonical links, sitemap and Open Graph.
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "fr_FR",
  lang: "fr",
  twitter: "@evscope",
  email: "contact@evscope.example",
  organization: {
    name: "EVExpert",
    legalName: "EVExpert (nom de projet temporaire)",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Outils", href: "/outils" },
  { label: "Voitures électriques", href: "/voitures-electriques" },
  { label: "Comparer", href: "/comparer" },
  { label: "Recharge", href: "/recharge" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explorer",
    items: [
      { label: "Outils", href: "/outils" },
      { label: "Voitures électriques", href: "/voitures-electriques" },
      { label: "Comparer", href: "/comparer" },
      { label: "Recharge", href: "/recharge" },
      { label: "Guides", href: "/guides" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "À propos",
    items: [
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
      { label: "Sources", href: "/sources" },
    ],
  },
  {
    title: "Légal",
    items: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Politique de confidentialité", href: "/confidentialite" },
      { label: "Politique cookies", href: "/cookies" },
      { label: "Conditions d'utilisation", href: "/conditions-utilisation" },
    ],
  },
];

// AdSense readiness (disabled by default).
export const adsConfig = {
  enabled: readEnv(process.env.ADSENSE_ENABLED) === "true",
  clientId: readEnv(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) ?? "",
};

// Analytics (optional, consent-gated).
export const analyticsConfig = {
  ga4Id: readEnv(process.env.NEXT_PUBLIC_GA_ID) ?? "",
  gtmId: readEnv(process.env.NEXT_PUBLIC_GTM_ID) ?? "",
};
