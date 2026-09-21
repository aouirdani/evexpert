import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import { tools } from "@/data/tools";
import { buildArticles } from "@/data/articles";
import { buildAutonomieGuides } from "@/data/guides/autonomie";
import { buildRechargeGuides } from "@/data/guides/recharge";
import { buildUsageGuides } from "@/data/guides/usage";
import { buildNewGuides } from "@/data/guides/nouveaux";
import { makeGuideContext } from "@/data/guides/helpers";
import { decorateArticles, decorateGuides } from "@/data/editorial/decorate";
import { EDITORIAL_HEROES, EDITORIAL_PHOTOS } from "@/data/editorial/media";
import { EDITORIAL_META } from "@/data/editorial/meta";
import { linkifySections } from "@/lib/editorial-links";
import { vehicleHref } from "@/lib/vehicle-utils";
import type { ArticleSection } from "@/types";

const ctx = makeGuideContext(vehicles);
const guides = decorateGuides([...buildAutonomieGuides(ctx), ...buildRechargeGuides(ctx), ...buildUsageGuides(ctx), ...buildNewGuides(ctx)], vehicles);
const articles = decorateArticles(buildArticles(vehicles), vehicles);
const all = [
  ...guides.map((g) => ({ ...g, path: `/guides/${g.slug}` })),
  ...articles.map((a) => ({ ...a, path: `/blog/${a.slug}` })),
];

const LINK = /\]\((\/[^)\s]*)\)/g;
const linksOf = (sections: ArticleSection[]) =>
  sections.flatMap((s) => [...s.paragraphs, ...(s.list ?? []), ...(s.table?.rows.flat() ?? [])]).flatMap((t) => [...t.matchAll(LINK)].map((m) => m[1]));

const knownRoutes = new Set<string>([
  "/", "/voitures-electriques", "/comparer", "/recharge", "/guides", "/blog", "/outils", "/methodologie", "/sources", "/a-propos", "/contact",
  ...tools.map((t) => t.href),
  ...guides.map((g) => `/guides/${g.slug}`),
  ...articles.map((a) => `/blog/${a.slug}`),
  ...vehicles.flatMap((v) => [vehicleHref(v, "brand"), vehicleHref(v, "model")]),
]);

describe("contenu éditorial", () => {
  it("les slugs sont uniques et les nouveaux contenus existent", () => {
    const slugs = all.map((x) => x.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of ["kw-kwh-difference-voiture-electrique", "consommation-voiture-electrique-kwh-100-km", "recharger-sur-prise-domestique", "garantie-batterie-ce-que-disent-les-donnees"]) {
      expect(slugs, s).toContain(s);
    }
  });

  it("chaque entrée de médias et de méta correspond à un contenu réel (pas de faute de frappe)", () => {
    const slugs = new Set(all.map((x) => x.slug));
    for (const k of [...Object.keys(EDITORIAL_HEROES), ...Object.keys(EDITORIAL_PHOTOS), ...Object.keys(EDITORIAL_META)]) expect(slugs.has(k), k).toBe(true);
  });

  it("les images principales existent, ont alt, légende et dimensions cohérentes avec le SVG", () => {
    for (const [slug, img] of Object.entries(EDITORIAL_HEROES)) {
      const file = new URL(`../../public${img.src}`, import.meta.url);
      expect(existsSync(file), img.src).toBe(true);
      const svg = readFileSync(file, "utf8");
      expect(svg, slug).toContain(`viewBox="0 0 ${img.width} ${img.height}"`);
      expect(img.alt.length, slug).toBeGreaterThan(60);
      expect(img.caption?.length ?? 0, slug).toBeGreaterThan(20);
      expect(img.src, slug).toMatch(/^\/editorial\/[a-z0-9-]+\.svg$/);
    }
  });

  it("chaque image principale a une copie PNG de partage 1200 × 675 optimisée", () => {
    for (const img of Object.values(EDITORIAL_HEROES)) {
      expect(img.share, img.src).toMatch(/^\/editorial\/[a-z0-9-]+\.png$/);
      const file = new URL(`../../public${img.share}`, import.meta.url);
      const b = readFileSync(file);
      expect([b.readUInt32BE(16), b.readUInt32BE(20)], img.share).toEqual([1200, 675]);
      expect(b.length, img.share).toBeLessThan(90_000);
    }
  });

  it("photographies : fichiers JPEG 1376 × 768 légers, dérivé Open Graph 1200 × 630, alt et légende", () => {
    const jpegSize = (b: Buffer): [number, number] => {
      let i = 2;
      while (i < b.length) {
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
        i += 2 + b.readUInt16BE(i + 2);
      }
      throw new Error("SOF introuvable");
    };
    for (const [slug, { image }] of Object.entries(EDITORIAL_PHOTOS)) {
      const main = readFileSync(new URL(`../../public${image.src}`, import.meta.url));
      const og = readFileSync(new URL(`../../public${image.share}`, import.meta.url));
      expect(jpegSize(main), slug).toEqual([1376, 768]);
      expect(jpegSize(og), `${slug} og`).toEqual([1200, 630]);
      expect(main.length, slug).toBeLessThan(300_000);
      expect(og.length, `${slug} og`).toBeLessThan(200_000);
      expect(image.alt.length, slug).toBeGreaterThan(50);
      expect(image.caption, slug).toContain("générée par IA");
    }
  });

  it("les photos ne sont utilisées que sur des guides/analyses, jamais sur une fiche véhicule", () => {
    const pages = new Set(all.map((x) => x.slug));
    for (const slug of Object.keys(EDITORIAL_PHOTOS)) expect(pages.has(slug), slug).toBe(true);
  });

  it("avec une photo : elle est l'image principale et le schéma descend dans le corps, jamais collé à la photo", () => {
    for (const slug of Object.keys(EDITORIAL_PHOTOS)) {
      const x = all.find((y) => y.slug === slug)!;
      expect(x.hero?.src, slug).toBe(EDITORIAL_PHOTOS[slug].image.src);
      const idx = x.sections.findIndex((s) => s.image);
      if (EDITORIAL_HEROES[slug]) {
        expect(idx, `${slug} : schéma dans le corps`).toBeGreaterThanOrEqual(0);
        expect(x.sections[idx].image?.src, slug).toBe(EDITORIAL_HEROES[slug].src);
        expect(idx, `${slug} : schéma pas dans la toute première section`).toBeGreaterThanOrEqual(0);
      } else {
        expect(idx, `${slug} : pas de schéma`).toBe(-1);
      }
    }
  });

  it("les schémas SVG sont autonomes (sans police, texte vivant ni ressource externe) et légers", () => {
    for (const img of Object.values(EDITORIAL_HEROES)) {
      const file = new URL(`../../public${img.src}`, import.meta.url);
      const svg = readFileSync(file, "utf8");
      expect(svg, img.src).not.toMatch(/<text|font-family|<image|url\(|http(?!:\/\/www\.w3\.org)/);
      expect(statSync(file).size, img.src).toBeLessThan(60_000);
    }
  });

  it("tous les liens internes éditoriaux pointent vers une route existante", () => {
    for (const x of all) for (const href of linksOf(x.sections)) expect(knownRoutes.has(href), `${x.path} → ${href}`).toBe(true);
  });

  it("chaque contenu a un maillage dans le texte, sans lien vers lui-même ni doublon", () => {
    for (const x of all) {
      const links = linksOf(x.sections);
      expect(links.length, x.path).toBeGreaterThanOrEqual(2);
      expect(links, x.path).not.toContain(x.path);
      expect(new Set(links).size, x.path).toBe(links.length);
    }
  });

  it("les liens associés (guides, outils, véhicules) existent", () => {
    for (const x of all) {
      for (const g of x.relatedGuides ?? []) expect(guides.some((y) => y.slug === g), `${x.path} → guide ${g}`).toBe(true);
      for (const t of x.relatedTools ?? []) expect(tools.some((y) => y.href === t || y.slug === t), `${x.path} → outil ${t}`).toBe(true);
      for (const id of x.relatedVehicleIds ?? []) expect(vehicles.some((v) => v.id === id), `${x.path} → véhicule ${id}`).toBe(true);
    }
  });

  it("titres et descriptions pour les résultats de recherche : longueurs raisonnables", () => {
    for (const x of all) {
      const title = x.metaTitle ?? x.title;
      const desc = x.metaDescription ?? x.description;
      expect(title.length, `${x.path} : title`).toBeLessThanOrEqual(56);
      expect(desc.length, `${x.path} : description`).toBeLessThanOrEqual(165);
      expect(desc.length, `${x.path} : description`).toBeGreaterThan(80);
    }
  });

  it("les FAQ (JSON-LD) sont du texte brut : aucun balisage de lien", () => {
    for (const x of all) for (const f of x.faq ?? []) expect(`${f.question} ${f.answer}`, x.path).not.toMatch(/\]\(\//);
  });

  it("les titres H2 d'un même contenu sont uniques (ancres du sommaire)", () => {
    for (const x of all) {
      const h = x.sections.map((s) => s.heading).filter(Boolean);
      expect(new Set(h).size, x.path).toBe(h.length);
    }
  });

  it("les graphiques ont des barres finies et positives", () => {
    for (const x of all) {
      for (const s of x.sections) {
        if (!s.chart) continue;
        expect(s.chart.bars.length, `${x.path} : ${s.chart.title}`).toBeGreaterThan(0);
        for (const b of s.chart.bars) {
          expect(Number.isFinite(b.value) && b.value >= 0, `${x.path} : ${b.label}`).toBe(true);
        }
      }
    }
  });
});

describe("maillage automatique (linkifySections)", () => {
  const sample: ArticleSection[] = [
    {
      heading: "La capacité utile",
      paragraphs: [
        "La capacité utile compte plus que la capacité brute. Voir le WLTP et la Renault 5 E-Tech 52 kWh 150 ch.",
        "Encore la capacité utile, et encore le WLTP.",
      ],
      table: { headers: ["Modèle"], rows: [["Renault 5 E-Tech 52 kWh 150 ch"], ["Tesla Model Y RWD"]] },
    },
  ];
  const out = linkifySections(sample, vehicles, "/guides/wltp-definition");

  it("lie la première occurrence utile, une seule fois par cible", () => {
    expect(out[0].paragraphs[0]).toContain("[capacité utile](/guides/batterie-brute-batterie-utile)");
    expect(out[0].paragraphs[1]).not.toContain("](/guides/batterie-brute-batterie-utile)");
  });

  it("ne lie jamais la page elle-même ni un titre", () => {
    expect(out[0].paragraphs.join(" ")).not.toContain("](/guides/wltp-definition)");
    expect(out[0].heading).toBe("La capacité utile");
  });

  it("étend l'ancre d'un modèle à sa version et lie les cellules de tableau", () => {
    expect(out[0].paragraphs[0]).toContain("[Renault 5 E-Tech 52 kWh 150 ch](/voitures-electriques/renault/5-e-tech)");
    expect(out[0].table?.rows[1][0]).toContain("](/voitures-electriques/tesla/model-y)");
  });
});
