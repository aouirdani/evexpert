import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { ChargingTimeCalculator } from "@/components/calculators/ChargingTimeCalculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;
export const metadata = toolMetadata("temps-recharge");

export default async function Page() {
  const presets = await getVehiclePresets();
  return <ToolPageShell slug="temps-recharge" calculator={<ChargingTimeCalculator presets={presets} />} />;
}
