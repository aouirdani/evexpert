import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/content/ArticleView";
import { getGuide, guideCategoryLabels, guides } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return buildMetadata({
    title: g.title,
    description: g.description,
    path: `/guides/${g.slug}`,
    ogType: "article",
    publishedTime: g.publishedAt,
    modifiedTime: g.updatedAt,
  });
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const g = getGuide(slug);
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
    />
  );
}
