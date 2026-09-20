import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import { RelatedTools } from "@/components/related";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Recharge à domicile d'une voiture électrique",
  description:
    "Prise renforcée ou wallbox, puissance, installation et coûts : le guide de la recharge à domicile.",
  path: "/recharge-a-domicile",
});

export default function Page() {
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Recharge", href: "/recharge" },
          { name: "À domicile", href: "/recharge-a-domicile" },
        ]}
      />
      <PageHeader
        eyebrow="Recharge"
        title="Recharge à domicile"
        description="La solution la plus pratique et la plus économique pour un usage quotidien."
      />
      <article className="mt-8 max-w-3xl">
        <ContentSections
          sections={[
            {
              heading: "Prise renforcée ou wallbox ?",
              paragraphs: [
                "Une prise renforcée (~3,7 kW) convient à un petit kilométrage et se contente d'une installation simple.",
                "Une wallbox de 7,4 kW (monophasé) ou 11 kW (triphasé) offre une recharge plus rapide, plus sûre et pilotable.",
              ],
            },
            {
              heading: "Combien de temps pour recharger ?",
              paragraphs: [
                "Le temps dépend de la capacité de la batterie et de la puissance de la wallbox. Une nuit suffit généralement à récupérer une charge confortable.",
                "Estimez votre durée avec le calculateur de temps de recharge.",
              ],
            },
          ]}
        />
        <RelatedTools hrefs={["/outils/temps-recharge", "/outils/cout-recharge-voiture-electrique"]} />
      </article>
    </Container>
  );
}
