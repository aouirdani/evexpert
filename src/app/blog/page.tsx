import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArticleCard } from "@/components/cards";
import { getArticles } from "@/data/blog";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Blog EVExpert : analyses chiffrées sur la voiture électrique",
  description:
    "Analyses sourcées et recalculées sur les données du catalogue EVExpert : consommation, recharge rapide, batteries. Pas d'actualité non vérifiée.",
  path: "/blog",
});

export default async function BlogPage() {
  const articles = await getArticles();
  const sorted = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
      <PageHeader
        eyebrow="Blog"
        title="Blog : analyses chiffrées sur la voiture électrique"
        description="Nous privilégions la qualité au volume : chaque article s'appuie sur des données du catalogue ou sur des sources citées, et indique sa date de mise à jour. Nous ne publions pas d'actualité que nous ne pouvons pas vérifier."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-600">
        Suivre le blog : <a href="/blog/rss.xml" className="font-medium text-emerald-800 underline">flux RSS</a>.
      </p>
      <JsonLd data={itemListJsonLd("Articles du blog EVExpert", sorted.map((a) => ({ name: a.title, href: `/blog/${a.slug}` })))} />
    </Container>
  );
}
