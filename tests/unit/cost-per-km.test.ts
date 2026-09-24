import { describe, expect, it } from "vitest";
import { costPerKmCents } from "@/lib/calculators";

describe("costPerKmCents — conversion €/100 km vers centimes/km", () => {
  it("un coût de 6 €/100 km vaut 6 centimes/km", () => {
    expect(costPerKmCents(6)).toBe(6);
  });

  it("conserve les décimales sans les arrondir", () => {
    expect(costPerKmCents(4.37)).toBeCloseTo(4.37, 6);
  });

  it("vaut 0 pour un coût nul", () => {
    expect(costPerKmCents(0)).toBe(0);
  });

  it("reste cohérent avec la formule manuelle (÷ 100 km × 100 centimes/€)", () => {
    const costPer100 = 8.24;
    expect(costPerKmCents(costPer100)).toBeCloseTo((costPer100 / 100) * 100, 9);
  });
});
