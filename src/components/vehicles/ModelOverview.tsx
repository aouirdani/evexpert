import Link from "next/link";
import type { Vehicle } from "@/types";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { fmt } from "@/lib/vehicle-format";
import { ASSUMPTIONS } from "@/data/assumptions";
import { costPer100km } from "@/lib/vehicle-calcs";
import { formatEuro, formatNumber } from "@/lib/format";
import { DataBadge } from "@/components/ui/DataBadge";
import { SourceLine } from "@/components/ui/SourceBadge";
import { RelatedGuides, RelatedTools } from "@/components/related";
import { RangeBar } from "./RangeBar";
import { VehicleCard } from "./VehicleCard";
import { GarageToggle } from "@/components/garage/GarageToggle";

const th = "label whitespace-nowrap pb-2.5 pr-5 text-left font-semibold";

/** Page modèle à plusieurs versions : tableau comparatif des versions. */
export function ModelOverview({ versions, similar }: { versions: Vehicle[]; similar: Vehicle[] }) {
  const first = versions[0];
  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left">
          <caption className="sr-only">Comparaison des versions du {first.brand} {first.model}</caption>
          <thead>
            <tr>
              <th scope="col" className={th}>Version</th>
              <th scope="col" className={th}>Autonomie WLTP</th>
              <th scope="col" className={`${th} text-right`}>Batterie utile</th>
              <th scope="col" className={`${th} text-right`}>Charge DC</th>
              <th scope="col" className={`${th} text-right`}>10 → 80 %</th>
              <th scope="col" className={`${th} text-right`}>Puissance</th>
              <th scope="col" className={`${th} text-right`}>Coût /100 km*</th>
              <th scope="col" className={`${th} pl-4 pr-0 text-right`}>
                <span className="sr-only">Sélection</span>
              </th>
            </tr>
          </thead>
          <tbody className="border-t-2 border-ink">
            {versions.map((v) => (
              <tr key={v.id} className="group relative border-t border-line first:border-t-0 hover:bg-surface">
                <th scope="row" className="py-4 pr-5 text-left align-middle font-normal">
                  <Link
                    href={vehicleHref(v, "version")}
                    className="link-h text-base font-bold text-ink after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                  >
                    {v.version}
                  </Link>
                  <span className="block text-caption text-muted">{v.years}</span>
                </th>
                <td className="w-44 py-4 pr-5 align-middle">
                  <span className="num block text-data-md font-bold text-ink">
                    {formatNumber(v.rangeWltp)}
                    <span className="unit">km</span>
                  </span>
                  <RangeBar value={v.rangeWltp} decorative className="mt-1.5" />
                </td>
                <td className="num py-4 pr-5 text-right align-middle font-semibold text-ink">{fmt(v.batteryUsable, "kWh", 1)}</td>
                <td className="num py-4 pr-5 text-right align-middle font-semibold text-ink">{fmt(v.chargingDC, "kW")}</td>
                <td className="num py-4 pr-5 text-right align-middle font-semibold text-ink">{fmt(v.chargingTime10to80, "min")}</td>
                <td className="num py-4 pr-5 text-right align-middle font-semibold text-ink">{fmt(v.powerKw, "kW")}</td>
                <td className="num py-4 pr-5 text-right align-middle font-semibold text-ink">{formatEuro(costPer100km(v, ASSUMPTIONS.homePrice), 2)}</td>
                <td className="relative py-4 pl-4 text-right align-middle">
                  <GarageToggle id={v.id} className="relative" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-caption text-muted">
        <DataBadge type={first.source.dataType} /> caractéristiques ·<DataBadge type="calculated" /> * coût aux 100 km à {formatNumber(ASSUMPTIONS.homePrice, 2)}&nbsp;€/kWh (hypothèse), conditions WLTP.
      </p>

      <section className="mt-section grid gap-x-12 gap-y-6 lg:grid-cols-12" aria-labelledby="sources-titre">
        <div className="lg:col-span-3">
          <h2 id="sources-titre" className="text-2xl font-bold text-ink">Sources des données</h2>
        </div>
        <ul className="border-t-2 border-ink lg:col-span-9">
          {versions.map((v) => (
            <li key={v.id} className="border-b border-line py-4">
              <span className="text-sm font-bold text-ink">{vehicleTitle(v)}</span>
              <div className="mt-1.5">
                <SourceLine source={v.source} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {similar.length > 0 && (
        <section className="mt-section" aria-labelledby="similaires">
          <div className="mb-8 border-t-2 border-ink pt-4">
            <h2 id="similaires" className="text-h2 font-bold text-ink">Véhicules similaires</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <VehicleCard key={s.id} vehicle={s} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-4 grid gap-x-12 md:grid-cols-2">
        <RelatedTools hrefs={["/outils/cout-100-km", "/outils/cout-recharge-voiture-electrique", "/outils/autonomie-voiture-electrique"]} />
        <RelatedGuides slugs={["calculer-autonomie-reelle", "batterie-brute-batterie-utile", "choisir-voiture-electrique-selon-usage"]} />
      </div>
    </div>
  );
}
