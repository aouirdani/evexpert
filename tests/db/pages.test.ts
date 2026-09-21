import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { closeDb } from "@/db";
import { resetCatalogCache } from "@/data/catalog";
import { TEST_APP_URL } from "../helpers/env";

beforeAll(() => {
  process.env.DATABASE_URL = TEST_APP_URL;
  delete process.env.EVEXPERT_DATA_SOURCE;
  resetCatalogCache();
});
afterAll(() => closeDb());

const params = <T,>(p: T) => ({ params: Promise.resolve(p) });

/** Le titre est un objet { absolute } : le gabarit du layout n'ajoute plus « | EVExpert » une seconde fois. */
const pageTitle = (md: { title?: unknown }): string => {
  const t = md.title as string | { absolute?: string } | undefined;
  return typeof t === "string" ? t : (t?.absolute ?? "");
};

describe("pages dynamiques alimentées par la base (URLs inchangées)", () => {
  it("/voitures-electriques/[brand] : 22 marques, metadata et indexation", async () => {
    const mod = await import("@/app/voitures-electriques/[brand]/page");
    expect(await mod.generateStaticParams()).toHaveLength(22);
    const renault = await mod.generateMetadata(params({ brand: "renault" }));
    expect(renault.alternates?.canonical).toBe("https://evexpert.fr/voitures-electriques/renault");
    expect(renault.robots).toMatchObject({ index: true });
    const single = await mod.generateMetadata(params({ brand: "porsche" }));
    expect(single.robots).toMatchObject({ index: false }); // 1 seul modèle → non indexable
  });
  it("/voitures-electriques/[brand]/[model] : 45 pages", async () => {
    const mod = await import("@/app/voitures-electriques/[brand]/[model]/page");
    const all = await mod.generateStaticParams();
    expect(all).toHaveLength(45);
    expect(all).toContainEqual({ brand: "renault", model: "5-e-tech" });
    const md = await mod.generateMetadata(params({ brand: "tesla", model: "model-3" }));
    expect(md.alternates?.canonical).toBe("https://evexpert.fr/voitures-electriques/tesla/model-3");
    expect(pageTitle(md)).toContain("Tesla Model 3");
  });
  it("/voitures-electriques/[brand]/[model]/[version] : 47 pages, canonical vers le modèle si version unique", async () => {
    const mod = await import("@/app/voitures-electriques/[brand]/[model]/[version]/page");
    expect(await mod.generateStaticParams()).toHaveLength(47);
    const single = await mod.generateMetadata(params({ brand: "renault", model: "5-e-tech", version: "52-kwh-150-ch" }));
    expect(single.alternates?.canonical).toBe("https://evexpert.fr/voitures-electriques/renault/5-e-tech");
    expect(single.robots).toMatchObject({ index: false });
    const multi = await mod.generateMetadata(params({ brand: "tesla", model: "model-3", version: "rwd" }));
    expect(multi.alternates?.canonical).toBe("https://evexpert.fr/voitures-electriques/tesla/model-3/rwd");
    expect(multi.robots).toMatchObject({ index: true });
    expect(await mod.generateMetadata(params({ brand: "x", model: "y", version: "z" }))).toEqual({});
  });
  it("/comparer/[slug] : 8 comparaisons", async () => {
    const mod = await import("@/app/comparer/[slug]/page");
    const all = await mod.generateStaticParams();
    expect(all).toHaveLength(8);
    const md = await mod.generateMetadata(params({ slug: all[0].slug }));
    expect(pageTitle(md)).toContain("comparatif");
  });
  it("/guides/[slug] et /blog/[slug] : 23 guides, 7 articles", async () => {
    // Passe éditoriale : +3 guides (kW/kWh, consommation, prise domestique) et +1 analyse (garantie batterie).
    expect(await (await import("@/app/guides/[slug]/page")).generateStaticParams()).toHaveLength(23);
    expect(await (await import("@/app/blog/[slug]/page")).generateStaticParams()).toHaveLength(7);
  });
  it("sitemap : 124 URLs uniques, toutes sur evexpert.fr", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toHaveLength(124);
    expect(new Set(urls).size).toBe(124);
    expect(urls.every((u) => u.startsWith("https://evexpert.fr"))).toBe(true);
    expect(urls).toContain("https://evexpert.fr/voitures-electriques/tesla/model-3/long-range-rwd");
    expect(urls).not.toContain("https://evexpert.fr/voitures-electriques/renault/5-e-tech/52-kwh-150-ch");
  });
});
