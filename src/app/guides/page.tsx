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

const order: GuideCategory[] = ["autonomie", "recharge", "batterie", "coûts", "achat"];

export default async function GuidesPage() {
  const guides = await getGuides();
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />
      <PageHeader
        eyebrow="Guides"
        title="Guides voiture électrique : recharge, autonomie, batterie et coûts"
        description={`${guides.length} guides pratiques, rédigés à partir de méthodes de calcul visibles et de sources citées. Chaque guide renvoie vers l'outil de calcul correspondant.`}
      />
      <nav aria-label="Catégories" className="mt-6 flex flex-wrap gap-2">
        {order.map((c) => (
          <a key={c} href={`#${c}`} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:border-emerald-500 hover:text-emerald-800">
            {guideCategoryLabels[c]}
          </a>
        ))}
      </nav>
      {order.map((c) => {
        const list = guides.filter((g) => g.category === c);
        if (!list.length) return null;
        return (
          <section key={c} id={c} className="mt-12" aria-labelledby={`h-${c}`}>
            <h2 id={`h-${c}`} className="text-2xl font-bold text-slate-900">{guideCategoryLabels[c]}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </section>
        );
      })}
      <p className="mt-12 text-sm text-slate-600">
        Vous cherchez un calcul plutôt qu&apos;une explication ? Rendez-vous dans les <Link href="/outils" className="font-medium text-emerald-800 underline">outils</Link>.
      </p>
      <JsonLd data={itemListJsonLd("Guides voiture électrique", guides.map((g) => ({ name: g.title, href: `/guides/${g.slug}` })))} />
    </Container>
  );
}
