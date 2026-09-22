// Pure calculation functions for all EVExpert tools.
// Every formula is transparent and unit-tested by construction.

/* -------------------------------------------------------------------------- */
/*  1. Charging cost                                                          */
/* -------------------------------------------------------------------------- */

export interface ChargingCostInput {
  batteryCapacity: number; // kWh (usable)
  currentSoc: number; // %
  targetSoc: number; // %
  electricityPrice: number; // €/kWh
  efficiency: number; // % (charging efficiency)
  consumption: number; // kWh/100km for range-added estimate
}

export interface ChargingCostResult {
  energyStored: number; // kWh added to battery
  gridEnergy: number; // kWh drawn from the grid
  cost: number; // €
  costPer100km: number; // €
  rangeAdded: number; // km
}

export function computeChargingCost(input: ChargingCostInput): ChargingCostResult {
  const socDelta = Math.max(0, input.targetSoc - input.currentSoc);
  const energyStored = (input.batteryCapacity * socDelta) / 100;
  const eff = Math.max(1, input.efficiency) / 100;
  const gridEnergy = energyStored / eff;
  const cost = gridEnergy * input.electricityPrice;
  const rangeAdded =
    input.consumption > 0 ? (energyStored / input.consumption) * 100 : 0;
  const costPer100km =
    rangeAdded > 0 ? (cost / rangeAdded) * 100 : 0;
  return { energyStored, gridEnergy, cost, costPer100km, rangeAdded };
}

/* -------------------------------------------------------------------------- */
/*  2. Real-world range (estimate)                                            */
/* -------------------------------------------------------------------------- */

export type DrivingType = "ville" | "mixte" | "autoroute";

export interface RangeInput {
  usableCapacity: number; // kWh
  baseConsumption: number; // kWh/100km (WLTP-like reference)
  speed: number; // km/h average
  temperature: number; // °C
  drivingType: DrivingType;
  reserve: number; // % battery kept as buffer
}

export interface RangeResult {
  estimatedRange: number; // km
  usableEnergy: number; // kWh actually available
  adjustedConsumption: number; // kWh/100km
}

// Temperature factor: consumption increases in cold/heat.
export function temperatureFactor(temp: number): number {
  if (temp >= 20) return 1;
  if (temp >= 10) return 1.08;
  if (temp >= 0) return 1.2;
  if (temp >= -10) return 1.4;
  return 1.55;
}

export function drivingFactor(type: DrivingType): number {
  switch (type) {
    case "ville":
      return 0.85;
    case "autoroute":
      return 1.3;
    default:
      return 1;
  }
}

// Aerodynamic penalty above ~110 km/h.
export function speedFactor(speed: number): number {
  if (speed <= 90) return 1;
  const over = speed - 90;
  return 1 + over * 0.006;
}

export function computeRange(input: RangeInput): RangeResult {
  const factor =
    temperatureFactor(input.temperature) *
    drivingFactor(input.drivingType) *
    speedFactor(input.speed);
  const adjustedConsumption = input.baseConsumption * factor;
  const reserve = Math.min(Math.max(input.reserve, 0), 50) / 100;
  const usableEnergy = input.usableCapacity * (1 - reserve);
  const estimatedRange =
    adjustedConsumption > 0 ? (usableEnergy / adjustedConsumption) * 100 : 0;
  return { estimatedRange, usableEnergy, adjustedConsumption };
}

/* -------------------------------------------------------------------------- */
/*  3. Cost per 100 km (EV vs petrol/diesel/hybrid)                           */
/* -------------------------------------------------------------------------- */

export type EnergyKind = "ev" | "essence" | "diesel" | "hybride";

export interface Per100Input {
  consumption: number; // kWh/100 or L/100
  price: number; // €/kWh or €/L
}

export function costPer100km(input: Per100Input): number {
  return input.consumption * input.price;
}

export function annualCost(costPer100: number, annualKm: number): number {
  return (costPer100 * annualKm) / 100;
}

/* -------------------------------------------------------------------------- */
/*  4. EV vs Petrol running cost                                              */
/* -------------------------------------------------------------------------- */

export interface RunningCostInput {
  price: number; // vehicle price
  annualKm: number;
  consumption: number; // energy units /100km
  energyPrice: number; // € per unit
  insurance: number; // €/year
  maintenance: number; // €/year
  depreciationRate: number; // %/year of price
}

export interface RunningCostResult {
  annualEnergy: number;
  annualDepreciation: number;
  annualTotal: number;
  monthly: number;
  perKm: number;
  costOverYears: (years: number) => number;
}

export function computeRunningCost(input: RunningCostInput): RunningCostResult {
  const annualEnergy = (input.consumption * input.energyPrice * input.annualKm) / 100;
  const annualDepreciation = (input.price * input.depreciationRate) / 100;
  const annualTotal =
    annualEnergy + input.insurance + input.maintenance + annualDepreciation;
  const monthly = annualTotal / 12;
  const perKm = input.annualKm > 0 ? annualTotal / input.annualKm : 0;
  const costOverYears = (years: number) => annualTotal * years;
  return { annualEnergy, annualDepreciation, annualTotal, monthly, perKm, costOverYears };
}

/* -------------------------------------------------------------------------- */
/*  5. Total Cost of Ownership                                               */
/* -------------------------------------------------------------------------- */

export interface TcoInput {
  price: number;
  bonus: number; // aides déduites
  resaleValue: number; // valeur de revente estimée
  years: number;
  annualKm: number;
  consumption: number; // kWh/100 (EV) or L/100
  energyPrice: number;
  publicChargingShare: number; // % de recharge publique (pour EV)
  publicChargingPrice: number; // €/kWh
  insurance: number; // €/year
  maintenance: number; // €/year
  tires: number; // €/year
  taxes: number; // €/year
}

export interface TcoResult {
  depreciation: number;
  energy: number;
  insurance: number;
  maintenance: number;
  tires: number;
  taxes: number;
  total: number;
  perYear: number;
  perMonth: number;
  perKm: number;
  breakdown: { label: string; value: number }[];
}

export function computeTco(input: TcoInput): TcoResult {
  const depreciation = input.price - input.bonus - input.resaleValue;
  const totalKm = input.annualKm * input.years;
  const totalEnergyUnits = (input.consumption * totalKm) / 100;
  const homeShare = 1 - Math.min(Math.max(input.publicChargingShare, 0), 100) / 100;
  const energy =
    totalEnergyUnits * homeShare * input.energyPrice +
    totalEnergyUnits * (1 - homeShare) * input.publicChargingPrice;
  const insurance = input.insurance * input.years;
  const maintenance = input.maintenance * input.years;
  const tires = input.tires * input.years;
  const taxes = input.taxes * input.years;
  const total = depreciation + energy + insurance + maintenance + tires + taxes;
  const perYear = input.years > 0 ? total / input.years : 0;
  const perMonth = perYear / 12;
  const perKm = totalKm > 0 ? total / totalKm : 0;
  const breakdown = [
    { label: "Dépréciation", value: depreciation },
    { label: "Énergie", value: energy },
    { label: "Assurance", value: insurance },
    { label: "Entretien", value: maintenance },
    { label: "Pneus", value: tires },
    { label: "Taxes", value: taxes },
  ];
  return {
    depreciation,
    energy,
    insurance,
    maintenance,
    tires,
    taxes,
    total,
    perYear,
    perMonth,
    perKm,
    breakdown,
  };
}

/* -------------------------------------------------------------------------- */
/*  6. Charging time (theoretical)                                           */
/* -------------------------------------------------------------------------- */

export interface ChargingTimeInput {
  batteryCapacity: number; // kWh usable
  currentSoc: number; // %
  targetSoc: number; // %
  power: number; // kW
  efficiency: number; // %
}

export interface ChargingTimeResult {
  energyToAdd: number; // kWh
  minutes: number;
}

export function computeChargingTime(input: ChargingTimeInput): ChargingTimeResult {
  const socDelta = Math.max(0, input.targetSoc - input.currentSoc);
  const energyToAdd = (input.batteryCapacity * socDelta) / 100;
  const eff = Math.max(1, input.efficiency) / 100;
  const effectivePower = input.power * eff;
  const minutes = effectivePower > 0 ? (energyToAdd / effectivePower) * 60 : 0;
  return { energyToAdd, minutes };
}

/* -------------------------------------------------------------------------- */
/*  7. Coût d'usage annuel personnalisé (domicile + public)                  */
/* -------------------------------------------------------------------------- */

export interface UsageCostInput {
  /** Consommation réseau (kWh/100 km, pertes de charge comprises). */
  gridConsumption: number;
  annualKm: number;
  /** Part de la recharge faite à domicile (0-100) ; le reste est facturé au tarif public. */
  homeSharePct: number;
  homePrice: number;
  publicPrice: number;
}

export interface UsageCostResult {
  /** Prix moyen du kWh, pondéré par la part domicile/public. */
  blendedPricePerKwh: number;
  kwhPerYear: number;
  costPerYear: number;
  costPerMonth: number;
  costPer100km: number;
  costOver3Years: number;
}

export function computeUsageCost(input: UsageCostInput): UsageCostResult {
  const homeShare = Math.min(Math.max(input.homeSharePct, 0), 100) / 100;
  const blendedPricePerKwh = homeShare * input.homePrice + (1 - homeShare) * input.publicPrice;
  const kwhPerYear = (input.gridConsumption * input.annualKm) / 100;
  const costPerYear = kwhPerYear * blendedPricePerKwh;
  return {
    blendedPricePerKwh,
    kwhPerYear,
    costPerYear,
    costPerMonth: costPerYear / 12,
    costPer100km: input.gridConsumption * blendedPricePerKwh,
    costOver3Years: costPerYear * 3,
  };
}

/* -------------------------------------------------------------------------- */
/*  8. Simulateur de trajet longue distance (estimation, pas une navigation) */
/* -------------------------------------------------------------------------- */

export interface TripPlanInput {
  distanceKm: number;
  avgSpeed: number; // km/h
  temperature: number; // °C
  /** Réserve de sécurité conservée à chaque arrêt (0-30 %), transmise à `computeRange`. */
  marginPct: number;
  usableCapacityKwh: number;
  baseConsumptionKwh100: number;
  /** Puissance DC moyenne réellement atteignable (kW), pas le pic annoncé. */
  dcAveragePowerKw: number;
  dcPricePerKwh: number;
  efficiencyPct?: number;
}

export interface TripPlanResult {
  drivingType: DrivingType;
  /** Autonomie réelle estimée par trajet (après réserve), km. */
  legRangeKm: number;
  /** Énergie utile rechargée à chaque arrêt (kWh), = autonomie d'un trajet. */
  energyPerStopKwh: number;
  legs: number;
  stops: number;
  minutesPerStop: number;
  totalChargingMinutes: number;
  totalEnergyKwh: number;
  totalCost: number;
}

/**
 * Simule un trajet en estimant l'autonomie réelle (mêmes facteurs que le calculateur
 * d'autonomie), puis le nombre d'arrêts nécessaires et leur durée théorique. Chaque arrêt
 * est supposé recharger l'équivalent d'un trajet complet (approximation transparente,
 * pas une navigation avec bornes réelles).
 */
export function computeTripPlan(input: TripPlanInput): TripPlanResult {
  const efficiencyPct = input.efficiencyPct ?? 90;
  const drivingType: DrivingType = input.avgSpeed > 100 ? "autoroute" : input.avgSpeed > 70 ? "mixte" : "ville";
  const range = computeRange({
    usableCapacity: input.usableCapacityKwh,
    baseConsumption: input.baseConsumptionKwh100,
    speed: input.avgSpeed,
    temperature: input.temperature,
    drivingType,
    reserve: input.marginPct,
  });
  const legRangeKm = Math.max(1, range.estimatedRange);
  const legs = Math.max(1, Math.ceil(input.distanceKm / legRangeKm));
  const stops = legs - 1;
  const energyPerStopKwh = range.usableEnergy;
  const minutesPerStop = input.dcAveragePowerKw > 0 ? (energyPerStopKwh / (input.dcAveragePowerKw * (efficiencyPct / 100))) * 60 : 0;
  const totalEnergyKwh = stops * (energyPerStopKwh / (efficiencyPct / 100));
  return {
    drivingType,
    legRangeKm,
    energyPerStopKwh,
    legs,
    stops,
    minutesPerStop,
    totalChargingMinutes: stops * minutesPerStop,
    totalEnergyKwh,
    totalCost: totalEnergyKwh * input.dcPricePerKwh,
  };
}
