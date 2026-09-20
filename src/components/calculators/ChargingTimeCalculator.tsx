"use client";

import { useMemo, useState } from "react";
import { computeChargingTime } from "@/lib/calculators";
import { formatNumber, minutesToHuman } from "@/lib/utils";
import { CalcLayout, Field, NumberInput, RangeInputControl, ResultCard, SelectInput } from "./kit";

const powerPresets = [
  { value: "3.7", label: "3,7 kW — prise renforcée" },
  { value: "7.4", label: "7,4 kW — wallbox monophasée" },
  { value: "11", label: "11 kW — wallbox triphasée" },
  { value: "22", label: "22 kW — borne AC voirie" },
  { value: "50", label: "50 kW — recharge rapide" },
  { value: "150", label: "150 kW — recharge rapide" },
  { value: "250", label: "250 kW — ultra-rapide" },
];

export function ChargingTimeCalculator() {
  const [capacity, setCapacity] = useState(60);
  const [current, setCurrent] = useState(20);
  const [target, setTarget] = useState(80);
  const [power, setPower] = useState(11);
  const [efficiency, setEfficiency] = useState(90);

  const r = useMemo(
    () =>
      computeChargingTime({
        batteryCapacity: capacity,
        currentSoc: current,
        targetSoc: target,
        power,
        efficiency,
      }),
    [capacity, current, target, power, efficiency],
  );

  return (
    <>
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Ce temps est <strong>théorique</strong>. En recharge rapide (DC), la
        courbe de charge n&apos;est pas linéaire&nbsp;: la puissance diminue au-delà
        de 80 %, le temps réel peut donc être plus long.
      </div>
      <CalcLayout
        inputs={
          <>
            <Field label="Capacité utile (kWh)" htmlFor="t-cap">
              <NumberInput id="t-cap" value={capacity} onChange={setCapacity} min={10} max={200} step={0.5} suffix="kWh" />
            </Field>
            <Field label="État de charge actuel" htmlFor="t-current">
              <RangeInputControl id="t-current" value={current} onChange={setCurrent} min={0} max={100} suffix="%" />
            </Field>
            <Field label="État de charge souhaité" htmlFor="t-target">
              <RangeInputControl id="t-target" value={target} onChange={setTarget} min={0} max={100} suffix="%" />
            </Field>
            <Field label="Puissance de recharge" htmlFor="t-power">
              <SelectInput id="t-power" value={String(power)} onChange={(v) => setPower(Number(v))} options={powerPresets} />
            </Field>
            <Field label="Rendement de recharge" htmlFor="t-eff">
              <RangeInputControl id="t-eff" value={efficiency} onChange={setEfficiency} min={70} max={100} suffix="%" />
            </Field>
          </>
        }
        results={
          <>
            <ResultCard
              label="Temps de recharge estimé"
              value={minutesToHuman(r.minutes)}
              emphasis
              hint={`${formatNumber(r.energyToAdd, 1)} kWh à recharger`}
            />
            <div className="grid grid-cols-2 gap-4">
              <ResultCard label="Énergie à recharger" value={`${formatNumber(r.energyToAdd, 1)} kWh`} />
              <ResultCard label="Durée en minutes" value={`≈ ${formatNumber(r.minutes)} min`} />
            </div>
            <p className="text-xs text-slate-500">
              Calcul&nbsp;: énergie à recharger = capacité × (cible − actuel) / 100 ;
              temps = énergie / (puissance × rendement).
            </p>
          </>
        }
      />
    </>
  );
}
