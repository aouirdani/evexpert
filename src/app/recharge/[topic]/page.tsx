import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/content/ArticleView";
import { chargingTopics, getChargingTopic } from "@/data/charging";
import { buildMetadata } from "@/lib/seo";

type Params = { topic: string };

export function generateStaticParams() {
  return chargingTopics.map((t) => ({ topic: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { topic } = await params;
  const t = getChargingTopic(topic);
  if (!t) return {};
  return buildMetadata({
    title: t.title,
    description: t.description,
    path: `/recharge/${t.slug}`,
    ogType: "article",
    modifiedTime: t.updatedAt,
  });
}

export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const { topic } = await params;
  const t = getChargingTopic(topic);
  if (!t) notFound();
  return (
    <ArticleView
      crumbs={[
        { name: "Recharge", href: "/recharge" },
        { name: t.shortTitle, href: `/recharge/${t.slug}` },
      ]}
      path={`/recharge/${t.slug}`}
      kicker="Recharge · Connecteurs"
      title={t.title}
      description={t.description}
      intro={t.intro}
      sections={t.sections}
      faq={t.faq}
      sources={t.sources}
      publishedAt={t.updatedAt}
      updatedAt={t.updatedAt}
      readingTime={3}
      relatedTools={["/outils/puissance-borne-recharge", "/outils/temps-recharge"]}
      relatedGuides={t.relatedGuides}
    />
  );
}
