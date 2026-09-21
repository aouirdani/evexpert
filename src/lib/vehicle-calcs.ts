import type { Vehicle } from "@/types";
import { ASSUMPTIONS } from "@/data/assumptions";
import { computeRange, type DrivingType } from "@/lib/calculators";

/**
 * Calculs dérivés des fiches véhicules. Toutes les fonctions sont pures et
 * n'utilisent que des données de la fiche + des hypothèses passées en argument.
 * Leurs résultats sont des « calculs EVExpert » ou des « estimations EVExpert ».
 */

/** Énergie utile consommée aux 100 km (côté batterie) = capacité utile ÷ autonomie WLTP × 100. */
export function batteryConsumption100(v: Vehicle): number {
  return (v.batteryUsable / v.rangeWltp) * 100;
}

/** Énergie tirée du réseau aux 100 km, pertes de charge comprises. */
export function gridConsumption100(
  v: Vehicle,
  efficiencyPct: number = ASSUMPTIONS.chargingEfficiency,
): number {
  return batteryConsumption100(v) / (Math.max(1, efficiencyPct) / 100);
}

export function costPer100km(
  v: Vehicle,
  pricePerKwh: number,
  efficiencyPct: number = ASSUMPTIONS.chargingEfficiency,
): number {
  return gridConsumption100(v, efficiencyPct) * pricePerKwh;
}

/** Coût d'une recharge de `fromPct` à `toPct` (énergie réseau × prix). */
export function chargeCost(
  v: Vehicle,
  pricePerKwh: number,
  fromPct = 10,
  toPct = 80,
  efficiencyPct: number = ASSUMPTIONS.chargingEfficiency,
): { energyStored: number; gridEnergy: number; cost: number; rangeAdded: number } {
  const energyStored = (v.batteryUsable * Math.max(0, toPct - fromPct)) / 100;
  const gridEnergy = energyStored / (Math.max(1, efficiencyPct) / 100);
  const rangeAdded = (energyStored / batteryConsumption100(v)) * 100;
  return { energyStored, gridEnergy, cost: gridEnergy * pricePerKwh, rangeAdded };
}

/** Temps théorique (min) d'une recharge AC de 10 à 80 % à la puissance donnée, plafonnée au chargeur du véhicule. */
export function acChargeMinutes(
  v: Vehicle,
  stationKw: number,
  fromPct = 10,
  toPct = 80,
  efficiencyPct: number = ASSUMPTIONS.chargingEfficiency,
): { minutes: number; effectiveKw: number } {
  const effectiveKw = Math.min(stationKw, v.chargingAC);
  const energy = (v.batteryUsable * Math.max(0, toPct - fromPct)) / 100;
  const minutes = (energy / (effectiveKw * (efficiencyPct / 100))) * 60;
  return { minutes, effectiveKw };
}

export interface RangeScenario {
  id: string;
  label: string;
  speed: number;
  temperature: number;
  drivingType: DrivingType;
}

export const RANGE_SCENARIOS: RangeScenario[] = [
  { id: "ville", label: "Ville, 20 °C", speed: 50, temperature: 20, drivingType: "ville" },
  { id: "mixte", label: "Mixte, 15 °C", speed: 90, temperature: 15, drivingType: "mixte" },
  { id: "autoroute", label: "Autoroute 130 km/h, 20 °C", speed: 130, temperature: 20, drivingType: "autoroute" },
  { id: "hiver", label: "Mixte hivernal, 0 °C", speed: 90, temperature: 0, drivingType: "mixte" },
  { id: "hiver-autoroute", label: "Autoroute hivernale, 0 °C", speed: 130, temperature: 0, drivingType: "autoroute" },
];

/** Estimation EVExpert de l'autonomie selon un scénario (modèle multiplicatif documenté sur /methodologie). */
export function estimateRange(v: Vehicle, s: RangeScenario): number {
  return computeRange({
    usableCapacity: v.batteryUsable,
    baseConsumption: batteryConsumption100(v),
    speed: s.speed,
    temperature: s.temperature,
    drivingType: s.drivingType,
    reserve: 0,
  }).estimatedRange;
}

/** Puissance moyenne (kW) sur la fenêtre 10-80 % en DC, déduite du temps publié. */
export function averageDcPower(v: Vehicle): number | null {
  if (!v.chargingTime10to80) return null;
  const energy = v.batteryUsable * 0.7;
  return energy / (v.chargingTime10to80 / 60);
}
