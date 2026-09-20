import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation du site.",
  path: "/conditions-utilisation",
  noindex: true,
});

export default function Page() {
  return (
    <LegalPage
      title="Conditions d'utilisation"
      description="Les règles d'utilisation du site et de ses outils."
      breadcrumb="Conditions d'utilisation"
      href="/conditions-utilisation"
      sections={[
        {
          heading: "Objet",
          paragraphs: [
            "Le site fournit des contenus informatifs et des outils de calcul à titre indicatif. Il ne constitue ni un conseil personnalisé, ni une offre commerciale.",
          ],
        },
        {
          heading: "Nature des informations",
          paragraphs: [
            "Les données véhicules publiées sont actuellement des données d'exemple. Les résultats des calculateurs sont des estimations dépendant des valeurs saisies par l'utilisateur.",
          ],
        },
        {
          heading: "Responsabilité",
          paragraphs: [
            "L'utilisateur reste seul responsable de l'usage qu'il fait des informations et estimations fournies. Nous recommandons de vérifier toute donnée déterminante auprès de sources officielles.",
          ],
        },
      ]}
    />
  );
}
