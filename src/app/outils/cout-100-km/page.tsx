import { ToolPageShell, Prose } from "@/components/calculators/ToolPageShell";
import { CostPer100Calculator } from "@/components/calculators/CostPer100Calculator";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/data/tools";

const tool = getTool("cout-100-km")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: tool.href,
});

export default function Page() {
  return (
    <ToolPageShell
      title={tool.title}
      description="Comparez le coût énergétique aux 100 km entre électrique, essence, diesel et hybride, et estimez le coût annuel."
      calculator={<CostPer100Calculator />}
      relatedTools={["/outils/essence-vs-electrique", "/outils/tco-voiture-electrique"]}
      explanation={
        <Prose>
          <h2>Comment comparer honnêtement ?</h2>
          <p>
            Ce calculateur compare uniquement le <strong>coût de l&apos;énergie</strong>{" "}
            aux 100 km. Il ne prend pas en compte l&apos;achat, l&apos;entretien,
            l&apos;assurance ou la dépréciation.
          </p>
          <p>
            Pour une comparaison complète, utilisez le comparateur essence vs
            électrique ou le calculateur de TCO.
          </p>
          <h2>Coût aux 100 km</h2>
          <ul>
            <li>Électrique&nbsp;: consommation (kWh/100) × prix du kWh</li>
            <li>Thermique&nbsp;: consommation (L/100) × prix du litre</li>
          </ul>
        </Prose>
      }
      faq={[
        {
          question: "L'électrique est-il toujours moins cher aux 100 km ?",
          answer:
            "En coût énergétique, l'électrique rechargé à domicile est généralement bien plus économique. Le résultat dépend toutefois des prix de l'énergie que vous saisissez.",
        },
      ]}
    />
  );
}
