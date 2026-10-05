import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { VehicleDetail } from "@/components/vehicles/VehicleDetail";
import { getAllVehicles, getSimilarVehicles, getVehicleBySlug, isVersionPageIndexable } from "@/data/catalog";
import { modelTitle, vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { buildMetadata } from "@/lib/seo";
import { vehicleTitleText } from "@/lib/seo/titles";
import { modelText } from "@/data/catalog/model-content";

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
    title: vehicleTitleText(v),
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
  const allVehicles = await getAllVehicles();
  const siblings = allVehicles.filter((x) => x.brandSlug === v.brandSlug && x.modelSlug === v.modelSlug);
  // Un modèle à plusieurs versions a déjà ce texte sur sa page modèle (ModelOverview) : l'y
  // répéter dupliquerait un même bloc entre plusieurs pages indexées. Seul un modèle à version
  // unique — dont cette page n'est qu'un doublon noindex de la page modèle — le reprend ici.
  const text = siblings.length === 1 ? modelText(v.brandSlug, v.modelSlug, siblings, allVehicles) : undefined;
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs
        items={[
          { name: "Voitures électriques", href: "/voitures-electriques" },
          { name: v.brand, href: vehicleHref(v, "brand") },
          { name: v.model, href: vehicleHref(v, "model") },
          { name: v.version, href: vehicleHref(v, "version") },
        ]}
      />
      <VehicleDetail
        vehicle={v}
        similar={similar}
        eyebrow={modelTitle(v)}
        title={`${vehicleTitle(v)} : autonomie, recharge et caractéristiques`}
        modelText={text}
      />
    </Container>
  );
}
