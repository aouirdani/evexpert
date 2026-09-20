import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sources et méthodologie",
  description: `Notre politique de données : sources, méthodologie de calcul et transparence sur les données d'exemple.`,
  path: "/sources",
});

export default function Page() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Sources", href: "/sources" }]} />
      <PageHeader
        title="Sources et méthodologie"
        description="Notre engagement de transparence sur l'origine des données et le fonctionnement des calculs."
      />
      <article className="mt-8 max-w-3xl">
        <ContentSections
          sections={[
            {
              heading: "Données véhicules",
              paragraphs: [
                `Les fiches véhicules actuellement publiées sur ${siteConfig.name} sont des données d'exemple, clairement identifiées par une mention « Donnée d'exemple ». Elles servent à démontrer l'architecture du site.`,
                "Elles ne constituent pas des spécifications officielles et ne doivent pas fonder une décision d'achat. Chaque fiche est structurée pour accueillir, à terme, une source et une date de mise à jour vérifiables.",
              ],
            },
            {
              heading: "Données de recharge",
              paragraphs: [
                "Les exemples de bornes de recharge sont des données de démonstration. Ils pourront être remplacés par une source ouverte, par exemple le jeu de données national des points de recharge (IRVE) publié sur data.gouv.fr.",
              ],
            },
            {
              heading: "Méthodologie des calculateurs",
              paragraphs: [
                "Nos calculateurs utilisent des formules transparentes, rappelées sur chaque page d'outil. Les résultats sont des estimations basées sur les paramètres que vous saisissez.",
                "Nous distinguons systématiquement les données officielles (WLTP, spécifications) des estimations calculées par le site.",
              ],
            },
            {
              heading: "Signaler une erreur",
              paragraphs: [
                "Vous constatez une donnée inexacte ? Écrivez-nous via la page Contact en précisant le modèle et, si possible, un lien vers la source officielle.",
              ],
            },
          ]}
        />
      </article>
    </Container>
  );
}
