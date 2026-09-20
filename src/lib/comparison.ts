import { getAllVehicles, vehicleSlug } from "@/data/vehicles";
import type { Vehicle } from "@/types";

export function comparisonSlug(a: Vehicle, b: Vehicle): string {
  return `${vehicleSlug(a)}-vs-${vehicleSlug(b)}`;
}

export function parseComparison(slug: string): Vehicle[] | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const all = getAllVehicles();
  const matched = parts.map((p) => all.find((v) => vehicleSlug(v) === p));
  if (matched.some((v) => !v)) return null;
  const [a, b] = matched as Vehicle[];
  if (a.id === b.id) return null;
  return [a, b];
}

/**
 * Curated set of comparison pages to pre-render and index.
 * We only generate meaningful pairs, not every possible combination,
 * to avoid thin / low-value pages.
 */
export function getFeaturedComparisons(): { slug: string; vehicles: Vehicle[] }[] {
  const all = getAllVehicles();
  const byId = (id: string) => all.find((v) => v.id === id)!;
  const pairs: [string, string][] = [
    ["tesla-model-3-propulsion", "renault-5-e-tech-comfort"],
    ["tesla-model-3-propulsion", "tesla-model-y-grande-autonomie"],
    ["kia-ev6-grande-autonomie", "hyundai-kona-electric-64"],
    ["renault-5-e-tech-comfort", "peugeot-e-208-gt"],
    ["volkswagen-id3-pro", "mg4-comfort"],
  ];
  return pairs
    .map(([a, b]) => {
      const va = byId(a);
      const vb = byId(b);
      if (!va || !vb) return null;
      return { slug: comparisonSlug(va, vb), vehicles: [va, vb] };
    })
    .filter((x): x is { slug: string; vehicles: Vehicle[] } => Boolean(x));
}
