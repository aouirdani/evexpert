import type { Vehicle } from "@/types";

/**
 * Règles de qualité des données véhicules, partagées par l'import, le script
 * `check:data` et les tests. Elles ne corrigent rien : elles signalent.
 */

export type IssueCategory =
  | "duplicate"
  | "slug"
  | "required"
  | "battery"
  | "wltp"
  | "consumption"
  | "power"
  | "charging"
  | "price"
  | "source"
  | "verification"
  | "range";

export interface Issue {
  category: IssueCategory;
  subject: string;
  message: string;
}

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}/.test(s) && !Number.isNaN(Date.parse(s));

export function validateVehicle(v: Vehicle): Issue[] {
  const out: Issue[] = [];
  const add = (category: IssueCategory, message: string) => out.push({ category, subject: v.id, message });

  for (const [k, s] of [["marque", v.brandSlug], ["modèle", v.modelSlug], ["version", v.versionSlug]] as const) {
    if (!SLUG_RE.test(s)) add("slug", `slug ${k} invalide : « ${s} »`);
  }

  if (!(v.batteryUsable > 0)) add("required", "capacité utile absente ou non positive");
  if (!(v.rangeWltp > 0)) add("required", "autonomie WLTP absente ou non positive");
  if (!(v.powerKw > 0) || !(v.powerPs > 0)) add("required", "puissance absente");
  if (!(v.chargingAC > 0)) add("required", "puissance AC absente");

  if (v.batteryGross !== null && v.batteryGross <= 0) add("battery", "batterie brute non positive");
  if (v.batteryGross !== null && v.batteryUsable > v.batteryGross) add("battery", "batterie utile supérieure à la brute");

  if (v.rangeWltp < 30 || v.rangeWltp > 1500) add("wltp", `autonomie WLTP hors plage (${v.rangeWltp} km)`);
  if (v.consumptionWltp !== null) {
    if (v.consumptionWltp < 5 || v.consumptionWltp > 60) add("consumption", `consommation WLTP hors plage (${v.consumptionWltp})`);
    else {
      const ratio = (v.consumptionWltp / 100) * v.rangeWltp / v.batteryUsable;
      if (ratio < 1.05 || ratio > 1.4) add("consumption", `consommation incohérente avec capacité × autonomie (ratio ${ratio.toFixed(2)})`);
    }
  }

  if (Math.abs(v.powerPs * 0.7355 - v.powerKw) / v.powerKw > 0.03) add("power", "kW et ch incohérents");
  if (v.acceleration0to100 !== null && (v.acceleration0to100 < 2 || v.acceleration0to100 > 20)) add("range", "0-100 km/h hors plage");
  if (v.topSpeed !== null && (v.topSpeed < 100 || v.topSpeed > 300)) add("range", "vitesse maximale hors plage");
  if (v.weight !== null && (v.weight < 500 || v.weight > 4000)) add("range", "poids hors plage");
  if (v.trunkVolume !== null && v.trunkVolumeMax !== null && v.trunkVolumeMax < v.trunkVolume) add("range", "coffre maximal inférieur au coffre");
  if (![2, 4, 5, 6, 7].includes(v.seats)) add("range", `nombre de places inattendu (${v.seats})`);

  if (v.chargingDC !== null && v.chargingDC < v.chargingAC) add("charging", "puissance DC inférieure à la puissance AC");
  if (v.chargingTime10to80 !== null && (v.chargingTime10to80 < 5 || v.chargingTime10to80 > 240)) add("charging", "temps 10-80 % hors plage");

  if (v.price !== null && (!(v.price > 0) || v.price > 5_000_000)) add("price", `prix invalide (${v.price})`);

  if (!v.source?.url?.startsWith("http") || !v.source?.name) add("source", "source absente ou URL invalide");
  if (!v.source?.lastUpdated || !isIsoDate(v.source.lastUpdated)) add("verification", "date de vérification absente ou invalide");
  return out;
}

export function validateVehicles(vehicles: Vehicle[]): Issue[] {
  const out = vehicles.flatMap(validateVehicle);
  const seen = new Map<string, number>();
  for (const v of vehicles) {
    const key = `${v.brandSlug}/${v.modelSlug}/${v.versionSlug}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
    const idKey = `id:${v.id}`;
    seen.set(idKey, (seen.get(idKey) ?? 0) + 1);
  }
  for (const [key, n] of seen) {
    if (n > 1) out.push({ category: "duplicate", subject: key, message: `${n} occurrences` });
  }
  return out;
}

export function countByCategory(issues: Issue[], ...cats: IssueCategory[]): number {
  return issues.filter((i) => cats.includes(i.category)).length;
}
