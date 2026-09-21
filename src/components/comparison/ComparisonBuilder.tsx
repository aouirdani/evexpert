"use client";

import { useState } from "react";
import type { Vehicle } from "@/types";
import { fieldClass } from "@/components/ui/Field";
import { ComparisonTable } from "./ComparisonTable";

const letters = ["A", "B", "C"];

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

  return (
    <div>
      <div className="grid gap-x-8 gap-y-5 border-t-2 border-ink pt-5 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <label htmlFor={`cmp-${i}`} className="mb-2 flex items-baseline gap-3">
              <span aria-hidden className="num text-data-lg font-bold text-ink">{letters[i]}</span>
              <span className="label">
                Véhicule {letters[i]}
                {i === 2 && " (facultatif)"}
              </span>
            </label>
            <select
              id={`cmp-${i}`}
              value={ids[i]}
              onChange={(e) => setIds((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
              className={fieldClass}
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
      <div className="mt-6" aria-live="polite">
        {selected.length >= 2 ? (
          <ComparisonTable vehicles={selected} />
        ) : (
          <p className="border-t border-line pt-5 text-body">Sélectionnez au moins deux véhicules différents.</p>
        )}
      </div>
    </div>
  );
}
