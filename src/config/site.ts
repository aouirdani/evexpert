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
    "Comprenez, comparez et calculez le coût réel d'une voiture électrique : calculateurs transparents, fiches techniques sourcées, guides sur la recharge et l'autonomie.",
  // Public base URL used for canonical links, sitemap and Open Graph.
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "fr_FR",
  lang: "fr",
  /** Adresse de contact publique (optionnelle) : NEXT_PUBLIC_CONTACT_EMAIL. */
  email: readEnv(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  organization: {
    name: "EVExpert",
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
    title: "Outils",
    items: [
      { label: "Coût de recharge", href: "/outils/cout-recharge-voiture-electrique" },
      { label: "Coût aux 100 km", href: "/outils/cout-100-km" },
      { label: "Autonomie réelle", href: "/outils/autonomie-voiture-electrique" },
      { label: "Temps de recharge", href: "/outils/temps-recharge" },
      { label: "Essence vs électrique", href: "/outils/essence-vs-electrique" },
      { label: "Calculateur TCO", href: "/outils/tco-voiture-electrique" },
    ],
  },
  {
    title: "Explorer",
    items: [
      { label: "Voitures électriques", href: "/voitures-electriques" },
      { label: "Comparer", href: "/comparer" },
      { label: "Recharge", href: "/recharge" },
      { label: "Guides", href: "/guides" },
      { label: "Blog", href: "/blog" },
      { label: "Recherche", href: "/recherche" },
    ],
  },
  {
    title: "EVExpert",
    items: [
      { label: "À propos", href: "/a-propos" },
      { label: "Méthodologie", href: "/methodologie" },
      { label: "Sources des données", href: "/sources" },
      { label: "Contact", href: "/contact" },
      { label: "Flux RSS du blog", href: "/blog/rss.xml" },
    ],
  },
  {
    title: "Légal",
    items: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Cookies", href: "/cookies" },
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
