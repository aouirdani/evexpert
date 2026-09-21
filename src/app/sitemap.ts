import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { tools } from "@/data/tools";
import { getBrands, getModelVersions, getModels, getAllVehicles, isVersionPageIndexable, vehicleHref } from "@/data/vehicles";
import { guides } from "@/data/guides";
import { articles } from "@/data/articles";
import { chargingTopics } from "@/data/charging";
import { getFeaturedComparisons } from "@/lib/comparison";
import { SOURCE_CHECKED_AT } from "@/data/vehicles";

/**
 * Seules les pages indexables figurent dans le sitemap :
 * - pas de recherche (noindex), pas de pages légales secondaires sans valeur SEO ;
 * - pages marque uniquement si la marque a au moins 2 modèles ;
 * - pages version uniquement si le modèle a plusieurs versions.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const catalogDate = new Date(SOURCE_CHECKED_AT);
  const entry = (
    path: string,
    lastModified: Date,
    changeFrequency: "weekly" | "monthly" | "yearly",
    priority: number,
  ) => ({ url: `${base}${path}`, lastModified, changeFrequency, priority });

  const staticRoutes = [
    entry("", catalogDate, "weekly", 1),
    entry("/outils", catalogDate, "monthly", 0.9),
    entry("/voitures-electriques", catalogDate, "weekly", 0.9),
    entry("/comparer", catalogDate, "monthly", 0.8),
    entry("/recharge", catalogDate, "monthly", 0.8),
    entry("/guides", catalogDate, "weekly", 0.8),
    entry("/blog", catalogDate, "weekly", 0.7),
    entry("/methodologie", catalogDate, "yearly", 0.6),
    entry("/sources", catalogDate, "yearly", 0.5),
    entry("/a-propos", catalogDate, "yearly", 0.4),
    entry("/contact", catalogDate, "yearly", 0.3),
  ];

  const toolRoutes = tools.map((t) => entry(t.href, catalogDate, "monthly", 0.9));

  const brandRoutes = getBrands()
    .filter((b) => getModels().filter((m) => m.brandSlug === b.slug).length >= 2)
    .map((b) => entry(`/voitures-electriques/${b.slug}`, catalogDate, "monthly", 0.6));

  const modelRoutes = getModels().map((m) => entry(vehicleHref(m), new Date(m.source.lastUpdated), "monthly", 0.7));

  const versionRoutes = getAllVehicles()
    .filter((v) => isVersionPageIndexable(v) && getModelVersions(v.brandSlug, v.modelSlug).length > 1)
    .map((v) => entry(vehicleHref(v, "version"), new Date(v.source.lastUpdated), "monthly", 0.6));

  const comparisonRoutes = getFeaturedComparisons().map((c) => entry(`/comparer/${c.slug}`, catalogDate, "monthly", 0.6));
  const guideRoutes = guides.map((g) => entry(`/guides/${g.slug}`, new Date(g.updatedAt), "monthly", 0.8));
  const chargingRoutes = chargingTopics.map((t) => entry(`/recharge/${t.slug}`, new Date(t.updatedAt), "monthly", 0.6));
  const articleRoutes = articles.map((a) => entry(`/blog/${a.slug}`, new Date(a.updatedAt), "monthly", 0.6));

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...brandRoutes,
    ...modelRoutes,
    ...versionRoutes,
    ...comparisonRoutes,
    ...guideRoutes,
    ...chargingRoutes,
    ...articleRoutes,
  ];
}
