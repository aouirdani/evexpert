import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site.",
  path: "/mentions-legales",
  noindex: true,
});

export default function Page() {
  return (
    <LegalPage
      title="Mentions légales"
      description="Informations légales relatives à l'édition du site."
      breadcrumb="Mentions légales"
      href="/mentions-legales"
      sections={[
        {
          heading: "Éditeur",
          paragraphs: [
            `${siteConfig.name} (${siteConfig.organization.legalName}). Contact : ${siteConfig.email}.`,
            "Le présent site est un projet en cours de développement. Les informations d'édition définitives seront précisées avant toute mise en production commerciale.",
          ],
        },
        {
          heading: "Hébergement",
          paragraphs: [
            "Le site est conçu pour être déployé sur une infrastructure de type Vercel. Les coordonnées de l'hébergeur seront précisées lors de la mise en ligne.",
          ],
        },
        {
          heading: "Propriété intellectuelle",
          paragraphs: [
            "Les contenus éditoriaux originaux sont la propriété de l'éditeur. Les marques et modèles cités appartiennent à leurs détenteurs respectifs.",
          ],
        },
        {
          heading: "Responsabilité",
          paragraphs: [
            "Les données véhicules actuellement publiées sont des données d'exemple. Les calculateurs fournissent des estimations. L'éditeur ne saurait être tenu responsable d'une décision fondée sur ces informations de démonstration.",
          ],
        },
      ]}
    />
  );
}
