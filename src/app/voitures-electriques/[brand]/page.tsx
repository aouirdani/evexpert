import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getBrands, getModels, getVehiclesByBrand, vehicleHref } from "@/data/vehicles";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";

type Params = { brand: string };

export function generateStaticParams() {
  return getBrands().map((b) => ({ brand: b.slug }));
}

function modelsOf(brand: string) {
  return getModels().filter((m) => m.brandSlug === brand);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { brand } = await params;
  const list = getVehiclesByBrand(brand);
  if (!list.length) return {};
  const name = list[0].brand;
  const models = modelsOf(brand);
  // Une marque avec un seul modèle n'apporte rien de plus que la fiche modèle.
  const indexable = models.length >= 2;
  return buildMetadata({
    title: `${name} électriques : modèles, autonomie et recharge`,
    description: `Les ${name} électriques de notre base : ${models.map((m) => m.model).join(", ")}. Autonomie WLTP, batterie et puissance de recharge comparées.`,
    path: `/voitures-electriques/${brand}`,
    noindex: !indexable,
  });
}

export default async function BrandPage({ params }: { params: Promise<Params> }) {
  const { brand } = await params;
  const list = getVehiclesByBrand(brand);
  if (!list.length) notFound();
  const name = list[0].brand;
  const models = modelsOf(brand);
  const ranges = list.map((v) => v.rangeWltp);
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Voitures électriques", href: "/voitures-electriques" },
          { name, href: `/voitures-electriques/${brand}` },
        ]}
      />
      <PageHeader
        eyebrow="Marque"
        title={`${name} électriques : modèles, autonomie et recharge`}
        description={`${models.length} modèle${models.length > 1 ? "s" : ""} et ${list.length} version${list.length > 1 ? "s" : ""} dans notre base. Autonomie WLTP de ${formatNumber(Math.min(...ranges))} à ${formatNumber(Math.max(...ranges))} km selon la source.`}
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <VehicleCard key={v.id} vehicle={v} href={vehicleHref(v, list.filter((x) => x.modelSlug === v.modelSlug).length > 1 ? "version" : "model")} />
        ))}
      </div>
      <JsonLd
        data={itemListJsonLd(
          `${name} électriques`,
          models.map((m) => ({ name: `${m.brand} ${m.model}`, href: vehicleHref(m) })),
        )}
      />
    </Container>
  );
}
