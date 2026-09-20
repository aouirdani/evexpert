import { ToolPageShell, Prose } from "@/components/calculators/ToolPageShell";
import { EvVsPetrolCalculator } from "@/components/calculators/EvVsPetrolCalculator";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/data/tools";

const tool = getTool("essence-vs-electrique")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: tool.href,
});

export default function Page() {
  return (
    <ToolPageShell
      title={tool.title}
      description="Comparez le coût annuel, mensuel et pluriannuel d'une voiture électrique et d'une voiture essence."
      calculator={<EvVsPetrolCalculator />}
      relatedTools={["/outils/tco-voiture-electrique", "/outils/cout-100-km"]}
      explanation={
        <Prose>
          <h2>Ce que compare cet outil</h2>
          <p>
            Le calculateur additionne, pour chaque véhicule, le coût de
            l&apos;énergie, l&apos;assurance, l&apos;entretien et une estimation de
            dépréciation annuelle. Le graphique projette le coût cumulé sur 3, 5 et
            8 ans.
          </p>
          <h2>Vos données vs les hypothèses</h2>
          <p>
            Le prix, le kilométrage et les prix de l&apos;énergie sont vos données.
            L&apos;assurance, l&apos;entretien et la dépréciation sont des
            <strong> hypothèses</strong> à ajuster selon votre situation réelle.
          </p>
        </Prose>
      }
      faq={[
        {
          question: "La dépréciation est-elle fiable ?",
          answer:
            "C'est une estimation exprimée en pourcentage annuel du prix. La valeur réelle dépend du modèle, du marché et de l'état du véhicule.",
        },
      ]}
    />
  );
}
