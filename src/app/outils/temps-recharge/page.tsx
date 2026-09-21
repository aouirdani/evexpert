import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { ChargingTimeCalculator } from "@/components/calculators/ChargingTimeCalculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";
export const metadata = toolMetadata("temps-recharge");

export default function Page() {
  return <ToolPageShell slug="temps-recharge" calculator={<ChargingTimeCalculator presets={getVehiclePresets()} />} />;
}
