import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { ChargingCostCalculator } from "@/components/calculators/ChargingCostCalculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";
export const metadata = toolMetadata("cout-recharge-voiture-electrique");

export default function Page() {
  return <ToolPageShell slug="cout-recharge-voiture-electrique" calculator={<ChargingCostCalculator presets={getVehiclePresets()} />} />;
}
