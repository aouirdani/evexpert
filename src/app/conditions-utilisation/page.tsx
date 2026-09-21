import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Conditions d'utilisation",
  description: "Règles d'usage du site EVExpert : contenus informatifs, calculateurs, propriété intellectuelle et limites de responsabilité.",
  path: "/conditions-utilisation",
});

export default function Page() {
  return (
    <LegalPage
      title="Conditions d'utilisation"
      description="En utilisant le site, vous acceptez les règles ci-dessous."
      breadcrumb="Conditions d'utilisation"
      href="/conditions-utilisation"
      sections={[
        {
          heading: "Objet",
          paragraphs: ["Le site propose des contenus informatifs, des calculateurs et des fiches techniques sur les voitures électriques. Il n'est ni un vendeur, ni un conseiller financier, ni un service de prise de décision."],
        },
        {
          heading: "Usage des calculateurs",
          paragraphs: [
            "Les résultats sont des estimations produites à partir des valeurs que vous saisissez et d'hypothèses affichées. Ils sont fournis à titre indicatif : vérifiez les points importants (tarifs, aides, caractéristiques exactes) auprès des sources officielles et du constructeur avant tout achat ou investissement.",
          ],
        },
        {
          heading: "Exactitude des données",
          paragraphs: [
            "Nous indiquons la source, la nature (sourcée, calculée, estimée) et la date de relevé des données. Elles peuvent devenir obsolètes ou comporter des erreurs ; signalez-les via la page Contact.",
          ],
        },
        {
          heading: "Utilisation acceptable",
          paragraphs: ["Il est interdit d'utiliser le site pour perturber son fonctionnement, extraire massivement son contenu ou en reproduire le contenu de façon substantielle sans autorisation."],
        },
        {
          heading: "Limitation de responsabilité",
          paragraphs: ["Dans les limites permises par la loi, l'éditeur ne peut être tenu responsable des dommages résultant de l'utilisation des informations ou de l'indisponibilité du site."],
        },
        {
          heading: "Évolution",
          paragraphs: ["Ces conditions peuvent évoluer ; la date de mise à jour figure en haut de page. Le droit français s'applique."],
        },
      ]}
    />
  );
}
