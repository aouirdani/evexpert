import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import { RANGE_SCALE_MAX, bodyGlyphId, bodyTypeLabels } from "@/lib/vehicle-format";

const sprite = readFileSync(new URL("../../public/brand/body-glyphs.svg", import.meta.url), "utf8");

describe("silhouettes de carrosserie", () => {
  it("chaque type de carrosserie a une silhouette dans le sprite", () => {
    for (const type of Object.keys(bodyTypeLabels) as (keyof typeof bodyTypeLabels)[]) {
      expect(sprite, type).toContain(`<symbol id="${bodyGlyphId(type)}"`);
    }
  });

  it("le sprite est statique : aucun script, texte, police ni ressource externe", () => {
    expect(sprite).not.toMatch(/<script|<text|font-family|<image|url\(/);
  });

  it("chaque carrosserie du catalogue est couverte", () => {
    for (const v of vehicles) expect(sprite, v.id).toContain(`id="${bodyGlyphId(v.bodyType)}"`);
  });
});

describe("barre d'autonomie", () => {
  it("l'échelle commune couvre la plus grande autonomie du catalogue", () => {
    const max = Math.max(...vehicles.map((v) => v.rangeWltp));
    expect(max).toBeLessThanOrEqual(RANGE_SCALE_MAX);
  });
});
