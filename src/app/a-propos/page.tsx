import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Prose } from "@/components/ui/Prose";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "À propos d'EVExpert",
  description:
    "EVExpert aide à comprendre, comparer et calculer le coût réel d'une voiture électrique en France : notre mission, nos quatre piliers et nos règles éditoriales.",
  path: "/a-propos",
});

export default function Page() {
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "À propos", href: "/a-propos" }]} />
      <article className="max-w-3xl">
        <PageHeader
          eyebrow="À propos"
          title="À propos d'EVExpert"
          description={`${siteConfig.name} — ${siteConfig.tagline} Une plateforme française pour comprendre, comparer et calculer le coût réel d'une voiture électrique.`}
        />
        <div className="mt-3">
          <LastUpdated date="2026-09-21" />
        </div>
        <div className="mt-8">
          <Prose
            sections={[
              {
                heading: "Notre mission",
                paragraphs: [
                  "Passer à l'électrique soulève des questions concrètes : quelle autonomie aurai-je vraiment, combien coûtera la recharge, quelle borne choisir, l'électrique revient-elle moins cher ? EVExpert y répond avec des outils dont chaque calcul est visible et des données dont la source est citée.",
                ],
              },
              {
                heading: "Quatre piliers",
                paragraphs: [],
                list: [
                  "Outils : sept calculateurs (coût de recharge, autonomie, coût aux 100 km, essence vs électrique, TCO, temps de recharge, puissance de borne) avec formules, exemples et limites.",
                  "Véhicules : un catalogue de fiches techniques sourcées, avec « Non disponible » quand une donnée manque.",
                  "Recharge : AC, DC, puissances, connecteurs, coûts.",
                  "Guides et analyses : des contenus pédagogiques et des analyses chiffrées à partir de notre catalogue.",
                ],
              },
              {
                heading: "Nos règles éditoriales",
                paragraphs: [],
                list: [
                  "Nous n'inventons pas de données : une valeur inconnue reste vide.",
                  "Nous distinguons données sourcées, calculs et estimations, avec un badge sur les pages concernées.",
                  "Nous ne publions ni faux avis, ni faux témoignages, ni classement subjectif automatique de « meilleure voiture ».",
                  "Nous n'acceptons pas de contenu sponsorisé déguisé en avis éditorial. Si des publicités ou des liens commerciaux sont un jour ajoutés, ils seront clairement identifiés.",
                  "Nous corrigeons les erreurs signalées et mettons à jour les dates.",
                ],
              },
              {
                heading: "Ce que nous ne sommes pas",
                paragraphs: [
                  "EVExpert n'est ni un constructeur, ni un concessionnaire, ni un conseiller financier. Nos estimations éclairent une décision, elles ne la remplacent pas : vérifiez auprès du constructeur et des sources officielles avant d'acheter.",
                ],
              },
              {
                heading: "Aller plus loin",
                paragraphs: [],
              },
            ]}
          />
          <ul className="mt-2 space-y-2 text-sm">
            <li><Link href="/methodologie" className="link-u font-semibold text-signal-deep">Méthodologie : comment nous calculons</Link></li>
            <li><Link href="/sources" className="link-u font-semibold text-signal-deep">Sources des données</Link></li>
            <li><Link href="/contact" className="link-u font-semibold text-signal-deep">Nous contacter ou signaler une erreur</Link></li>
          </ul>
        </div>
      </article>
    </Container>
  );
}
