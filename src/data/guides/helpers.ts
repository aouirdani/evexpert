import type { Vehicle } from "@/types";

export const GUIDE_DATE = "2026-09-21";

/** Contexte fourni aux constructeurs de guides : le catalogue déjà chargé. */
export interface GuideContext {
  vehicles: Vehicle[];
  /** Retrouve un véhicule par id ; échoue au build si l'identifiant est inconnu. */
  veh: (id: string) => Vehicle;
}

export function makeGuideContext(vehicles: Vehicle[]): GuideContext {
  const byId = new Map(vehicles.map((v) => [v.id, v]));
  return {
    vehicles,
    veh(id) {
      const v = byId.get(id);
      if (!v) throw new Error(`Véhicule inconnu dans un guide ou un article : ${id}`);
      return v;
    },
  };
}

/**
 * Nom complet d'une version : marque, modèle et version (« Renault 5 E-Tech 52 kWh 150 ch »). Quand la version
 * répète la fin du nom du modèle (« Puma Gen-E » + « Gen-E »), elle n'est pas écrite deux fois.
 */
export const fullName = (v: Vehicle) =>
  v.model.toLowerCase().endsWith(v.version.toLowerCase()) ? `${v.brand} ${v.model}` : `${v.brand} ${v.model} ${v.version}`;

export interface Extent {
  min: Vehicle;
  max: Vehicle;
  minValue: number;
  maxValue: number;
  /** Nombre de versions pour lesquelles la valeur existe. */
  n: number;
}

/**
 * Plus petite et plus grande valeur d'une grandeur sur les versions du catalogue (lues en direct, jamais écrites
 * en dur). Les versions pour lesquelles la valeur est absente (`null`) sont ignorées. Échoue si aucune n'en a une.
 */
export function extent(vehicles: Vehicle[], pick: (v: Vehicle) => number | null | undefined): Extent {
  const withValue = vehicles
    .map((v) => ({ v, x: pick(v) }))
    .filter((e): e is { v: Vehicle; x: number } => typeof e.x === "number" && Number.isFinite(e.x))
    .sort((a, b) => a.x - b.x);
  if (!withValue.length) throw new Error("extent : aucune version du catalogue n'a cette valeur");
  const lo = withValue[0];
  const hi = withValue[withValue.length - 1];
  return { min: lo.v, max: hi.v, minValue: lo.x, maxValue: hi.x, n: withValue.length };
}
