import Link from "next/link";
import type { Vehicle } from "@/types";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { bodyTypeLabels } from "@/lib/vehicle-format";
import { formatNumber } from "@/lib/utils";
import { RangeBar } from "./RangeBar";

const dash = (
  <>
    <span aria-hidden className="text-muted">—</span>
    <span className="sr-only">Non disponible</span>
  </>
);

/**
 * Ligne de tableau (vue « Tableau » du catalogue, sélection d'accueil) : une version par ligne,
 * lisible d'un coup d'œil. À placer dans un `<tbody>` ; la première cellule porte le lien étiré.
 */
export function VehicleRow({ vehicle: v, href }: { vehicle: Vehicle; href?: string }) {
  return (
    <tr className="group relative border-t border-line transition-colors duration-150 hover:bg-surface">
      <th scope="row" className="py-3.5 pr-4 text-left align-middle font-normal">
        <span className="eyebrow block text-signal-deep">{v.brand}</span>
        <Link
          href={href ?? vehicleHref(v)}
          aria-label={vehicleTitle(v)}
          className="link-u mt-0.5 inline text-base font-bold text-ink after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:[background-size:100%_2px,100%_1px]"
        >
          {v.model}
        </Link>
        <span className="ml-2 text-sm text-muted">{v.version}</span>
      </th>
      <td className="hidden py-3.5 pr-4 align-middle text-sm text-muted xl:table-cell">{bodyTypeLabels[v.bodyType]}</td>
      <td className="w-44 py-3.5 pr-4 align-middle">
        <span className="num block text-data-md font-bold text-ink">
          {formatNumber(v.rangeWltp)}
          <span className="unit">km</span>
        </span>
        <RangeBar value={v.rangeWltp} decorative className="mt-1.5" />
      </td>
      <td className="num py-3.5 pr-4 text-right align-middle text-base font-semibold text-ink">
        {formatNumber(v.batteryUsable, 1)}
        <span className="unit">kWh</span>
      </td>
      <td className="num py-3.5 pr-4 text-right align-middle text-base font-semibold text-ink xl:pr-4">
        {v.chargingDC === null ? dash : <>{formatNumber(v.chargingDC)}<span className="unit">kW</span></>}
      </td>
      <td className="num hidden py-3.5 text-right align-middle text-base font-semibold text-ink xl:table-cell">
        {v.chargingTime10to80 === null ? dash : <>{formatNumber(v.chargingTime10to80)}<span className="unit">min</span></>}
      </td>
    </tr>
  );
}

/** En-tête de colonnes commun aux tableaux de versions. */
export function VehicleRowsHead() {
  const th = "label whitespace-nowrap pb-2.5 pr-4 text-left font-semibold";
  return (
    <thead>
      <tr>
        <th scope="col" className={th}>Modèle</th>
        <th scope="col" className={`${th} hidden xl:table-cell`}>Carrosserie</th>
        <th scope="col" className={th}>Autonomie WLTP</th>
        <th scope="col" className={`${th} text-right`}>Batterie utile</th>
        <th scope="col" className={`${th} text-right`}>Charge DC</th>
        <th scope="col" className={`${th} hidden pr-0 text-right xl:table-cell`}>10 → 80 %</th>
      </tr>
    </thead>
  );
}
