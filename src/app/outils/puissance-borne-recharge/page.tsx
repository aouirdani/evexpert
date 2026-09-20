import { ToolPageShell, Prose } from "@/components/calculators/ToolPageShell";
import { ChargingTimeCalculator } from "@/components/calculators/ChargingTimeCalculator";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/data/tools";

const tool = getTool("puissance-borne-recharge")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: tool.href,
});

export default function Page() {
  return (
    <ToolPageShell
      title={tool.title}
      description="Comprenez l'effet de la puissance d'une borne sur le temps de recharge, avec un simulateur pratique."
      calculator={<ChargingTimeCalculator />}
      relatedTools={["/outils/temps-recharge", "/outils/cout-recharge-voiture-electrique"]}
      explanation={
        <Prose>
          <h2>Ce que change la puissance d&apos;une borne</h2>
          <p>
            Plus la puissance est élevée, plus la recharge est théoriquement
            rapide. Mais deux limites entrent en jeu&nbsp;:
          </p>
          <ul>
            <li>Le <strong>chargeur embarqué</strong> limite la recharge AC (souvent 7,4, 11 ou 22 kW).</li>
            <li>La <strong>puissance DC acceptée</strong> par le véhicule et sa courbe de charge limitent la recharge rapide.</li>
          </ul>
          <p>
            Brancher une voiture limitée à 11 kW AC sur une borne 22 kW ne la fera
            pas charger plus vite&nbsp;: c&apos;est le plus faible des deux qui
            s&apos;applique.
          </p>
          <h2>Repères de puissance</h2>
          <ul>
            <li>7,4 kW / 11 kW&nbsp;: recharge à domicile (wallbox)</li>
            <li>22 kW&nbsp;: bornes AC de voirie</li>
            <li>50 à 150 kW&nbsp;: recharge rapide</li>
            <li>250 kW et plus&nbsp;: recharge ultra-rapide (véhicules compatibles)</li>
          </ul>
        </Prose>
      }
      faq={[
        {
          question: "Une borne plus puissante charge-t-elle toujours plus vite ?",
          answer:
            "Non. La vitesse réelle est plafonnée par la puissance maximale acceptée par votre véhicule (chargeur embarqué en AC, courbe de charge en DC).",
        },
      ]}
    />
  );
}
