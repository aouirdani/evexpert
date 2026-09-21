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
      sections={[
        {
          heading: "En résumé",
          paragraphs: [
            "Les calculateurs fonctionnent dans votre navigateur : les valeurs que vous saisissez ne sont pas envoyées à nos serveurs. Le site ne demande ni compte, ni inscription. Aucun cookie de mesure d'audience ou de publicité n'est déposé à ce jour.",
          ],
        },
        {
          heading: "Données traitées",
          paragraphs: [],
          list: [
            "Journaux techniques de l'hébergeur (adresse IP, date et heure, page demandée, type de navigateur) : nécessaires à la sécurité et au fonctionnement du service.",
            "Termes saisis dans la recherche du site : ils apparaissent dans l'adresse de la page de résultats et donc dans les journaux techniques.",
            "Votre choix de consentement aux cookies, stocké dans le navigateur (stockage local) pour ne pas vous le redemander.",
            siteConfig.email ? "Les messages que vous nous envoyez par courrier électronique, utilisés uniquement pour vous répondre." : "Les messages que vous nous envoyez, le cas échéant, utilisés uniquement pour vous répondre.",
          ],
        },
        {
          heading: "Finalités et bases légales",
          paragraphs: [
            "Le fonctionnement et la sécurité du site reposent sur l'intérêt légitime de l'éditeur. La mesure d'audience et la publicité, si elles sont activées un jour, ne le seront qu'avec votre consentement préalable.",
          ],
        },
        {
          heading: "Mesure d'audience et publicité",
          paragraphs: [
            "Le site est prêt à charger des outils de mesure d'audience (Google Analytics / Tag Manager) ou de publicité (Google AdSense), mais ils sont désactivés et ne s'exécuteront qu'après votre accord explicite via le bandeau de consentement. Vous pouvez modifier votre choix à tout moment avec le bouton « Gestion des cookies » en bas de page.",
          ],
        },
        {
          heading: "Destinataires et transferts",
          paragraphs: [
            "Les données techniques sont traitées par l'hébergeur Vercel Inc., qui peut opérer hors de l'Union européenne. Aucune donnée n'est vendue. En cas d'activation ultérieure de services Google, la présente politique sera mise à jour avant l'activation.",
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
