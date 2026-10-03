import { existsSync, readFileSync, statSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ImageCreditLine } from "@/components/content/ImageCreditLine";
import { EDITORIAL_LICENSED } from "@/data/editorial/licensed";
import { EDITORIAL_PHOTOS } from "@/data/editorial/media";
import { chargingTopics } from "@/data/charging";
import { vehicles } from "@/data/vehicles";
import { buildArticles } from "@/data/articles";
import { buildAutonomieGuides } from "@/data/guides/autonomie";
import { buildRechargeGuides } from "@/data/guides/recharge";
import { buildUsageGuides } from "@/data/guides/usage";
import { buildNewGuides } from "@/data/guides/nouveaux";
import { buildBatteryGuides } from "@/data/guides/batterie";
import { makeGuideContext } from "@/data/guides/helpers";
import { buildEssentials, firstSentence } from "@/lib/essentials";

const jpegSize = (b: Buffer): [number, number] => {
  let i = 2;
  while (i < b.length) {
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error("SOF introuvable");
};
const file = (src: string) => new URL(`../../public${src}`, import.meta.url);

const ALLOWED_SOURCES: Record<string, string[]> = {
  Unsplash: ["unsplash.com"],
  Pexels: ["www.pexels.com", "pexels.com"],
  Pixabay: ["pixabay.com"],
  "Wikimedia Commons": ["commons.wikimedia.org"],
};

describe("images sous licence libre", () => {
  for (const [slug, { image }] of Object.entries(EDITORIAL_LICENSED)) {
    it(`${slug} : fichiers 16:9 et Open Graph, poids, texte alternatif`, () => {
      expect(existsSync(file(image.src)), image.src).toBe(true);
      expect(jpegSize(readFileSync(file(image.src)))).toEqual([1600, 900]);
      expect(statSync(file(image.src)).size).toBeLessThan(250_000);
      expect(image.share).toBeTruthy();
      expect(jpegSize(readFileSync(file(image.share!)))).toEqual([1200, 630]);
      expect(statSync(file(image.share!)).size).toBeLessThan(150_000);
      expect(image.alt.length).toBeGreaterThan(60);
      expect(image.caption?.length ?? 0).toBeGreaterThan(20);
    });

    it(`${slug} : provenance et licence complètes, source autorisée`, () => {
      const c = image.credit!;
      expect(c).toBeTruthy();
      for (const url of [c.sourceUrl, c.authorUrl, c.licenseUrl]) expect(url).toMatch(/^https:\/\//);
      expect(c.author.length).toBeGreaterThan(1);
      expect(c.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.modifications.length).toBeGreaterThan(5);
      const hosts = ALLOWED_SOURCES[c.sourceName];
      expect(hosts, `source non autorisée : ${c.sourceName}`).toBeTruthy();
      expect(hosts).toContain(new URL(c.sourceUrl).host);
      expect(`${c.license} ${c.sourceUrl}`).not.toMatch(/unsplash\+|plus\./i);
    });
  }
});

describe("encadré « L'essentiel »", () => {
  it("première phrase : liens markdown réduits à leur texte, décimales conservées", () => {
    expect(firstSentence("Voir [le guide](/guides/x) : 2,3 kW suffisent. Suite du texte.")).toBe("Voir le guide : 2,3 kW suffisent.");
    expect(firstSentence("Une seule phrase sans point final")).toBe("Une seule phrase sans point final");
  });

  it("construit depuis les premiers paragraphes des H2, sans en inventer", () => {
    const items = buildEssentials(
      [
        { heading: "Sans paragraphe", paragraphs: [] },
        { heading: "Première réponse", paragraphs: ["La réponse tient en une phrase assez longue pour compter. La suite développe."] },
        { heading: "Sous-section", level: 3, paragraphs: ["Ce niveau 3 est ignoré par l'encadré, comme les H3."] },
        { heading: "Deuxième réponse", paragraphs: ["Seconde réponse directe, également assez longue pour être retenue ici."] },
      ],
      4,
    );
    expect(items.map((i) => i.id)).toEqual(["premiere-reponse", "deuxieme-reponse"]);
    expect(items[0].text).toBe("La réponse tient en une phrase assez longue pour compter.");
  });
});

// Contraste WCAG 2.x
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

describe("palette « Cobalt & volt » : contraste WCAG AA (jetons de globals.css)", () => {
  const css = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8");
  const theme = css.slice(css.indexOf("@theme {"), css.indexOf("@layer base"));
  const t = (name: string) => {
    const m = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(theme);
    if (!m) throw new Error(`jeton --color-${name} introuvable`);
    return m[1];
  };

  it("texte et contrôles sur les fonds clairs, teintés et sombres", () => {
    const pairs: [string, string, number][] = [
      ["ink", "paper", 4.5], ["body", "paper", 4.5], ["muted", "paper", 4.5], ["muted", "surface", 4.5],
      ["ink", "paper-deep", 4.5], ["body", "paper-deep", 4.5], ["muted", "paper-deep", 4.5],
      ["signal-deep", "paper", 4.5], ["signal-deep", "paper-deep", 4.5], ["signal-deep", "surface", 4.5], ["signal-deep", "signal-tint", 4.5],
      ["body", "signal-tint", 4.5], ["ink", "signal-tint", 4.5],
      ["ink", "signal", 4.5], ["signal", "ink", 4.5], ["ink-muted", "ink", 4.5], ["ink-muted", "ink-raised", 4.5], ["paper", "ink", 4.5],
      ["brand-fg", "brand", 4.5], ["brand-muted", "brand", 4.5], ["brand-fg", "brand-raised", 4.5], ["brand-muted", "brand-raised", 4.5],
      ["signal", "brand", 3], ["control", "paper", 3],
    ];
    for (const [fg, bg, min] of pairs) expect(ratio(t(fg), t(bg)), `${fg} sur ${bg}`).toBeGreaterThanOrEqual(min);
  });

  it("le volt n'est jamais un texte sur fond clair (contraste < 3 : réservé aux fonds et aux soulignements)", () => {
    expect(ratio(t("signal"), t("paper"))).toBeLessThan(3);
  });
});

describe("couverture des images (35 contenus)", () => {
  const ctx = makeGuideContext(vehicles);
  const slugs = [
    ...[...buildAutonomieGuides(ctx), ...buildRechargeGuides(ctx), ...buildUsageGuides(ctx), ...buildNewGuides(ctx), ...buildBatteryGuides(ctx)].map((g) => g.slug),
    ...buildArticles(vehicles).map((a) => a.slug),
    ...chargingTopics.map((t) => t.slug),
  ];

  /** Contenus sans photo, et pourquoi : aucune image libre convenable n'a été trouvée (on ne force pas). */
  const SANS_PHOTO: Record<string, string> = {
    "wltp-definition": "schéma seul : aucune photo libre n'illustre un cycle d'homologation",
    "consommation-voiture-electrique-kwh-100-km": "aucune photo libre convenable",
    "cout-100-km-voiture-electrique": "aucune photo libre convenable",
    "voiture-electrique-vs-essence": "aucune photo libre convenable (comparaison électrique / essence)",
    "comment-evexpert-construit-sa-base": "contenu méthodologique : aucune photo libre pertinente",
    "garantie-batterie-ce-que-disent-les-donnees": "aucune photo libre convenable",
  };

  it("chaque contenu a une photo sous licence, une illustration existante, ou une raison documentée", () => {
    expect(slugs).toHaveLength(35);
    for (const slug of slugs) {
      const has = Boolean(EDITORIAL_LICENSED[slug] || EDITORIAL_PHOTOS[slug]);
      expect(has || slug in SANS_PHOTO, slug).toBe(true);
      if (slug in SANS_PHOTO) expect(EDITORIAL_LICENSED[slug], `${slug} : ne plus lister dans SANS_PHOTO`).toBeUndefined();
    }
    for (const slug of Object.keys(EDITORIAL_LICENSED)) expect(slugs, slug).toContain(slug);
  });

  it("une photo n'est jamais utilisée pour deux contenus (fichier unique par entrée)", () => {
    const files = Object.values(EDITORIAL_LICENSED).map((e) => e.image.src);
    expect(new Set(files).size).toBe(files.length);
  });

  it("licence CC BY / BY-SA : crédit obligatoire marqué, avec mention de la modification", () => {
    for (const [slug, { image }] of Object.entries(EDITORIAL_LICENSED)) {
      const c = image.credit!;
      if (/CC BY/.test(c.license)) {
        expect(c.attributionRequired, slug).toBe(true);
        expect(c.modifications, slug).toMatch(/modifi/i);
      }
    }
  });
});

describe("ligne de crédit sous les photos", () => {
  const html = (slug: string) => renderToStaticMarkup(createElement(ImageCreditLine, { credit: EDITORIAL_LICENSED[slug].image.credit! }));

  it("CC BY-SA : auteur, licence avec son lien et « image recadrée »", () => {
    const sa = Object.entries(EDITORIAL_LICENSED).filter(([, e]) => /BY-SA/.test(e.image.credit!.license));
    expect(sa.map(([slug]) => slug).sort()).toEqual(["ccs", "chademo", "lfp-ou-nmc-ce-que-montrent-les-donnees", "prix-batterie-voiture-electrique"]);
    for (const [slug, e] of sa) {
      const c = e.image.credit!;
      const out = html(slug);
      expect(out, slug).toContain(c.author);
      expect(out, slug).toContain(c.license);
      expect(out, slug).toContain(`href="${c.licenseUrl}"`);
      expect(out, slug).toContain("image recadrée");
    }
  });

  it("Unsplash et CC0 : crédit affiché, sans mention de modification obligatoire", () => {
    expect(html("temps-recharge-voiture-electrique")).not.toContain("image recadrée");
    expect(html("type-2")).toContain("CC0");
  });
});
