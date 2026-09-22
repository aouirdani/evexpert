"use client";

import { useMemo, useState } from "react";
import { computeTripPlan } from "@/lib/calculators";
import { ASSUMPTIONS } from "@/data/assumptions";
import { formatEuro, formatNumber, minutesToHuman } from "@/lib/format";
import { CalcLayout, Field, NumberInput, RangeInputControl, ResultCard, VehiclePresetSelect, type VehiclePreset } from "./kit";

/**
 * « Cette voiture passe-t-elle mon trajet, et avec combien d'arrêts ? » (persona long trajet).
 * Simulation théorique explicite (voir l'avertissement) : elle réutilise le même modèle
 * d'autonomie réelle que le calculateur d'autonomie (`computeTripPlan` → `computeRange`), pas une
 * nouvelle courbe inventée. La puissance DC « moyenne » se déduit du 10-80 % réel du véhicule
 * choisi quand il est connu, sinon d'une hypothèse conservatrice modifiable.
 */
export function TripPlanner({ presets = [] }: { presets?: VehiclePreset[] }) {
  const [distanceKm, setDistanceKm] = useState(500);
  const [avgSpeed, setAvgSpeed] = useState(120);
  const [temperature, setTemperature] = useState(10);
  const [marginPct, setMarginPct] = useState(10);
  const [capacity, setCapacity] = useState(60);
  const [consumption, setConsumption] = useState(16);
  const [dcAveragePowerKw, setDcAveragePowerKw] = useState(90);
  const [dcPrice, setDcPrice] = useState<number>(ASSUMPTIONS.fastDcPrice);

  const r = useMemo(
    () =>
      computeTripPlan({
        distanceKm,
        avgSpeed,
        temperature,
        marginPct,
        usableCapacityKwh: capacity,
        baseConsumptionKwh100: consumption,
        dcAveragePowerKw,
        dcPricePerKwh: dcPrice,
      }),
    [distanceKm, avgSpeed, temperature, marginPct, capacity, consumption, dcAveragePowerKw, dcPrice],
  );

  return (
    <>
      <div className="mb-4 rounded-xl border border-warn/30 bg-warn-bg p-4 text-sm text-warn">
        <strong>Simulation</strong>, pas une navigation : distance, vitesse et température sont les vôtres, pas celles d&apos;un itinéraire réel. Vérifiez les bornes
        disponibles avec une carte à jour avant de partir.
      </div>
      <CalcLayout
        inputs={
          <>
            <VehiclePresetSelect
              id="tp-preset"
              presets={presets}
              onPick={(p) => {
                setCapacity(p.usable);
                setConsumption(Math.round(p.batteryConsumption * 10) / 10);
                // Puissance DC « moyenne » ≈ 55 % du pic déclaré : approximation documentée dans les limites de l'outil,
                // en l'absence d'une courbe de charge publiée pour ce modèle.
                if (p.dcKw) setDcAveragePowerKw(Math.round(p.dcKw * 0.55));
              }}
              hint="Renseigne la batterie, la consommation de référence et une puissance DC moyenne approchée."
            />
            <Field label="Distance du trajet" htmlFor="tp-distance">
              <NumberInput id="tp-distance" value={distanceKm} onChange={setDistanceKm} min={10} max={3000} step={10} suffix="km" />
            </Field>
            <Field label="Vitesse moyenne" htmlFor="tp-speed">
              <RangeInputControl id="tp-speed" value={avgSpeed} onChange={setAvgSpeed} min={50} max={150} step={5} suffix="km/h" />
            </Field>
            <Field label="Température extérieure" htmlFor="tp-temp">
              <RangeInputControl id="tp-temp" value={temperature} onChange={setTemperature} min={-15} max={35} suffix="°C" />
            </Field>
            <Field label="Réserve de sécurité gardée à chaque arrêt" htmlFor="tp-margin">
              <RangeInputControl id="tp-margin" value={marginPct} onChange={setMarginPct} min={0} max={25} suffix="%" />
            </Field>
            <Field label="Batterie utile" htmlFor="tp-capacity">
              <NumberInput id="tp-capacity" value={capacity} onChange={setCapacity} min={10} max={200} step={0.5} suffix="kWh" />
            </Field>
            <Field label="Consommation de référence" htmlFor="tp-conso">
              <NumberInput id="tp-conso" value={consumption} onChange={setConsumption} min={8} max={35} step={0.5} suffix="kWh/100" />
            </Field>
            <Field label="Puissance DC moyenne réellement atteignable" htmlFor="tp-dc" hint="Pas le pic annoncé : voir le 10-80 % publié sur la fiche du modèle.">
              <NumberInput id="tp-dc" value={dcAveragePowerKw} onChange={setDcAveragePowerKw} min={10} max={300} step={5} suffix="kW" />
            </Field>
            <Field label="Prix de la recharge rapide" htmlFor="tp-price">
              <NumberInput id="tp-price" value={dcPrice} onChange={setDcPrice} min={0} max={1} step={0.01} suffix="€/kWh" />
            </Field>
          </>
        }
        results={
          <>
            <ResultCard
              label={r.stops === 0 ? "Aucun arrêt nécessaire" : `${r.stops} arrêt${r.stops > 1 ? "s" : ""} de recharge`}
              value={r.stops === 0 ? `≈ ${formatNumber(r.legRangeKm)} km d'autonomie réelle` : minutesToHuman(r.totalChargingMinutes)}
              emphasis
              hint={`Autonomie réelle estimée (${r.drivingType}, réserve ${marginPct} %) : ≈ ${formatNumber(r.legRangeKm)} km par trajet`}
            />
            <div className="grid grid-cols-2 gap-4">
              <ResultCard label="Énergie rechargée en route" value={`${formatNumber(r.totalEnergyKwh, 1)} kWh`} />
              <ResultCard label="Coût de recharge en route" value={formatEuro(r.totalCost, 2)} />
            </div>
            <p className="text-xs text-ink-muted">
              Chaque arrêt est simulé comme une recharge complète d&apos;un trajet (après réserve de sécurité), à la puissance DC moyenne indiquée. Le temps de conduite
              lui-même n&apos;est pas compté.
            </p>
          </>
        }
      />
    </>
  );
}
