import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { TcoCalculator } from "@/components/calculators/TcoCalculator";

export const metadata = toolMetadata("tco-voiture-electrique");

export default function Page() {
  return <ToolPageShell slug="tco-voiture-electrique" calculator={<TcoCalculator />} />;
}
