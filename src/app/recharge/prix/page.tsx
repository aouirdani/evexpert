import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import { RelatedTools } from "@/components/related";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Prix de la recharge d'une voiture électrique",
  description:
    "Combien coûte une recharge selon le lieu : domicile, borne publique AC ou recharge rapide DC. Méthode et comparaison.",
  path: "/recharge/prix",
});

export default function Page() {
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Recharge", href: "/recharge" },
          { name: "Prix", href: "/recharge/prix" },
        ]}
      />
      <PageHeader
        eyebrow="Recharge"
        title="Prix de la recharge d'une voiture électrique"
        description="Le prix d'une recharge varie fortement selon le lieu et l'opérateur. Voici comment l'estimer."
      />
      <article className="mt-8 max-w-3xl">
        <ContentSections
          sections={[
            {
              heading: "Trois scénarios, trois tarifs",
              paragraphs: [
                "À domicile, le prix au kWh correspond à votre contrat d'électricité : c'est généralement l'option la plus économique.",
                "Sur borne publique en courant alternatif (AC), le tarif est supérieur à celui du domicile.",
                "En recharge rapide (DC), notamment sur autoroute, le prix au kWh est le plus élevé, mais reste souvent compétitif face au carburant.",
              ],
            },
            {
              heading: "Comment calculer son coût",
              paragraphs: [
                "Le coût dépend de l'énergie réellement tirée du réseau et du prix du kWh. Le rendement de charge (pertes) augmente légèrement l'énergie facturée.",
                "Utilisez notre calculateur de coût de recharge pour une estimation personnalisée.",
              ],
            },
          ]}
        />
        <RelatedTools hrefs={["/outils/cout-recharge-voiture-electrique", "/outils/cout-100-km"]} />
      </article>
    </Container>
  );
}
