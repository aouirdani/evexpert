import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politique de confidentialité",
  description: "Quelles données sont traitées par EVExpert, pourquoi, combien de temps, et comment exercer vos droits.",
  path: "/confidentialite",
});

export default function Page() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      description="Ce que le site fait — et ne fait pas — de vos données."
      breadcrumb="Confidentialité"
      href="/confidentialite"
      updatedAt="2026-09-25"
      sections={[
        {
          heading: "En résumé",
          paragraphs: [
            "Les calculateurs fonctionnent dans votre navigateur : les valeurs que vous saisissez ne sont pas envoyées à nos serveurs. Le site ne demande ni compte, ni inscription. Les cookies de mesure d'audience et de publicité ne sont déposés qu'avec votre consentement (voir « Mesure d'audience et publicité » ci-dessous).",
          ],
        },
        {
          heading: "Données traitées",
          paragraphs: [],
          list: [
            "Journaux techniques de l'hébergeur (adresse IP, date et heure, page demandée, type de navigateur) : nécessaires à la sécurité et au fonctionnement du service.",
            "Termes saisis dans la recherche du site : ils apparaissent dans l'adresse de la page de résultats et donc dans les journaux techniques.",
            "Votre choix de consentement, géré et conservé par le message de Google (le site ne stocke plus lui-même ce choix).",
            siteConfig.email ? "Les messages que vous nous envoyez par courrier électronique, utilisés uniquement pour vous répondre." : "Les messages que vous nous envoyez, le cas échéant, utilisés uniquement pour vous répondre.",
          ],
        },
        {
          heading: "Finalités et bases légales",
          paragraphs: [
            "Le fonctionnement et la sécurité du site reposent sur l'intérêt légitime de l'éditeur. La mesure d'audience et la publicité ne s'exécutent qu'avec votre consentement préalable.",
          ],
        },
        {
          heading: "Mesure d'audience et publicité",
          paragraphs: [
            "Le site utilise Google Analytics pour la mesure d'audience : ces cookies ne sont déposés qu'après votre accord explicite via le message de consentement de Google (« Réglementations européennes »).",
            "Le site est également inscrit auprès de Google AdSense (régie publicitaire), en cours de validation par Google : aucune annonce n'est affichée à ce jour. Le script Google chargé sur chaque page peut néanmoins déposer certains cookies ou identifiants techniques indépendamment de l'affichage d'une publicité, notamment à des fins de détection de fraude et de mesure de la qualité du trafic publicitaire. Avant votre réponse au message de consentement, Google Consent Mode refuse ces usages par défaut. Les cookies utilisés pour des annonces personnalisées, eux, ne seront déposés qu'après votre consentement explicite, recueilli via ce même message. Vous pouvez à tout moment modifier ou retirer ce consentement en le rouvrant depuis le bouton « Gérer mes cookies » en bas de page.",
            "Google et ses partenaires publicitaires peuvent utiliser les données ainsi collectées conformément à leurs propres politiques. Pour en savoir plus sur l'usage des données par les partenaires de Google, consultez policies.google.com/technologies/partner-sites.",
          ],
        },
        {
          heading: "Destinataires et transferts",
          paragraphs: [
            "Les données techniques sont traitées par l'hébergeur Vercel Inc., qui peut opérer hors de l'Union européenne. Une fois votre consentement donné, Google (Google Analytics, Google AdSense et leurs partenaires publicitaires) traite également certaines données, selon les finalités décrites ci-dessus. Aucune donnée n'est vendue.",
          ],
        },
        {
          heading: "Durée de conservation",
          paragraphs: ["Les journaux techniques sont conservés par l'hébergeur pour une durée limitée définie dans ses conditions. Votre choix de consentement reste dans votre navigateur jusqu'à ce que vous l'effaciez."],
        },
        {
          heading: "Vos droits",
          paragraphs: [
            "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité. Pour l'exercer, contactez-nous via la page Contact. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).",
          ],
        },
      ]}
    />
  );
}
