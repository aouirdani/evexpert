import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Prose } from "@/components/ui/Prose";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contacter EVExpert : signaler une erreur de données, proposer une correction ou poser une question sur les outils.",
  path: "/contact",
});

export default function Page() {
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
      <article className="max-w-3xl">
        <PageHeader
          eyebrow="Contact"
          title="Contacter EVExpert"
          description="Une erreur, une question sur un calcul, une suggestion : nous lisons chaque message."
        />
        <div className="mt-3">
          <LastUpdated date="2026-09-21" />
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-paper-deep p-5">
          {siteConfig.email ? (
            <p className="text-ink">
              Écrivez-nous à{" "}
              <a href={`mailto:${siteConfig.email}`} className="link-u font-bold text-signal-deep">{siteConfig.email}</a>.
            </p>
          ) : (
            <p className="text-ink">
              L&apos;adresse de contact sera publiée sur cette page prochainement. En attendant, consultez la{" "}
              <Link href="/methodologie" className="link-u font-semibold text-signal-deep">méthodologie</Link> et les{" "}
              <Link href="/sources" className="link-u font-semibold text-signal-deep">sources</Link> pour vérifier une donnée.
            </p>
          )}
        </div>

        <div className="mt-8">
          <Prose
            sections={[
              {
                heading: "Signaler une erreur de données",
                paragraphs: ["Pour accélérer la vérification, indiquez :"],
                list: [
                  "le modèle et la version concernés (avec le lien de la fiche),",
                  "la valeur affichée et la valeur que vous pensez correcte,",
                  "la source qui étaye votre correction (page constructeur, document technique).",
                ],
              },
              {
                heading: "Autres demandes",
                paragraphs: [
                  "Questions sur un calculateur, suggestion de modèle à ajouter, demande relative à vos données personnelles (voir la politique de confidentialité) : précisez l'objet dans votre message.",
                  "Nous ne répondons pas aux demandes de contenus sponsorisés présentés comme éditoriaux.",
                ],
              },
            ]}
          />
        </div>
      </article>
    </Container>
  );
}
