import { getVehicleById } from "@/data/vehicles";
import type { Vehicle } from "@/types";

/** Récupère un véhicule du catalogue ; échoue au build si l'identifiant est inconnu. */
export function veh(id: string): Vehicle {
  const v = getVehicleById(id);
  if (!v) throw new Error(`Véhicule inconnu dans un guide : ${id}`);
  return v;
}

export const GUIDE_DATE = "2026-09-21";
