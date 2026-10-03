import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { GuidesBrowser, type GuideGroup } from "@/components/guides/GuidesBrowser";
import { formatDateFr } from "@/lib/format";
import { getGuides, guideCategoryLabels } from "@/data/guides";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import type { GuideCategory } from "@/types";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Guides voiture électrique : autonomie, recharge, batterie",
  description:
    "Guides pratiques sur la voiture électrique : autonomie réelle, recharge AC et DC, durée de vie et prix de la batterie, coût réel. Sources citées.",
  path: "/guides",
});

// "comprendre" en tête : ce sont les bases (kW vs kWh...), avant les rubriques pratiques.
const order: GuideCategory[] = ["comprendre", "autonomie", "recharge", "batterie", "coûts", "achat"];

export default async function GuidesPage() {
  const guides = await getGuides();
  const groups: GuideGroup[] = order
    .map((c) => ({
      id: c,
      label: guideCategoryLabels[c],
      guides: guides
        .filter((g) => g.category === c)
        .map((g) => ({
          slug: g.slug,
          title: g.title,
          excerpt: g.description,
          categoryLabel: guideCategoryLabels[c],
          readingTime: g.readingTime,
          updatedAtIso: g.updatedAt,
          updatedAtLabel: formatDateFr(g.updatedAt),
          // Photographies uniquement : les schémas SVG ne servent pas de vignette.
          image: g.hero && !g.hero.src.endsWith(".svg") ? { src: g.hero.src, width: g.hero.width, height: g.hero.height } : undefined,
        })),
    }))
    .filter((g) => g.guides.length > 0);
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />
      <PageHeader
        eyebrow="Guides"
        title="Guides voiture électrique : recharge, autonomie, batterie et coûts"
        description={`${guides.length} guides pratiques, rédigés à partir de méthodes de calcul visibles et de sources citées. Chaque guide renvoie vers l'outil de calcul correspondant.`}
      />
      <GuidesBrowser groups={groups} />
      <p className="mt-section text-sm text-muted">
        Vous cherchez un calcul plutôt qu&apos;une explication ? Rendez-vous dans les <Link href="/outils" className="link-u font-semibold text-signal-deep">outils</Link>.
      </p>
      <JsonLd data={itemListJsonLd("Guides voiture électrique", guides.map((g) => ({ name: g.title, href: `/guides/${g.slug}` })))} />
    </Container>
  );
}
