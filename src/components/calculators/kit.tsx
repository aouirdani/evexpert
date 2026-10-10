"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { comfortableFieldClass, numberFieldClass, numberFieldFrameClass, rangeFieldClass } from "@/components/ui/Field";
import { inputPanelClass, resultPanelClass } from "@/components/ui/componentStyles";

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
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p id={`${htmlFor}-hint`} className="text-caption text-muted">{hint}</p>}
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
  "aria-describedby": describedBy,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  "aria-describedby"?: string;
}) {
  return (
    <div className={numberFieldFrameClass}>
      <input
        id={id}
        aria-describedby={describedBy}
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={numberFieldClass}
      />
      {suffix && (
        <span className="num pointer-events-none mr-3 whitespace-nowrap text-caption text-muted">
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
  "aria-describedby": describedBy,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  "aria-describedby"?: string;
}) {
  return (
    <div>
      <input
        id={id}
        aria-describedby={describedBy}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={rangeFieldClass}
      />
      <div className="num mt-1 text-sm font-semibold text-ink">
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
      className={comfortableFieldClass}
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
    <div className="min-w-0 border-t border-line-ink pt-5">
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
      <div className={inputPanelClass}>
        <h2 className="label">Vos paramètres</h2>
        <div className="mt-6 space-y-6">{inputs}</div>
      </div>
      <div className={resultPanelClass} aria-live="polite">
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
        aria-describedby={hint ? `${id}-hint` : undefined}
        defaultValue=""
        onChange={(e) => {
          const p = presets.find((x) => x.id === e.target.value);
          if (p) onPick(p);
        }}
        className={comfortableFieldClass}
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
