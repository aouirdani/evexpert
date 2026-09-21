import { ToolPageShell, toolMetadata } from "@/components/calculators/ToolPageShell";
import { EvVsPetrolCalculator } from "@/components/calculators/EvVsPetrolCalculator";

export const metadata = toolMetadata("essence-vs-electrique");

export default function Page() {
  return <ToolPageShell slug="essence-vs-electrique" calculator={<EvVsPetrolCalculator />} />;
}
