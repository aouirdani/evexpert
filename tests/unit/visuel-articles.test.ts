import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EDITORIAL_LICENSED } from "@/data/editorial/licensed";
import { buildEssentials, firstSentence } from "@/lib/essentials";
import { PALETTES } from "@/components/PalettePreview";

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

describe("palettes d'aperçu : contraste WCAG AA", () => {
  const pairs: [string, string, number][] = [
    ["ink", "paper", 4.5], ["body", "paper", 4.5], ["muted", "paper", 4.5], ["muted", "paper-deep", 4.5],
    ["signal-deep", "paper", 4.5], ["signal-deep", "signal-tint", 4.5], ["ink", "signal", 4.5], ["signal", "ink", 4.5],
    ["ink-muted", "ink", 4.5], ["ink-muted", "ink-raised", 4.5], ["paper", "ink", 4.5], ["control", "paper", 3],
  ];
  for (const [key, p] of Object.entries(PALETTES)) {
    it(`${p.label}`, () => {
      for (const [fg, bg, min] of pairs) {
        expect(ratio(p.tokens[fg], p.tokens[bg]), `${fg} sur ${bg}`).toBeGreaterThanOrEqual(min);
      }
      expect(key).toMatch(/^[abc]$/);
    });
  }
});
