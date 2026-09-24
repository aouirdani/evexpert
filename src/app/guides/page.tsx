import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { GuideCard } from "@/components/cards";
import { getGuides, guideCategoryLabels } from "@/data/guides";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import type { GuideCategory } from "@/types";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Guides voiture électrique : recharge, autonomie, batterie et coûts",
  description:
    "Guides pratiques sur la voiture électrique : calculer l'autonomie réelle, comprendre la recharge AC et DC, préserver la batterie, estimer le coût réel et choisir son modèle.",
  path: "/guides",
});

// "comprendre" en tête : ce sont les bases (kW vs kWh...), avant les rubriques pratiques.
const order: GuideCategory[] = ["comprendre", "autonomie", "recharge", "batterie", "coûts", "achat"];

export default async function GuidesPage() {
  const guides = await getGuides();
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />
      <PageHeader
        eyebrow="Guides"
        title="Guides voiture électrique : recharge, autonomie, batterie et coûts"
        description={`${guides.length} guides pratiques, rédigés à partir de méthodes de calcul visibles et de sources citées. Chaque guide renvoie vers l'outil de calcul correspondant.`}
      />
      <nav aria-label="Catégories" className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-4">
        <span className="label mr-1">Rubriques</span>
        {order.map((c) => (
          <a key={c} href={`#${c}`} className="link-u text-sm font-medium text-ink">
            {guideCategoryLabels[c]}
          </a>
        ))}
      </nav>
      {order.map((c) => {
        const list = guides.filter((g) => g.category === c);
        if (!list.length) return null;
        return (
          <section key={c} id={c} className="mt-section grid scroll-mt-28 gap-x-12 gap-y-8 lg:grid-cols-12" aria-labelledby={`h-${c}`}>
            <div className="lg:col-span-3">
              <h2 id={`h-${c}`} className="text-h2 font-bold text-ink">{guideCategoryLabels[c]}</h2>
              <p className="label mt-3">{list.length} guide{list.length > 1 ? "s" : ""}</p>
            </div>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-9">
              {list.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </section>
        );
      })}
      <p className="mt-section text-sm text-muted">
        Vous cherchez un calcul plutôt qu&apos;une explication ? Rendez-vous dans les <Link href="/outils" className="link-u font-semibold text-signal-deep">outils</Link>.
      </p>
      <JsonLd data={itemListJsonLd("Guides voiture électrique", guides.map((g) => ({ name: g.title, href: `/guides/${g.slug}` })))} />
    </Container>
  );
}
