import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Image de partage par défaut (public/brand/og-image.png, 1200 × 630). */
export const DEFAULT_SHARE_IMAGE = {
  src: "/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: "EVExpert — Comprendre. Comparer. Calculer.",
};

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Image de partage propre à la page (ex. schéma principal d'un article). */
  image?: { src: string; width: number; height: number; alt: string };
}

export function buildMetadata({
  title,
  description,
  path,
  noindex,
  ogType = "website",
  publishedTime,
  modifiedTime,
  image = DEFAULT_SHARE_IMAGE,
}: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle =
    path === "/" ? title : `${title} | ${siteConfig.name}`;
  const shareImage = { url: image.src, width: image.width, height: image.height, alt: image.alt };
  return {
    // `absolute` : le gabarit du layout ajouterait sinon « | EVExpert » une seconde fois.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: ogType,
      images: [shareImage],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage],
    },
  };
}

/* ------------------------------ JSON-LD ------------------------------- */

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/recherche?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    url: siteConfig.url,
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

export function articleJsonLd(input: {
  /** BlogPosting pour les analyses du blog, Article pour les guides. */
  type?: "Article" | "BlogPosting";
  title: string;
  description: string;
  path: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  /** Image principale, uniquement si elle est réellement affichée dans la page. */
  image?: { src: string; width: number; height: number };
  /** Rubrique affichée dans le surtitre de la page. */
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: `${siteConfig.url}${input.path}`,
    author: { "@type": "Organization", name: input.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    inLanguage: "fr-FR",
    ...(input.image
      ? { image: { "@type": "ImageObject", url: `${siteConfig.url}${input.image.src}`, width: input.image.width, height: input.image.height } }
      : {}),
    ...(input.section ? { articleSection: input.section } : {}),
  };
}

export function itemListJsonLd(
  name: string,
  items: { name: string; href: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${siteConfig.url}${item.href}`,
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
