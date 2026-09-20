import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politique de confidentialité",
  description: "Comment nous traitons vos données personnelles.",
  path: "/confidentialite",
  noindex: true,
});

export default function Page() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      description="Notre approche de la protection des données personnelles (RGPD)."
      breadcrumb="Confidentialité"
      href="/confidentialite"
      sections={[
        {
          heading: "Données collectées",
          paragraphs: [
            "Le site ne nécessite pas de création de compte. Les calculateurs fonctionnent côté navigateur : les valeurs que vous saisissez ne sont pas transmises à un serveur.",
          ],
        },
        {
          heading: "Mesure d'audience et cookies",
          paragraphs: [
            "Des outils de mesure d'audience (par exemple Google Analytics) peuvent être activés, mais uniquement après votre consentement via la bannière cookies. Aucun cookie non essentiel n'est déposé sans accord préalable.",
          ],
        },
        {
          heading: "Publicité",
          paragraphs: [
            "Le site est préparé pour la publicité (Google AdSense), désactivée par défaut. Le cas échéant, la publicité personnalisée serait soumise à votre consentement.",
          ],
        },
        {
          heading: "Vos droits",
          paragraphs: [
            "Conformément au RGPD, vous disposez de droits d'accès, de rectification et d'opposition. Pour toute demande, contactez-nous via la page Contact.",
          ],
        },
      ]}
    />
  );
}
