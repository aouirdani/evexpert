"use client";

import { useMemo, useState } from "react";
import { formatNumber, minutesToHuman } from "@/lib/utils";
import { CalcLayout, Field, NumberInput, RangeInputControl, ResultCard, VehiclePresetSelect, type VehiclePreset } from "./kit";

const STATIONS: { kw: number; kind: "AC" | "DC"; label: string }[] = [
  { kw: 3.7, kind: "AC", label: "Prise renforcée" },
  { kw: 7.4, kind: "AC", label: "Wallbox monophasée" },
  { kw: 11, kind: "AC", label: "Wallbox triphasée" },
  { kw: 22, kind: "AC", label: "Borne AC 22 kW" },
  { kw: 50, kind: "DC", label: "Recharge rapide" },
  { kw: 150, kind: "DC", label: "Recharge rapide" },
  { kw: 350, kind: "DC", label: "Ultra-rapide" },
];

export function StationPowerCalculator({ presets = [] }: { presets?: VehiclePreset[] }) {
  const [capacity, setCapacity] = useState(60);
  const [acLimit, setAcLimit] = useState(11);
  const [dcLimit, setDcLimit] = useState(150);
  const [from, setFrom] = useState(10);
  const [to, setTo] = useState(80);
  const efficiency = 0.9;

  const rows = useMemo(() => {
    const energy = (capacity * Math.max(0, to - from)) / 100;
    return STATIONS.map((s) => {
      const vehicleLimit = s.kind === "AC" ? acLimit : dcLimit;
      const effective = Math.min(s.kw, vehicleLimit);
      const minutes = effective > 0 ? (energy / (effective * (s.kind === "AC" ? efficiency : 1))) * 60 : 0;
      return { ...s, effective, minutes, limitedByVehicle: vehicleLimit < s.kw };
    });
  }, [capacity, acLimit, dcLimit, from, to]);

  const best = rows.reduce((a, b) => (b.minutes < a.minutes ? b : a), rows[0]);

  return (
    <CalcLayout
      inputs={
        <>
          <VehiclePresetSelect
            id="sp-preset"
            presets={presets}
            onPick={(p) => {
              setCapacity(p.usable);
              setAcLimit(p.acKw);
              if (p.dcKw) setDcLimit(p.dcKw);
            }}
            hint="Renseigne la capacité utile et les limites de charge AC et DC du modèle."
          />
          <Field label="Capacité utile (kWh)" htmlFor="sp-cap">
            <NumberInput id="sp-cap" value={capacity} onChange={setCapacity} min={10} max={200} step={0.5} suffix="kWh" />
          </Field>
          <Field label="Puissance AC maximale du véhicule (kW)" htmlFor="sp-ac" hint="Chargeur embarqué : souvent 7,4, 11 ou 22 kW.">
            <NumberInput id="sp-ac" value={acLimit} onChange={setAcLimit} min={1} max={22} step={0.1} suffix="kW" />
          </Field>
          <Field label="Puissance DC maximale du véhicule (kW)" htmlFor="sp-dc" hint="Pic de la courbe de charge, non tenu en continu.">
            <NumberInput id="sp-dc" value={dcLimit} onChange={setDcLimit} min={20} max={400} step={1} suffix="kW" />
          </Field>
          <Field label="État de charge de départ" htmlFor="sp-from">
            <RangeInputControl id="sp-from" value={from} onChange={setFrom} min={0} max={95} suffix="%" />
          </Field>
          <Field label="État de charge visé" htmlFor="sp-to">
            <RangeInputControl id="sp-to" value={to} onChange={setTo} min={5} max={100} suffix="%" />
          </Field>
        </>
      }
      results={
        <>
          <ResultCard
            label="Recharge la plus rapide (théorique)"
            value={minutesToHuman(best.minutes)}
            emphasis
            hint={`${best.label} ${formatNumber(best.kw, 1)} kW → ${formatNumber(best.effective, 1)} kW effectifs`}
          />
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[420px] text-left text-sm">
              <caption className="sr-only">Temps de recharge théorique selon la puissance de la borne</caption>
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Borne</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Puissance utilisée</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.kw}>
                    <th scope="row" className="px-3 py-2 font-medium text-slate-900">
                      {formatNumber(r.kw, 1)} kW {r.kind}
                    </th>
                    <td className="tabular px-3 py-2 text-slate-700">
                      {formatNumber(r.effective, 1)} kW
                      {r.limitedByVehicle && <span className="ml-1 text-xs text-amber-800">(limité par le véhicule)</span>}
                    </td>
                    <td className="tabular px-3 py-2 font-semibold text-slate-900">{minutesToHuman(r.minutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600">
            Temps théorique à puissance constante. En DC la puissance réelle baisse au fil du remplissage : le temps réel est plus long
            (voir le temps 10-80 % publié sur la fiche de chaque modèle). En AC, rendement de charge de 90 % supposé.
          </p>
        </>
      }
    />
  );
}
