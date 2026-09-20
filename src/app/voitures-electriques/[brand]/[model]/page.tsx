import { notFound } from "next/navigation";
import { VehicleDetail } from "@/components/vehicles/VehicleDetail";
import { getAllVehicles, getVehicle, vehicleTitle } from "@/data/vehicles";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllVehicles().map((v) => ({ brand: v.brandSlug, model: v.modelSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = await params;
  const v = getVehicle(brand, model);
  if (!v) return {};
  return buildMetadata({
    title: `${vehicleTitle(v)} : fiche, autonomie, recharge et coûts`,
    description: `Fiche ${vehicleTitle(v)} : autonomie ${v.rangeWltp} km WLTP, batterie ${v.usableBatteryCapacity} kWh, recharge ${v.chargingDC} kW. Estimations de coûts (données d'exemple).`,
    path: `/voitures-electriques/${brand}/${model}`,
  });
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = await params;
  const v = getVehicle(brand, model);
  if (!v) notFound();
  return <VehicleDetail vehicle={v} />;
}
