import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Prose, TableOfContents } from "@/components/ui/Prose";
import { DataLegend } from "@/components/ui/DataBadge";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { ASSUMPTIONS, ASSUMPTIONS_UPDATED_AT } from "@/data/assumptions";
import { getCatalogDate } from "@/data/catalog";
import { drivingFactor, speedFactor, temperatureFactor } from "@/lib/calculators";
import { buildMetadata } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";
import type { ArticleSection } from "@/types";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Méthodologie : sources, calculs et limites",
  description:
    "Comment EVExpert collecte ses données, calcule les coûts, estime l'autonomie et distingue données sourcées, calculs et estimations. Hypothèses et limites détaillées.",
  path: "/methodologie",
});

const f = (n: number) => formatNumber(n, 2);

function buildSections(checkedAt: string): ArticleSection[] {
  return [
  {
    heading: "Principes",
    paragraphs: [
      "EVExpert vise à aider à comprendre, comparer et calculer le coût réel d'une voiture électrique. Trois règles guident ce travail : ne jamais inventer une donnée, toujours indiquer d'où elle vient, et distinguer clairement ce qui est sourcé de ce qui est calculé ou estimé.",
    ],
  },
  {
    heading: "Les données véhicules",
    paragraphs: [
      `Les caractéristiques techniques du catalogue proviennent de la base spécialisée EV Database (source spécialisée, non constructeur), relevées le ${checkedAt}. Chaque fiche cite sa source, son lien et sa date de relevé.`,
      "Un script de contrôle vérifie la cohérence de chaque ligne avant publication : batterie utile ≤ brute, kW et chevaux concordants, consommation cohérente avec capacité et autonomie, temps de charge et performances dans des plages plausibles. Une donnée jugée incohérente ou absente est laissée vide (« Non disponible ») : elle n'est jamais corrigée ni complétée à la main.",
      "Le prix en France, la garantie véhicule et certaines consommations WLTP ne sont pas collectés à ce stade. Les prix publiés par notre source concernent d'autres marchés et ne sont pas présentés comme des prix français.",
    ],
    list: [
      "Sélection des modèles : versions pertinentes pour le marché français, sans multiplier des pages faibles.",
      "Mise à jour : à chaque révision du catalogue, avec la date de relevé affichée. Les évolutions importantes sont documentées ici.",
    ],
  },
  {
    heading: "Nature des données",
    paragraphs: ["Chaque valeur est rattachée à l'une de ces natures, signalée par un badge :"],
  },
  {
    heading: "Coût aux 100 km et coût d'une recharge",
    paragraphs: [
      "La consommation « côté batterie » est calculée à partir de deux données de la fiche : capacité utile ÷ autonomie WLTP × 100. Elle est ensuite ramenée au compteur en tenant compte du rendement de charge.",
    ],
    list: [
      "Consommation batterie (kWh/100 km) = capacité utile ÷ autonomie WLTP × 100",
      "Énergie au compteur (kWh/100 km) = consommation batterie ÷ rendement de charge",
      "Coût aux 100 km = énergie au compteur × prix du kWh",
      "Coût d'une recharge = capacité utile × (état final − état initial) ÷ rendement × prix du kWh",
    ],
  },
  {
    heading: "Hypothèses par défaut",
    paragraphs: [
      `Les valeurs par défaut des calculateurs et des fiches sont des hypothèses EVExpert, modifiables, non issues d'un relevé officiel (dernière révision : ${ASSUMPTIONS_UPDATED_AT}). Remplacez-les par vos propres tarifs.`,
    ],
    table: {
      headers: ["Hypothèse", "Valeur par défaut"],
      rows: [
        ["Prix du kWh à domicile", `${f(ASSUMPTIONS.homePrice)} €/kWh`],
        ["Prix du kWh sur borne AC publique", `${f(ASSUMPTIONS.publicAcPrice)} €/kWh`],
        ["Prix du kWh en recharge rapide DC", `${f(ASSUMPTIONS.fastDcPrice)} €/kWh`],
        ["Prix de l'essence", `${f(ASSUMPTIONS.petrolPrice)} €/L`],
        ["Prix du gazole", `${f(ASSUMPTIONS.dieselPrice)} €/L`],
        ["Rendement de charge", `${ASSUMPTIONS.chargingEfficiency} %`],
        ["Kilométrage annuel de référence", `${formatNumber(ASSUMPTIONS.annualKm)} km`],
      ],
    },
  },
  {
    heading: "Estimation de l'autonomie réelle",
    paragraphs: [
      "L'autonomie estimée applique trois facteurs multiplicatifs à la consommation de référence, puis divise l'énergie exploitable par cette consommation ajustée. C'est un modèle volontairement simple : il donne un ordre de grandeur, pas une prévision.",
    ],
    list: [
      "Consommation ajustée = consommation de référence × facteur température × facteur trajet × facteur vitesse",
      "Autonomie = capacité utile × (1 − réserve) ÷ consommation ajustée × 100",
    ],
    table: {
      caption: "Facteurs de consommation utilisés (estimation EVExpert)",
      headers: ["Facteur", "Valeur"],
      rows: [
        ["Température ≥ 20 °C", `× ${f(temperatureFactor(20))}`],
        ["Température 10 à 19 °C", `× ${f(temperatureFactor(15))}`],
        ["Température 0 à 9 °C", `× ${f(temperatureFactor(5))}`],
        ["Température −10 à −1 °C", `× ${f(temperatureFactor(-5))}`],
        ["Température < −10 °C", `× ${f(temperatureFactor(-15))}`],
        ["Trajet urbain", `× ${f(drivingFactor("ville"))}`],
        ["Trajet mixte", `× ${f(drivingFactor("mixte"))}`],
        ["Autoroute", `× ${f(drivingFactor("autoroute"))}`],
        ["Vitesse 90 km/h ou moins", `× ${f(speedFactor(90))}`],
        ["Vitesse 110 km/h", `× ${f(speedFactor(110))}`],
        ["Vitesse 130 km/h", `× ${f(speedFactor(130))}`],
      ],
    },
  },
  {
    heading: "Temps de recharge",
    paragraphs: [
      "En AC, le temps est calculé : énergie à ajouter ÷ (puissance utilisée × rendement), la puissance utilisée étant la plus faible entre la borne et le chargeur embarqué. En DC, nous affichons le temps 10-80 % publié par la source, car la puissance varie pendant la charge ; la puissance moyenne indiquée dans certains articles en est déduite.",
    ],
  },
  {
    heading: "TCO et comparaison essence / électrique",
    paragraphs: [
      "Les calculateurs additionnent dépréciation, énergie, assurance, entretien, pneus et taxes. Les valeurs par défaut sont des exemples d'illustration, pas des données de marché : ils ne comprennent ni financement, ni borne à domicile, ni aides, que vous saisissez vous-même après vérification.",
    ],
  },
  {
    heading: "Limites",
    paragraphs: [],
    list: [
      "Les valeurs WLTP sont des valeurs d'homologation, non des consommations d'usage.",
      "Le modèle d'autonomie ignore le relief, le vent, la charge, les pneus et l'état de santé de la batterie.",
      "Les données d'une source tierce peuvent différer de celles du constructeur pour une version ou une année précise.",
      "Les tarifs d'énergie, les aides et la fiscalité évoluent : vérifiez-les auprès des sources officielles.",
    ],
  },
  {
    heading: "Signaler une erreur",
    paragraphs: [
      "Une donnée vous semble erronée ? Indiquez le modèle, la valeur concernée et la source à l'appui via la page Contact : nous vérifions et corrigeons, avec mise à jour de la date.",
    ],
  },
];
}

export default async function Page() {
  const sections = buildSections(await getCatalogDate());
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Méthodologie", href: "/methodologie" }]} />
      <article className="max-w-3xl">
        <PageHeader
          eyebrow="Transparence"
          title="Méthodologie : sources, calculs et limites"
          description="Comment nous collectons, calculons et estimons — et ce que nous ne faisons pas."
        />
        <div className="mt-3">
          <LastUpdated date="2026-09-21" />
        </div>
        <TableOfContents sections={sections} />
        <div className="mt-8">
          <Prose sections={sections.slice(0, 3)} />
          <DataLegend className="mt-6" />
          <div className="mt-2">
            <Prose sections={sections.slice(3)} />
          </div>
          <p className="mt-10 text-sm text-body">
            Voir aussi la liste des <Link href="/sources" className="link-u font-semibold text-signal-deep">sources</Link> et les{" "}
            <Link href="/outils" className="link-u font-semibold text-signal-deep">outils</Link> où chaque formule est détaillée.
          </p>
        </div>
      </article>
    </Container>
  );
}
