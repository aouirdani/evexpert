import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { VehicleDetail } from "@/components/vehicles/VehicleDetail";
import { ModelOverview } from "@/components/vehicles/ModelOverview";
import { VehicleHeader } from "@/components/vehicles/VehicleHeader";
import { getModelVersions, getModels, getSimilarVehicles } from "@/data/catalog";
import { modelTitle, vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { buildMetadata } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

type Params = { brand: string; model: string };

export async function generateStaticParams() {
  return (await getModels()).map((v) => ({ brand: v.brandSlug, model: v.modelSlug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { brand, model } = await params;
  const versions = await getModelVersions(brand, model);
  if (!versions.length) return {};
  const v = versions[0];
  if (versions.length === 1) {
    return buildMetadata({
      title: `${modelTitle(v)} ${v.version} : autonomie, recharge et caractéristiques`,
      description: `Fiche ${vehicleTitle(v)} : ${v.rangeWltp} km WLTP, batterie ${v.batteryUsable} kWh utiles, recharge AC ${v.chargingAC} kW${v.chargingDC ? `, DC ${v.chargingDC} kW` : ""}. Coûts et temps de recharge calculés.`,
      path: vehicleHref(v, "model"),
    });
  }
  const minR = Math.min(...versions.map((x) => x.rangeWltp));
  const maxR = Math.max(...versions.map((x) => x.rangeWltp));
  return buildMetadata({
    title: `${modelTitle(v)} : versions, autonomie et recharge comparées`,
    description: `${modelTitle(v)} en ${versions.length} versions : autonomie WLTP de ${minR} à ${maxR} km, puissance de recharge et coût aux 100 km comparés.`,
    path: vehicleHref(v, "model"),
  });
}

export default async function ModelPage({ params }: { params: Promise<Params> }) {
  const { brand, model } = await params;
  const versions = await getModelVersions(brand, model);
  if (!versions.length) notFound();
  const v = versions[0];
  const similar = await getSimilarVehicles(v, 3);
  const single = versions.length === 1;
  const title = single
    ? `${vehicleTitle(v)} : autonomie, recharge et caractéristiques`
    : `${modelTitle(v)} : versions, autonomie et recharge`;
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs
        items={[
          { name: "Voitures électriques", href: "/voitures-electriques" },
          { name: v.brand, href: vehicleHref(v, "brand") },
          { name: v.model, href: vehicleHref(v, "model") },
        ]}
      />
      {single ? (
        <VehicleDetail vehicle={v} similar={similar} eyebrow={v.brand} title={title} />
      ) : (
        <>
          <VehicleHeader
            eyebrow={v.brand}
            title={title}
            source={v.source}
            dek={`Le ${v.brand} ${v.model} est présent dans notre base en ${versions.length} versions. Le tableau les compare sur les critères principaux ; chaque version dispose de sa fiche complète (coûts de recharge, temps de charge, autonomie estimée par scénario).`}
          />
          <div className="mt-12 border-t-2 border-ink pt-8">
            <ModelOverview versions={versions} similar={similar} />
          </div>
        </>
      )}
    </Container>
  );
}
