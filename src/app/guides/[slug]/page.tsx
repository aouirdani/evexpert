import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import { Faq } from "@/components/ui/Faq";
import { RelatedTools } from "@/components/related";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { JsonLd } from "@/components/ui/JsonLd";
import { articleJsonLd, faqJsonLd } from "@/lib/seo";
import { guides, getGuide } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return buildMetadata({
    title: g.title,
    description: g.description,
    path: `/guides/${slug}`,
    ogType: "article",
    modifiedTime: g.updatedAt,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Guides", href: "/guides" },
          { name: g.title, href: `/guides/${slug}` },
        ]}
      />
      <article className="max-w-3xl">
        <PageHeader eyebrow="Guide" title={g.title} description={g.intro} />
        <div className="mt-3">
          <LastUpdated date={g.updatedAt} />
        </div>
        <div className="mt-8">
          <ContentSections sections={g.sections} />
        </div>
        {g.relatedTools && <RelatedTools hrefs={g.relatedTools} />}
        {g.faq && (
          <>
            <Faq items={g.faq} />
            <JsonLd data={faqJsonLd(g.faq)} />
          </>
        )}
      </article>
      <JsonLd
        data={articleJsonLd({
          title: g.title,
          description: g.description,
          path: `/guides/${slug}`,
          author: "La rédaction EVExpert",
          publishedAt: g.updatedAt,
          updatedAt: g.updatedAt,
        })}
      />
    </Container>
  );
}
