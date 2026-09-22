import { describe, expect, it } from "vitest";
import { computeTripPlan, computeUsageCost } from "@/lib/calculators";

describe("computeUsageCost — coût d'usage annuel personnalisé", () => {
  it("pondère le prix par la part domicile/public", () => {
    const r = computeUsageCost({ gridConsumption: 17.8, annualKm: 15000, homeSharePct: 70, homePrice: 0.25, publicPrice: 0.45 });
    expect(r.blendedPricePerKwh).toBeCloseTo(0.7 * 0.25 + 0.3 * 0.45, 6);
    expect(r.kwhPerYear).toBeCloseTo((17.8 * 15000) / 100, 6);
    expect(r.costPerYear).toBeCloseTo(r.kwhPerYear * r.blendedPricePerKwh, 6);
    expect(r.costPerMonth).toBeCloseTo(r.costPerYear / 12, 6);
    expect(r.costOver3Years).toBeCloseTo(r.costPerYear * 3, 6);
  });
  it("100 % domicile = prix domicile pur", () => {
    const r = computeUsageCost({ gridConsumption: 16, annualKm: 12000, homeSharePct: 100, homePrice: 0.25, publicPrice: 0.65 });
    expect(r.blendedPricePerKwh).toBeCloseTo(0.25, 6);
  });
  it("borne haute et basse de la part domicile sont bornées à [0, 100]", () => {
    const over = computeUsageCost({ gridConsumption: 16, annualKm: 12000, homeSharePct: 150, homePrice: 0.25, publicPrice: 0.65 });
    const under = computeUsageCost({ gridConsumption: 16, annualKm: 12000, homeSharePct: -50, homePrice: 0.25, publicPrice: 0.65 });
    expect(over.blendedPricePerKwh).toBeCloseTo(0.25, 6);
    expect(under.blendedPricePerKwh).toBeCloseTo(0.65, 6);
  });
});

describe("computeTripPlan — simulateur de trajet longue distance", () => {
  const base = {
    distanceKm: 500,
    avgSpeed: 130,
    temperature: 10,
    marginPct: 10,
    usableCapacityKwh: 60,
    baseConsumptionKwh100: 15,
    dcAveragePowerKw: 90,
    dcPricePerKwh: 0.65,
  };

  it("un trajet plus court que l'autonomie réelle ne demande aucun arrêt", () => {
    const r = computeTripPlan({ ...base, distanceKm: 100 });
    expect(r.stops).toBe(0);
    expect(r.totalChargingMinutes).toBe(0);
    expect(r.totalCost).toBe(0);
  });

  it("calcule un nombre d'arrêts croissant avec la distance", () => {
    const short = computeTripPlan({ ...base, distanceKm: 500 });
    const long = computeTripPlan({ ...base, distanceKm: 1000 });
    expect(long.stops).toBeGreaterThan(short.stops);
    expect(long.totalChargingMinutes).toBeGreaterThan(short.totalChargingMinutes);
    expect(long.totalCost).toBeGreaterThan(short.totalCost);
  });

  it("la conduite est classée autoroute au-delà de 100 km/h", () => {
    expect(computeTripPlan({ ...base, avgSpeed: 130 }).drivingType).toBe("autoroute");
    expect(computeTripPlan({ ...base, avgSpeed: 90 }).drivingType).toBe("mixte");
    expect(computeTripPlan({ ...base, avgSpeed: 45 }).drivingType).toBe("ville");
  });

  it("chaque arrêt recharge l'équivalent d'un trajet complet, pertes de charge comprises", () => {
    const r = computeTripPlan({ ...base, distanceKm: 1000 });
    const perStopGrid = r.energyPerStopKwh / 0.9;
    expect(r.totalEnergyKwh).toBeCloseTo(r.stops * perStopGrid, 6);
  });

  it("une puissance DC plus élevée réduit le temps de charge total", () => {
    const slow = computeTripPlan({ ...base, distanceKm: 1000, dcAveragePowerKw: 50 });
    const fast = computeTripPlan({ ...base, distanceKm: 1000, dcAveragePowerKw: 150 });
    expect(fast.totalChargingMinutes).toBeLessThan(slow.totalChargingMinutes);
  });
});
