import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { BlogBrowser, type BlogCard } from "@/components/guides/BlogBrowser";
import { formatDateFr } from "@/lib/format";
import { getArticles } from "@/data/blog";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Blog : analyses chiffrées sur la voiture électrique",
  description:
    "Analyses sourcées et recalculées sur les données du catalogue EVExpert : consommation, recharge rapide, batteries. Pas d'actualité non vérifiée.",
  path: "/blog",
});

export default async function BlogPage() {
  const articles = await getArticles();
  const sorted = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const cards: BlogCard[] = sorted.map((a) => ({
    href: `/blog/${a.slug}`,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    categoryLabel: a.category,
    readingTime: a.readingTime,
    dateLabel: "Mis à jour le",
    updatedAtIso: a.updatedAt,
    updatedAtLabel: formatDateFr(a.updatedAt),
    // Photographies uniquement : les schémas SVG ne servent pas de vignette.
    image: a.hero && !a.hero.src.endsWith(".svg") ? { src: a.hero.src, width: a.hero.width, height: a.hero.height } : undefined,
  }));
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
      <PageHeader
        eyebrow="Blog"
        title="Blog : analyses chiffrées sur la voiture électrique"
        description="Nous privilégions la qualité au volume : chaque article s'appuie sur des données du catalogue ou sur des sources citées, et indique sa date de mise à jour. Nous ne publions pas d'actualité que nous ne pouvons pas vérifier."
      />
      <BlogBrowser cards={cards} />
      <p className="mt-section text-sm text-muted">
        Suivre le blog : <a href="/blog/rss.xml" className="link-u font-semibold text-signal-deep">flux RSS</a>.
      </p>
      <JsonLd data={itemListJsonLd("Articles du blog EVExpert", sorted.map((a) => ({ name: a.title, href: `/blog/${a.slug}` })))} />
    </Container>
  );
}
