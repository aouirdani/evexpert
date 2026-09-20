import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ComparisonBuilder } from "@/components/comparison/ComparisonBuilder";
import { DemoNotice } from "@/components/ui/SourceBadge";
import { getAllVehicles, vehicleTitle } from "@/data/vehicles";
import { getFeaturedComparisons } from "@/lib/comparison";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Comparer les voitures électriques",
  description:
    "Comparez jusqu'à 4 voitures électriques : prix, batterie, autonomie, recharge, performances et garanties.",
  path: "/comparer",
});

export default function ComparerPage() {
  const vehicles = getAllVehicles();
  const popular = getFeaturedComparisons().map((c) => ({
    slug: c.slug,
    label: `${vehicleTitle(c.vehicles[0]).replace(c.vehicles[0].version, "").trim()} vs ${vehicleTitle(c.vehicles[1]).replace(c.vehicles[1].version, "").trim()}`,
  }));

  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Comparer", href: "/comparer" }]} />
      <PageHeader
        eyebrow="Comparateur"
        title="Comparer les voitures électriques"
        description="Sélectionnez jusqu'à 4 modèles pour comparer leurs caractéristiques côte à côte."
      />
      <div className="mt-6">
        <DemoNotice />
      </div>
      <div className="mt-8">
        <ComparisonBuilder allVehicles={vehicles} popular={popular} />
      </div>
    </Container>
  );
}
