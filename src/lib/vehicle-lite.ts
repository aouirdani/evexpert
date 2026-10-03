import type { Vehicle } from "@/types";
import { vehicleHref } from "@/lib/vehicle-utils";

/**
 * Versions allégées d'un véhicule pour les composants CLIENT. Tout ce qui est passé en props à un
 * composant client est sérialisé dans le HTML (données RSC) et repris par le navigateur : un `Vehicle`
 * complet pèse ~0,8 Ko par version (47 versions → ~38 Ko en JSON) alors que l'explorateur, l'assistant
 * de sélection ou le comparateur n'en lisent qu'une partie. Chaque liste ci-dessous contient donc
 * exactement les champs lus par le composant (le compilateur le vérifie : les composants sont typés
 * avec ces `Pick`). Ajouter un champ lu par le composant = l'ajouter ici.
 */

function pick<K extends keyof Vehicle>(v: Vehicle, keys: readonly K[]): Pick<Vehicle, K> {
  const out = {} as Pick<Vehicle, K>;
  for (const k of keys) out[k] = v[k];
  return out;
}

/** Ce que lisent VehicleCard et VehicleRow (identité, carrosserie, autonomie, batterie, recharge). */
export const CARD_FIELDS = [
  "id", "brand", "model", "version", "bodyType", "rangeWltp", "batteryUsable", "chargingDC", "chargingTime10to80",
] as const;
export type VehicleCardData = Pick<Vehicle, (typeof CARD_FIELDS)[number]>;

/** Explorateur du catalogue : carte/ligne + lien de la fiche. */
export type ExplorerVehicle = VehicleCardData & { href: string };
export const toExplorerVehicle = (v: Vehicle & { href: string }): ExplorerVehicle => ({ ...pick(v, CARD_FIELDS), href: v.href });

/** Assistant « Trouver ma voiture » : critères (autonomie, recharge DC, places, coffre, carrosserie) + affichage. */
export const FINDER_FIELDS = [
  "id", "brand", "model", "version", "bodyType", "rangeWltp", "batteryUsable", "chargingDC", "trunkVolume", "seats",
] as const;
export type FinderVehicle = Pick<Vehicle, (typeof FINDER_FIELDS)[number]> & { href: string };
export const toFinderVehicle = (v: Vehicle & { href: string }): FinderVehicle => ({ ...pick(v, FINDER_FIELDS), href: v.href });

/** Comparateur : tous les critères du tableau comparatif, sans slugs, années, transmission ni source. */
export const COMPARE_FIELDS = [
  "id", "brand", "model", "version", "chemistry", "batteryGross", "batteryUsable", "rangeWltp", "consumptionWltp",
  "powerKw", "powerPs", "torque", "acceleration0to100", "topSpeed", "chargingAC", "chargingDC", "chargingTime10to80",
  "dimensions", "weight", "trunkVolume", "trunkVolumeMax", "seats", "batteryWarranty", "warranty", "price",
] as const;
/** `href` : fiche du modèle (l'en-tête de colonne y renvoie). */
export type CompareVehicle = Pick<Vehicle, (typeof COMPARE_FIELDS)[number]> & { href: string };
export const toCompareVehicle = (v: Vehicle): CompareVehicle => ({ ...pick(v, COMPARE_FIELDS), href: vehicleHref(v, "model") });
