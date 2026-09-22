import type { BodyType } from "@/types";
import { RANGE_SCENARIOS, batteryConsumption100, estimateRange } from "@/lib/vehicle-calcs";
import type { Vehicle } from "@/types";

/**
 * Assistant de sélection : détermine, pour un véhicule, si chaque critère demandé est
 * rempli — jamais un score global opaque ni un classement subjectif. Aucun critère de
 * budget : le prix en France n'est pas encore collecté (voir /methodologie).
 */
export interface FinderAnswers {
  /** Trajet quotidien aller simple (km) ; l'autonomie requise est le double, avec marge. */
  dailyKm: number;
  /** Trajets autoroute fréquents : la recharge rapide DC devient un critère. */
  highwayUser: boolean;
  /** Recharge possible à domicile ou au travail : sans elle, la recharge rapide DC pèse plus. */
  homeCharging: boolean;
  minSeats: number;
  /** Coffre minimal souhaité (L) ; 0 = indifférent. */
  minTrunk: number;
  /** Carrosseries souhaitées ; vide = toutes acceptées. */
  bodyTypes: BodyType[];
}

export interface FinderCriterion {
  key: string;
  label: string;
  /** `null` : la donnée nécessaire est absente de la fiche, le critère n'est pas comptabilisé. */
  met: boolean | null;
}

export interface FinderMatch<V extends Vehicle = Vehicle> {
  vehicle: V;
  criteria: FinderCriterion[];
  /** Nombre de critères applicables remplis. */
  matched: number;
  /** Nombre de critères applicables (les critères à `met: null` sont exclus des deux totaux). */
  applicable: number;
}

const mixte = RANGE_SCENARIOS.find((s) => s.id === "mixte")!;
const autoroute = RANGE_SCENARIOS.find((s) => s.id === "autoroute")!;

/** Marge de sécurité : on ne vise jamais l'autonomie affichée à 100 %. */
const SAFETY_MARGIN = 0.85;

/** Générique sur `V` pour laisser passer les champs ajoutés par l'appelant (ex. `href` précalculé). */
export function matchVehicle<V extends Vehicle>(v: V, a: FinderAnswers): FinderMatch<V> {
  const dailyNeedKm = a.dailyKm * 2;
  const realMixteRange = estimateRange(v, mixte) * SAFETY_MARGIN;

  const criteria: FinderCriterion[] = [
    {
      key: "range",
      label: `Autonomie suffisante pour ${Math.round(dailyNeedKm)} km/jour (estimée, conduite mixte)`,
      met: dailyNeedKm <= 0 ? true : realMixteRange >= dailyNeedKm,
    },
    {
      key: "highway",
      label: "Adaptée aux longs trajets autoroute (autonomie et recharge rapide)",
      met: !a.highwayUser
        ? true
        : v.chargingDC === null
          ? null
          : estimateRange(v, autoroute) * SAFETY_MARGIN >= 250 && v.chargingDC >= 100,
    },
    {
      key: "fastCharge",
      label: "Recharge rapide DC disponible (utile sans borne à domicile)",
      met: a.homeCharging ? true : v.chargingDC !== null && v.chargingDC >= 80,
    },
    {
      key: "seats",
      label: `Au moins ${a.minSeats} places`,
      met: a.minSeats <= 0 ? true : v.seats >= a.minSeats,
    },
    {
      key: "trunk",
      label: `Coffre d'au moins ${a.minTrunk} L`,
      met: a.minTrunk <= 0 ? true : v.trunkVolume === null ? null : v.trunkVolume >= a.minTrunk,
    },
    {
      key: "body",
      label: "Carrosserie parmi celles choisies",
      met: a.bodyTypes.length === 0 ? true : a.bodyTypes.includes(v.bodyType),
    },
  ];

  const applicableCriteria = criteria.filter((c) => c.met !== null);
  return {
    vehicle: v,
    criteria,
    matched: applicableCriteria.filter((c) => c.met).length,
    applicable: applicableCriteria.length,
  };
}

export function matchVehicles<V extends Vehicle>(vehicles: V[], a: FinderAnswers): FinderMatch<V>[] {
  return vehicles
    .map((v) => matchVehicle(v, a))
    .sort((x, y) => y.matched - x.matched || y.vehicle.rangeWltp - x.vehicle.rangeWltp);
}

export const defaultFinderAnswers: FinderAnswers = {
  dailyKm: 40,
  highwayUser: false,
  homeCharging: true,
  minSeats: 4,
  minTrunk: 0,
  bodyTypes: [],
};

/** Réexporté pour l'affichage (consommation de référence, non utilisée dans le score). */
export { batteryConsumption100 };
