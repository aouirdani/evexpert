"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Rows3, SlidersHorizontal } from "lucide-react";
import type { Vehicle } from "@/types";
import { ASSUMPTIONS } from "@/data/assumptions";
import { costPer100km } from "@/lib/vehicle-calcs";
import { bodyTypeLabels } from "@/lib/vehicle-format";
import { cn } from "@/lib/utils";
import { fieldClass, labelClass } from "@/components/ui/Field";
import { VehicleCard } from "./VehicleCard";
import { VehicleRow, VehicleRowsHead } from "./VehicleRow";

type SortKey = "range-desc" | "cost-asc" | "dc-desc" | "battery-desc" | "name";
type View = "cards" | "table";

const viewButton =
  "inline-flex h-10 w-10 items-center justify-center rounded-sm border transition-colors duration-150";

/** Filtres côté client uniquement : aucune combinaison de filtres ne crée d'URL indexable. */
export function VehicleExplorer({ vehicles }: { vehicles: (Vehicle & { href: string })[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [body, setBody] = useState("all");
  const [minRange, setMinRange] = useState(0);
  const [minDc, setMinDc] = useState(0);
  const [sort, setSort] = useState<SortKey>("range-desc");
  const [view, setView] = useState<View>("cards");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))).sort((a, b) => a.localeCompare(b, "fr")), [vehicles]);
  const bodies = useMemo(() => Array.from(new Set(vehicles.map((v) => v.bodyType))), [vehicles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = vehicles.filter((v) => {
      if (q && !`${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(q)) return false;
      if (brand !== "all" && v.brand !== brand) return false;
      if (body !== "all" && v.bodyType !== body) return false;
      if (v.rangeWltp < minRange) return false;
      if (minDc > 0 && (v.chargingDC ?? 0) < minDc) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      switch (sort) {
        case "cost-asc":
          return costPer100km(a, ASSUMPTIONS.homePrice) - costPer100km(b, ASSUMPTIONS.homePrice);
        case "dc-desc":
          return (b.chargingDC ?? 0) - (a.chargingDC ?? 0);
        case "battery-desc":
          return b.batteryUsable - a.batteryUsable;
        case "name":
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`, "fr");
        default:
          return b.rangeWltp - a.rangeWltp;
      }
    });
  }, [vehicles, query, brand, body, minRange, minDc, sort]);

  const activeFilters = [brand !== "all", body !== "all", minRange > 0, minDc > 0].filter(Boolean).length;
  const reset = () => {
    setQuery("");
    setBrand("all");
    setBody("all");
    setMinRange(0);
    setMinDc(0);
  };

  return (
    <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[14.5rem_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:h-fit">
        <div className="flex gap-2 lg:block">
          <div className="min-w-0 flex-1">
            <label htmlFor="v-search" className={labelClass}>Rechercher</label>
            <input
              id="v-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Marque ou modèle"
              className={fieldClass}
            />
          </div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="v-filters"
            onClick={() => setFiltersOpen((o) => !o)}
            className="mt-auto inline-flex h-[2.625rem] items-center gap-2 rounded-md border border-control bg-surface px-3 text-sm font-semibold text-ink lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filtres{activeFilters > 0 && <span className="num rounded-sm bg-ink px-1.5 text-xs text-paper">{activeFilters}</span>}
          </button>
        </div>

        <form
          id="v-filters"
          aria-label="Filtres"
          onSubmit={(e) => e.preventDefault()}
          className={cn("mt-5 space-y-5 border-t-2 border-ink pt-5 lg:block", filtersOpen ? "block" : "hidden")}
        >
          <div>
            <label htmlFor="v-brand" className={labelClass}>Marque</label>
            <select id="v-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={fieldClass}>
              <option value="all">Toutes</option>
              {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="v-body" className={labelClass}>Carrosserie</label>
            <select id="v-body" value={body} onChange={(e) => setBody(e.target.value)} className={fieldClass}>
              <option value="all">Toutes</option>
              {bodies.map((b) => (<option key={b} value={b}>{bodyTypeLabels[b]}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="v-range" className={labelClass}>
              Autonomie WLTP min. <span className="num float-right font-bold">{minRange} km</span>
            </label>
            <input id="v-range" type="range" min={0} max={700} step={50} value={minRange} onChange={(e) => setMinRange(Number(e.target.value))} className="w-full accent-signal-deep" />
          </div>
          <div>
            <label htmlFor="v-dc" className={labelClass}>
              Charge DC min. <span className="num float-right font-bold">{minDc} kW</span>
            </label>
            <input id="v-dc" type="range" min={0} max={300} step={25} value={minDc} onChange={(e) => setMinDc(Number(e.target.value))} className="w-full accent-signal-deep" />
          </div>
          {(activeFilters > 0 || query) && (
            <button type="button" onClick={reset} className="link-u text-sm font-semibold text-signal-deep">
              Réinitialiser les filtres
            </button>
          )}
        </form>
      </div>

      <div className="min-w-0">
        <h2 className="sr-only">Résultats</h2>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-3">
          <p className="text-sm text-muted" role="status" aria-live="polite">
            <span className="num text-data-md font-bold text-ink">{filtered.length}</span> version{filtered.length > 1 ? "s" : ""} sur {vehicles.length}
          </p>
          <div className="flex items-end gap-3">
            <div>
              <label htmlFor="v-sort" className="label mb-1 block">Trier par</label>
              <select id="v-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={cn(fieldClass, "py-2")}>
                <option value="range-desc">Autonomie WLTP</option>
                <option value="cost-asc">Coût aux 100 km (calculé)</option>
                <option value="dc-desc">Puissance DC</option>
                <option value="battery-desc">Batterie utile</option>
                <option value="name">Nom (A-Z)</option>
              </select>
            </div>
            <div role="group" aria-label="Affichage" className="hidden gap-1 lg:flex">
              <button
                type="button"
                aria-pressed={view === "cards"}
                aria-label="Affichage en fiches"
                onClick={() => setView("cards")}
                className={cn(viewButton, view === "cards" ? "border-ink bg-ink text-paper" : "border-control bg-surface text-ink hover:border-ink")}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-pressed={view === "table"}
                aria-label="Affichage en tableau"
                onClick={() => setView("table")}
                className={cn(viewButton, view === "table" ? "border-ink bg-ink text-paper" : "border-control bg-surface text-ink hover:border-ink")}
              >
                <Rows3 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 border-t-2 border-ink pt-5">
            <p className="text-h3 font-bold text-ink">Aucune version ne correspond.</p>
            <p className="mt-1 text-muted">Assouplissez un critère ou réinitialisez les filtres.</p>
            <button type="button" onClick={reset} className="link-u mt-3 text-sm font-semibold text-signal-deep">
              Réinitialiser les filtres
            </button>
          </div>
        ) : view === "table" ? (
          <table className="mt-5 hidden w-full lg:table">
            <caption className="sr-only">Versions affichées, triées</caption>
            <VehicleRowsHead />
            <tbody>
              {filtered.map((v) => (
                <VehicleRow key={v.id} vehicle={v} href={v.href} />
              ))}
            </tbody>
          </table>
        ) : null}
        {filtered.length > 0 && (
          <div className={cn("mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3", view === "table" && "lg:hidden")}>
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} href={v.href} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
