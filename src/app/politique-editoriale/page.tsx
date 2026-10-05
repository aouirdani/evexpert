import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Prose, TableOfContents } from "@/components/ui/Prose";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { buildMetadata } from "@/lib/seo";
import { formatDateFr } from "@/lib/format";
import type { ArticleSection } from "@/types";

// Dernière révision de cette page (voir docs/seo pour l'historique des lots).
const LAST_UPDATED = "2026-10-05";

export const metadata = buildMetadata({
  title: "Politique éditoriale",
  description:
    "Comment EVExpert choisit ses sources, vérifie ses données, corrige ses erreurs et encadre l'usage de l'intelligence artificielle dans sa rédaction.",
  path: "/politique-editoriale",
});

const sections: ArticleSection[] = [
  {
    heading: "Choix des sources",
    paragraphs: [
      "Nous utilisons EV Database pour les caractéristiques techniques : une base spécialisée, pas un document constructeur. Nous l'indiquons sur chaque fiche avec un lien vers la source et la date du relevé.",
      "Nous n'avons pas encore intégré de source française pour les prix : une donnée non transposable en France n'est pas publiée comme si elle l'était.",
    ],
  },
  {
    heading: "Vérification",
    paragraphs: [
      "Avant publication, un script de contrôle vérifie chaque fiche : batterie utile inférieure ou égale à la batterie brute, puissance en kW et en chevaux concordante, consommation cohérente avec la capacité et l'autonomie, temps de charge, performances et prix dans des plages plausibles, source et date de relevé présentes.",
      "Un champ manquant ou jugé incohérent n'est jamais complété ni corrigé à la main : il reste vide sur la fiche. Une version à laquelle il manque une donnée indispensable à l'affichage (autonomie, puissance, dimensions…) n'est pas publiée.",
    ],
  },
  {
    heading: "Corrections",
    paragraphs: [
      "Un signalement via la page [Contact](/contact) déclenche une vérification contre la source citée. Une correction confirmée est appliquée avec mise à jour de la date de relevé, et consignée dans le journal ci-dessous.",
    ],
  },
  {
    heading: "Journal des corrections",
    paragraphs: [
      `Ce journal recense, avec la date, les corrections apportées à la suite d'un signalement. Aucune correction à ce jour (mise à jour le ${formatDateFr(LAST_UPDATED)}).`,
    ],
  },
  {
    heading: "Usage de l'intelligence artificielle",
    paragraphs: [
      "Les textes de ce site sont rédigés avec l'aide d'outils d'intelligence artificielle. Chaque chiffre provient du catalogue de données ou d'une source nommée et vérifiable : aucun fait n'est généré sans cette base, et chaque contenu est relu par [l'auteur](/auteur) avant publication.",
      "Les illustrations générées par IA sont signalées comme telles sur la page où elles apparaissent.",
    ],
  },
  {
    heading: "Indépendance",
    paragraphs: ["Voir la section [Financement et indépendance](/a-propos#financement-et-independance) sur la page À propos."],
  },
];

export default function Page() {
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Politique éditoriale", href: "/politique-editoriale" }]} />
      <article className="max-w-3xl">
        <PageHeader
          eyebrow="Transparence"
          title="Politique éditoriale"
          description="Comment nous choisissons nos sources, vérifions les données et corrigeons nos erreurs."
        />
        <div className="mt-3">
          <LastUpdated date={LAST_UPDATED} />
        </div>
        <TableOfContents sections={sections} />
        <div className="mt-8">
          <Prose sections={sections} />
        </div>
      </article>
    </Container>
  );
}
