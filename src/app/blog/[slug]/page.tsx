import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/content/ArticleView";
import { getArticle, getArticles } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

type Params = { slug: string };

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return buildMetadata({
    title: a.title,
    description: a.description,
    path: `/blog/${a.slug}`,
    ogType: "article",
    publishedTime: a.publishedAt,
    modifiedTime: a.updatedAt,
  });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  return (
    <ArticleView
      crumbs={[
        { name: "Blog", href: "/blog" },
        { name: a.title, href: `/blog/${a.slug}` },
      ]}
      path={`/blog/${a.slug}`}
      kicker={`Blog · ${a.category}`}
      title={a.title}
      description={a.description}
      intro={a.intro}
      sections={a.sections}
      faq={a.faq}
      sources={a.sources}
      publishedAt={a.publishedAt}
      updatedAt={a.updatedAt}
      readingTime={a.readingTime}
      relatedTools={a.relatedTools}
      relatedGuides={a.relatedGuides}
      relatedVehicleIds={a.relatedVehicleIds}
    />
  );
}
