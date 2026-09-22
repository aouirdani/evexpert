import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import { defaultFinderAnswers, matchVehicle, matchVehicles } from "@/lib/vehicle-finder";

const v = (id: string) => vehicles.find((x) => x.id === id)!;

describe("assistant de sélection — matchVehicle", () => {
  it("aucun critère de budget : le prix n'entre jamais dans le calcul", () => {
    const src = matchVehicle.toString();
    expect(src).not.toMatch(/price/i);
  });

  it("un trajet quotidien nul rend le critère d'autonomie toujours rempli", () => {
    const m = matchVehicle(v("dacia-spring-electric-70"), { ...defaultFinderAnswers, dailyKm: 0 });
    expect(m.criteria.find((c) => c.key === "range")?.met).toBe(true);
  });

  it("un trajet quotidien très long peut ne pas être couvert par une petite batterie", () => {
    const m = matchVehicle(v("dacia-spring-electric-70"), { ...defaultFinderAnswers, dailyKm: 300 });
    expect(m.criteria.find((c) => c.key === "range")?.met).toBe(false);
  });

  it("sans usage autoroute, le critère autoroute est toujours rempli (non applicable)", () => {
    const m = matchVehicle(v("dacia-spring-electric-70"), { ...defaultFinderAnswers, highwayUser: false });
    expect(m.criteria.find((c) => c.key === "highway")?.met).toBe(true);
  });

  it("le critère de coffre est neutre (null) quand la donnée est absente", () => {
    const withoutTrunk = { ...v("dacia-spring-electric-70"), trunkVolume: null };
    const m = matchVehicle(withoutTrunk, { ...defaultFinderAnswers, minTrunk: 300 });
    const c = m.criteria.find((x) => x.key === "trunk")!;
    expect(c.met).toBeNull();
    expect(m.applicable).toBe(m.criteria.filter((x) => x.met !== null).length);
  });

  it("le nombre de véhicules retournés est inchangé et le tri est décroissant par correspondance", () => {
    const matches = matchVehicles(vehicles, defaultFinderAnswers);
    expect(matches).toHaveLength(vehicles.length);
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].matched).toBeGreaterThanOrEqual(matches[i].matched);
    }
  });

  it("la carrosserie filtre correctement quand elle est choisie", () => {
    const m = matchVehicle(v("dacia-spring-electric-70"), { ...defaultFinderAnswers, bodyTypes: ["SUV"] });
    expect(m.criteria.find((c) => c.key === "body")?.met).toBe(false);
  });
});
