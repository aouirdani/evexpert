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
            "Un seul message de consentement gère désormais la mesure d'audience et la publicité : celui de Google (« Réglementations européennes »), affiché aux visiteurs européens. Le site ne gère plus son propre bandeau ni son propre stockage de consentement.",
            "Avant votre réponse à ce message, Google Consent Mode (v2) refuse par défaut les quatre signaux concernés (stockage publicitaire, données utilisateur publicitaires, personnalisation publicitaire, stockage de mesure d'audience) : les scripts Google Analytics et Google AdSense sont chargés sur chaque page, mais n'écrivent aucun cookie et ne transmettent aucune donnée identifiante tant que vous n'avez pas répondu.",
          ],
        },
        {
          heading: "Ce qui pourra être activé avec votre accord",
          paragraphs: [],
          table: {
            headers: ["Catégorie", "Outil", "Finalité", "État"],
            rows: [
              ["Mesure d'audience", "Google Analytics", "Statistiques de fréquentation", "Régi par le message de consentement Google (refusé par défaut, mis à jour par votre choix)"],
              ["Publicité", "Google AdSense", "Affichage d'annonces", "Régi par le message de consentement Google (refusé par défaut, mis à jour par votre choix)"],
            ],
          },
        },
        {
          heading: "Gérer votre choix",
          paragraphs: [
            "Le message de Google propose ses propres choix. Pour le rouvrir à tout moment et modifier votre décision, utilisez le bouton « Gérer mes cookies » en bas de chaque page. Vous pouvez aussi supprimer le stockage du site dans les réglages de votre navigateur.",
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
