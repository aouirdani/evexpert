"use client";

import { useState } from "react";
import type { Vehicle } from "@/types";
import { ComparisonTable } from "./ComparisonTable";

export function ComparisonBuilder({
  vehicles,
  defaultIds,
}: {
  vehicles: Vehicle[];
  defaultIds: [string, string];
}) {
  const [ids, setIds] = useState<string[]>([defaultIds[0], defaultIds[1], ""]);
  const selected = ids
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => Boolean(v));

  const cls =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30";

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <label htmlFor={`cmp-${i}`} className="mb-1.5 block text-sm font-semibold text-slate-800">
              Véhicule {i + 1} {i === 2 && <span className="font-normal text-slate-600">(facultatif)</span>}
            </label>
            <select
              id={`cmp-${i}`}
              value={ids[i]}
              onChange={(e) => setIds((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
              className={cls}
            >
              {i === 2 && <option value="">Aucun</option>}
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} {v.version}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-8" aria-live="polite">
        {selected.length >= 2 ? (
          <ComparisonTable vehicles={selected} />
        ) : (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">Sélectionnez au moins deux véhicules différents.</p>
        )}
      </div>
    </div>
  );
}
