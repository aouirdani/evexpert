import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/content/ArticleView";
import { getGuide, getGuides, guideCategoryLabels } from "@/data/guides";
import { buildMetadata, shareImageOf } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

type Params = { slug: string };

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) return {};
  return buildMetadata({
    title: g.metaTitle ?? g.title,
    description: g.metaDescription ?? g.description,
    path: `/guides/${g.slug}`,
    ogType: "article",
    publishedTime: g.publishedAt,
    modifiedTime: g.updatedAt,
    image: g.hero && shareImageOf(g.hero),
  });
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) notFound();
  return (
    <ArticleView
      crumbs={[
        { name: "Guides", href: "/guides" },
        { name: g.title, href: `/guides/${g.slug}` },
      ]}
      path={`/guides/${g.slug}`}
      kicker={`Guide · ${guideCategoryLabels[g.category]}`}
      title={g.title}
      description={g.description}
      intro={g.intro}
      sections={g.sections}
      faq={g.faq}
      sources={g.sources}
      publishedAt={g.publishedAt}
      updatedAt={g.updatedAt}
      readingTime={g.readingTime}
      relatedTools={g.relatedTools}
      relatedGuides={g.relatedGuides}
      relatedVehicleIds={g.relatedVehicleIds}
      hero={g.hero}
      section={guideCategoryLabels[g.category]}
    />
  );
}
