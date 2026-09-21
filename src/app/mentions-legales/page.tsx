import { LegalPage } from "@/components/LegalPage";
import { legalConfig } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mentions légales",
  description: "Éditeur, hébergeur, propriété intellectuelle et responsabilité du site EVExpert.",
  path: "/mentions-legales",
});

export default function Page() {
  const l = legalConfig;
  const editorLines = [
    l.publisherName && `Éditeur : ${l.publisherName}`,
    l.publisherStatus && `Statut : ${l.publisherStatus}`,
    l.publisherAddress && `Adresse : ${l.publisherAddress}`,
    l.publicationDirector && `Directeur de la publication : ${l.publicationDirector}`,
    siteConfig.email && `Contact : ${siteConfig.email}`,
  ].filter(Boolean) as string[];

  return (
    <LegalPage
      title="Mentions légales"
      description="Informations légales relatives au site evexpert.fr."
      breadcrumb="Mentions légales"
      href="/mentions-legales"
      sections={[
        {
          heading: "Éditeur du site",
          paragraphs: editorLines.length
            ? []
            : [`Le site ${siteConfig.name} (evexpert.fr) est un projet éditorial indépendant. Pour toute question relative à l'éditeur, utilisez la page Contact.`],
          list: editorLines.length ? editorLines : undefined,
        },
        {
          heading: "Hébergement",
          paragraphs: ["Le site est hébergé par Vercel Inc. (https://vercel.com). Les journaux techniques de connexion (adresse IP, date, page demandée) sont traités par l'hébergeur pour assurer la sécurité et le bon fonctionnement du service."],
        },
        {
          heading: "Propriété intellectuelle",
          paragraphs: [
            "Les textes, la structure, les calculs et la présentation du site sont la propriété de l'éditeur, sauf mention contraire. Toute reproduction substantielle sans autorisation est interdite ; les courtes citations avec lien vers la page d'origine sont bienvenues.",
            "Les marques, noms de modèles et logos cités appartiennent à leurs titulaires respectifs : leur mention n'implique aucun partenariat.",
          ],
        },
        {
          heading: "Nature des contenus et responsabilité",
          paragraphs: [
            "Les contenus sont informatifs. Les caractéristiques techniques proviennent de sources citées sur chaque fiche et sur la page Sources ; les calculs et estimations reposent sur des hypothèses modifiables et ne remplacent ni un document constructeur, ni un devis, ni un conseil personnalisé.",
            "Malgré le soin apporté, des erreurs peuvent subsister : vous pouvez nous les signaler via la page Contact. L'éditeur ne saurait être tenu responsable d'une décision prise sur la seule base des informations publiées.",
          ],
        },
        {
          heading: "Liens externes",
          paragraphs: ["Le site peut renvoyer vers des sites tiers dont l'éditeur ne contrôle pas le contenu et dont il n'est pas responsable."],
        },
        {
          heading: "Droit applicable",
          paragraphs: ["Le site est soumis au droit français. Les litiges relèvent des juridictions françaises compétentes."],
        },
      ]}
    />
  );
}
