import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import { countByCategory, validateVehicle, validateVehicles } from "@/data/validation";
import type { Vehicle } from "@/types";

const base = vehicles[0];
const mutate = (patch: Partial<Vehicle>): Vehicle => ({ ...base, ...patch });

describe("qualité des données — catalogue local", () => {
  it("ne contient aucun problème", () => {
    expect(validateVehicles(vehicles)).toEqual([]);
  });
  it("contient 47 versions, 22 marques et 45 modèles", () => {
    expect(vehicles).toHaveLength(47);
    expect(new Set(vehicles.map((v) => v.brandSlug)).size).toBe(22);
    expect(new Set(vehicles.map((v) => `${v.brandSlug}/${v.modelSlug}`)).size).toBe(45);
  });
  it("aucun prix n'est présent sans marché (les prix passent par vehicle_prices)", () => {
    expect(vehicles.every((v) => v.price === null)).toBe(true);
  });
});

describe("règles de validation (cas invalides détectés)", () => {
  it("slugs dupliqués", () => {
    const issues = validateVehicles([base, { ...base }]);
    expect(countByCategory(issues, "duplicate")).toBeGreaterThan(0);
  });
  it("slug invalide", () => {
    expect(countByCategory(validateVehicle(mutate({ versionSlug: "Not A Slug" })), "slug")).toBe(1);
  });
  it("prix invalide", () => {
    expect(countByCategory(validateVehicle(mutate({ price: -5 })), "price")).toBe(1);
    expect(countByCategory(validateVehicle(mutate({ price: 0 })), "price")).toBe(1);
  });
  it("batterie utile supérieure à la batterie brute", () => {
    expect(countByCategory(validateVehicle(mutate({ batteryGross: 40, batteryUsable: 50 })), "battery")).toBe(1);
  });
  it("valeurs WLTP invalides", () => {
    expect(countByCategory(validateVehicle(mutate({ rangeWltp: 0 })), "wltp", "required")).toBeGreaterThan(0);
    expect(countByCategory(validateVehicle(mutate({ rangeWltp: 5000 })), "wltp")).toBe(1);
    expect(countByCategory(validateVehicle(mutate({ consumptionWltp: 1.4 })), "consumption")).toBe(1);
  });
  it("source manquante", () => {
    expect(countByCategory(validateVehicle(mutate({ source: { ...base.source, url: "" } })), "source")).toBe(1);
  });
  it("date de vérification manquante ou invalide", () => {
    expect(countByCategory(validateVehicle(mutate({ source: { ...base.source, lastUpdated: "" } })), "verification")).toBe(1);
    expect(countByCategory(validateVehicle(mutate({ source: { ...base.source, lastUpdated: "hier" } })), "verification")).toBe(1);
  });
  it("puissance DC inférieure à l'AC", () => {
    expect(countByCategory(validateVehicle(mutate({ chargingAC: 22, chargingDC: 11 })), "charging")).toBe(1);
  });
});
