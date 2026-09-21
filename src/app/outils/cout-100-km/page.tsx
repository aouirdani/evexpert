import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { CostPer100Calculator } from "@/components/calculators/CostPer100Calculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;
export const metadata = toolMetadata("cout-100-km");

export default async function Page() {
  const presets = await getVehiclePresets();
  return <ToolPageShell slug="cout-100-km" calculator={<CostPer100Calculator presets={presets} />} />;
}
