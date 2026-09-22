// Central brand & site configuration.
// Change these values to rebrand the entire platform.

const DEFAULT_SITE_URL = "https://www.evexpert.fr";

// Domaine canonique de production : evexpert.fr redirige en 308 vers www.evexpert.fr
// (DNS/Vercel). Si NEXT_PUBLIC_SITE_URL contient encore l'apex nu — par ex. une valeur Vercel
// historique qu'on ne peut pas modifier dans l'immédiat — on la corrige ici, au seul endroit où
// l'URL du site est résolue, plutôt que de dupliquer cette règle dans sitemap.ts/robots.ts/
// layout.tsx/lib/seo. Toute autre valeur (localhost, preview, staging…) n'est pas affectée.
const APEX_HOST = "evexpert.fr";
const CANONICAL_ORIGIN = "https://www.evexpert.fr";

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
    // Normalise l'apex nu vers le domaine canonique, quelle que soit sa provenance (env ou défaut).
    if (url.hostname === APEX_HOST) {
      return CANONICAL_ORIGIN;
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
  /** Mis en avant dans le header (une seule entrée : le comparateur). */
  emphasis?: boolean;
};

/** Navigation principale, par ordre d'importance. Toutes les routes existent. */
export const mainNav: NavItem[] = [
  { label: "Voitures électriques", href: "/voitures-electriques" },
  { label: "Comparer", href: "/comparer", emphasis: true },
  { label: "Recharge", href: "/recharge" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
];

/** Navigation secondaire : bandeau desktop au-dessus du header et bas du menu mobile. */
export const secondaryNav: NavItem[] = [
  { label: "Outils", href: "/outils" },
  { label: "Méthodologie", href: "/methodologie" },
  { label: "Sources des données", href: "/sources" },
  { label: "À propos", href: "/a-propos" },
];

/**
 * Colonnes du footer. Les six calculateurs restent listés : ce sont des pages
 * stratégiques et le footer est leur maillage interne sur tout le site.
 */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explorer",
    items: [
      { label: "Voitures électriques", href: "/voitures-electriques" },
      { label: "Comparateur", href: "/comparer" },
      { label: "Recharge", href: "/recharge" },
      { label: "Outils", href: "/outils" },
    ],
  },
  {
    title: "Calculateurs",
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
    title: "Guides",
    items: [
      { label: "Guides", href: "/guides" },
      { label: "Blog", href: "/blog" },
      { label: "Méthodologie", href: "/methodologie" },
      { label: "Sources des données", href: "/sources" },
      { label: "Flux RSS du blog", href: "/blog/rss.xml" },
    ],
  },
  {
    title: "Informations",
    items: [
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Politique de confidentialité", href: "/confidentialite" },
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

// Google Analytics 4 : voir `config/analytics.ts` (`getGa4MeasurementId`, variable serveur `GA_ID`,
// jamais lue directement par un Client Component — transmise en prop depuis `app/layout.tsx`).
