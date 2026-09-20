"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-800">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
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
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
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
        className="w-full accent-emerald-600"
      />
      <div className="mt-1 text-sm font-semibold text-slate-900">
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
      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

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
    <div
      className={cn(
        "rounded-xl border p-4",
        emphasis
          ? "border-emerald-200 bg-white ring-1 ring-emerald-100"
          : "border-slate-200 bg-white",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={cn(
          "tabular mt-1 font-extrabold",
          emphasis ? "text-4xl text-emerald-700 sm:text-5xl" : "text-2xl text-slate-900",
        )}
      >
        {value}
      </p>
      {hint && <p className="tabular mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function CalcLayout({
  inputs,
  results,
}: {
  inputs: ReactNode;
  results: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">Vos paramètres</h2>
        <div className="mt-5 space-y-5">{inputs}</div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">Résultats</h2>
        <div className="mt-5 space-y-4">{results}</div>
      </div>
    </div>
  );
}
