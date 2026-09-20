import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import { Faq } from "@/components/ui/Faq";
import { RelatedTools } from "@/components/related";
import { chargingTopics, getChargingTopic } from "@/data/charging";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return chargingTopics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const t = getChargingTopic(topic);
  if (!t) return {};
  return buildMetadata({
    title: t.title,
    description: t.description,
    path: `/recharge/${topic}`,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const t = getChargingTopic(topic);
  if (!t) notFound();

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Recharge", href: "/recharge" },
          { name: t.shortTitle, href: `/recharge/${topic}` },
        ]}
      />
      <PageHeader eyebrow="Recharge" title={t.title} description={t.intro} />
      <article className="mt-8 max-w-3xl">
        <ContentSections sections={t.sections} />
        <RelatedTools hrefs={["/outils/temps-recharge", "/outils/puissance-borne-recharge"]} />
        {t.faq && <Faq items={t.faq} />}
      </article>
    </Container>
  );
}
