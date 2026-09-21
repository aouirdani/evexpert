import Link from "next/link";
import { Clock } from "lucide-react";
import type { ArticleSection, FaqItem, Source } from "@/types";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Prose, TableOfContents } from "@/components/ui/Prose";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { RelatedGuides, RelatedTools, RelatedVehicles } from "@/components/related";
import { articleJsonLd, faqJsonLd } from "@/lib/seo";
import { formatDateFr } from "@/lib/utils";

/** Mise en page commune aux guides et aux articles de blog. */
export function ArticleView({
  crumbs,
  path,
  kicker,
  title,
  description,
  intro,
  sections,
  faq,
  sources,
  publishedAt,
  updatedAt,
  readingTime,
  relatedTools,
  relatedGuides,
  relatedVehicleIds,
}: {
  crumbs: Crumb[];
  path: string;
  kicker: string;
  title: string;
  description: string;
  intro: string;
  sections: ArticleSection[];
  faq?: FaqItem[];
  sources?: Source[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  relatedTools?: string[];
  relatedGuides?: string[];
  relatedVehicleIds?: string[];
}) {
  return (
    <Container className="py-10">
      <Breadcrumbs items={crumbs} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 max-w-3xl">
          <header>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">{kicker}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">{intro}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>Par la rédaction EVExpert</span>
              <span>
                Publié le <time dateTime={publishedAt}>{formatDateFr(publishedAt)}</time>
              </span>
              <span>
                Mis à jour le <time dateTime={updatedAt}>{formatDateFr(updatedAt)}</time>
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden /> {readingTime} min de lecture
              </span>
            </p>
          </header>

          <TableOfContents sections={sections} />

          <div className="mt-8">
            <Prose sections={sections} />
          </div>

          {faq && faq.length > 0 && (
            <>
              <Faq items={faq} />
              <JsonLd data={faqJsonLd(faq)} />
            </>
          )}

          {sources && sources.length > 0 && (
            <section aria-labelledby="sources-titre" className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 id="sources-titre" className="text-lg font-bold text-slate-900">Sources</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-emerald-800 underline underline-offset-2">
                      {s.label}
                    </a>{" "}
                    <span className="text-slate-600">(consulté le {formatDateFr(s.accessed)})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-600">
                Les chiffres calculés par EVExpert reposent sur les hypothèses de la page{" "}
                <Link href="/methodologie" className="underline">Méthodologie</Link>.
              </p>
            </section>
          )}
        </article>

        <aside className="space-y-2 lg:sticky lg:top-24 lg:h-fit">
          {relatedTools && <RelatedTools hrefs={relatedTools} />}
          {relatedGuides && <RelatedGuides slugs={relatedGuides} />}
          {relatedVehicleIds && <RelatedVehicles ids={relatedVehicleIds} title="Fiches véhicules" />}
        </aside>
      </div>
      <JsonLd data={articleJsonLd({ title, description, path, author: "La rédaction EVExpert", publishedAt, updatedAt })} />
    </Container>
  );
}
