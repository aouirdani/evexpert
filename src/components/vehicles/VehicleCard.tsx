import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/types";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { batteryConsumption100 } from "@/lib/vehicle-calcs";
import { bodyTypeLabels } from "@/lib/vehicle-format";
import { cn, formatNumber } from "@/lib/utils";
import { RangeBar } from "./RangeBar";

function Spec({
  label,
  value,
  unit,
  className,
}: {
  label: string;
  value: string | null;
  unit: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="label whitespace-nowrap">{label}</dt>
      <dd className="num mt-1 text-lg font-semibold text-ink sm:text-data-md">
        {value === null ? (
          <>
            <span aria-hidden className="text-muted">—</span>
            <span className="sr-only">Non disponible</span>
          </>
        ) : (
          <>
            {value}
            <span className="unit sm:hidden">{unit}</span>
            <span className="mt-0.5 hidden whitespace-nowrap text-xs font-normal text-muted sm:block">{unit}</span>
          </>
        )}
      </dd>
    </div>
  );
}

/**
 * Fiche véhicule : l'autonomie domine, le reste est en second plan. Pas de boîte, un filet
 * fort en tête ; aucune silhouette (elle se répéterait 47 fois sans rien apprendre).
 * Aucune donnée n'est inventée : une valeur absente s'affiche « — » (lue « Non disponible »).
 * Mobile : mise en page compacte (autonomie à gauche, identité et cotes à droite).
 * Toute la fiche est cliquable via un vrai lien HTML (lien étiré) ; l'anneau de focus entoure
 * la fiche entière. Server Component (aussi rendu dans l'explorateur client).
 */
export function VehicleCard({ vehicle: v, href }: { vehicle: Vehicle; href?: string }) {
  return (
    <article className="group relative grid grid-cols-[6.75rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-t-2 border-ink bg-surface px-4 pb-4 pt-3.5 transition-colors duration-200 hover:border-signal-deep sm:block sm:px-5 sm:pb-5 sm:pt-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-signal-deep">
      <div className="col-start-2 row-start-1 min-w-0">
        <p className="flex items-baseline justify-between gap-3">
          <span className="eyebrow truncate text-signal-deep">{v.brand}</span>
          <span className="label hidden sm:inline">{bodyTypeLabels[v.bodyType]}</span>
        </p>
        <h3 className="mt-1.5 text-h3 font-bold text-ink">
          <Link
            href={href ?? vehicleHref(v)}
            aria-label={vehicleTitle(v)}
            className="link-h after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:[background-size:100%_2px]"
          >
            {v.model}
          </Link>
        </h3>
        <p className="mt-0.5 truncate text-sm text-muted">{v.version}</p>
      </div>

      <div className="col-start-1 row-span-2 row-start-1 sm:mt-5">
        <p className="num text-data-lg font-bold text-ink">
          {formatNumber(v.rangeWltp)}
          <span className="unit">km</span>
        </p>
        <p className="label mt-2">
          <span className="sm:hidden">WLTP</span>
          <span className="hidden sm:inline">Autonomie WLTP</span>
        </p>
        <RangeBar value={v.rangeWltp} decorative className="mt-2.5" />
      </div>

      <dl className="col-start-2 row-start-2 grid grid-cols-2 gap-x-4 sm:mt-5 sm:flex sm:justify-between sm:gap-x-4 sm:border-t sm:border-line sm:pt-4">
        <Spec label="Batterie" value={formatNumber(v.batteryUsable, 1)} unit="kWh" />
        <Spec label="DC max" value={v.chargingDC === null ? null : formatNumber(v.chargingDC)} unit="kW" />
        <Spec
          label="Conso."
          value={formatNumber(batteryConsumption100(v), 1)}
          unit="kWh/100 km"
          className="hidden sm:block"
        />
      </dl>

      <p aria-hidden className="mt-4 hidden items-center justify-between text-sm sm:flex">
        <span className="text-muted">
          {v.chargingTime10to80 !== null ? (
            <>
              10 → 80 % <span className="num font-semibold text-body">{formatNumber(v.chargingTime10to80)} min</span>
            </>
          ) : null}
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-signal-deep">
          Fiche
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </span>
      </p>
    </article>
  );
}
