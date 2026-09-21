import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MARK } from "@/components/brand/geometry";

const brand = (f: string) => new URL(`../../public/brand/${f}`, import.meta.url);
const svg = (f: string) => readFileSync(brand(f), "utf8");

function pngSize(f: string) {
  const b = readFileSync(brand(f));
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

describe("identité de marque", () => {
  it("le composant Logo utilise exactement la géométrie des SVG générés", () => {
    for (const f of ["logo-mark.svg", "logo-mark-dark.svg", "logo.svg", "logo-dark.svg"]) {
      const s = svg(f);
      expect(s, f).toContain(`d="${MARK.plate}"`);
      expect(s, f).toContain(`d="${MARK.e}"`);
      expect(s, f).toContain(`cx="${MARK.dot.cx}" cy="${MARK.dot.cy}" r="${MARK.dot.r}"`);
    }
  });

  it("les SVG n'ont besoin d'aucune police ni ressource externe", () => {
    for (const f of ["logo.svg", "logo-dark.svg", "logo-mark.svg", "logo-mark-dark.svg", "favicon.svg"]) {
      const s = svg(f);
      expect(s, f).not.toMatch(/<text|font-family|href=|url\(|<image/);
    }
  });

  it("dimensions des PNG", () => {
    expect(pngSize("apple-touch-icon.png")).toEqual({ w: 180, h: 180 });
    expect(pngSize("icon-192.png")).toEqual({ w: 192, h: 192 });
    expect(pngSize("icon-512.png")).toEqual({ w: 512, h: 512 });
    expect(pngSize("og-image.png")).toEqual({ w: 1200, h: 630 });
  });

  it("favicon.ico contient 16, 32 et 48 px", () => {
    const b = readFileSync(brand("favicon.ico"));
    expect(b.readUInt16LE(2)).toBe(1); // type ICO
    expect(b.readUInt16LE(4)).toBe(3); // 3 images
    expect([6, 22, 38].map((o) => b[o])).toEqual([16, 32, 48]);
  });

  it("budget de poids : chaque asset reste léger", () => {
    const budget: Record<string, number> = {
      "logo.svg": 4_000, "logo-dark.svg": 4_000, "logo-mark.svg": 600, "logo-mark-dark.svg": 600,
      "favicon.svg": 800, "favicon.ico": 3_000, "apple-touch-icon.png": 2_000,
      "icon-192.png": 2_000, "icon-512.png": 4_000, "og-image.png": 60_000,
    };
    for (const [f, max] of Object.entries(budget)) expect(statSync(brand(f)).size, f).toBeLessThan(max);
  });

  it("photo du hero : JPEG 1376 × 768 de moins de 900 Ko (servie optimisée par next/image)", () => {
    const b = readFileSync(brand("evexpert-hero.jpeg"));
    expect([b[0], b[1]]).toEqual([0xff, 0xd8]); // SOI JPEG
    let i = 2;
    let dims: [number, number] | null = null;
    while (i < b.length) {
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        dims = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
        break;
      }
      i += 2 + len;
    }
    expect(dims).toEqual([1376, 768]);
    // La source a été remplacée par une version de ~780 Ko (commit 282f939) ; seul son dérivé AVIF/WebP est servi.
    expect(b.length).toBeLessThan(900_000);
  });
});
