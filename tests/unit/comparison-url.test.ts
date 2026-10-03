import { describe, expect, it } from "vitest";
import { parseRequestedIds, resolveInitialIds } from "@/lib/comparison-url";

const KNOWN = ["a", "b", "c", "d"];
const DEFAULTS = ["x", "y"];

describe("lien partagé ?v= du comparateur", () => {
  it("préremplit avec les identifiants du lien, dans l'ordre", () => {
    expect(resolveInitialIds("c,a,b", KNOWN, DEFAULTS)).toEqual(["c", "a", "b"]);
  });
  it("« Ma sélection » : un seul véhicule est repris tel quel", () => {
    expect(resolveInitialIds("b", KNOWN, DEFAULTS)).toEqual(["b"]);
  });
  it("ignore les identifiants inconnus, garde les valides", () => {
    expect(resolveInitialIds("zzz,b,a", KNOWN, DEFAULTS)).toEqual(["b", "a"]);
  });
  it("dédoublonne et plafonne à 3", () => {
    expect(parseRequestedIds("a,a,b,c,d")).toEqual(["a", "b", "c"]);
  });
  it("paire par défaut sans paramètre ou sans identifiant valide", () => {
    expect(resolveInitialIds(null, KNOWN, DEFAULTS)).toEqual(DEFAULTS);
    expect(resolveInitialIds("", KNOWN, DEFAULTS)).toEqual(DEFAULTS);
    expect(resolveInitialIds("zzz", KNOWN, DEFAULTS)).toEqual(DEFAULTS);
  });
});
