import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Prose } from "@/components/ui/Prose";
import { LastUpdated } from "@/components/ui/SourceBadge";
import type { ArticleSection } from "@/types";

export function LegalPage({
  title,
  description,
  breadcrumb,
  href,
  sections,
  updatedAt = "2026-09-21",
  children,
}: {
  title: string;
  description: string;
  breadcrumb: string;
  href: string;
  sections: ArticleSection[];
  updatedAt?: string;
  children?: React.ReactNode;
}) {
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: breadcrumb, href }]} />
      <article className="max-w-3xl">
        <PageHeader title={title} description={description} />
        <div className="mt-3">
          <LastUpdated date={updatedAt} />
        </div>
        <div className="mt-8">
          <Prose sections={sections} />
          {children}
        </div>
      </article>
    </Container>
  );
}
