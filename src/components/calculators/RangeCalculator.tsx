"use client";

import { useMemo, useState } from "react";
import { computeRange, type DrivingType } from "@/lib/calculators";
import { formatNumber } from "@/lib/utils";
import { CalcLayout, Field, NumberInput, RangeInputControl, ResultCard, SelectInput } from "./kit";

const vehiclePresets = [
  { value: "custom", label: "Personnalisé", cap: 60, conso: 16 },
  { value: "citadine", label: "Citadine (~52 kWh)", cap: 50, conso: 14 },
  { value: "berline", label: "Berline (~58 kWh)", cap: 57, conso: 15 },
  { value: "suv", label: "SUV (~77 kWh)", cap: 75, conso: 18 },
] as const;

export function RangeCalculator() {
  const [preset, setPreset] = useState<string>("custom");
  const [capacity, setCapacity] = useState(60);
  const [consumption, setConsumption] = useState(16);
  const [speed, setSpeed] = useState(110);
  const [temperature, setTemperature] = useState(15);
  const [drivingType, setDrivingType] = useState<DrivingType>("mixte");
  const [reserve, setReserve] = useState(10);

  function applyPreset(p: string) {
    setPreset(p);
    const found = vehiclePresets.find((v) => v.value === p);
    if (found && found.value !== "custom") {
      setCapacity(found.cap);
      setConsumption(found.conso);
    }
  }

  const r = useMemo(
    () =>
      computeRange({
        usableCapacity: capacity,
        baseConsumption: consumption,
        speed,
        temperature,
        drivingType,
        reserve,
      }),
    [capacity, consumption, speed, temperature, drivingType, reserve],
  );

  return (
    <>
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Cette autonomie est une <strong>estimation</strong> et non une valeur
        officielle constructeur. Elle dépend de nombreux facteurs réels.
      </div>
      <CalcLayout
        inputs={
          <>
            <Field label="Type de véhicule (préréglage)" htmlFor="r-preset">
              <SelectInput id="r-preset" value={preset} onChange={applyPreset} options={vehiclePresets.map((v) => ({ value: v.value, label: v.label }))} />
            </Field>
            <Field label="Capacité utile (kWh)" htmlFor="r-cap">
              <NumberInput id="r-cap" value={capacity} onChange={setCapacity} min={10} max={200} step={0.5} suffix="kWh" />
            </Field>
            <Field label="Consommation de référence (kWh/100 km)" htmlFor="r-conso">
              <NumberInput id="r-conso" value={consumption} onChange={setConsumption} min={8} max={35} step={0.5} suffix="kWh" />
            </Field>
            <Field label="Vitesse moyenne" htmlFor="r-speed">
              <RangeInputControl id="r-speed" value={speed} onChange={setSpeed} min={30} max={150} step={5} suffix="km/h" />
            </Field>
            <Field label="Température extérieure" htmlFor="r-temp">
              <RangeInputControl id="r-temp" value={temperature} onChange={setTemperature} min={-20} max={40} suffix="°C" />
            </Field>
            <Field label="Type de conduite" htmlFor="r-driving">
              <SelectInput id="r-driving" value={drivingType} onChange={setDrivingType} options={[{ value: "ville", label: "Ville" }, { value: "mixte", label: "Mixte" }, { value: "autoroute", label: "Autoroute" }]} />
            </Field>
            <Field label="Réserve de batterie conservée" htmlFor="r-reserve">
              <RangeInputControl id="r-reserve" value={reserve} onChange={setReserve} min={0} max={30} suffix="%" />
            </Field>
          </>
        }
        results={
          <>
            <ResultCard
              label="Autonomie estimée"
              value={`${formatNumber(r.estimatedRange)} km`}
              emphasis
              hint={`Consommation ajustée ≈ ${formatNumber(r.adjustedConsumption, 1)} kWh/100 km`}
            />
            <div className="grid grid-cols-2 gap-4">
              <ResultCard label="Énergie exploitable" value={`${formatNumber(r.usableEnergy, 1)} kWh`} />
              <ResultCard label="Consommation ajustée" value={`${formatNumber(r.adjustedConsumption, 1)} kWh/100`} />
            </div>
            <p className="text-xs text-slate-500">
              L&apos;estimation applique des facteurs liés à la vitesse, la
              température et le type de conduite à votre consommation de référence.
            </p>
          </>
        }
      />
    </>
  );
}
