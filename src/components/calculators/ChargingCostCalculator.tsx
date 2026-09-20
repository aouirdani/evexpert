"use client";

import { useMemo, useState } from "react";
import { computeChargingCost } from "@/lib/calculators";
import { formatEuro, formatNumber } from "@/lib/utils";
import { CalcLayout, Field, NumberInput, RangeInputControl, ResultCard } from "./kit";

export function ChargingCostCalculator() {
  const [batteryCapacity, setBattery] = useState(60);
  const [currentSoc, setCurrent] = useState(20);
  const [targetSoc, setTarget] = useState(80);
  const [price, setPrice] = useState(0.25);
  const [efficiency, setEfficiency] = useState(90);
  const [consumption, setConsumption] = useState(16);

  const r = useMemo(
    () =>
      computeChargingCost({
        batteryCapacity,
        currentSoc,
        targetSoc,
        electricityPrice: price,
        efficiency,
        consumption,
      }),
    [batteryCapacity, currentSoc, targetSoc, price, efficiency, consumption],
  );

  return (
    <CalcLayout
      inputs={
        <>
          <Field label="Capacité utile de la batterie (kWh)" htmlFor="cc-battery">
            <NumberInput id="cc-battery" value={batteryCapacity} onChange={setBattery} min={5} max={200} step={0.5} suffix="kWh" />
          </Field>
          <Field label="État de charge actuel" htmlFor="cc-current">
            <RangeInputControl id="cc-current" value={currentSoc} onChange={setCurrent} min={0} max={100} suffix="%" />
          </Field>
          <Field label="État de charge souhaité" htmlFor="cc-target">
            <RangeInputControl id="cc-target" value={targetSoc} onChange={setTarget} min={0} max={100} suffix="%" />
          </Field>
          <Field label="Prix du kWh (€)" htmlFor="cc-price" hint="Ex. tarif domicile ~0,25 €, borne rapide ~0,45-0,70 €.">
            <NumberInput id="cc-price" value={price} onChange={setPrice} min={0} max={2} step={0.01} suffix="€/kWh" />
          </Field>
          <Field label="Rendement de recharge" htmlFor="cc-eff" hint="Pertes en chaleur : généralement 85-95 %.">
            <RangeInputControl id="cc-eff" value={efficiency} onChange={setEfficiency} min={70} max={100} suffix="%" />
          </Field>
          <Field label="Consommation moyenne (kWh/100 km)" htmlFor="cc-conso" hint="Sert à estimer les km ajoutés.">
            <NumberInput id="cc-conso" value={consumption} onChange={setConsumption} min={8} max={35} step={0.5} suffix="kWh" />
          </Field>
        </>
      }
      results={
        <>
          <ResultCard
            label="Coût total de la recharge"
            value={formatEuro(r.cost, 2)}
            emphasis
            hint={`≈ ${formatEuro(r.costPer100km, 2)} / 100 km · +${formatNumber(r.rangeAdded)} km`}
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Énergie stockée" value={`${formatNumber(r.energyStored, 1)} kWh`} />
            <ResultCard label="Énergie au compteur" value={`${formatNumber(r.gridEnergy, 1)} kWh`} />
            <ResultCard label="Coût aux 100 km" value={formatEuro(r.costPer100km, 2)} />
            <ResultCard label="Autonomie ajoutée" value={`≈ ${formatNumber(r.rangeAdded)} km`} />
          </div>
          <p className="text-xs text-slate-500">
            Calcul transparent&nbsp;: énergie stockée = capacité × (cible − actuel) / 100 ;
            énergie au compteur = énergie stockée / rendement ; coût = énergie au compteur × prix du kWh.
          </p>
        </>
      }
    />
  );
}
