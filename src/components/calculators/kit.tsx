"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-caption text-muted">{hint}</p>}
    </div>
  );
}

export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-md border border-control bg-surface px-4 py-3 text-base text-ink focus-visible:border-signal-deep"
      />
      {suffix && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function RangeInputControl({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-deep"
      />
      <div className="mt-1 text-sm font-semibold text-ink">
        {value}
        {suffix ? ` ${suffix}` : ""}
      </div>
    </div>
  );
}

export function SelectInput<T extends string>({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-control bg-surface px-4 py-3 text-base text-ink focus-visible:border-signal-deep"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Résultat de calcul, composé sur fond sombre (voir CalcLayout) : étiquette, grande valeur tabulaire. */
export function ResultCard({
  label,
  value,
  emphasis,
  hint,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  hint?: string;
}) {
  return (
    <div className="border-t border-line-ink pt-5">
      <p className="label text-ink-muted">{label}</p>
      <p className={cx("num mt-2.5 font-bold", emphasis ? "text-data-xl text-signal" : "text-data-lg text-paper")}>{value}</p>
      {hint && <p className="num mt-2 text-sm text-ink-muted">{hint}</p>}
    </div>
  );
}

/** Saisie à gauche (encadré blanc), résultats à droite (panneau sombre : c'est le résultat du calcul). */
export function CalcLayout({
  inputs,
  results,
}: {
  inputs: ReactNode;
  results: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-line bg-surface p-7 sm:p-9">
        <h2 className="label">Vos paramètres</h2>
        <div className="mt-6 space-y-6">{inputs}</div>
      </div>
      <div className="on-ink rounded-2xl bg-ink p-7 text-paper sm:p-9" aria-live="polite">
        <h2 className="label text-ink-muted">Résultats</h2>
        <div className="mt-6 space-y-6">{results}</div>
      </div>
    </div>
  );
}

/** Modèle réel servant à préremplir un calculateur (données de la base EVExpert). */
export interface VehiclePreset {
  id: string;
  label: string;
  /** Capacité utile (kWh). */
  usable: number;
  /** Consommation côté batterie (kWh/100 km) = capacité utile ÷ autonomie WLTP. */
  batteryConsumption: number;
  /** Consommation côté réseau (kWh/100 km), rendement de charge 90 %. */
  gridConsumption: number;
  /** Puissance de charge AC maximale (kW). */
  acKw: number;
  /** Puissance de charge DC maximale (kW), si connue. */
  dcKw: number | null;
}

export function VehiclePresetSelect({
  id,
  presets,
  onPick,
  hint = "Préremplit les champs avec les données de la fiche (source citée sur la fiche du modèle).",
}: {
  id: string;
  presets: VehiclePreset[];
  onPick: (p: VehiclePreset) => void;
  hint?: string;
}) {
  if (!presets.length) return null;
  return (
    <Field label="Préremplir avec un modèle (facultatif)" htmlFor={id} hint={hint}>
      <select
        id={id}
        defaultValue=""
        onChange={(e) => {
          const p = presets.find((x) => x.id === e.target.value);
          if (p) onPick(p);
        }}
        className="w-full rounded-md border border-control bg-surface px-4 py-3 text-base text-ink focus-visible:border-signal-deep"
      >
        <option value="">Saisie manuelle</option>
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label} — {p.usable.toString().replace(".", ",")} kWh utiles
          </option>
        ))}
      </select>
    </Field>
  );
}
