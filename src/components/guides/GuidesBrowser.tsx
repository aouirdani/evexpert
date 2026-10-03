"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GuideCardVisual, type GuideCardData } from "@/components/guides/GuideCardVisual";

export interface GuideGroup {
  id: string;
  label: string;
  guides: GuideCardData[];
}

/**
 * Liste des guides par rubrique, avec filtre. Toutes les rubriques (et leurs intertitres H2, ancres
 * `#autonomie`, `#recharge`…) sont dans le HTML ; le filtre ne fait que masquer celles qui ne sont pas
 * choisies. Sans JavaScript, tout reste visible.
 */
export function GuidesBrowser({ groups }: { groups: GuideGroup[] }) {
  const [active, setActive] = useState<string>("all");
  const total = groups.reduce((n, g) => n + g.guides.length, 0);
  const chip = (selected: boolean) =>
    cn(
      "min-h-11 rounded-sm border px-4 text-sm font-semibold transition-colors duration-150",
      selected ? "border-ink bg-ink text-paper" : "border-control bg-surface text-ink hover:border-ink",
    );
  return (
    <>
      <div role="group" aria-label="Rubriques" className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="label mr-2">Rubriques</span>
        <button type="button" aria-pressed={active === "all"} onClick={() => setActive("all")} className={chip(active === "all")}>
          Toutes <span className="num">({total})</span>
        </button>
        {groups.map((g) => (
          <button key={g.id} type="button" aria-pressed={active === g.id} onClick={() => setActive(g.id)} className={chip(active === g.id)}>
            {g.label} <span className="num">({g.guides.length})</span>
          </button>
        ))}
      </div>
      {groups.map((g, gi) => (
        <section
          key={g.id}
          id={g.id}
          hidden={active !== "all" && active !== g.id}
          className="mt-section grid scroll-mt-28 gap-x-12 gap-y-8 lg:grid-cols-12"
          aria-labelledby={`h-${g.id}`}
        >
          <div className="lg:col-span-3">
            <h2 id={`h-${g.id}`} className="text-h2 font-bold text-ink">{g.label}</h2>
            <p className="label mt-3">{g.guides.length} guide{g.guides.length > 1 ? "s" : ""}</p>
          </div>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
            {g.guides.map((guide, i) => (
              <GuideCardVisual key={guide.href} guide={guide} priority={gi === 0 && i < 3} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
