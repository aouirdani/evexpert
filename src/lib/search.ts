import "server-only";
import { getAllVehicles } from "@/data/catalog";
import { versionsOf } from "@/data/catalog/selectors";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { tools } from "@/data/tools";
import { getGuides } from "@/data/guides";
import { getArticles } from "@/data/blog";

export type SearchResultType = "vehicle" | "tool" | "guide" | "article";

export interface SearchResult {
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  const [vehicles, guides, articles] = await Promise.all([getAllVehicles(), getGuides(), getArticles()]);
  const q = normalize(query.trim());
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const v of vehicles) {
    const hay = normalize(`${vehicleTitle(v)} ${v.bodyType} ${v.chemistry ?? ""}`);
    if (hay.includes(q)) {
      results.push({
        type: "vehicle",
        title: vehicleTitle(v),
        description: `${v.rangeWltp} km WLTP · batterie ${v.batteryUsable} kWh utiles · charge AC ${v.chargingAC} kW${v.chargingDC ? ` · DC ${v.chargingDC} kW` : ""}`,
        href: vehicleHref(v, versionsOf(vehicles, v.brandSlug, v.modelSlug).length > 1 ? "version" : "model"),
      });
    }
  }

  for (const t of tools) {
    const hay = normalize(`${t.title} ${t.shortTitle} ${t.description}`);
    if (hay.includes(q)) {
      results.push({
        type: "tool",
        title: t.title,
        description: t.description,
        href: t.href,
      });
    }
  }

  for (const g of guides) {
    const hay = normalize(`${g.title} ${g.description}`);
    if (hay.includes(q)) {
      results.push({
        type: "guide",
        title: g.title,
        description: g.description,
        href: `/guides/${g.slug}`,
      });
    }
  }

  for (const a of articles) {
    const hay = normalize(`${a.title} ${a.description} ${a.category}`);
    if (hay.includes(q)) {
      results.push({
        type: "article",
        title: a.title,
        description: a.description,
        href: `/blog/${a.slug}`,
      });
    }
  }

  return results.slice(0, 30);
}
