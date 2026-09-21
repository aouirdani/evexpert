import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { VehicleDetail } from "@/components/vehicles/VehicleDetail";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { getAllVehicles, getSimilarVehicles, getVehicleBySlug, isVersionPageIndexable } from "@/data/catalog";
import { modelTitle, vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { buildMetadata } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

type Params = { brand: string; model: string; version: string };

export async function generateStaticParams() {
  return (await getAllVehicles()).map((v) => ({
    brand: v.brandSlug,
    model: v.modelSlug,
    version: v.versionSlug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { brand, model, version } = await params;
  const v = await getVehicleBySlug(brand, model, version);
  if (!v) return {};
  // Un modèle à version unique : cette page dupliquerait la page modèle.
  // Elle reste accessible mais pointe vers la page modèle et n'est pas indexée.
  const indexable = await isVersionPageIndexable(v);
  const base = buildMetadata({
    title: `${vehicleTitle(v)} : autonomie, recharge et caractéristiques`,
    description: `Fiche ${vehicleTitle(v)} : ${v.rangeWltp} km WLTP, batterie ${v.batteryUsable} kWh utiles, recharge AC ${v.chargingAC} kW${v.chargingDC ? `, DC ${v.chargingDC} kW` : ""}. Coûts et temps de recharge calculés.`,
    path: indexable ? vehicleHref(v, "version") : vehicleHref(v, "model"),
    noindex: !indexable,
  });
  return base;
}

export default async function VersionPage({ params }: { params: Promise<Params> }) {
  const { brand, model, version } = await params;
  const v = await getVehicleBySlug(brand, model, version);
  if (!v) notFound();
  const similar = await getSimilarVehicles(v, 3);
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Voitures électriques", href: "/voitures-electriques" },
          { name: v.brand, href: vehicleHref(v, "brand") },
          { name: v.model, href: vehicleHref(v, "model") },
          { name: v.version, href: vehicleHref(v, "version") },
        ]}
      />
      <PageHeader
        eyebrow={modelTitle(v)}
        title={`${vehicleTitle(v)} : autonomie, recharge et caractéristiques`}
      />
      <div className="mt-3">
        <LastUpdated date={v.source.lastUpdated} label="Données relevées le" />
      </div>
      <div className="mt-8">
        <VehicleDetail vehicle={v} similar={similar} />
      </div>
    </Container>
  );
}
