"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { Vehicle } from "@/types";
import { formatEuro } from "@/lib/utils";
import { ComparisonTable } from "./ComparisonTable";

export function ComparisonBuilder({
  allVehicles,
  popular = [],
}: {
  allVehicles: Vehicle[];
  popular?: { slug: string; label: string }[];
}) {
  const [selected, setSelected] = useState<Vehicle[]>([]);

  function toggle(v: Vehicle) {
    setSelected((prev) => {
      if (prev.find((x) => x.id === v.id)) return prev.filter((x) => x.id !== v.id);
      if (prev.length >= 4) return prev;
      return [...prev, v];
    });
  }

  const isSelected = (id: string) => selected.some((v) => v.id === id);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Sélectionnez jusqu&apos;à 4 véhicules ({selected.length}/4)
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allVehicles.map((v) => {
            const active = isSelected(v.id);
            const disabled = !active && selected.length >= 4;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => toggle(v)}
                disabled={disabled}
                aria-pressed={active}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-emerald-400 bg-emerald-50"
                    : disabled
                      ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
                      : "border-slate-200 bg-white hover:border-emerald-300"
                }`}
              >
                <span>
                  <span className="block text-sm font-bold text-slate-900">
                    {v.brand} {v.model}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {v.version} — {formatEuro(v.price)}
                  </span>
                </span>
                {active && <X className="h-4 w-4 text-emerald-700" aria-hidden />}
              </button>
            );
          })}
        </div>
      </div>

      {selected.length >= 2 ? (
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900">Comparaison</h2>
          <ComparisonTable vehicles={selected} />
        </div>
      ) : (
        <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
          Sélectionnez au moins deux véhicules pour afficher le tableau comparatif.
        </p>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-sm font-semibold text-slate-900">
          Comparaisons populaires
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {popular.map((item) => (
            <Link
              key={item.slug}
              href={`/comparer/${item.slug}`}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
