"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { computeRunningCost } from "@/lib/calculators";
import { formatEuro } from "@/lib/utils";
import { Field, NumberInput, ResultCard } from "./kit";

interface CarInputs {
  price: number;
  annualKm: number;
  consumption: number;
  energyPrice: number;
  insurance: number;
  maintenance: number;
  depreciationRate: number;
}

const defaultEv: CarInputs = {
  price: 40000,
  annualKm: 15000,
  consumption: 16,
  energyPrice: 0.25,
  insurance: 700,
  maintenance: 250,
  depreciationRate: 12,
};

const defaultPetrol: CarInputs = {
  price: 30000,
  annualKm: 15000,
  consumption: 6.5,
  energyPrice: 1.85,
  insurance: 650,
  maintenance: 600,
  depreciationRate: 14,
};

function CarForm({
  title,
  state,
  set,
  energyLabel,
}: {
  title: string;
  state: CarInputs;
  set: (s: CarInputs) => void;
  energyLabel: string;
}) {
  const upd = (k: keyof CarInputs, v: number) => set({ ...state, [k]: v });
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="Prix (€)" htmlFor={`${title}-price`}>
          <NumberInput id={`${title}-price`} value={state.price} onChange={(v) => upd("price", v)} min={0} step={500} />
        </Field>
        <Field label="Km / an" htmlFor={`${title}-km`}>
          <NumberInput id={`${title}-km`} value={state.annualKm} onChange={(v) => upd("annualKm", v)} min={0} step={1000} />
        </Field>
        <Field label={`Conso (${energyLabel})`} htmlFor={`${title}-conso`}>
          <NumberInput id={`${title}-conso`} value={state.consumption} onChange={(v) => upd("consumption", v)} min={0} step={0.1} />
        </Field>
        <Field label="Prix énergie" htmlFor={`${title}-energy`}>
          <NumberInput id={`${title}-energy`} value={state.energyPrice} onChange={(v) => upd("energyPrice", v)} min={0} step={0.01} />
        </Field>
        <Field label="Assurance (€/an)" htmlFor={`${title}-ins`}>
          <NumberInput id={`${title}-ins`} value={state.insurance} onChange={(v) => upd("insurance", v)} min={0} step={50} />
        </Field>
        <Field label="Entretien (€/an)" htmlFor={`${title}-maint`}>
          <NumberInput id={`${title}-maint`} value={state.maintenance} onChange={(v) => upd("maintenance", v)} min={0} step={50} />
        </Field>
        <Field label="Dépréciation (%/an)" htmlFor={`${title}-dep`}>
          <NumberInput id={`${title}-dep`} value={state.depreciationRate} onChange={(v) => upd("depreciationRate", v)} min={0} max={40} step={1} />
        </Field>
      </div>
    </div>
  );
}

export function EvVsPetrolCalculator() {
  const [ev, setEv] = useState(defaultEv);
  const [petrol, setPetrol] = useState(defaultPetrol);

  const evR = useMemo(() => computeRunningCost(ev), [ev]);
  const petrolR = useMemo(() => computeRunningCost(petrol), [petrol]);

  const chartData = [3, 5, 8].map((y) => ({
    name: `${y} ans`,
    Électrique: Math.round(evR.costOverYears(y)),
    Essence: Math.round(petrolR.costOverYears(y)),
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        Les valeurs par défaut sont des <strong>hypothèses</strong> modifiables
        (assurance, entretien, dépréciation). Ajustez-les à votre situation pour
        un résultat pertinent.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CarForm title="Électrique" state={ev} set={setEv} energyLabel="kWh/100" />
        <CarForm title="Essence" state={petrol} set={setPetrol} energyLabel="L/100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard label="Coût annuel (électrique)" value={formatEuro(evR.annualTotal)} emphasis />
        <ResultCard label="Coût mensuel (électrique)" value={formatEuro(evR.monthly)} />
        <ResultCard label="Coût / km (électrique)" value={formatEuro(evR.perKm, 2)} />
        <ResultCard label="Coût annuel (essence)" value={formatEuro(petrolR.annualTotal)} />
        <ResultCard label="Coût mensuel (essence)" value={formatEuro(petrolR.monthly)} />
        <ResultCard label="Coût / km (essence)" value={formatEuro(petrolR.perKm, 2)} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-base font-bold text-slate-900">
          Coût cumulé selon la durée
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k€`} />
              <Tooltip formatter={(v) => formatEuro(Number(v))} />
              <Legend />
              <Bar dataKey="Électrique" fill="#059669" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Essence" fill="#64748b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
