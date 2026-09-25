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
      updatedAt="2026-09-25"
      sections={[
        {
          heading: "Ce que nous utilisons aujourd'hui",
          paragraphs: [
            "Le site enregistre uniquement votre choix de consentement dans le stockage local de votre navigateur (clé technique « evscope-consent »), afin de ne pas vous reposer la question à chaque visite. Ce stockage est strictement nécessaire au fonctionnement du bandeau et ne sert à aucun suivi.",
            "Google Analytics n'est chargé qu'après votre accord via le bandeau ci-dessous. Le site est par ailleurs inscrit auprès de Google AdSense (compte en cours de validation par Google) : aucune annonce n'est affichée à ce jour, mais le script correspondant est actif sur chaque page et peut déposer certains cookies techniques indépendamment de l'affichage d'une publicité (détection de fraude, mesure de la qualité du trafic). Les cookies publicitaires liés à des annonces personnalisées ne seront déposés qu'après votre consentement, recueilli séparément via le message affiché par Google.",
          ],
        },
        {
          heading: "Ce qui pourra être activé avec votre accord",
          paragraphs: [],
          table: {
            headers: ["Catégorie", "Outil", "Finalité", "État"],
            rows: [
              ["Mesure d'audience", "Google Analytics", "Statistiques de fréquentation", "Chargé seulement après consentement (bandeau ci-dessous)"],
              ["Publicité", "Google AdSense", "Affichage d'annonces", "Compte en cours de validation — script actif, aucune annonce affichée ; consentement publicitaire géré par le message de Google"],
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
