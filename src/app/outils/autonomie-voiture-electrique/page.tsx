import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { RangeCalculator } from "@/components/calculators/RangeCalculator";
import { getVehiclePresets } from "@/lib/vehicle-presets";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;
export const metadata = toolMetadata("autonomie-voiture-electrique");

export default async function Page() {
  const presets = await getVehiclePresets();
  return <ToolPageShell slug="autonomie-voiture-electrique" calculator={<RangeCalculator presets={presets} />} />;
}
