import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { TripPlanner } from "@/components/calculators/TripPlanner";
import { getVehiclePresets } from "@/lib/vehicle-presets";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;
export const metadata = toolMetadata("trajet-longue-distance");

export default async function Page() {
  const presets = await getVehiclePresets();
  return <ToolPageShell slug="trajet-longue-distance" calculator={<TripPlanner presets={presets} />} />;
}
