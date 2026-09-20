import Link from "next/link";
import { BatteryCharging, Gauge, Zap } from "lucide-react";
import type { Vehicle } from "@/types";
import { formatEuro, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/primitives";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const href = `/voitures-electriques/${vehicle.brandSlug}/${vehicle.modelSlug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div
        className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-slate-100 to-emerald-50"
        aria-hidden
      >
        <span className="text-4xl font-black tracking-tight text-slate-300">
          {vehicle.brand}
        </span>
        {vehicle.isDemo && (
          <div className="absolute right-3 top-3">
            <Badge tone="amber">Exemple</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          {vehicle.brand}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-900">
          {vehicle.model}{" "}
          <span className="font-medium text-slate-500">{vehicle.version}</span>
        </h3>
        <p className="mt-1 text-xl font-extrabold text-slate-900">
          {formatEuro(vehicle.price)}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Gauge className="h-4 w-4 text-emerald-600" aria-hidden />
            <span>
              <dt className="sr-only">Autonomie WLTP</dt>
              <dd>{formatNumber(vehicle.rangeWltp)} km</dd>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <BatteryCharging className="h-4 w-4 text-emerald-600" aria-hidden />
            <span>
              <dt className="sr-only">Batterie</dt>
              <dd>{formatNumber(vehicle.usableBatteryCapacity, 1)} kWh</dd>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-emerald-600" aria-hidden>
              ⚡
            </span>
            <span>
              <dt className="sr-only">Consommation</dt>
              <dd>{formatNumber(vehicle.consumptionWltp, 1)} kWh/100</dd>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Zap className="h-4 w-4 text-emerald-600" aria-hidden />
            <span>
              <dt className="sr-only">Recharge rapide</dt>
              <dd>{formatNumber(vehicle.chargingDC)} kW</dd>
            </span>
          </div>
        </dl>

        <div className="mt-5 pt-1">
          <Link
            href={href}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-emerald-600"
          >
            Voir la fiche
          </Link>
        </div>
      </div>
    </article>
  );
}
