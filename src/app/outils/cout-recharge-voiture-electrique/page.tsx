import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { ChargingCostCalculator } from "@/components/calculators/ChargingCostCalculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;
export const metadata = toolMetadata("cout-recharge-voiture-electrique");

export default async function Page() {
  const presets = await getVehiclePresets();
  return <ToolPageShell slug="cout-recharge-voiture-electrique" calculator={<ChargingCostCalculator presets={presets} />} />;
}
