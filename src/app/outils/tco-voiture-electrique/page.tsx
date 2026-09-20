import { ToolPageShell, Prose } from "@/components/calculators/ToolPageShell";
import { TcoCalculator } from "@/components/calculators/TcoCalculator";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/data/tools";

const tool = getTool("tco-voiture-electrique")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: tool.href,
});

export default function Page() {
  return (
    <ToolPageShell
      title={tool.title}
      description="Calculez le coût total de possession (TCO) et comparez deux véhicules sur la durée de votre choix."
      calculator={<TcoCalculator />}
      relatedTools={["/outils/essence-vs-electrique", "/outils/cout-recharge-voiture-electrique"]}
      explanation={
        <Prose>
          <h2>Qu&apos;est-ce que le TCO ?</h2>
          <p>
            Le coût total de possession (Total Cost of Ownership) agrège tous les
            coûts d&apos;un véhicule sur une période&nbsp;: achat (net des aides et de
            la revente), énergie, assurance, entretien, pneus et taxes.
          </p>
          <ul>
            <li>Dépréciation = prix − aides − valeur de revente</li>
            <li>Énergie = énergie totale × prix (domicile et recharge publique)</li>
            <li>+ assurance, entretien, pneus et taxes sur la durée</li>
          </ul>
          <h2>Pourquoi c&apos;est l&apos;indicateur clé</h2>
          <p>
            Le prix affiché ne dit pas tout&nbsp;: la dépréciation et l&apos;énergie
            pèsent souvent davantage que le prix d&apos;achat sur le coût réel.
          </p>
        </Prose>
      }
      faq={[
        {
          question: "Comment estimer la valeur de revente ?",
          answer:
            "Basez-vous sur les cotes du marché de l'occasion pour un modèle et un âge comparables. C'est une hypothèse déterminante pour le résultat.",
        },
      ]}
    />
  );
}
