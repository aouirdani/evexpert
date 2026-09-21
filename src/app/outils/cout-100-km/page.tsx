import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { CostPer100Calculator } from "@/components/calculators/CostPer100Calculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";
export const metadata = toolMetadata("cout-100-km");

export default function Page() {
  return <ToolPageShell slug="cout-100-km" calculator={<CostPer100Calculator presets={getVehiclePresets()} />} />;
}
