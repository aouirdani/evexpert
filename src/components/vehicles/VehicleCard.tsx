import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/types";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { batteryConsumption100 } from "@/lib/vehicle-calcs";
import { bodyTypeLabels } from "@/lib/vehicle-format";
import { formatNumber } from "@/lib/utils";
import { BodyGlyph } from "./BodyGlyph";
import { RangeBar } from "./RangeBar";

function Spec({ label, value, unit }: { label: string; value: string | null; unit: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.6875rem] font-medium leading-tight text-muted">{label}</dt>
      <dd className="mt-1">
        {value === null ? (
          <>
            <span aria-hidden className="text-lg font-semibold text-muted">—</span>
            <span className="sr-only">Non disponible</span>
          </>
        ) : (
          <>
            <span className="tabular block text-lg font-semibold leading-none text-ink">{value}</span>
            <span className="mt-1 block text-xs text-muted">{unit}</span>
          </>
        )}
      </dd>
    </div>
  );
}

/**
 * Carte véhicule : l'autonomie domine, le reste est en second plan. Aucune donnée
 * n'est inventée : une valeur absente s'affiche « — » (lue « Non disponible »).
 * Toute la carte est cliquable via un vrai lien HTML (lien étiré) ; l'anneau de focus
 * entoure la carte entière. Server Component (aussi rendu dans l'explorateur client).
 */
export function VehicleCard({ vehicle: v, href }: { vehicle: Vehicle; href?: string }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-ink has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-signal-deep">
      <div className="bg-paper-deep px-5 pb-2 pt-3.5">
        <p className="eyebrow text-body">{bodyTypeLabels[v.bodyType]}</p>
        <BodyGlyph type={v.bodyType} className="mx-auto h-14 w-full max-w-52 text-ink" />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-4 pt-4">
        <p className="eyebrow text-signal-deep">{v.brand}</p>
        <h3 className="mt-1 text-h3 font-bold text-ink">
          <Link
            href={href ?? vehicleHref(v)}
            aria-label={vehicleTitle(v)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {v.model}
          </Link>
        </h3>
        <p className="text-sm text-muted">{v.version}</p>

        <div className="mt-4">
          <p className="tabular text-h1 font-bold leading-none text-ink">
            {formatNumber(v.rangeWltp)}
            <span className="ml-1 text-base font-semibold text-muted">km</span>
          </p>
          <p className="eyebrow mt-2 text-muted">Autonomie WLTP</p>
          <RangeBar value={v.rangeWltp} decorative className="mt-3" />
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-x-3 border-t border-line pt-3.5">
          <Spec label="Batterie utile" value={formatNumber(v.batteryUsable, 1)} unit="kWh" />
          <Spec label="Charge DC max" value={v.chargingDC === null ? null : formatNumber(v.chargingDC)} unit="kW" />
          <Spec label="Conso. calculée" value={formatNumber(batteryConsumption100(v), 1)} unit="kWh/100 km" />
        </dl>
        {v.chargingTime10to80 !== null && (
          <p className="mt-3 text-xs text-muted">
            Recharge rapide 10-80 % : <span className="tabular font-semibold text-body">{formatNumber(v.chargingTime10to80)} min</span>
          </p>
        )}

        <p aria-hidden className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-signal-deep">
          Voir la fiche
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}
