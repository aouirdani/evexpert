import { describe, expect, it, vi } from "vitest";
import { vehicles } from "@/data/vehicles";
import { buildOccasionGuides } from "@/data/guides/occasion";
import { buildChineseVehiclesArticle } from "@/data/editorial/chinese-vehicles";
import { makeGuideContext } from "@/data/guides/helpers";
import { stripLinks } from "@/components/content/Inline";
import type { ArticleSection } from "@/types";

// Exerce les routes et le sitemap avec le catalogue local, sans importer ni connecter la DB.
vi.mock("@/data/catalog", async () => {
  const { vehicles: list } = await import("@/data/vehicles");
  const sel = await import("@/data/catalog/selectors");
  const catalog = { source: "local", vehicles: list, checkedAt: sel.latestVerification(list), skipped: [] };
  return {
    getCatalog: async () => catalog,
    getAllVehicles: async () => list,
    getBrands: async () => sel.brandsOf(list),
    getModels: async () => sel.modelsOf(list),
    getCatalogDate: async () => catalog.checkedAt,
    getVehiclesByBrand: async (brand: string) => sel.byBrand(list, brand),
    getModelVersions: async (brand: string, model: string) => sel.versionsOf(list, brand, model),
    getVehicleBySlug: async (brand: string, model: string, version?: string) => sel.find(list, brand, model, version),
    getSimilarVehicles: async (v: typeof list[number]) => sel.similarTo(list, v),
    isVersionPageIndexable: async (v: typeof list[number]) => sel.isVersionIndexable(list, v),
  };
});

const guide = buildOccasionGuides(makeGuideContext(vehicles))[0];
const article = buildChineseVehiclesArticle(vehicles);
const prose = (page: { intro: string; sections: ArticleSection[] }) => [page.intro, ...page.sections.flatMap((s) => [...s.paragraphs, ...(s.list ?? [])])];

describe("expansion éditoriale : contenu utile et provenance", () => {
  it("le guide occasion dépasse 1500 mots sans compter titres, tableaux, FAQ ou navigation", () => {
    const words = stripLinks(prose(guide).join(" ")).trim().split(/\s+/);
    expect(words.length).toBeGreaterThanOrEqual(1500);
    expect(new Set(prose(guide)).size).toBe(prose(guide).length);
    expect(guide.sections.some((s) => s.heading?.includes("Méthodologie"))).toBe(true);
    expect(guide.sections.some((s) => s.heading?.includes("limites"))).toBe(true);
  });

  it("les exemples utilisent les capacités source et une hypothèse explicitement annoncée", () => {
    const section = guide.sections.find((s) => s.table?.headers.includes("Énergie retenue à 90 %"))!;
    expect(section.paragraphs.join(" ")).toContain("n'est le SOH d'aucune voiture");
    expect(section.table?.rows).toHaveLength(3);
    expect(section.table?.rows.find((r) => r[0].includes("Kona"))).toEqual([
      "Hyundai Kona Electric 65 kWh", "65,4 kWh", "58,86 kWh", "41,20 kWh", "258 km",
    ]);
    expect(guide.sources?.some((s) => s.url.includes("service-public.gouv.fr"))).toBe(true);
    expect(guide.sources?.some((s) => s.url.includes("tesla.com/ownersmanual"))).toBe(true);
    for (const id of guide.relatedVehicleIds ?? []) {
      const v = vehicles.find((item) => item.id === id)!;
      expect(guide.sources?.some((s) => s.url === v.source.url)).toBe(true);
    }
  });

  it("l'analyse BYD/MG dépasse 1500 mots de prose distincte et explicite son périmètre", () => {
    expect(stripLinks(prose(article).join(" ")).trim().split(/\s+/).length).toBeGreaterThanOrEqual(1500);
    expect(new Set(prose(article)).size).toBe(prose(article).length);
    expect(article.sections.some((s) => s.heading?.includes("Méthodologie") && s.heading.includes("limites"))).toBe(true);
    expect(prose(article).join(" ")).toContain("ne constitue pas une certification du lieu de fabrication");
    expect(prose(article).join(" ")).toContain("Aucun prix France n'est renseigné");
    for (const v of vehicles.filter((v) => v.brandSlug === "byd" || v.brandSlug === "mg")) {
      expect(article.sources?.some((s) => s.url === v.source.url && s.accessed === v.source.lastUpdated)).toBe(true);
    }
  });

  it("compare l'énergie DC et plafonne l'AC plutôt que de promettre les puissances des bornes", () => {
    const dc = article.sections.find((s) => s.table?.headers.includes("Moyenne calculée"))!.table!;
    expect(dc.rows.find((r) => r[0].includes("Atto 3"))).toEqual([
      "BYD Atto 3 Evo RWD Design", "220 kW", "25 min", "52,36 kWh", "125,7 kW",
    ]);
    const ac = article.sections.find((s) => s.table?.headers.includes("Borne 22 kW"))!.table!;
    const mgs5 = ac.rows.find((r) => r[0].includes("MGS5"))!;
    expect(mgs5[1]).toBe("6,6 kW");
    expect(mgs5[2]).toBe(mgs5[3]);
    expect(mgs5[3]).toBe(mgs5[4]);
  });

  it("n'extrapole pas une durée DC absente ni une chimie inconnue", () => {
    const incomplete = vehicles.map((v) => v.brandSlug === "byd" ? { ...v, chemistry: null, chargingTime10to80: null } : v);
    const page = buildChineseVehiclesArticle(incomplete);
    const dc = page.sections.find((s) => s.table?.headers.includes("Moyenne calculée"))!.table!;
    expect(dc.rows.every((r) => r[0].startsWith("MG "))).toBe(true);
    const chemistry = page.sections.find((s) => s.table?.headers.includes("Chimie source"))!.table!;
    expect(chemistry.rows.filter((r) => r[0].startsWith("BYD ")).every((r) => r[1] === "Non disponible")).toBe(true);
  });
});

describe("expansion éditoriale : intégration SEO sans nouvelle règle", () => {
  it("la nouvelle route est indexable, canonique, unique et incluse dans le sitemap existant", async () => {
    const route = await import("@/app/guides/[slug]/page");
    const metadata = await route.generateMetadata({ params: Promise.resolve({ slug: guide.slug }) });
    expect(metadata.alternates?.canonical).toBe(`https://www.evexpert.fr/guides/${guide.slug}`);
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({ type: "article" });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    const paths = await route.generateStaticParams();
    expect(paths.filter((p) => p.slug === guide.slug)).toHaveLength(1);
    const sitemap = await (await import("@/app/sitemap")).default();
    expect(sitemap.filter((p) => p.url === metadata.alternates?.canonical)).toHaveLength(1);
  });

  it("les trois liens entrants contextuels sont présents dans les contenus existants", async () => {
    const guides = await (await import("@/data/guides")).getGuides();
    const articles = await (await import("@/data/blog")).getArticles();
    const target = `/guides/${guide.slug}`;
    const incoming = [...guides, ...articles].filter((page) => page.slug !== guide.slug &&
      page.sections.some((s) => [...s.paragraphs, ...(s.list ?? [])].some((p) => p.includes(`](${target})`))));
    expect(incoming.map((p) => p.slug).sort()).toEqual([
      "choisir-premiere-voiture-electrique", "garantie-batterie-ce-que-disent-les-donnees", "preserver-batterie-voiture-electrique",
    ]);
  });

  it("intègre l'analyse au blog, au sitemap et à trois pages d'entrée pertinentes", async () => {
    const route = await import("@/app/blog/[slug]/page");
    const metadata = await route.generateMetadata({ params: Promise.resolve({ slug: article.slug }) });
    expect(metadata.alternates?.canonical).toBe(`https://www.evexpert.fr/blog/${article.slug}`);
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({ type: "article" });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect((await route.generateStaticParams()).filter((p) => p.slug === article.slug)).toHaveLength(1);
    const sitemap = await (await import("@/app/sitemap")).default();
    expect(sitemap.filter((p) => p.url === metadata.alternates?.canonical)).toHaveLength(1);
    const guides = await (await import("@/data/guides")).getGuides();
    const articles = await (await import("@/data/blog")).getArticles();
    const target = `/blog/${article.slug}`;
    const incoming = [...guides, ...articles].filter((page) => page.slug !== article.slug &&
      page.sections.some((s) => s.paragraphs.some((p) => p.includes(`](${target})`))));
    expect(incoming.map((p) => p.slug).sort()).toEqual([
      "choisir-voiture-electrique-selon-usage", "lfp-ou-nmc-ce-que-montrent-les-donnees", "recharge-ac-puissances-acceptees",
    ]);
  });

  it("différencie les titres, descriptions et H1 des nouvelles pages parmi les contenus éditoriaux", async () => {
    const guides = await (await import("@/data/guides")).getGuides();
    const articles = await (await import("@/data/blog")).getArticles();
    const all = [...guides, ...articles];
    for (const slug of [guide.slug, article.slug]) {
      const page = all.find((p) => p.slug === slug)!;
      expect(all.filter((p) => p.title === page.title)).toHaveLength(1);
      expect(all.filter((p) => (p.metaTitle ?? p.title) === (page.metaTitle ?? page.title))).toHaveLength(1);
      expect(all.filter((p) => (p.metaDescription ?? p.description) === (page.metaDescription ?? page.description))).toHaveLength(1);
    }
  });

  it("préserve les canonicals et robots des versions, marques et duels existants", async () => {
    const version = await import("@/app/voitures-electriques/[brand]/[model]/[version]/page");
    const single = await version.generateMetadata({ params: Promise.resolve({ brand: "renault", model: "5-e-tech", version: "52-kwh-150-ch" }) });
    expect(single.alternates?.canonical).toBe("https://www.evexpert.fr/voitures-electriques/renault/5-e-tech");
    expect(single.robots).toMatchObject({ index: false, follow: true });
    const tesla = await version.generateMetadata({ params: Promise.resolve({ brand: "tesla", model: "model-3", version: "rwd" }) });
    expect(tesla.alternates?.canonical).toBe("https://www.evexpert.fr/voitures-electriques/tesla/model-3/rwd");
    expect(tesla.robots).toMatchObject({ index: true });
    const brand = await import("@/app/voitures-electriques/[brand]/page");
    expect((await brand.generateMetadata({ params: Promise.resolve({ brand: "porsche" }) })).robots).toMatchObject({ index: false });
    const duel = await import("@/app/comparer/[slug]/page");
    const params = (await duel.generateStaticParams())[0];
    expect((await duel.generateMetadata({ params: Promise.resolve(params) })).robots).toMatchObject({ index: false });
  });
});
