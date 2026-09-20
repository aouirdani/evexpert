import { ToolPageShell, Prose } from "@/components/calculators/ToolPageShell";
import { ChargingTimeCalculator } from "@/components/calculators/ChargingTimeCalculator";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/data/tools";

const tool = getTool("temps-recharge")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: tool.href,
});

export default function Page() {
  return (
    <ToolPageShell
      title={tool.title}
      description="Estimez le temps de recharge théorique selon la capacité de la batterie, l'état de charge et la puissance."
      calculator={<ChargingTimeCalculator />}
      relatedTools={["/outils/cout-recharge-voiture-electrique", "/outils/puissance-borne-recharge"]}
      explanation={
        <Prose>
          <h2>Un temps théorique</h2>
          <p>
            Le temps affiché suppose une puissance constante. En pratique, surtout
            en recharge rapide (DC), la <strong>courbe de charge n&apos;est pas
            linéaire</strong>&nbsp;: la puissance est élevée à faible état de charge
            puis diminue nettement au-delà de 80 %.
          </p>
          <p>
            Le temps réel pour atteindre 100 % est donc souvent bien plus long que
            le calcul théorique ne le suggère.
          </p>
          <h2>Formule</h2>
          <ul>
            <li>Énergie à recharger = capacité × (cible − actuel) / 100</li>
            <li>Temps = énergie / (puissance × rendement)</li>
          </ul>
        </Prose>
      }
      faq={[
        {
          question: "Pourquoi ma recharge est-elle plus lente que le calcul ?",
          answer:
            "En recharge rapide, la puissance diminue au fil de la charge pour préserver la batterie. La puissance affichée par la borne est un maximum, rarement maintenu jusqu'à 80-100 %.",
        },
      ]}
    />
  );
}
