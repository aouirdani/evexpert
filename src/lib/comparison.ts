import "server-only";
import { getAllVehicles } from "@/data/catalog";
import type { Vehicle } from "@/types";

export function comparisonSlug(a: Vehicle, b: Vehicle): string {
  return `${a.id}-vs-${b.id}`;
}

export async function parseComparison(slug: string): Promise<Vehicle[] | null> {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const all = await getAllVehicles();
  const matched = parts.map((p) => all.find((v) => v.id === p));
  if (matched.some((v) => !v)) return null;
  const [a, b] = matched as Vehicle[];
  if (a.id === b.id) return null;
  return [a, b];
}

/**
 * Sélection restreinte de comparaisons pré-générées et indexables : seulement
 * des paires de modèles réellement concurrents, pas toutes les combinaisons
 * possibles (pas de pages faibles ou redondantes). Une paire dont un véhicule
 * n'existe plus dans le catalogue est simplement ignorée.
 */
export const FEATURED_PAIRS: [string, string][] = [
  ["renault-5-e-tech-52-kwh-150-ch", "peugeot-e-208-50-kwh"],
  ["citroen-e-c3-standard-range-44-kwh", "fiat-grande-panda-44-kwh"],
  ["tesla-model-y-rwd", "skoda-elroq-85"],
  ["tesla-model-3-long-range-rwd", "bmw-i4-edrive40"],
  ["renault-scenic-e-tech-ev87-220-ch", "volkswagen-id-4-pro"],
  ["kia-ev3-long-range", "hyundai-kona-electric-65-kwh"],
  ["mg-mg4-urban-comfort-long-range", "cupra-born-170-kw-79-kwh"],
  ["byd-atto-3-evo-rwd-design", "mg-mgs5-ev-64-kwh"],
];

export async function getFeaturedComparisons(): Promise<{ slug: string; vehicles: Vehicle[] }[]> {
  const all = await getAllVehicles();
  return FEATURED_PAIRS.flatMap(([a, b]) => {
    const va = all.find((v) => v.id === a);
    const vb = all.find((v) => v.id === b);
    return va && vb ? [{ slug: comparisonSlug(va, vb), vehicles: [va, vb] }] : [];
  });
}
