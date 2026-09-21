import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { StationPowerCalculator } from "@/components/calculators/StationPowerCalculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";
export const metadata = toolMetadata("puissance-borne-recharge");

export default function Page() {
  return <ToolPageShell slug="puissance-borne-recharge" calculator={<StationPowerCalculator presets={getVehiclePresets()} />} />;
}
