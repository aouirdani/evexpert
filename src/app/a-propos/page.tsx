import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "À propos",
  description: `${siteConfig.name} est une plateforme d'information et d'outils dédiée à la voiture électrique en France.`,
  path: "/a-propos",
});

export default function Page() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "À propos", href: "/a-propos" }]} />
      <PageHeader
        title={`À propos de ${siteConfig.name}`}
        description={siteConfig.tagline}
      />
      <article className="mt-8 max-w-3xl">
        <ContentSections
          sections={[
            {
              heading: "Notre mission",
              paragraphs: [
                `${siteConfig.name} a pour objectif d'aider les automobilistes francophones à mieux comprendre la voiture électrique grâce à des outils interactifs, une base de véhicules structurée et des contenus pédagogiques.`,
                "Nous privilégions l'utilité et la transparence : des calculateurs qui calculent vraiment, des données clairement identifiées et des sources citées.",
              ],
            },
            {
              heading: "Notre approche des données",
              paragraphs: [
                "Nous n'inventons pas de spécifications. Les fiches véhicules actuelles reposent sur des données d'exemple, explicitement signalées, et sont conçues pour être remplacées par des données sourcées et datées.",
                "Chaque donnée factuelle vise une source et une date de mise à jour.",
              ],
            },
            {
              heading: "Un nom temporaire",
              paragraphs: [
                `« ${siteConfig.name} » est un nom de projet interne temporaire. La marque et le domaine pourront évoluer.`,
              ],
            },
          ]}
        />
      </article>
    </Container>
  );
}
