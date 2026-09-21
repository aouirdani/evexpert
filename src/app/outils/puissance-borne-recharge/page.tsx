import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { StationPowerCalculator } from "@/components/calculators/StationPowerCalculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;
export const metadata = toolMetadata("puissance-borne-recharge");

export default async function Page() {
  const presets = await getVehiclePresets();
  return <ToolPageShell slug="puissance-borne-recharge" calculator={<StationPowerCalculator presets={presets} />} />;
}
