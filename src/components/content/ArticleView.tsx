import Link from "next/link";
import { Clock } from "lucide-react";
import type { ArticleSection, EditorialImage, FaqItem, Source } from "@/types";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Prose, TableOfContents } from "@/components/ui/Prose";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { EditorialFigure } from "@/components/content/EditorialFigure";
import { RelatedGuides, RelatedTools, RelatedVehicles } from "@/components/related";
import { articleJsonLd, faqJsonLd, shareImageOf } from "@/lib/seo";
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
  hero,
  jsonLdType = "Article",
  section,
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
  /** Image principale : affichée sous l'introduction, reprise dans le JSON-LD. */
  hero?: EditorialImage;
  jsonLdType?: "Article" | "BlogPosting";
  /** Rubrique (articleSection du JSON-LD), identique à celle affichée dans le surtitre. */
  section?: string;
}) {
  return (
    <Container className="py-10">
      <Breadcrumbs items={crumbs} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 max-w-3xl">
          <header>
            <p className="eyebrow text-signal-deep">{kicker}</p>
            <h1 className="mt-2 text-h1 font-bold text-ink">{title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-body">{intro}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
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

          {hero && <EditorialFigure image={hero} priority className="mb-0 mt-6" />}

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
            <section aria-labelledby="sources-titre" className="mt-12 rounded-2xl border border-line bg-surface p-5">
              <h2 id="sources-titre" className="text-lg font-bold text-ink">Sources</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-signal-deep underline underline-offset-2">
                      {s.label}
                    </a>{" "}
                    <span className="text-muted">(consulté le {formatDateFr(s.accessed)})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">
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
          <section className="mt-8 rounded-2xl border border-line bg-ink p-5 text-paper">
            <h2 className="text-lg font-bold">Passer à la pratique</h2>
            <ul className="mt-3 space-y-2 text-sm font-medium">
              <li>
                <Link href="/voitures-electriques" className="text-signal underline-offset-4 hover:underline">
                  Explorer les fiches techniques des voitures électriques
                </Link>
              </li>
              <li>
                <Link href="/comparer" className="text-signal underline-offset-4 hover:underline">
                  Comparer deux ou trois modèles côte à côte
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
      <JsonLd
        data={articleJsonLd({
          type: jsonLdType,
          title,
          description,
          path,
          author: "La rédaction EVExpert",
          publishedAt,
          updatedAt,
          image: hero ? shareImageOf(hero) : undefined,
          section,
        })}
      />
    </Container>
  );
}
