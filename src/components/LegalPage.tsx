import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import type { ArticleSection } from "@/types";

export function LegalPage({
  title,
  description,
  breadcrumb,
  href,
  sections,
}: {
  title: string;
  description: string;
  breadcrumb: string;
  href: string;
  sections: ArticleSection[];
}) {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: breadcrumb, href }]} />
      <article className="max-w-3xl">
        <PageHeader title={title} description={description} />
        <div className="mt-8">
          <ContentSections sections={sections} />
        </div>
      </article>
    </Container>
  );
}
