import Link from "next/link";
import { BatteryCharging, Gauge, Plug, Timer } from "lucide-react";
import type { Vehicle } from "@/types";
import { vehicleHref } from "@/data/vehicles";
import { fmt } from "@/lib/vehicle-format";

const bodyLabel: Record<Vehicle["bodyType"], string> = {
  citadine: "Citadine",
  compacte: "Compacte",
  berline: "Berline",
  SUV: "SUV",
  break: "Break",
  monospace: "Monospace",
  utilitaire: "Utilitaire",
  coupé: "Coupé",
};

/** Carte véhicule : données sourcées uniquement, aucune image décorative. */
export function VehicleCard({ vehicle: v, href }: { vehicle: Vehicle; href?: string }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{v.brand}</p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
          {bodyLabel[v.bodyType]}
        </span>
      </div>
      <h3 className="mt-1 text-lg font-bold leading-snug text-slate-900">
        <Link
          href={href ?? vehicleHref(v)}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {v.model}
        </Link>
      </h3>
      <p className="text-sm text-slate-600">{v.version}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-slate-600">
            <Gauge className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            Autonomie WLTP
          </dt>
          <dd className="tabular mt-0.5 font-semibold text-slate-900">{fmt(v.rangeWltp, "km")}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-slate-600">
            <BatteryCharging className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            Batterie utile
          </dt>
          <dd className="tabular mt-0.5 font-semibold text-slate-900">{fmt(v.batteryUsable, "kWh", 1)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-slate-600">
            <Plug className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            Charge DC max
          </dt>
          <dd className="tabular mt-0.5 font-semibold text-slate-900">{fmt(v.chargingDC, "kW")}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-slate-600">
            <Timer className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            10-80 % (DC)
          </dt>
          <dd className="tabular mt-0.5 font-semibold text-slate-900">{fmt(v.chargingTime10to80, "min")}</dd>
        </div>
      </dl>
    </article>
  );
}
