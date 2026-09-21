import { describe, expect, it } from "vitest";
import { parseBatteryWarranty, parseYears } from "@/db/import";
import { vehicles } from "@/data/vehicles";

describe("parseYears", () => {
  it("année seule", () => expect(parseYears("2026")).toEqual({ from: 2026, to: 2026 }));
  it("plage", () => expect(parseYears("2024-2026")).toEqual({ from: 2024, to: 2026 }));
  it("format inconnu → NULL, jamais inventé", () => expect(parseYears("récent")).toEqual({ from: null, to: null }));
});

describe("parseBatteryWarranty", () => {
  it("années et km", () => expect(parseBatteryWarranty("8 ans / 160 000 km")).toEqual({ years: 8, km: 160000 }));
  it("années seules", () => expect(parseBatteryWarranty("8 ans")).toEqual({ years: 8, km: null }));
  it("condition « ou »", () => expect(parseBatteryWarranty("8 ans ou 250 000 km")).toEqual({ years: 8, km: 250000 }));
  it("miles : pas de conversion inventée", () => expect(parseBatteryWarranty("8 ans / 100 000 miles")).toEqual({ years: 8, km: null }));
  it("absent → NULL", () => expect(parseBatteryWarranty(null)).toEqual({ years: null, km: null }));
  it("tous les textes du catalogue sont analysables", () => {
    for (const v of vehicles) {
      const w = parseBatteryWarranty(v.batteryWarranty);
      expect(w.years, v.id).not.toBeNull();
    }
  });
});
