import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Kicker } from "@/components/layout/Section";
import { VehicleFinder } from "@/components/finder/VehicleFinder";
import { getAllVehicles } from "@/data/catalog";
import { versionsOf } from "@/data/catalog/selectors";
import { vehicleHref } from "@/lib/vehicle-utils";
import { buildMetadata } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Trouver la voiture électrique adaptée à votre usage",
  description:
    "Répondez à quelques questions sur votre usage : EVExpert indique, pour chaque modèle, les critères objectifs remplis. Aucun classement, aucun critère de budget.",
  path: "/voitures-electriques/trouver",
});

export default async function FinderPage() {
  const all = await getAllVehicles();
  const vehicles = all.map((v) => ({
    ...v,
    href: vehicleHref(v, versionsOf(all, v.brandSlug, v.modelSlug).length > 1 ? "version" : "model"),
  }));
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs
        items={[
          { name: "Voitures électriques", href: "/voitures-electriques" },
          { name: "Trouver ma voiture", href: "/voitures-electriques/trouver" },
        ]}
      />
      <Kicker>Trouver ma voiture</Kicker>
      <h1 className="balance mt-4 max-w-3xl text-h1 font-bold text-ink">
        Quelle voiture électrique correspond à votre usage&nbsp;?
      </h1>
      <p className="pretty mt-5 max-w-2xl text-dek text-body">
        Six questions sur votre trajet quotidien, vos longs trajets et vos besoins. Pour chaque modèle, nous indiquons
        les critères objectifs remplis — jamais un classement ni une note globale. Le budget n&apos;est pas un
        critère&nbsp;: aucune source française de prix n&apos;est encore disponible.
      </p>

      <div className="mt-12">
        <VehicleFinder vehicles={vehicles} />
      </div>
    </Container>
  );
}
