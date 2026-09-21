import Link from "next/link";
import type { ArticleSection, EditorialImage, FaqItem, Source } from "@/types";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/layout/Section";
import { Colophon } from "@/components/content/Colophon";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Prose, TableOfContents } from "@/components/ui/Prose";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { EditorialFigure } from "@/components/content/EditorialFigure";
import { RelatedGuides, RelatedTools, RelatedVehicles } from "@/components/related";
import { articleJsonLd, faqJsonLd, shareImageOf } from "@/lib/seo";
import { formatDateFr, frTypo } from "@/lib/utils";

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
  /** Image principale : photo pleine largeur en ouverture, ou schéma sous l'introduction ; reprise dans le JSON-LD. */
  hero?: EditorialImage;
  jsonLdType?: "Article" | "BlogPosting";
  /** Rubrique (articleSection du JSON-LD), identique à celle affichée dans le surtitre. */
  section?: string;
}) {
  const heroIsPhoto = hero && !hero.src.endsWith(".svg");
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={crumbs} />

      <header className="max-w-4xl">
        <Kicker aside={`${readingTime} min de lecture`}>{kicker}</Kicker>
        <h1 className="balance mt-5 text-h1 font-bold text-ink">{frTypo(title)}</h1>
        <p className="pretty mt-6 max-w-3xl text-dek text-body">{intro}</p>
      </header>
      <Colophon publishedAt={publishedAt} updatedAt={updatedAt} readingTime={readingTime} />

      {heroIsPhoto && <EditorialFigure image={hero} priority wide className="mb-0 mt-10" />}

      <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,44rem)_minmax(0,1fr)]">
        <article className="min-w-0">
          {hero && !heroIsPhoto && <EditorialFigure image={hero} priority className="mb-8 mt-0" />}

          <TableOfContents sections={sections} className="mb-10 lg:hidden" />

          <Prose sections={sections} />

          {faq && faq.length > 0 && (
            <>
              <Faq items={faq} />
              <JsonLd data={faqJsonLd(faq)} />
            </>
          )}

          {sources && sources.length > 0 && (
            <section aria-labelledby="sources-titre" className="mt-14">
              <h2 id="sources-titre" className="text-h3 font-bold text-ink">Sources</h2>
              <ul className="mt-3 border-t-2 border-ink text-sm">
                {sources.map((s) => (
                  <li key={s.url} className="border-b border-line py-3">
                    <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="link-u font-semibold text-signal-deep">
                      {s.label}
                    </a>{" "}
                    <span className="text-muted">(consulté le {formatDateFr(s.accessed)})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-caption text-muted">
                Les chiffres calculés par EVExpert reposent sur les hypothèses de la page{" "}
                <Link href="/methodologie" className="link-u font-semibold text-signal-deep">Méthodologie</Link>.
              </p>
            </section>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)]">
            <TableOfContents sections={sections} />
            <div className="on-ink mt-8 rounded-2xl bg-ink p-6 text-paper">
              <p className="eyebrow text-signal">Passer à la pratique</p>
              <ul className="mt-4 space-y-3 text-sm font-semibold">
                <li>
                  <Link href="/voitures-electriques" className="link-u text-paper">
                    Explorer les fiches techniques
                  </Link>
                </li>
                <li>
                  <Link href="/comparer" className="link-u text-paper">
                    Comparer deux ou trois modèles côte à côte
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {(relatedTools || relatedGuides || relatedVehicleIds) && (
        <div className="mt-section grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {relatedTools && <RelatedTools hrefs={relatedTools} />}
          {relatedGuides && <RelatedGuides slugs={relatedGuides} />}
          {relatedVehicleIds && <RelatedVehicles ids={relatedVehicleIds} title="Fiches véhicules" />}
        </div>
      )}
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
