"use client";

import { useMemo, useState } from "react";
import type { BodyType, Vehicle } from "@/types";
import { ASSUMPTIONS } from "@/data/assumptions";
import { costPer100km } from "@/lib/vehicle-calcs";
import { VehicleCard } from "./VehicleCard";

const bodyLabels: Record<BodyType, string> = {
  citadine: "Citadine",
  compacte: "Compacte",
  berline: "Berline",
  SUV: "SUV",
  break: "Break",
  monospace: "Monospace",
  utilitaire: "Utilitaire",
  coupé: "Coupé",
};

type SortKey = "range-desc" | "cost-asc" | "dc-desc" | "battery-desc" | "name";

/** Filtres côté client uniquement : aucune combinaison de filtres ne crée d'URL indexable. */
export function VehicleExplorer({ vehicles }: { vehicles: (Vehicle & { href: string })[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [body, setBody] = useState("all");
  const [minRange, setMinRange] = useState(0);
  const [minDc, setMinDc] = useState(0);
  const [sort, setSort] = useState<SortKey>("range-desc");

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

  const inputCls =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30";
  const labelCls = "mb-1.5 block text-sm font-semibold text-slate-800";

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <form
        className="space-y-4 lg:sticky lg:top-24 lg:h-fit"
        aria-label="Filtres"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label htmlFor="v-search" className={labelCls}>Rechercher</label>
          <input id="v-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Marque ou modèle" className={inputCls} />
        </div>
        <div>
          <label htmlFor="v-brand" className={labelCls}>Marque</label>
          <select id="v-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls}>
            <option value="all">Toutes</option>
            {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="v-body" className={labelCls}>Carrosserie</label>
          <select id="v-body" value={body} onChange={(e) => setBody(e.target.value)} className={inputCls}>
            <option value="all">Toutes</option>
            {bodies.map((b) => (<option key={b} value={b}>{bodyLabels[b]}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="v-range" className={labelCls}>Autonomie WLTP minimale : {minRange} km</label>
          <input id="v-range" type="range" min={0} max={700} step={50} value={minRange} onChange={(e) => setMinRange(Number(e.target.value))} className="w-full accent-emerald-700" />
        </div>
        <div>
          <label htmlFor="v-dc" className={labelCls}>Charge DC minimale : {minDc} kW</label>
          <input id="v-dc" type="range" min={0} max={300} step={25} value={minDc} onChange={(e) => setMinDc(Number(e.target.value))} className="w-full accent-emerald-700" />
        </div>
        <div>
          <label htmlFor="v-sort" className={labelCls}>Trier par</label>
          <select id="v-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={inputCls}>
            <option value="range-desc">Autonomie WLTP décroissante</option>
            <option value="cost-asc">Coût aux 100 km croissant (calculé)</option>
            <option value="dc-desc">Puissance DC décroissante</option>
            <option value="battery-desc">Batterie utile décroissante</option>
            <option value="name">Nom (A-Z)</option>
          </select>
        </div>
      </form>

      <div>
        <p className="mb-4 text-sm font-medium text-slate-700" role="status" aria-live="polite">
          {filtered.length} version{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""} sur {vehicles.length}
        </p>
        {filtered.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-6 text-slate-700">Aucun véhicule ne correspond à ces critères. Assouplissez un filtre.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} href={v.href} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
