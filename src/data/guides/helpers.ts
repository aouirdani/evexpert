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
