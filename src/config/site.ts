// Central brand & site configuration.
// Change these values to rebrand the entire platform.

export const siteConfig = {
  name: "EVExpert",
  tagline: "Comprendre. Comparer. Calculer.",
  description:
    "Comparez les voitures électriques, calculez le coût de recharge, l'autonomie et le coût réel d'utilisation. Guides et données sur la mobilité électrique.",
  // Public base URL used for canonical links, sitemap and Open Graph.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://evscope.example",
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
  enabled: process.env.ADSENSE_ENABLED === "true",
  clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
};

// Analytics (optional, consent-gated).
export const analyticsConfig = {
  ga4Id: process.env.NEXT_PUBLIC_GA_ID ?? "",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
};
