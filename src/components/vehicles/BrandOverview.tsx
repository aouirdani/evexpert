import Link from "next/link";
import type { Vehicle } from "@/types";
import { vehicleHref } from "@/lib/vehicle-utils";
import { fmt } from "@/lib/vehicle-format";
import { batteryConsumption100 } from "@/lib/vehicle-calcs";
import { formatNumber } from "@/lib/format";
import { DataBadge } from "@/components/ui/DataBadge";
import { DataFigure } from "@/components/ui/DataFigure";
import { SourceLine } from "@/components/ui/SourceBadge";
import { RelatedTools } from "@/components/related";
import { bodyTypeLabels } from "@/lib/vehicle-format";
import { BRAND_CONTENT } from "@/data/catalog/brand-content";
import type { getFeaturedComparisons } from "@/lib/comparison";

const th = "label whitespace-nowrap pb-3 pr-5 text-left font-semibold";
const driveLabel = { FWD: "traction avant", RWD: "propulsion", AWD: "transmission intégrale" } as const;

/**
 * Contenu enrichi d'une page marque (lot SEO 2), pour les marques à au moins 2 modèles. Titre,
 * meta et H1 de la page restent inchangés (gérés par `page.tsx`) : ce composant n'ajoute que du
 * contenu de corps de page et des liens internes.
 */
export function BrandOverview({
  brandSlug,
  vehicles,
  comparisons,
}: {
  brandSlug: string;
  vehicles: Vehicle[];
  comparisons: Awaited<ReturnType<typeof getFeaturedComparisons>>;
}) {
  const content = BRAND_CONTENT[brandSlug];
  const first = vehicles[0];
  const ranges = vehicles.map((v) => v.rangeWltp);
  const minRange = Math.min(...ranges);
  const maxRange = Math.max(...ranges);
  const modelCount = new Set(vehicles.map((v) => v.modelSlug)).size;
  const brandComparisons = comparisons.filter((c) => c.vehicles.some((v) => v.brandSlug === brandSlug));
  const usage = content?.usage(vehicles);
  const bodySet = [...new Set(vehicles.map((v) => bodyTypeLabels[v.bodyType]))];
  const driveSet = [...new Set(vehicles.map((v) => v.drive))];
  const batteries = vehicles.map((v) => v.batteryUsable);
  const battSpread = Math.max(...batteries) - Math.min(...batteries);

  return (
    <div>
      {content && <p id="brand-intro" className="pretty mt-8 max-w-3xl text-body">{content.intro(vehicles)}</p>}

      <dl className="mt-8 grid grid-cols-3 gap-x-8 gap-y-6 border-t-2 border-ink pt-6">
        <DataFigure label="Modèles" value={String(modelCount)} />
        <DataFigure label="Versions" value={String(vehicles.length)} />
        <DataFigure label="Écart d'autonomie WLTP" value={formatNumber(maxRange - minRange)} unit="km" />
      </dl>
      <p className="mt-4 text-sm text-muted">
        Ce qui distingue les versions : {bodySet.length > 1 ? `${bodySet.length} carrosseries (${bodySet.join(", ")})` : `une seule carrosserie (${bodySet[0]})`}
        {" · "}
        {driveSet.length > 1 ? `transmissions ${driveSet.map((d) => driveLabel[d]).join(" et ")}` : `toutes en ${driveLabel[driveSet[0]]}`}
        {" · "}écart de batterie utile de <span className="num font-semibold text-ink">{formatNumber(battSpread, 1)} kWh</span> entre la version la moins et la plus pourvue.
      </p>

      <section className="mt-section" aria-labelledby="versions-titre">
        <h2 id="versions-titre" className="text-h2 font-bold text-ink">Les versions {first.brand}</h2>
        <div className="relative mt-6 overflow-x-auto">
          <table className="w-full min-w-[50rem] text-left">
            <caption className="sr-only">Comparaison des versions {first.brand}</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Modèle</th>
                <th scope="col" className={th}>Carrosserie</th>
                <th scope="col" className={th}>Autonomie WLTP</th>
                <th scope="col" className={`${th} text-right`}>Batterie utile</th>
                <th scope="col" className={`${th} text-right`}>Charge DC max</th>
                <th scope="col" className={`${th} text-right`}>10 → 80 %</th>
                <th scope="col" className={`${th} text-right`}>Consommation calculée</th>
              </tr>
            </thead>
            <tbody className="border-t-2 border-ink">
              {vehicles.map((v) => {
                const sameModelCount = vehicles.filter((x) => x.modelSlug === v.modelSlug).length;
                return (
                  <tr key={v.id} className="border-t border-line first:border-t-0 hover:bg-surface">
                    <th scope="row" className="py-4 pr-5 text-left align-middle font-normal">
                      <Link href={vehicleHref(v, sameModelCount > 1 ? "version" : "model")} className="link-h text-base font-bold text-ink">
                        {v.model}
                      </Link>
                      <span className="block text-caption text-muted">{v.version}</span>
                    </th>
                    <td className="py-4 pr-5 align-middle text-sm text-muted">{bodyTypeLabels[v.bodyType]}</td>
                    <td className="num py-4 pr-5 align-middle text-base font-semibold text-ink">{fmt(v.rangeWltp, "km")}</td>
                    <td className="num py-4 pr-5 text-right align-middle text-base font-semibold text-ink">{fmt(v.batteryUsable, "kWh", 1)}</td>
                    <td className="num py-4 pr-5 text-right align-middle text-base font-semibold text-ink">{fmt(v.chargingDC, "kW")}</td>
                    <td className="num py-4 pr-5 text-right align-middle text-base font-semibold text-ink">{fmt(v.chargingTime10to80, "min")}</td>
                    <td className="num py-4 pr-5 text-right align-middle text-base font-semibold text-ink">
                      {formatNumber(batteryConsumption100(v), 1)}
                      <span className="unit">kWh/100 km</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-caption text-muted">
          <DataBadge type={first.source.dataType} /> autres colonnes ·<DataBadge type="calculated" /> consommation calculée (capacité utile ÷ autonomie WLTP × 100).
        </p>
      </section>

      {usage && (
        <section className="mt-section" aria-labelledby="usage-titre">
          <h2 id="usage-titre" className="text-h2 font-bold text-ink">Pour quel usage ?</h2>
          {usage.points && (
            <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {usage.points.map((p) => (
                <div key={p.usage} className="border-t-2 border-ink pt-4">
                  <dt className="text-sm font-bold text-ink">{p.usage}</dt>
                  <dd className="pretty mt-2 text-sm text-body">{p.text}</dd>
                </div>
              ))}
            </dl>
          )}
          {usage.note && <p className="pretty mt-4 max-w-3xl text-sm text-muted">{usage.note}</p>}
          <p className="mt-4 text-sm text-muted">
            Pour aller plus loin :{" "}
            <Link href="/guides/choisir-voiture-electrique-selon-usage" className="link-u font-semibold text-signal-deep">
              comment choisir une voiture électrique selon son usage
            </Link>
            .
          </p>
        </section>
      )}

      {brandComparisons.length > 0 && (
        <section className="mt-section" aria-labelledby="duels-titre">
          <h2 id="duels-titre" className="text-h2 font-bold text-ink">Duels du comparateur</h2>
          <ul className="mt-6 border-t-2 border-ink">
            {brandComparisons.map((c) => (
              <li key={c.slug} className="border-b border-line py-4">
                <Link href={`/comparer/${c.slug}`} className="link-h text-base font-bold text-ink">
                  {c.vehicles[0].brand} {c.vehicles[0].model} vs {c.vehicles[1].brand} {c.vehicles[1].model}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-section">
        <RelatedTools hrefs={["/outils/autonomie-voiture-electrique", "/outils/cout-recharge-voiture-electrique", "/outils/cout-100-km", "/outils/temps-recharge"]} />
      </div>

      <section className="mt-section" aria-labelledby="sources-titre">
        <h2 id="sources-titre" className="text-h2 font-bold text-ink">Sources des données</h2>
        <ul className="mt-6 border-t-2 border-ink">
          {[...new Map(vehicles.map((v) => [v.source.url, v.source])).values()].map((s) => (
            <li key={s.url} className="border-b border-line py-4">
              <SourceLine source={s} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
