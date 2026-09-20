import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { VehicleExplorer } from "@/components/vehicles/VehicleExplorer";
import { DemoNotice } from "@/components/ui/SourceBadge";
import { getAllVehicles } from "@/data/vehicles";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Voitures électriques : base de modèles et fiches",
  description:
    "Explorez les voitures électriques par marque, prix, autonomie, batterie et puissance de recharge. Données d'exemple filtrables et triables.",
  path: "/voitures-electriques",
});

export default function VehiclesPage() {
  const vehicles = getAllVehicles();
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Voitures électriques", href: "/voitures-electriques" }]} />
      <PageHeader
        eyebrow="Base de véhicules"
        title="Voitures électriques"
        description="Filtrez et comparez les modèles selon vos critères. Les caractéristiques affichées sont des données d'exemple."
      />
      <div className="mt-6">
        <DemoNotice />
      </div>
      <div className="mt-8">
        <VehicleExplorer vehicles={vehicles} />
      </div>
    </Container>
  );
}
