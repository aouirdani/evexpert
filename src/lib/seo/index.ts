import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  noindex,
  ogType = "website",
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle =
    path === "/" ? title : `${title} | ${siteConfig.name}`;
  return {
    title: fullTitle,
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
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
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
  title: string;
  description: string;
  path: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
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
