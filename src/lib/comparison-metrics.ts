import { ASSUMPTIONS } from "@/data/assumptions";
import { costPer100km } from "@/lib/vehicle-calcs";
import { fmt, fmtText } from "@/lib/vehicle-format";
import { formatEuro, formatNumber } from "@/lib/format";
import type { DataType, Vehicle } from "@/types";

/* ------------------------------ Métriques -------------------------------- */

export interface Metric {
  key: string;
  label: string;
  group: string;
  type: DataType;
  /** Valeur numérique comparable ; null si non disponible. */
  value: (v: Vehicle) => number | null;
  format: (v: Vehicle) => string;
  /** Sens de la mise en évidence : plus haut / plus bas ; absent = aucune mise en évidence. */
  best?: "max" | "min";
  /** Libellé de la différence objective, ex. « Autonomie WLTP la plus élevée ». */
  highlight?: string;
}

const home = ASSUMPTIONS.homePrice;

export const METRICS: Metric[] = [
  { key: "price", label: "Prix en France", group: "Prix", type: "official", value: (v) => v.price, format: (v) => (v.price === null ? "Non disponible" : formatEuro(v.price)) },
  { key: "gross", label: "Batterie brute", group: "Batterie", type: "specialized", value: (v) => v.batteryGross, format: (v) => fmt(v.batteryGross, "kWh", 1) },
  { key: "usable", label: "Batterie utile", group: "Batterie", type: "specialized", value: (v) => v.batteryUsable, format: (v) => fmt(v.batteryUsable, "kWh", 1), best: "max", highlight: "Batterie utile la plus grande" },
  { key: "chem", label: "Technologie", group: "Batterie", type: "specialized", value: () => null, format: (v) => fmtText(v.chemistry) },
  { key: "range", label: "Autonomie WLTP", group: "Autonomie", type: "specialized", value: (v) => v.rangeWltp, format: (v) => fmt(v.rangeWltp, "km"), best: "max", highlight: "Autonomie WLTP la plus élevée" },
  { key: "cons", label: "Consommation calculée (batterie)", group: "Consommation", type: "calculated", value: (v) => (v.batteryUsable / v.rangeWltp) * 100, format: (v) => fmt((v.batteryUsable / v.rangeWltp) * 100, "kWh/100 km", 1), best: "min", highlight: "Consommation calculée la plus faible" },
  { key: "consw", label: "Consommation WLTP (source)", group: "Consommation", type: "specialized", value: (v) => v.consumptionWltp, format: (v) => fmt(v.consumptionWltp, "kWh/100 km", 1) },
  { key: "ac", label: "Puissance AC maximale", group: "Recharge", type: "specialized", value: (v) => v.chargingAC, format: (v) => fmt(v.chargingAC, "kW", 1), best: "max", highlight: "Puissance AC maximale la plus élevée" },
  { key: "dc", label: "Puissance DC maximale", group: "Recharge", type: "specialized", value: (v) => v.chargingDC, format: (v) => fmt(v.chargingDC, "kW"), best: "max", highlight: "Puissance DC maximale la plus élevée" },
  { key: "t1080", label: "Charge DC 10-80 %", group: "Recharge", type: "specialized", value: (v) => v.chargingTime10to80, format: (v) => fmt(v.chargingTime10to80, "min"), best: "min", highlight: "Temps de charge 10-80 % le plus court" },
  { key: "power", label: "Puissance", group: "Performances", type: "specialized", value: (v) => v.powerKw, format: (v) => `${fmt(v.powerKw, "kW")} (${fmt(v.powerPs, "ch")})`, best: "max", highlight: "Puissance la plus élevée" },
  { key: "torque", label: "Couple", group: "Performances", type: "specialized", value: (v) => v.torque, format: (v) => fmt(v.torque, "Nm") },
  { key: "acc", label: "0 à 100 km/h", group: "Performances", type: "specialized", value: (v) => v.acceleration0to100, format: (v) => fmt(v.acceleration0to100, "s", 1), best: "min", highlight: "Temps 0 à 100 km/h le plus court" },
  { key: "top", label: "Vitesse maximale", group: "Performances", type: "specialized", value: (v) => v.topSpeed, format: (v) => fmt(v.topSpeed, "km/h") },
  { key: "dim", label: "Longueur × largeur × hauteur", group: "Dimensions", type: "specialized", value: () => null, format: (v) => `${formatNumber(v.dimensions.length)} × ${formatNumber(v.dimensions.width)} × ${formatNumber(v.dimensions.height)} mm` },
  { key: "weight", label: "Poids à vide", group: "Dimensions", type: "specialized", value: (v) => v.weight, format: (v) => fmt(v.weight, "kg"), best: "min", highlight: "Poids à vide le plus faible" },
  { key: "boot", label: "Coffre", group: "Coffre", type: "specialized", value: (v) => v.trunkVolume, format: (v) => fmt(v.trunkVolume, "L"), best: "max", highlight: "Plus grand coffre" },
  { key: "bootmax", label: "Coffre, banquette rabattue", group: "Coffre", type: "specialized", value: (v) => v.trunkVolumeMax, format: (v) => fmt(v.trunkVolumeMax, "L") },
  { key: "seats", label: "Places", group: "Coffre", type: "specialized", value: (v) => v.seats, format: (v) => String(v.seats) },
  { key: "wv", label: "Garantie véhicule", group: "Garanties", type: "official", value: () => null, format: (v) => fmtText(v.warranty) },
  { key: "wb", label: "Garantie batterie", group: "Garanties", type: "specialized", value: () => null, format: (v) => fmtText(v.batteryWarranty) },
  { key: "cost", label: `Coût aux 100 km (${formatNumber(home, 2)} €/kWh)`, group: "Coût d'utilisation", type: "calculated", value: (v) => costPer100km(v, home), format: (v) => formatEuro(costPer100km(v, home), 2), best: "min", highlight: "Coût estimé aux 100 km le plus faible" },
];

export const METRIC_GROUPS = Array.from(new Set(METRICS.map((m) => m.group)));

export interface Difference {
  label: string;
  vehicle: Vehicle;
  display: string;
}

/**
 * Différences objectives : pour chaque métrique mesurable, le véhicule qui a la
 * meilleure valeur, uniquement si elle est strictement meilleure que les autres
 * et calculée à partir des données affichées. Aucun classement global.
 */
export function objectiveDifferences(vehicles: Vehicle[]): Difference[] {
  const out: Difference[] = [];
  for (const m of METRICS) {
    if (!m.best || !m.highlight) continue;
    const vals = vehicles.map((v) => ({ v, n: m.value(v) })).filter((x): x is { v: Vehicle; n: number } => x.n !== null);
    if (vals.length < 2) continue;
    const target = m.best === "max" ? Math.max(...vals.map((x) => x.n)) : Math.min(...vals.map((x) => x.n));
    const winners = vals.filter((x) => x.n === target);
    if (winners.length !== 1) continue;
    out.push({ label: m.highlight, vehicle: winners[0].v, display: m.format(winners[0].v) });
  }
  return out;
}
