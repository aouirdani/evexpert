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
    expect(renault.alternates?.canonical).toBe("https://www.evexpert.fr/voitures-electriques/renault");
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
    expect(md.alternates?.canonical).toBe("https://www.evexpert.fr/voitures-electriques/tesla/model-3");
    expect(pageTitle(md)).toContain("Tesla Model 3");
  });
  it("/voitures-electriques/[brand]/[model]/[version] : 47 pages, canonical vers le modèle si version unique", async () => {
    const mod = await import("@/app/voitures-electriques/[brand]/[model]/[version]/page");
    expect(await mod.generateStaticParams()).toHaveLength(47);
    const single = await mod.generateMetadata(params({ brand: "renault", model: "5-e-tech", version: "52-kwh-150-ch" }));
    expect(single.alternates?.canonical).toBe("https://www.evexpert.fr/voitures-electriques/renault/5-e-tech");
    expect(single.robots).toMatchObject({ index: false });
    const multi = await mod.generateMetadata(params({ brand: "tesla", model: "model-3", version: "rwd" }));
    expect(multi.alternates?.canonical).toBe("https://www.evexpert.fr/voitures-electriques/tesla/model-3/rwd");
    expect(multi.robots).toMatchObject({ index: true });
    expect(await mod.generateMetadata(params({ brand: "x", model: "y", version: "z" }))).toEqual({});
  });
  it("/comparer/[slug] : 8 comparaisons, noindex en attendant une analyse rédigée par paire", async () => {
    const mod = await import("@/app/comparer/[slug]/page");
    const all = await mod.generateStaticParams();
    expect(all).toHaveLength(8);
    const md = await mod.generateMetadata(params({ slug: all[0].slug }));
    expect(pageTitle(md)).toContain("comparatif");
    expect(md.robots).toMatchObject({ index: false });
  });
  it("/guides/[slug] et /blog/[slug] : 25 guides, 7 articles", async () => {
    // Passe éditoriale : +3 guides (kW/kWh, consommation, prise domestique) et +1 analyse (garantie batterie) ; puis +2 guides batterie (durée de vie, prix).
    expect(await (await import("@/app/guides/[slug]/page")).generateStaticParams()).toHaveLength(25);
    expect(await (await import("@/app/blog/[slug]/page")).generateStaticParams()).toHaveLength(7);
  });
  it("sitemap : 121 URLs uniques, toutes sur www.evexpert.fr", async () => {
    // +2 depuis la passe fonctionnalités : /outils/trajet-longue-distance, /voitures-electriques/trouver ; +2 avec les guides batterie.
    // Lot confiance-catalogue : -8 duels (/comparer/[slug], retirés en attendant une analyse rédigée par paire) ; +1 /politique-editoriale.
    const sitemap = (await import("@/app/sitemap")).default;
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toHaveLength(121);
    expect(new Set(urls).size).toBe(121);
    expect(urls.every((u) => u.startsWith("https://www.evexpert.fr"))).toBe(true);
    expect(urls).toContain("https://www.evexpert.fr/voitures-electriques/tesla/model-3/long-range-rwd");
    expect(urls).not.toContain("https://www.evexpert.fr/voitures-electriques/renault/5-e-tech/52-kwh-150-ch");
  });
});

describe("titles et metas (lot titles-metas)", () => {
  const desc = (md: { description?: unknown }) => String(md.description ?? "");

  it("fiches modèle et version : le nom et « autonomie » tiennent dans les 55 premiers caractères", async () => {
    const { queryEnd, TITLE_QUERY_LIMIT } = await import("@/lib/seo/titles");
    const modelPage = await import("@/app/voitures-electriques/[brand]/[model]/page");
    const versionPage = await import("@/app/voitures-electriques/[brand]/[model]/[version]/page");
    const models = await modelPage.generateStaticParams();
    for (const p of models) {
      const t = pageTitle(await modelPage.generateMetadata(params(p)));
      expect(queryEnd(t), t).toBeLessThanOrEqual(TITLE_QUERY_LIMIT);
    }
    const versions = await versionPage.generateStaticParams();
    for (const p of versions) {
      const t = pageTitle(await versionPage.generateMetadata(params(p)));
      expect(queryEnd(t), t).toBeLessThanOrEqual(TITLE_QUERY_LIMIT);
    }
    const m3 = pageTitle(await modelPage.generateMetadata(params({ brand: "tesla", model: "model-3" })));
    expect(m3).toBe("Tesla Model 3 : autonomie, recharge et versions | EVExpert");
    const lr = pageTitle(await versionPage.generateMetadata(params({ brand: "tesla", model: "model-3", version: "long-range-rwd" })));
    expect(lr).toBe("Tesla Model 3 Long Range RWD : autonomie, recharge, fiche technique | EVExpert");
  });

  it("metas des marques : 160 caractères maximum (gabarit), Renault compris", async () => {
    const mod = await import("@/app/voitures-electriques/[brand]/page");
    for (const p of await mod.generateStaticParams()) {
      const md = await mod.generateMetadata(params(p));
      expect(desc(md).length, p.brand).toBeLessThanOrEqual(160);
    }
    const renault = await mod.generateMetadata(params({ brand: "renault" }));
    expect(pageTitle(renault)).toBe("Renault électriques : modèles, autonomie et recharge | EVExpert");
    expect(desc(renault)).toContain("Autonomie WLTP, batterie et recharge comparées.");
  });

  it("metas de l'accueil, de la méthodologie et du CHAdeMO : 160 caractères maximum", async () => {
    const home = (await import("@/app/page")).metadata;
    const methodo = (await import("@/app/methodologie/page")).metadata;
    const chademo = await (await import("@/app/recharge/[topic]/page")).generateMetadata(params({ topic: "chademo" }));
    for (const md of [home, methodo, chademo]) expect(desc(md).length).toBeLessThanOrEqual(160);
    expect(pageTitle(home)).toBe("Voiture électrique : autonomie, recharge et coût réel");
  });

  it("titles réécrits à la main et connecteurs", async () => {
    expect(pageTitle((await import("@/app/guides/page")).metadata)).toBe("Guides voiture électrique : autonomie, recharge, batterie | EVExpert");
    expect(pageTitle((await import("@/app/blog/page")).metadata)).toBe("Blog : analyses chiffrées sur la voiture électrique | EVExpert");
    expect(pageTitle((await import("@/app/voitures-electriques/trouver/page")).metadata)).toBe("Trouver sa voiture électrique selon son usage | EVExpert");
    const topic = (await import("@/app/recharge/[topic]/page")).generateMetadata;
    expect(pageTitle(await topic(params({ topic: "type-2" })))).toBe("Prise Type 2 : connecteur standard de recharge AC | EVExpert");
    expect(pageTitle(await topic(params({ topic: "ccs" })))).toBe("CCS Combo 2 : connecteur de recharge rapide en Europe | EVExpert");
    expect(pageTitle(await topic(params({ topic: "chademo" })))).toBe("CHAdeMO : standard japonais de recharge rapide | EVExpert");
  });
});

