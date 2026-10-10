import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { VehicleCardData } from "@/lib/vehicle-lite";
import { vehicleTitle } from "@/lib/vehicle-utils";
import { batteryConsumption100 } from "@/lib/vehicle-calcs";
import { bodyTypeLabels } from "@/lib/vehicle-format";
import { formatNumber } from "@/lib/format";
import { cx } from "@/lib/cx";
import { RangeBar } from "./RangeBar";
import { GarageToggle } from "@/components/garage/GarageToggle";
import { DataBadge } from "@/components/ui/DataBadge";
import { catalogueStyles as styles } from "./catalogueStyles";

function Spec({
  label,
  value,
  unit,
  className,
  catalogue = false,
  calculated = false,
}: {
  label: string;
  value: string | null;
  unit: string;
  className?: string;
  catalogue?: boolean;
  calculated?: boolean;
}) {
  return (
    <div className={cx("min-w-0", className)}>
      <dt className="label whitespace-nowrap">
        {label}
        {catalogue && calculated && <span data-ui-provenance><DataBadge type="calculated" className="font-sans normal-case" /></span>}
      </dt>
      <dd className="num mt-1 text-lg font-semibold text-ink sm:text-data-md">
        {value === null ? (
          <>
            <span aria-hidden className="text-muted">—</span>
            <span className="sr-only">Non disponible</span>
          </>
        ) : (
          <>
            {value}
            <span className={cx("unit sm:hidden", catalogue && styles.inlineUnit)}>{unit}</span>
            <span className={cx("mt-0.5 hidden whitespace-nowrap text-xs font-normal text-muted sm:block", catalogue && styles.separateUnit)}>{unit}</span>
          </>
        )}
      </dd>
    </div>
  );
}

/**
 * Fiche véhicule : l’autonomie domine, le reste est en second plan. Le défaut conserve
 * son filet fort en tête ; la variante catalogue ajoute une surface bordée explicite.
 * Aucune silhouette répétée sans information supplémentaire.
 * Aucune donnée n'est inventée : une valeur absente s'affiche « — » (lue « Non disponible »).
 * Le défaut compact est conservé sur l’accueil. La présentation catalogue est explicite,
 * avec identité complète, métriques et provenance du calcul visibles à toutes les largeurs.
 * Toute la fiche est cliquable via un vrai lien HTML (lien étiré) ; l'anneau de focus entoure
 * la fiche entière. Server Component (aussi rendu dans l'explorateur client).
 */
export function VehicleCard({ vehicle: v, href, presentation }: { vehicle: VehicleCardData; href: string; presentation?: "catalogue" }) {
  const catalogue = presentation === "catalogue";
  return (
    <article className={cx("group relative grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-5 gap-y-4 border-t-2 border-ink bg-surface px-5 pb-5 pt-4 transition-colors duration-200 hover:border-signal-deep min-[375px]:grid-cols-[6.75rem_minmax(0,1fr)] sm:block sm:px-6 sm:pb-6 sm:pt-5 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-signal-deep", catalogue && styles.card)}>
      <GarageToggle id={v.id} className="absolute right-5 top-4 z-10 sm:right-6 sm:top-5" />
      <div className={cx("col-start-2 row-start-1 min-w-0", catalogue && styles.identity)}>
        <p className="flex min-h-11 items-baseline justify-between gap-3 pr-12 sm:min-h-0">
          <span className="eyebrow min-w-0 text-signal-deep [overflow-wrap:anywhere]">{v.brand}</span>
          <span className="label hidden sm:inline">{bodyTypeLabels[v.bodyType]}</span>
        </p>
        <h3 className="mt-1.5 text-h3 font-bold text-ink sm:pr-12">
          <Link
            href={href}
            aria-label={vehicleTitle(v)}
            className="link-h after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:[background-size:100%_2px]"
          >
            {v.model}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-muted [overflow-wrap:anywhere]">{v.version}</p>
      </div>

      <div className={cx("col-start-1 row-start-1 min-[375px]:row-span-2 sm:mt-5", catalogue && styles.range)}>
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

      <dl className={cx("col-span-2 col-start-1 row-start-2 grid grid-cols-2 gap-x-4 min-[375px]:col-span-1 min-[375px]:col-start-2 sm:mt-5 sm:flex sm:justify-between sm:gap-x-4 sm:border-t sm:border-line sm:pt-4", catalogue && styles.specs)}>
        <Spec catalogue={catalogue} label="Batterie" value={formatNumber(v.batteryUsable, 1)} unit="kWh" />
        <Spec catalogue={catalogue} label="DC max" value={v.chargingDC === null ? null : formatNumber(v.chargingDC)} unit="kW" />
        <Spec
          catalogue={catalogue}
          calculated
          label="Conso."
          value={formatNumber(batteryConsumption100(v), 1)}
          unit="kWh/100 km"
          className={cx("hidden sm:block", catalogue && styles.computedSpec)}
        />
      </dl>

      <p aria-hidden className={cx("mt-4 hidden items-center justify-between text-sm sm:flex", catalogue && styles.footer)}>
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
