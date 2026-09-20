import { ToolPageShell, Prose } from "@/components/calculators/ToolPageShell";
import { ChargingCostCalculator } from "@/components/calculators/ChargingCostCalculator";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/data/tools";

const tool = getTool("cout-recharge-voiture-electrique")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: tool.href,
});

export default function Page() {
  return (
    <ToolPageShell
      title={tool.title}
      description="Estimez précisément le coût d'une recharge selon la capacité de votre batterie, le prix du kWh et le rendement de charge."
      calculator={<ChargingCostCalculator />}
      relatedTools={["/outils/temps-recharge", "/outils/cout-100-km"]}
      explanation={
        <Prose>
          <h2>Comment est calculé le coût de recharge ?</h2>
          <p>
            Le coût de recharge repose sur trois grandeurs&nbsp;: l&apos;énergie
            réellement stockée dans la batterie, l&apos;énergie tirée du réseau
            (supérieure à cause des pertes) et le prix du kWh.
          </p>
          <ul>
            <li>Énergie stockée = capacité × (SOC cible − SOC actuel) / 100</li>
            <li>Énergie au compteur = énergie stockée / rendement de charge</li>
            <li>Coût = énergie au compteur × prix du kWh</li>
          </ul>
          <h2>Trois exemples concrets</h2>
          <h3>Recharge à domicile</h3>
          <p>
            Avec un tarif domestique autour de 0,25 €/kWh, recharger de 20 à 80 %
            une batterie de 60 kWh coûte quelques euros — c&apos;est le scénario le
            plus économique.
          </p>
          <h3>Recharge publique (AC)</h3>
          <p>
            Sur une borne de voirie, le prix au kWh est généralement plus élevé
            qu&apos;à domicile. La recharge reste pratique pour un appoint.
          </p>
          <h3>Recharge rapide (DC)</h3>
          <p>
            Sur autoroute, le prix au kWh peut être nettement supérieur, mais la
            recharge rapide reste souvent compétitive face au carburant.
          </p>
        </Prose>
      }
      faq={[
        {
          question: "Pourquoi l'énergie tirée du réseau est-elle supérieure ?",
          answer:
            "Une partie de l'énergie est perdue sous forme de chaleur lors de la conversion et de la charge. Ce rendement est généralement de 85 à 95 %.",
        },
        {
          question: "Quel prix du kWh utiliser ?",
          answer:
            "Utilisez le prix réel de votre contrat pour la recharge à domicile, ou le tarif affiché de l'opérateur pour la recharge publique.",
        },
      ]}
    />
  );
}
