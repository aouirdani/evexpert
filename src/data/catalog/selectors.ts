import type { Vehicle } from "@/types";

/**
 * Sélecteurs PURS sur une liste de véhicules déjà chargée (base ou données locales).
 * Aucune I/O : testables sans base et réutilisables partout.
 */

export function byId(vehicles: Vehicle[], id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function byBrand(vehicles: Vehicle[], brandSlug: string): Vehicle[] {
  return vehicles.filter((v) => v.brandSlug === brandSlug);
}

export function find(vehicles: Vehicle[], brandSlug: string, modelSlug: string, versionSlug?: string): Vehicle | undefined {
  return vehicles.find(
    (v) => v.brandSlug === brandSlug && v.modelSlug === modelSlug && (versionSlug ? v.versionSlug === versionSlug : true),
  );
}

export function versionsOf(vehicles: Vehicle[], brandSlug: string, modelSlug: string): Vehicle[] {
  return vehicles.filter((v) => v.brandSlug === brandSlug && v.modelSlug === modelSlug);
}

/** Marques triées alphabétiquement avec leur nombre de versions. */
export function brandsOf(vehicles: Vehicle[]): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const v of vehicles) {
    const existing = map.get(v.brandSlug);
    if (existing) existing.count += 1;
    else map.set(v.brandSlug, { name: v.brand, count: 1 });
  }
  return Array.from(map.entries())
    .map(([slug, val]) => ({ slug, ...val }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/** Un modèle = une page /[brand]/[model] ; on retourne sa première version comme représentant. */
export function modelsOf(vehicles: Vehicle[]): Vehicle[] {
  const seen = new Set<string>();
  const out: Vehicle[] = [];
  for (const v of vehicles) {
    const key = `${v.brandSlug}/${v.modelSlug}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(v);
    }
  }
  return out;
}

/** Une page version n'est indexable que si le modèle a plusieurs versions (sinon elle dupliquerait la page modèle). */
export function isVersionIndexable(vehicles: Vehicle[], v: Vehicle): boolean {
  return versionsOf(vehicles, v.brandSlug, v.modelSlug).length > 1;
}

/** Véhicules proches : même carrosserie d'abord, puis capacité et autonomie voisines. */
export function similarTo(vehicles: Vehicle[], vehicle: Vehicle, limit = 3): Vehicle[] {
  return vehicles
    .filter((v) => v.id !== vehicle.id && v.modelSlug !== vehicle.modelSlug)
    .map((v) => ({
      v,
      score:
        (v.bodyType === vehicle.bodyType ? 0 : 3) +
        Math.abs(v.batteryUsable - vehicle.batteryUsable) / 15 +
        Math.abs(v.rangeWltp - vehicle.rangeWltp) / 100,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.v);
}

/** Date de relevé la plus récente du catalogue (ISO AAAA-MM-JJ). */
export function latestVerification(vehicles: Vehicle[]): string {
  return vehicles.map((v) => v.source.lastUpdated).sort().at(-1) ?? "";
}
