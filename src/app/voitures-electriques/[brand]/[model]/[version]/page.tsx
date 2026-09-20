import { notFound } from "next/navigation";
import { VehicleDetail } from "@/components/vehicles/VehicleDetail";
import { getAllVehicles, getVehicle, vehicleTitle } from "@/data/vehicles";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllVehicles().map((v) => ({
    brand: v.brandSlug,
    model: v.modelSlug,
    version: v.versionSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string; model: string; version: string }>;
}) {
  const { brand, model, version } = await params;
  const v = getVehicle(brand, model, version);
  if (!v) return {};
  return buildMetadata({
    title: `${vehicleTitle(v)} : fiche complète`,
    description: `Fiche détaillée ${vehicleTitle(v)} : autonomie, batterie, recharge et estimations de coûts (données d'exemple).`,
    path: `/voitures-electriques/${brand}/${model}/${version}`,
  });
}

export default async function VersionPage({
  params,
}: {
  params: Promise<{ brand: string; model: string; version: string }>;
}) {
  const { brand, model, version } = await params;
  const v = getVehicle(brand, model, version);
  if (!v) notFound();
  return <VehicleDetail vehicle={v} />;
}
