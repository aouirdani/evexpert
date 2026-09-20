import type { Vehicle } from "@/types";

/**
 * IMPORTANT — POLITIQUE DE DONNÉES
 * ---------------------------------
 * Toutes les fiches ci-dessous sont des DONNÉES D'EXEMPLE (isDemo: true).
 * Elles servent uniquement à démontrer l'architecture du site.
 * Elles ne doivent PAS être présentées comme des spécifications officielles.
 * Chaque fiche possède un champ `source`, `sourceUrl` et `lastUpdated`
 * afin de pouvoir être remplacée par des données sourcées et vérifiées.
 */

const DEMO_SOURCE = "Données d'exemple EVExpert";
const DEMO_URL = "/sources";
const UPDATED = "2026-01-15";

function base(v: Omit<Vehicle, "isDemo" | "source" | "sourceUrl" | "lastUpdated">): Vehicle {
  return {
    ...v,
    isDemo: true,
    source: DEMO_SOURCE,
    sourceUrl: DEMO_URL,
    lastUpdated: UPDATED,
  };
}

export const vehicles: Vehicle[] = [
  base({
    id: "tesla-model-3-propulsion",
    brand: "Tesla",
    brandSlug: "tesla",
    model: "Model 3",
    modelSlug: "model-3",
    version: "Propulsion",
    versionSlug: "propulsion",
    year: 2025,
    bodyType: "berline",
    price: 41990,
    batteryCapacity: 62,
    usableBatteryCapacity: 57.5,
    rangeWltp: 513,
    consumptionWltp: 13.2,
    realWorldRange: 400,
    chargingAC: 11,
    chargingDC: 170,
    dcPeakPower: 175,
    chargingTime10to80: 27,
    acceleration: 6.1,
    power: 283,
    torque: 420,
    weight: 1765,
    trunkVolume: 594,
    seats: 5,
    dimensions: { length: 4720, width: 1849, height: 1441 },
    warranty: "4 ans / 80 000 km",
    batteryWarranty: "8 ans / 160 000 km",
    summary:
      "Berline électrique polyvalente, appréciée pour son efficience et son réseau de recharge dédié.",
  }),
  base({
    id: "tesla-model-y-grande-autonomie",
    brand: "Tesla",
    brandSlug: "tesla",
    model: "Model Y",
    modelSlug: "model-y",
    version: "Grande Autonomie",
    versionSlug: "grande-autonomie",
    year: 2025,
    bodyType: "SUV",
    price: 49990,
    batteryCapacity: 78,
    usableBatteryCapacity: 75,
    rangeWltp: 565,
    consumptionWltp: 15.2,
    realWorldRange: 440,
    chargingAC: 11,
    chargingDC: 250,
    dcPeakPower: 250,
    chargingTime10to80: 27,
    acceleration: 5.0,
    power: 378,
    torque: 500,
    weight: 1997,
    trunkVolume: 854,
    seats: 5,
    dimensions: { length: 4751, width: 1921, height: 1624 },
    warranty: "4 ans / 80 000 km",
    batteryWarranty: "8 ans / 192 000 km",
    summary:
      "SUV familial électrique avec un grand volume de chargement et une recharge rapide performante.",
  }),
  base({
    id: "renault-5-e-tech-comfort",
    brand: "Renault",
    brandSlug: "renault",
    model: "5 E-Tech",
    modelSlug: "5-e-tech",
    version: "Comfort Range",
    versionSlug: "comfort-range",
    year: 2025,
    bodyType: "citadine",
    price: 33490,
    batteryCapacity: 52,
    usableBatteryCapacity: 52,
    rangeWltp: 410,
    consumptionWltp: 14.0,
    realWorldRange: 320,
    chargingAC: 11,
    chargingDC: 100,
    dcPeakPower: 100,
    chargingTime10to80: 30,
    acceleration: 8.0,
    power: 150,
    torque: 245,
    weight: 1450,
    trunkVolume: 326,
    seats: 5,
    dimensions: { length: 3922, width: 1774, height: 1498 },
    warranty: "5 ans / 100 000 km",
    batteryWarranty: "8 ans / 160 000 km",
    summary:
      "Citadine électrique au style rétro-moderne, pensée pour un usage urbain et périurbain.",
  }),
  base({
    id: "peugeot-e-208-gt",
    brand: "Peugeot",
    brandSlug: "peugeot",
    model: "e-208",
    modelSlug: "e-208",
    version: "GT",
    versionSlug: "gt",
    year: 2025,
    bodyType: "citadine",
    price: 35400,
    batteryCapacity: 51,
    usableBatteryCapacity: 48.1,
    rangeWltp: 410,
    consumptionWltp: 13.0,
    realWorldRange: 310,
    chargingAC: 11,
    chargingDC: 100,
    dcPeakPower: 100,
    chargingTime10to80: 30,
    acceleration: 8.2,
    power: 156,
    torque: 260,
    weight: 1455,
    trunkVolume: 311,
    seats: 5,
    dimensions: { length: 4055, width: 1745, height: 1430 },
    warranty: "2 ans illimité",
    batteryWarranty: "8 ans / 160 000 km",
    summary:
      "Citadine électrique élégante offrant un bon compromis entre autonomie et agrément urbain.",
  }),
  base({
    id: "volkswagen-id3-pro",
    brand: "Volkswagen",
    brandSlug: "volkswagen",
    model: "ID.3",
    modelSlug: "id-3",
    version: "Pro",
    versionSlug: "pro",
    year: 2025,
    bodyType: "berline",
    price: 39990,
    batteryCapacity: 59,
    usableBatteryCapacity: 58,
    rangeWltp: 435,
    consumptionWltp: 15.0,
    realWorldRange: 350,
    chargingAC: 11,
    chargingDC: 120,
    dcPeakPower: 120,
    chargingTime10to80: 30,
    acceleration: 7.4,
    power: 204,
    torque: 310,
    weight: 1812,
    trunkVolume: 385,
    seats: 5,
    dimensions: { length: 4264, width: 1809, height: 1568 },
    warranty: "2 ans illimité",
    batteryWarranty: "8 ans / 160 000 km",
    summary:
      "Compacte électrique polyvalente misant sur l'habitabilité et la simplicité d'usage.",
  }),
  base({
    id: "hyundai-kona-electric-64",
    brand: "Hyundai",
    brandSlug: "hyundai",
    model: "Kona Electric",
    modelSlug: "kona-electric",
    version: "64 kWh",
    versionSlug: "64-kwh",
    year: 2025,
    bodyType: "SUV",
    price: 42500,
    batteryCapacity: 65.4,
    usableBatteryCapacity: 64,
    rangeWltp: 514,
    consumptionWltp: 14.7,
    realWorldRange: 400,
    chargingAC: 11,
    chargingDC: 100,
    dcPeakPower: 102,
    chargingTime10to80: 41,
    acceleration: 8.8,
    power: 218,
    torque: 255,
    weight: 1690,
    trunkVolume: 466,
    seats: 5,
    dimensions: { length: 4355, width: 1825, height: 1580 },
    warranty: "5 ans illimité",
    batteryWarranty: "8 ans / 160 000 km",
    summary:
      "SUV urbain électrique reconnu pour son autonomie confortable et sa garantie étendue.",
  }),
  base({
    id: "kia-ev6-grande-autonomie",
    brand: "Kia",
    brandSlug: "kia",
    model: "EV6",
    modelSlug: "ev6",
    version: "Grande Autonomie",
    versionSlug: "grande-autonomie",
    year: 2025,
    bodyType: "SUV",
    price: 49990,
    batteryCapacity: 84,
    usableBatteryCapacity: 81.4,
    rangeWltp: 582,
    consumptionWltp: 15.5,
    realWorldRange: 460,
    chargingAC: 11,
    chargingDC: 258,
    dcPeakPower: 258,
    chargingTime10to80: 18,
    acceleration: 7.3,
    power: 229,
    torque: 350,
    weight: 2015,
    trunkVolume: 490,
    seats: 5,
    dimensions: { length: 4695, width: 1890, height: 1550 },
    warranty: "7 ans / 150 000 km",
    batteryWarranty: "7 ans / 150 000 km",
    summary:
      "Crossover électrique à architecture 800 V permettant une recharge rapide de référence.",
  }),
  base({
    id: "bmw-i4-edrive40",
    brand: "BMW",
    brandSlug: "bmw",
    model: "i4",
    modelSlug: "i4",
    version: "eDrive40",
    versionSlug: "edrive40",
    year: 2025,
    bodyType: "berline",
    price: 59900,
    batteryCapacity: 83.9,
    usableBatteryCapacity: 80.7,
    rangeWltp: 590,
    consumptionWltp: 15.0,
    realWorldRange: 470,
    chargingAC: 11,
    chargingDC: 205,
    dcPeakPower: 205,
    chargingTime10to80: 31,
    acceleration: 5.7,
    power: 340,
    torque: 430,
    weight: 2050,
    trunkVolume: 470,
    seats: 5,
    dimensions: { length: 4783, width: 1852, height: 1448 },
    warranty: "2 ans illimité",
    batteryWarranty: "8 ans / 160 000 km",
    summary:
      "Berline premium dynamique combinant confort routier et grande autonomie.",
  }),
  base({
    id: "dacia-spring-extreme",
    brand: "Dacia",
    brandSlug: "dacia",
    model: "Spring",
    modelSlug: "spring",
    version: "Extreme",
    versionSlug: "extreme",
    year: 2025,
    bodyType: "citadine",
    price: 20800,
    batteryCapacity: 26.8,
    usableBatteryCapacity: 25,
    rangeWltp: 225,
    consumptionWltp: 13.2,
    realWorldRange: 170,
    chargingAC: 7,
    chargingDC: 30,
    dcPeakPower: 30,
    chargingTime10to80: 45,
    acceleration: 13.7,
    power: 65,
    torque: 113,
    weight: 984,
    trunkVolume: 308,
    seats: 4,
    dimensions: { length: 3701, width: 1583, height: 1519 },
    warranty: "3 ans / 100 000 km",
    batteryWarranty: "8 ans / 120 000 km",
    summary:
      "Micro-citadine électrique parmi les plus abordables, idéale pour les trajets urbains courts.",
  }),
  base({
    id: "mg4-comfort",
    brand: "MG",
    brandSlug: "mg",
    model: "MG4",
    modelSlug: "mg4",
    version: "Comfort",
    versionSlug: "comfort",
    year: 2025,
    bodyType: "berline",
    price: 29990,
    batteryCapacity: 64,
    usableBatteryCapacity: 61.7,
    rangeWltp: 435,
    consumptionWltp: 16.0,
    realWorldRange: 340,
    chargingAC: 11,
    chargingDC: 140,
    dcPeakPower: 140,
    chargingTime10to80: 26,
    acceleration: 7.9,
    power: 204,
    torque: 250,
    weight: 1685,
    trunkVolume: 363,
    seats: 5,
    dimensions: { length: 4287, width: 1836, height: 1504 },
    warranty: "7 ans / 150 000 km",
    batteryWarranty: "7 ans / 150 000 km",
    summary:
      "Compacte électrique au rapport prix/prestations agressif et à la garantie longue.",
  }),
];

/* --------------------------- Helper selectors --------------------------- */

export function getAllVehicles(): Vehicle[] {
  return vehicles;
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getVehiclesByBrand(brandSlug: string): Vehicle[] {
  return vehicles.filter((v) => v.brandSlug === brandSlug);
}

export function getVehicle(
  brandSlug: string,
  modelSlug: string,
  versionSlug?: string,
): Vehicle | undefined {
  return vehicles.find(
    (v) =>
      v.brandSlug === brandSlug &&
      v.modelSlug === modelSlug &&
      (versionSlug ? v.versionSlug === versionSlug : true),
  );
}

export function getBrands(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const v of vehicles) {
    const existing = map.get(v.brandSlug);
    if (existing) existing.count += 1;
    else map.set(v.brandSlug, { name: v.brand, count: 1 });
  }
  return Array.from(map.entries()).map(([slug, val]) => ({ slug, ...val }));
}

export function getSimilarVehicles(vehicle: Vehicle, limit = 3): Vehicle[] {
  return vehicles
    .filter((v) => v.id !== vehicle.id)
    .map((v) => ({
      v,
      score:
        Math.abs(v.price - vehicle.price) / 1000 +
        Math.abs(v.rangeWltp - vehicle.rangeWltp) / 50,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.v);
}

export function vehicleTitle(v: Vehicle): string {
  return `${v.brand} ${v.model} ${v.version}`;
}

export function vehicleSlug(v: Vehicle): string {
  return `${v.brandSlug}-${v.modelSlug}`;
}
