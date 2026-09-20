"use client";

import { useMemo, useState } from "react";
import type { BodyType, Vehicle } from "@/types";
import { VehicleCard } from "./VehicleCard";

const bodyTypes: BodyType[] = ["citadine", "berline", "SUV", "break", "monospace", "coupé"];

type SortKey = "price-asc" | "price-desc" | "range-desc" | "dc-desc";

export function VehicleExplorer({ vehicles }: { vehicles: Vehicle[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [body, setBody] = useState("all");
  const [maxPrice, setMaxPrice] = useState(60000);
  const [minRange, setMinRange] = useState(0);
  const [minDc, setMinDc] = useState(0);
  const [sort, setSort] = useState<SortKey>("price-asc");

  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand))).sort(),
    [vehicles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = vehicles.filter((v) => {
      if (q && !`${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(q)) return false;
      if (brand !== "all" && v.brand !== brand) return false;
      if (body !== "all" && v.bodyType !== body) return false;
      if (v.price > maxPrice) return false;
      if (v.rangeWltp < minRange) return false;
      if (v.chargingDC < minDc) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      switch (sort) {
        case "price-desc":
          return b.price - a.price;
        case "range-desc":
          return b.rangeWltp - a.rangeWltp;
        case "dc-desc":
          return b.chargingDC - a.chargingDC;
        default:
          return a.price - b.price;
      }
    });
  }, [vehicles, query, brand, body, maxPrice, minRange, minDc, sort]);

  const inputCls =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30";

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
        <div>
          <label htmlFor="v-search" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Rechercher
          </label>
          <input id="v-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Modèle, marque..." className={inputCls} />
        </div>
        <div>
          <label htmlFor="v-brand" className="mb-1.5 block text-sm font-semibold text-slate-800">Marque</label>
          <select id="v-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls}>
            <option value="all">Toutes les marques</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="v-body" className="mb-1.5 block text-sm font-semibold text-slate-800">Carrosserie</label>
          <select id="v-body" value={body} onChange={(e) => setBody(e.target.value)} className={inputCls}>
            <option value="all">Toutes</option>
            {bodyTypes.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="v-price" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Prix max : {maxPrice.toLocaleString("fr-FR")} €
          </label>
          <input id="v-price" type="range" min={20000} max={70000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-emerald-600" />
        </div>
        <div>
          <label htmlFor="v-range" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Autonomie min : {minRange} km
          </label>
          <input id="v-range" type="range" min={0} max={600} step={25} value={minRange} onChange={(e) => setMinRange(Number(e.target.value))} className="w-full accent-emerald-600" />
        </div>
        <div>
          <label htmlFor="v-dc" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Recharge DC min : {minDc} kW
          </label>
          <input id="v-dc" type="range" min={0} max={300} step={10} value={minDc} onChange={(e) => setMinDc(Number(e.target.value))} className="w-full accent-emerald-600" />
        </div>
      </aside>

      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">{filtered.length} véhicule(s)</p>
          <div className="flex items-center gap-2">
            <label htmlFor="v-sort" className="text-sm text-slate-600">Trier :</label>
            <select id="v-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="range-desc">Autonomie</option>
              <option value="dc-desc">Recharge rapide</option>
            </select>
          </div>
        </div>
        {filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Aucun véhicule ne correspond à ces critères.
          </p>
        )}
      </div>
    </div>
  );
}
