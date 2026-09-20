import Link from "next/link";
import type { Vehicle } from "@/types";
import { formatEuro, formatNumber } from "@/lib/utils";

type Row = {
  label: string;
  get: (v: Vehicle) => string;
  better?: "high" | "low";
  raw?: (v: Vehicle) => number;
};

const rows: Row[] = [
  { label: "Prix", get: (v) => formatEuro(v.price), better: "low", raw: (v) => v.price },
  { label: "Batterie (totale)", get: (v) => `${formatNumber(v.batteryCapacity, 1)} kWh` },
  { label: "Batterie utile", get: (v) => `${formatNumber(v.usableBatteryCapacity, 1)} kWh`, better: "high", raw: (v) => v.usableBatteryCapacity },
  { label: "Autonomie WLTP", get: (v) => `${formatNumber(v.rangeWltp)} km`, better: "high", raw: (v) => v.rangeWltp },
  { label: "Consommation WLTP", get: (v) => `${formatNumber(v.consumptionWltp, 1)} kWh/100`, better: "low", raw: (v) => v.consumptionWltp },
  { label: "Autonomie réelle (est.)", get: (v) => `${formatNumber(v.realWorldRange)} km`, better: "high", raw: (v) => v.realWorldRange },
  { label: "Recharge AC", get: (v) => `${formatNumber(v.chargingAC)} kW`, better: "high", raw: (v) => v.chargingAC },
  { label: "Recharge DC", get: (v) => `${formatNumber(v.chargingDC)} kW`, better: "high", raw: (v) => v.chargingDC },
  { label: "10-80 % (DC)", get: (v) => `${formatNumber(v.chargingTime10to80)} min`, better: "low", raw: (v) => v.chargingTime10to80 },
  { label: "Puissance", get: (v) => `${formatNumber(v.power)} ch`, better: "high", raw: (v) => v.power },
  { label: "0-100 km/h", get: (v) => `${formatNumber(v.acceleration, 1)} s`, better: "low", raw: (v) => v.acceleration },
  { label: "Poids", get: (v) => `${formatNumber(v.weight)} kg`, better: "low", raw: (v) => v.weight },
  { label: "Coffre", get: (v) => `${formatNumber(v.trunkVolume)} L`, better: "high", raw: (v) => v.trunkVolume },
  { label: "Garantie véhicule", get: (v) => v.warranty },
  { label: "Garantie batterie", get: (v) => v.batteryWarranty },
];

export function ComparisonTable({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="sticky left-0 z-10 bg-slate-50 p-4 text-left font-semibold text-slate-500">
              Caractéristique
            </th>
            {vehicles.map((v) => (
              <th key={v.id} className="p-4 text-left">
                <Link
                  href={`/voitures-electriques/${v.brandSlug}/${v.modelSlug}`}
                  className="font-bold text-slate-900 hover:text-emerald-700"
                >
                  {v.brand} {v.model}
                </Link>
                <p className="text-xs font-normal text-slate-500">{v.version}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const values = row.raw ? vehicles.map(row.raw) : [];
            let best: number | undefined;
            if (row.better && values.length > 1) {
              best = row.better === "high" ? Math.max(...values) : Math.min(...values);
            }
            return (
              <tr key={row.label} className="border-t border-slate-100">
                <th className="sticky left-0 z-10 bg-white p-4 text-left font-medium text-slate-600">
                  {row.label}
                </th>
                {vehicles.map((v, i) => {
                  const isBest = row.raw && best !== undefined && row.raw(v) === best;
                  return (
                    <td
                      key={v.id}
                      className={`p-4 ${isBest ? "font-bold text-emerald-700" : "text-slate-900"}`}
                    >
                      {row.get(v)}
                      {isBest && <span className="ml-1 text-xs">★</span>}
                      {i === -1 && null}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
