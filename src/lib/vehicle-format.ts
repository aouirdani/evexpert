import type { BodyType } from "@/types";
import { formatNumber } from "@/lib/format";

export const NA = "Non disponible";

/** Formate une valeur numérique nullable avec unité ; « Non disponible » si absente. */
export function fmt(value: number | null | undefined, unit = "", digits = 0): string {
  if (value === null || value === undefined) return NA;
  return `${formatNumber(value, digits)}${unit ? ` ${unit}` : ""}`;
}

export function fmtText(value: string | null | undefined): string {
  return value && value.trim() ? value : NA;
}

/** Libellés des carrosseries (cartes, filtres). Source unique. */
export const bodyTypeLabels: Record<BodyType, string> = {
  citadine: "Citadine",
  compacte: "Compacte",
  berline: "Berline",
  SUV: "SUV",
  break: "Break",
  monospace: "Monospace",
  utilitaire: "Utilitaire",
  coupé: "Coupé",
};

/** Identifiant de la silhouette dans /brand/body-glyphs.svg (sans accent, en minuscules). */
export function bodyGlyphId(type: BodyType): string {
  return type === "coupé" ? "coupe" : type.toLowerCase();
}

/**
 * Échelle commune des barres d'autonomie (km). Elle doit rester ≥ à la plus grande
 * autonomie du catalogue (vérifié par tests/unit/vehicle-card.test.ts) : les barres
 * représentent une donnée relative, jamais un classement.
 */
export const RANGE_SCALE_MAX = 800;
