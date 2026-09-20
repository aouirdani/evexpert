import type { ReactNode } from "react";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Faq } from "@/components/ui/Faq";
import { RelatedTools } from "@/components/related";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import type { FaqItem } from "@/types";

export function ToolPageShell({
  title,
  description,
  calculator,
  explanation,
  faq,
  relatedTools,
}: {
  title: string;
  description: string;
  calculator: ReactNode;
  explanation: ReactNode;
  faq?: FaqItem[];
  relatedTools?: string[];
}) {
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Outils", href: "/outils" },
          { name: title, href: "#" },
        ]}
      />
      <PageHeader eyebrow="Calculateur" title={title} description={description} />

      <div className="mt-8">{calculator}</div>

      <section className="prose prose-slate mt-12 max-w-none">
        {explanation}
      </section>

      {relatedTools && relatedTools.length > 0 && (
        <RelatedTools hrefs={relatedTools} />
      )}

      {faq && faq.length > 0 && (
        <>
          <Faq items={faq} />
          <JsonLd data={faqJsonLd(faq)} />
        </>
      )}
    </Container>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 text-slate-700 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed">
      {children}
    </div>
  );
}
