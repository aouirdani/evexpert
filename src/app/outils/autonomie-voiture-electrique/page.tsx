import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { RangeCalculator } from "@/components/calculators/RangeCalculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";
export const metadata = toolMetadata("autonomie-voiture-electrique");

export default function Page() {
  return <ToolPageShell slug="autonomie-voiture-electrique" calculator={<RangeCalculator presets={getVehiclePresets()} />} />;
}
