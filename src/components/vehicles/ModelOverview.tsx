import Link from "next/link";
import type { Vehicle } from "@/types";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { fmt } from "@/lib/vehicle-format";
import { ASSUMPTIONS } from "@/data/assumptions";
import { costPer100km } from "@/lib/vehicle-calcs";
import { formatEuro, formatNumber } from "@/lib/utils";
import { DataBadge } from "@/components/ui/DataBadge";
import { SourceLine } from "@/components/ui/SourceBadge";
import { RelatedGuides, RelatedTools } from "@/components/related";
import { VehicleCard } from "./VehicleCard";

/** Page modèle à plusieurs versions : tableau comparatif des versions. */
export function ModelOverview({ versions, similar }: { versions: Vehicle[]; similar: Vehicle[] }) {
  const first = versions[0];
  return (
    <div>
      <p className="max-w-3xl text-slate-700">
        Le {first.brand} {first.model} est présent dans notre base en {versions.length} versions. Le tableau ci-dessous les compare sur les critères
        principaux ; chaque version dispose de sa fiche complète (coûts de recharge, temps de charge, autonomie estimée par scénario).
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Comparaison des versions du {first.brand} {first.model}</caption>
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Version</th>
              <th scope="col" className="px-4 py-3 font-semibold">Batterie utile</th>
              <th scope="col" className="px-4 py-3 font-semibold">Autonomie WLTP</th>
              <th scope="col" className="px-4 py-3 font-semibold">Charge DC max</th>
              <th scope="col" className="px-4 py-3 font-semibold">10-80 % DC</th>
              <th scope="col" className="px-4 py-3 font-semibold">Puissance</th>
              <th scope="col" className="px-4 py-3 font-semibold">Coût /100 km*</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {versions.map((v) => (
              <tr key={v.id}>
                <th scope="row" className="px-4 py-3 font-semibold">
                  <Link href={vehicleHref(v, "version")} className="text-emerald-800 underline underline-offset-2">
                    {v.version}
                  </Link>
                  <span className="block text-xs font-normal text-slate-600">{v.years}</span>
                </th>
                <td className="tabular px-4 py-3">{fmt(v.batteryUsable, "kWh", 1)}</td>
                <td className="tabular px-4 py-3">{fmt(v.rangeWltp, "km")}</td>
                <td className="tabular px-4 py-3">{fmt(v.chargingDC, "kW")}</td>
                <td className="tabular px-4 py-3">{fmt(v.chargingTime10to80, "min")}</td>
                <td className="tabular px-4 py-3">{fmt(v.powerKw, "kW")}</td>
                <td className="tabular px-4 py-3">{formatEuro(costPer100km(v, ASSUMPTIONS.homePrice), 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <DataBadge type={first.source.dataType} /> caractéristiques ·<DataBadge type="calculated" /> * coût aux 100 km à {formatNumber(ASSUMPTIONS.homePrice, 2)} €/kWh (hypothèse), conditions WLTP.
      </p>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-bold text-slate-900">Sources des données</h2>
        <ul className="mt-3 space-y-2">
          {versions.map((v) => (
            <li key={v.id} className="text-sm">
              <span className="font-medium text-slate-900">{vehicleTitle(v)}</span>
              <div className="mt-1">
                <SourceLine source={v.source} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {similar.length > 0 && (
        <section className="mt-12" aria-labelledby="similaires">
          <h2 id="similaires" className="text-2xl font-bold text-slate-900">Véhicules similaires</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <VehicleCard key={s.id} vehicle={s} />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <RelatedTools hrefs={["/outils/cout-100-km", "/outils/cout-recharge-voiture-electrique", "/outils/autonomie-voiture-electrique"]} />
        <RelatedGuides slugs={["calculer-autonomie-reelle", "batterie-brute-batterie-utile", "choisir-voiture-electrique-selon-usage"]} />
      </div>
    </div>
  );
}
