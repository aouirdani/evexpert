import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { tools } from "@/data/tools";
import { getAllVehicles, getBrands } from "@/data/vehicles";
import { guides } from "@/data/guides";
import { articles } from "@/data/articles";
import { chargingTopics } from "@/data/charging";
import { getFeaturedComparisons } from "@/lib/comparison";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/outils",
    "/voitures-electriques",
    "/comparer",
    "/recharge",
    "/recharge/prix",
    "/recharge-a-domicile",
    "/recharge-rapide",
    "/bornes-recharge",
    "/guides",
    "/blog",
    "/a-propos",
    "/contact",
    "/sources",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const toolRoutes = tools.map((t) => ({
    url: `${base}${t.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const brandRoutes = getBrands().map((b) => ({
    url: `${base}/voitures-electriques/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const vehicleRoutes = getAllVehicles().map((v) => ({
    url: `${base}/voitures-electriques/${v.brandSlug}/${v.modelSlug}`,
    lastModified: new Date(v.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const comparisonRoutes = getFeaturedComparisons().map((c) => ({
    url: `${base}/comparer/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const guideRoutes = guides.map((g) => ({
    url: `${base}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const chargingRoutes = chargingTopics.map((t) => ({
    url: `${base}/recharge/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...brandRoutes,
    ...vehicleRoutes,
    ...comparisonRoutes,
    ...guideRoutes,
    ...chargingRoutes,
    ...articleRoutes,
  ];
}
