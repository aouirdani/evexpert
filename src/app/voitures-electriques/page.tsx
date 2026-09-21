import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { DataLegend } from "@/components/ui/DataBadge";
import { VehicleExplorer } from "@/components/vehicles/VehicleExplorer";
import { getAllVehicles, getBrands, getModels } from "@/data/catalog";
import { versionsOf } from "@/data/catalog/selectors";
import { vehicleHref } from "@/lib/vehicle-utils";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Voitures électriques : autonomie, recharge et fiches techniques",
  description:
    "Base de voitures électriques vendues en France : autonomie WLTP, batterie, puissance de recharge et coût aux 100 km, avec source et date de relevé pour chaque fiche.",
  path: "/voitures-electriques",
});

export default async function VehiclesPage() {
  const all = await getAllVehicles();
  const vehicles = all.map((v) => ({
    ...v,
    href: vehicleHref(v, versionsOf(all, v.brandSlug, v.modelSlug).length > 1 ? "version" : "model"),
  }));
  const brands = await getBrands();
  const models = await getModels();
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Voitures électriques", href: "/voitures-electriques" }]} />
      <PageHeader
        eyebrow="Base de véhicules"
        title="Voitures électriques : autonomie, recharge et fiches techniques"
        description={`${models.length} modèles et ${vehicles.length} versions de ${brands.length} marques. Chaque fiche indique sa source, sa date de relevé et distingue données sourcées, calculs et estimations.`}
      />

      <nav aria-label="Marques" className="mt-6 flex flex-wrap gap-2">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/voitures-electriques/${b.slug}`}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:border-emerald-500 hover:text-emerald-800"
          >
            {b.name} <span className="text-slate-600">({b.count})</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8">
        <VehicleExplorer vehicles={vehicles} />
      </div>

      <section className="mt-16" aria-labelledby="lire-fiches">
        <h2 id="lire-fiches" className="text-2xl font-bold text-slate-900">Comment lire les fiches</h2>
        <p className="mt-2 max-w-3xl text-slate-700">
          Les caractéristiques techniques proviennent de la base spécialisée EV Database, sans complément manuel : une donnée absente est affichée « Non disponible ».
          Le prix en France n&apos;est pas encore collecté. Les coûts et temps de recharge sont des calculs EVExpert dont les hypothèses sont modifiables dans les{" "}
          <Link href="/outils" className="font-medium text-emerald-800 underline">outils</Link> ; le détail figure sur la page{" "}
          <Link href="/methodologie" className="font-medium text-emerald-800 underline">Méthodologie</Link>.
        </p>
        <DataLegend className="mt-5" />
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
