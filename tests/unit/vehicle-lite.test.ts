import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import { COMPARE_FIELDS, FINDER_FIELDS, CARD_FIELDS, toCompareVehicle, toExplorerVehicle, toFinderVehicle } from "@/lib/vehicle-lite";
import { objectiveDifferences } from "@/lib/comparison-metrics";
import { matchVehicles, defaultFinderAnswers } from "@/lib/vehicle-finder";

const withHref = vehicles.map((v) => ({ ...v, href: `/voitures-electriques/${v.brandSlug}/${v.modelSlug}` }));
const bytes = (o: unknown) => JSON.stringify(o).length;

describe("versions allégées pour les composants client", () => {
  it("n'exposent que les champs listés (ni source, ni slugs, ni années)", () => {
    const e = toExplorerVehicle(withHref[0]);
    expect(Object.keys(e).sort()).toEqual([...CARD_FIELDS, "href"].sort());
    expect(Object.keys(toFinderVehicle(withHref[0])).sort()).toEqual([...FINDER_FIELDS, "href"].sort());
    expect(Object.keys(toCompareVehicle(vehicles[0])).sort()).toEqual([...COMPARE_FIELDS, "href"].sort());
    for (const k of ["source", "brandSlug", "modelSlug", "versionSlug", "years", "drive"]) {
      expect(e).not.toHaveProperty(k);
      expect(toCompareVehicle(vehicles[0])).not.toHaveProperty(k);
    }
  });

  it("restent légères : l'explorateur et l'assistant tiennent à moins du tiers du catalogue complet", () => {
    const full = bytes(withHref);
    expect(bytes(withHref.map(toExplorerVehicle))).toBeLessThan(full / 3);
    expect(bytes(withHref.map(toFinderVehicle))).toBeLessThan(full / 3);
    expect(bytes(vehicles.map(toCompareVehicle))).toBeLessThan(full * 0.7);
  });

  it("donnent les mêmes résultats que les véhicules complets (assistant) et alimentent tout le comparateur", () => {
    const a = { ...defaultFinderAnswers, dailyKm: 80, highwayUser: true, homeCharging: false };
    const names = (list: { vehicle: { brand: string; model: string; version: string } }[]) => list.map((m) => `${m.vehicle.brand} ${m.vehicle.model} ${m.vehicle.version}`);
    expect(names(matchVehicles(withHref.map(toFinderVehicle), a))).toEqual(names(matchVehicles(withHref, a)));
    // Le comparateur lit tous ses critères dans la version allégée : aucun écart ne disparaît faute de champ.
    const diffs = objectiveDifferences([vehicles[0], vehicles[10]].map(toCompareVehicle));
    expect(diffs.length).toBeGreaterThan(3);
    expect(diffs.every((d) => d.label.length > 0 && d.display.length > 0)).toBe(true);
  });
});
