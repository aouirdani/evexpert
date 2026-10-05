import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Kicker } from "@/components/layout/Section";
import { ArrowLink } from "@/components/ui/primitives";
import { JsonLd } from "@/components/ui/JsonLd";
import { DataFigure } from "@/components/ui/DataFigure";
import { DataLegend } from "@/components/ui/DataBadge";
import { VehicleExplorer } from "@/components/vehicles/VehicleExplorer";
import { getAllVehicles, getBrands, getModels } from "@/data/catalog";
import { versionsOf } from "@/data/catalog/selectors";
import { vehicleHref } from "@/lib/vehicle-utils";
import { toExplorerVehicle } from "@/lib/vehicle-lite";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { formatNumber } from "@/lib/format";
import { bodyTypeLabels } from "@/lib/vehicle-format";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

/**
 * generateMetadata (pas un export statique) : le nombre de versions vient du catalogue,
 * jamais en dur — il doit rester exact si le catalogue change sans que quelqu'un se souvienne
 * de mettre à jour ce texte à la main.
 */
export async function generateMetadata(): Promise<Metadata> {
  const count = (await getAllVehicles()).length;
  return buildMetadata({
    title: "Liste des voitures électriques par autonomie",
    description: `${count} versions de voitures électriques, triables par autonomie WLTP, avec batterie, puissance de recharge, source et date de relevé pour chaque fiche.`,
    path: "/voitures-electriques",
  });
}

export default async function VehiclesPage() {
  const all = await getAllVehicles();
  const vehicles = all.map((v) => ({
    ...v,
    href: vehicleHref(v, versionsOf(all, v.brandSlug, v.modelSlug).length > 1 ? "version" : "model"),
  }));
  const brands = await getBrands();
  const models = await getModels();
  const ranges = vehicles.map((v) => v.rangeWltp);
  const batteries = vehicles.map((v) => v.batteryUsable);
  const bodyCounts = Object.entries(
    vehicles.reduce<Record<string, number>>((acc, v) => {
      const label = bodyTypeLabels[v.bodyType];
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const dcCapable = vehicles.filter((v) => v.chargingDC !== null).length;
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Voitures électriques", href: "/voitures-electriques" }]} />

      <header className="grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Kicker>Base de véhicules</Kicker>
          <h1 className="balance mt-4 text-h1 font-bold text-ink">
            Voitures électriques : autonomie, recharge et fiches techniques
          </h1>
          <p className="pretty mt-5 max-w-2xl text-dek text-body">
            Chaque fiche indique sa source et sa date de relevé, et distingue données sourcées, calculs et estimations.
            Triable par autonomie WLTP — le classement par défaut —, coût aux 100 km calculé, puissance DC ou capacité de batterie.
          </p>
          <div className="mt-5">
            <ArrowLink href="/voitures-electriques/trouver">Vous ne savez pas par où commencer ? Trouver ma voiture</ArrowLink>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-x-6 border-t-2 border-ink pt-4 lg:col-span-4">
          <DataFigure label="Versions" value={String(vehicles.length)} size="lg" />
          <DataFigure label="Modèles" value={String(models.length)} size="lg" />
          <DataFigure label="Marques" value={String(brands.length)} size="lg" />
        </dl>
      </header>

      <nav aria-label="Marques" className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-line pt-4">
        <span className="label mr-1">Marques</span>
        {brands.map((b) => (
          <Link key={b.slug} href={`/voitures-electriques/${b.slug}`} className="link-u text-sm font-medium text-ink">
            {b.name} <span className="num text-muted">{b.count}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-10">
        <VehicleExplorer vehicles={vehicles.map(toExplorerVehicle)} />
      </div>

      <section className="mt-section grid gap-x-12 gap-y-6 lg:grid-cols-12" aria-labelledby="couverture">
        <div className="lg:col-span-4">
          <h2 id="couverture" className="text-h2 font-bold text-ink">Ce que couvre le catalogue</h2>
          <p className="label mt-3">
            Autonomie de {formatNumber(Math.min(...ranges))} à {formatNumber(Math.max(...ranges))} km WLTP
          </p>
        </div>
        <div className="lg:col-span-8">
          <p className="pretty max-w-2xl text-body">
            {bodyCounts.length} carrosseries sont représentées : {bodyCounts.map(([label, count], i) => (
              <span key={label}>
                {i > 0 && (i === bodyCounts.length - 1 ? " et " : ", ")}
                {label.toLowerCase()} ({count})
              </span>
            ))}. La batterie utile s&apos;étend de {formatNumber(Math.min(...batteries), 1)} à {formatNumber(Math.max(...batteries), 1)}&nbsp;kWh selon la version,
            et {dcCapable} versions sur {vehicles.length} publient une puissance de charge rapide DC.
          </p>
          <p className="pretty mt-4 max-w-2xl text-body">
            Les caractéristiques techniques proviennent de la base spécialisée EV Database. Les coûts et temps de recharge sont des calculs EVExpert dont les hypothèses sont modifiables dans les{" "}
            <Link href="/outils" className="link-u font-medium text-signal-deep">outils</Link> ; le détail figure sur la page{" "}
            <Link href="/methodologie" className="link-u font-medium text-signal-deep">Méthodologie</Link>.
          </p>
          <DataLegend className="mt-6" />
        </div>
      </section>

      <JsonLd
        data={itemListJsonLd(
          "Voitures électriques",
          models.map((m) => ({ name: `${m.brand} ${m.model}`, href: vehicleHref(m) })),
        )}
      />
    </Container>
  );
}
