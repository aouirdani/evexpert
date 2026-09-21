import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import { brandsOf, isVersionIndexable, modelsOf, similarTo, versionsOf } from "@/data/catalog/selectors";
import { vehicleHref } from "@/lib/vehicle-utils";

describe("sélecteurs purs", () => {
  it("regroupe marques et modèles", () => {
    expect(brandsOf(vehicles)).toHaveLength(22);
    expect(modelsOf(vehicles)).toHaveLength(45);
  });
  it("Tesla Model 3 a 2 versions → pages version indexables ; Renault 5 en a 1 → non", () => {
    const m3 = versionsOf(vehicles, "tesla", "model-3");
    expect(m3).toHaveLength(2);
    expect(isVersionIndexable(vehicles, m3[0])).toBe(true);
    const r5 = versionsOf(vehicles, "renault", "5-e-tech")[0];
    expect(isVersionIndexable(vehicles, r5)).toBe(false);
  });
  it("les URLs publiques sont inchangées", () => {
    const r5 = versionsOf(vehicles, "renault", "5-e-tech")[0];
    expect(vehicleHref(r5, "brand")).toBe("/voitures-electriques/renault");
    expect(vehicleHref(r5, "model")).toBe("/voitures-electriques/renault/5-e-tech");
    expect(vehicleHref(r5, "version")).toBe("/voitures-electriques/renault/5-e-tech/52-kwh-150-ch");
  });
  it("véhicules similaires : jamais le même modèle", () => {
    const s = similarTo(vehicles, vehicles[0], 3);
    expect(s).toHaveLength(3);
    expect(s.every((v) => v.modelSlug !== vehicles[0].modelSlug)).toBe(true);
  });
});
