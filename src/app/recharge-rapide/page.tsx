import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import { RelatedTools } from "@/components/related";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Recharge rapide d'une voiture électrique",
  description:
    "Bornes DC, courbe de charge, puissances 50 à 300+ kW et bonnes pratiques pour les longs trajets.",
  path: "/recharge-rapide",
});

export default function Page() {
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Recharge", href: "/recharge" },
          { name: "Recharge rapide", href: "/recharge-rapide" },
        ]}
      />
      <PageHeader
        eyebrow="Recharge"
        title="Recharge rapide"
        description="Sur autoroute et longs trajets, la recharge rapide en courant continu (DC) fait toute la différence."
      />
      <article className="mt-8 max-w-3xl">
        <ContentSections
          sections={[
            {
              heading: "La courbe de charge, l'élément clé",
              paragraphs: [
                "En recharge rapide, la puissance n'est pas constante : elle est élevée à faible état de charge puis diminue nettement au-delà de 60-80 %.",
                "Sur un long trajet, recharger de 10 à 80 % est souvent plus efficace que d'attendre 100 %.",
              ],
            },
            {
              heading: "Puissance de la borne vs puissance du véhicule",
              paragraphs: [
                "La vitesse réelle est plafonnée par la puissance DC maximale acceptée par votre véhicule et par sa courbe de charge.",
                "Une borne 300 kW ne recharge pas plus vite un véhicule limité à 100 kW.",
              ],
            },
          ]}
        />
        <RelatedTools hrefs={["/outils/temps-recharge", "/outils/puissance-borne-recharge"]} />
      </article>
    </Container>
  );
}
