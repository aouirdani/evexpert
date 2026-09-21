"use client";

import { useMemo, useState } from "react";
import { GroupedBars } from "@/components/charts/GroupedBars";
import { ASSUMPTIONS } from "@/data/assumptions";
import { computeTco, type TcoInput } from "@/lib/calculators";
import { formatEuro } from "@/lib/utils";
import { Field, NumberInput, ResultCard } from "./kit";

const defaultA: TcoInput = {
  price: 40000,
  bonus: 0,
  resaleValue: 18000,
  years: 5,
  annualKm: 15000,
  consumption: 16,
  energyPrice: ASSUMPTIONS.homePrice,
  publicChargingShare: 20,
  publicChargingPrice: ASSUMPTIONS.publicAcPrice,
  insurance: 700,
  maintenance: 250,
  tires: 150,
  taxes: 0,
};

const defaultB: TcoInput = {
  ...defaultA,
  price: 30000,
  bonus: 0,
  resaleValue: 13000,
  consumption: 6.5,
  energyPrice: ASSUMPTIONS.petrolPrice,
  publicChargingShare: 0,
  publicChargingPrice: 0,
  maintenance: 600,
  taxes: 60,
};

function TcoForm({ title, state, set }: { title: string; state: TcoInput; set: (s: TcoInput) => void }) {
  const upd = (k: keyof TcoInput, v: number) => set({ ...state, [k]: v });
  const fields: { k: keyof TcoInput; label: string; step?: number }[] = [
    { k: "price", label: "Prix (€)", step: 500 },
    { k: "bonus", label: "Aides déduites (€)", step: 250 },
    { k: "resaleValue", label: "Revente estimée (€)", step: 500 },
    { k: "years", label: "Durée (ans)", step: 1 },
    { k: "annualKm", label: "Km / an", step: 1000 },
    { k: "consumption", label: "Conso /100 km", step: 0.1 },
    { k: "energyPrice", label: "Prix énergie", step: 0.01 },
    { k: "publicChargingShare", label: "Part recharge publique (%)", step: 5 },
    { k: "publicChargingPrice", label: "Prix recharge publique", step: 0.01 },
    { k: "insurance", label: "Assurance (€/an)", step: 50 },
    { k: "maintenance", label: "Entretien (€/an)", step: 50 },
    { k: "tires", label: "Pneus (€/an)", step: 25 },
    { k: "taxes", label: "Taxes (€/an)", step: 10 },
  ];
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <Field key={String(f.k)} label={f.label} htmlFor={`${title}-${String(f.k)}`}>
            <NumberInput id={`${title}-${String(f.k)}`} value={state[f.k]} onChange={(v) => upd(f.k, v)} min={0} step={f.step} />
          </Field>
        ))}
      </div>
    </div>
  );
}

export function TcoCalculator() {
  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);

  const rA = useMemo(() => computeTco(a), [a]);
  const rB = useMemo(() => computeTco(b), [b]);

  const groups = rA.breakdown.map((item, i) => ({
    label: item.label,
    values: [Math.round(item.value), Math.round(rB.breakdown[i].value)],
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-info/30 bg-info-bg p-4 text-sm text-info">
        Distinguez vos <strong>données</strong> (prix, kilométrage, énergie) des{" "}
        <strong>hypothèses</strong> (revente, assurance, entretien). Le TCO est
        aussi fiable que les valeurs saisies.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TcoForm title="Véhicule A" state={a} set={setA} />
        <TcoForm title="Véhicule B" state={b} set={setB} />
      </div>

      <div className="on-ink grid gap-x-8 gap-y-5 rounded-2xl bg-ink p-6 text-paper sm:grid-cols-2 sm:p-8" aria-live="polite">
        <ResultCard label={`TCO total — Véhicule A (${a.years} ans)`} value={formatEuro(rA.total)} emphasis />
        <ResultCard label={`TCO total — Véhicule B (${b.years} ans)`} value={formatEuro(rB.total)} emphasis />
        <ResultCard label="Coût mensuel — A" value={formatEuro(rA.perMonth)} />
        <ResultCard label="Coût mensuel — B" value={formatEuro(rB.perMonth)} />
        <ResultCard label="Coût / km — A" value={formatEuro(rA.perKm, 2)} />
        <ResultCard label="Coût / km — B" value={formatEuro(rB.perKm, 2)} />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-4 text-base font-bold text-ink">
          Répartition des coûts par poste
        </h2>
        <GroupedBars
          title="Répartition des coûts par poste, véhicule A et véhicule B"
          groups={groups}
          series={[
            { label: "Véhicule A", color: "#0F6B4F" },
            { label: "Véhicule B", color: "#0B1626" },
          ]}
        />
      </div>
    </div>
  );
}
