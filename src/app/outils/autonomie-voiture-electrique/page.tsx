import { ToolPageShell, Prose } from "@/components/calculators/ToolPageShell";
import { RangeCalculator } from "@/components/calculators/RangeCalculator";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/data/tools";

const tool = getTool("autonomie-voiture-electrique")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: tool.href,
});

export default function Page() {
  return (
    <ToolPageShell
      title={tool.title}
      description="Estimez l'autonomie réelle d'une voiture électrique selon la vitesse, la température et le type de conduite."
      calculator={<RangeCalculator />}
      relatedTools={["/outils/cout-recharge-voiture-electrique", "/outils/temps-recharge"]}
      explanation={
        <Prose>
          <h2>Comment est calculée l&apos;autonomie ?</h2>
          <p>
            L&apos;estimation part d&apos;une consommation de référence à laquelle
            on applique des facteurs correctifs&nbsp;:
          </p>
          <ul>
            <li>La vitesse&nbsp;: au-delà de 90-110 km/h, la consommation augmente fortement.</li>
            <li>La température&nbsp;: le froid réduit sensiblement l&apos;autonomie.</li>
            <li>Le type de conduite&nbsp;: la ville est favorable, l&apos;autoroute défavorable.</li>
            <li>La réserve de batterie que vous souhaitez conserver.</li>
          </ul>
          <p>
            <strong>Important&nbsp;:</strong> il s&apos;agit d&apos;une estimation.
            Ce n&apos;est pas une valeur officielle constructeur et l&apos;autonomie
            réelle dépend de nombreux paramètres supplémentaires.
          </p>
        </Prose>
      }
      faq={[
        {
          question: "Cette autonomie est-elle garantie ?",
          answer:
            "Non. Il s'agit d'une estimation pédagogique. L'autonomie réelle dépend du véhicule, du relief, du vent, de la charge et de nombreux autres facteurs.",
        },
        {
          question: "Pourquoi le froid réduit-il l'autonomie ?",
          answer:
            "Le chauffage de l'habitacle et le maintien en température de la batterie consomment de l'énergie, et la chimie de la batterie est moins performante à froid.",
        },
      ]}
    />
  );
}
