"use client";

import { useMemo, useState } from "react";
import { annualCost, costPer100km } from "@/lib/calculators";
import { formatEuro } from "@/lib/utils";
import { Field, NumberInput, SelectInput } from "./kit";

interface Row {
  key: string;
  label: string;
  unit: string;
  priceUnit: string;
  consumption: number;
  price: number;
}

const kmOptions = [10000, 15000, 20000, 30000];

export function CostPer100Calculator() {
  const [annualKm, setAnnualKm] = useState(15000);
  const [rows, setRows] = useState<Row[]>([
    { key: "ev", label: "Électrique", unit: "kWh/100", priceUnit: "€/kWh", consumption: 16, price: 0.25 },
    { key: "essence", label: "Essence", unit: "L/100", priceUnit: "€/L", consumption: 6.5, price: 1.85 },
    { key: "diesel", label: "Diesel", unit: "L/100", priceUnit: "€/L", consumption: 5, price: 1.75 },
    { key: "hybride", label: "Hybride", unit: "L/100", priceUnit: "€/L", consumption: 4.5, price: 1.85 },
  ]);

  function update(key: string, field: "consumption" | "price", value: number) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  const computed = useMemo(
    () =>
      rows.map((r) => {
        const per100 = costPer100km({ consumption: r.consumption, price: r.price });
        return { ...r, per100, annual: annualCost(per100, annualKm) };
      }),
    [rows, annualKm],
  );

  const cheapest = useMemo(
    () => computed.reduce((min, r) => (r.annual < min.annual ? r : min), computed[0]),
    [computed],
  );

  return (
    <div>
      <div className="mb-6 max-w-xs">
        <Field label="Kilométrage annuel" htmlFor="c100-km">
          <SelectInput
            id="c100-km"
            value={String(annualKm)}
            onChange={(v) => setAnnualKm(Number(v))}
            options={kmOptions.map((k) => ({ value: String(k), label: `${k.toLocaleString("fr-FR")} km/an` }))}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {computed.map((r) => (
          <div
            key={r.key}
            className={`rounded-2xl border p-5 ${r.key === cheapest.key ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">{r.label}</h3>
              {r.key === cheapest.key && (
                <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  Le moins cher
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label={`Conso (${r.unit})`} htmlFor={`c-${r.key}`}>
                <NumberInput id={`c-${r.key}`} value={r.consumption} onChange={(v) => update(r.key, "consumption", v)} min={0} step={0.1} />
              </Field>
              <Field label={`Prix (${r.priceUnit})`} htmlFor={`p-${r.key}`}>
                <NumberInput id={`p-${r.key}`} value={r.price} onChange={(v) => update(r.key, "price", v)} min={0} step={0.01} />
              </Field>
            </div>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Coût aux 100 km</dt>
                <dd className="font-semibold text-slate-900">{formatEuro(r.per100, 2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Coût énergie annuel</dt>
                <dd className="font-bold text-slate-900">{formatEuro(r.annual)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        Économie annuelle estimée de l&apos;électrique face à l&apos;essence&nbsp;:{" "}
        <strong className="text-emerald-700">
          {formatEuro(
            Math.max(0, (computed.find((r) => r.key === "essence")?.annual ?? 0) - (computed.find((r) => r.key === "ev")?.annual ?? 0)),
          )}
        </strong>{" "}
        (coût énergie uniquement).
      </p>
    </div>
  );
}
