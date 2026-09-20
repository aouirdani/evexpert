import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politique cookies",
  description: "Utilisation des cookies sur le site.",
  path: "/cookies",
  noindex: true,
});

export default function Page() {
  return (
    <LegalPage
      title="Politique cookies"
      description="Quels cookies nous utilisons et comment les gérer."
      breadcrumb="Cookies"
      href="/cookies"
      sections={[
        {
          heading: "Cookies essentiels",
          paragraphs: [
            "Certains cookies techniques sont nécessaires au bon fonctionnement du site (mémorisation de votre choix de consentement, par exemple). Ils ne requièrent pas de consentement.",
          ],
        },
        {
          heading: "Cookies de mesure d'audience",
          paragraphs: [
            "Ces cookies nous aident à comprendre l'usage du site. Ils ne sont déposés qu'après votre accord via la bannière de consentement.",
          ],
        },
        {
          heading: "Cookies publicitaires",
          paragraphs: [
            "Le site est préparé pour la publicité, désactivée par défaut. Aucun cookie publicitaire n'est déposé tant que la publicité n'est pas activée et acceptée.",
          ],
        },
        {
          heading: "Gérer votre consentement",
          paragraphs: [
            "Vous pouvez modifier votre choix à tout moment via le bouton « Gestion des cookies » présent dans le pied de page.",
          ],
        },
      ]}
    />
  );
}
