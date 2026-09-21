import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politique de cookies",
  description: "Quels cookies et traceurs EVExpert utilise, à quelles conditions, et comment modifier votre choix.",
  path: "/cookies",
});

export default function Page() {
  return (
    <LegalPage
      title="Politique de cookies"
      description="Aucun cookie non essentiel n'est déposé sans votre accord."
      breadcrumb="Cookies"
      href="/cookies"
      sections={[
        {
          heading: "Ce que nous utilisons aujourd'hui",
          paragraphs: [
            "Le site enregistre uniquement votre choix de consentement dans le stockage local de votre navigateur (clé technique « evscope-consent »), afin de ne pas vous reposer la question à chaque visite. Ce stockage est strictement nécessaire au fonctionnement du bandeau et ne sert à aucun suivi.",
            "À ce jour, aucun cookie de mesure d'audience ni de publicité n'est déposé.",
          ],
        },
        {
          heading: "Ce qui pourra être activé avec votre accord",
          paragraphs: [],
          table: {
            headers: ["Catégorie", "Outil", "Finalité", "État"],
            rows: [
              ["Mesure d'audience", "Google Analytics / Tag Manager", "Statistiques de fréquentation", "Désactivé (chargé seulement après consentement, si configuré)"],
              ["Publicité", "Google AdSense", "Affichage d'annonces", "Désactivé"],
            ],
          },
        },
        {
          heading: "Gérer votre choix",
          paragraphs: [
            "Le bandeau vous propose « Accepter » ou « Refuser » avec la même visibilité. Refuser n'affecte pas l'accès au site. Pour modifier votre choix, cliquez sur « Gestion des cookies » en bas de chaque page. Vous pouvez aussi supprimer le stockage du site dans les réglages de votre navigateur.",
          ],
        },
        {
          heading: "En savoir plus",
          paragraphs: ["Consultez notre politique de confidentialité et les informations pédagogiques de la CNIL sur les cookies et traceurs (cnil.fr)."],
        },
      ]}
    />
  );
}
