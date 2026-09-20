import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getBrands, getVehiclesByBrand } from "@/data/vehicles";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getBrands().map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const list = getVehiclesByBrand(brand);
  if (!list.length) return {};
  const name = list[0].brand;
  return buildMetadata({
    title: `Voitures électriques ${name}`,
    description: `Découvrez les modèles électriques ${name} : autonomie, batterie, recharge et prix (données d'exemple).`,
    path: `/voitures-electriques/${brand}`,
  });
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const list = getVehiclesByBrand(brand);
  if (!list.length) notFound();
  const name = list[0].brand;

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
        title={`Voitures électriques ${name}`}
        description={`Les modèles électriques ${name} référencés (données d'exemple).`}
      />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </Container>
  );
}
