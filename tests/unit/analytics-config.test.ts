import { afterEach, describe, expect, it } from "vitest";
import { getGa4MeasurementId } from "@/config/analytics";

const ORIGINAL = process.env.GA_ID;

describe("getGa4MeasurementId — variable serveur GA_ID (sans préfixe NEXT_PUBLIC_)", () => {
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.GA_ID;
    else process.env.GA_ID = ORIGINAL;
  });

  it("renvoie l'identifiant tel que défini", () => {
    process.env.GA_ID = "G-1HZPD8J76K";
    expect(getGa4MeasurementId()).toBe("G-1HZPD8J76K");
  });

  it("renvoie une chaîne vide quand la variable est absente", () => {
    delete process.env.GA_ID;
    expect(getGa4MeasurementId()).toBe("");
  });

  it("renvoie une chaîne vide quand la variable est vide ou blanche", () => {
    process.env.GA_ID = "   ";
    expect(getGa4MeasurementId()).toBe("");
  });

  it("retire les espaces superflus", () => {
    process.env.GA_ID = "  G-1HZPD8J76K  ";
    expect(getGa4MeasurementId()).toBe("G-1HZPD8J76K");
  });

  it("n'utilise jamais NEXT_PUBLIC_GA_ID (variable obsolète)", () => {
    delete process.env.GA_ID;
    process.env.NEXT_PUBLIC_GA_ID = "G-devraitEtreIgnore";
    expect(getGa4MeasurementId()).toBe("");
    delete process.env.NEXT_PUBLIC_GA_ID;
  });
});
