import Link from "next/link";
import type { ArticleSection, EditorialImage, FaqItem, Source } from "@/types";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/layout/Section";
import { Colophon } from "@/components/content/Colophon";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Prose, TableOfContents } from "@/components/ui/Prose";
import { Faq } from "@/components/ui/Faq";
import { EssentialBox } from "@/components/content/EssentialBox";
import { AdReserve } from "@/components/ads/AdReserve";
import { tools } from "@/data/tools";
import { buildEssentials } from "@/lib/essentials";
import { JsonLd } from "@/components/ui/JsonLd";
import { EditorialFigure } from "@/components/content/EditorialFigure";
import { RelatedGuides, RelatedTools, RelatedVehicles } from "@/components/related";
import { articleJsonLd, faqJsonLd, shareImageOf } from "@/lib/seo";
import { formatDateFr, frTypo } from "@/lib/format";
import { author } from "@/config/author";

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
  visual = false,
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
  /**
   * Mise en page « visuelle » (prototype) : photo 16:9 en tête de la colonne de lecture, encadré
   * « L'essentiel », outils liés et emplacement publicitaire réservé dans la barre latérale. Les textes,
   * intertitres et ancres de l'article sont ceux de la mise en page standard.
   */
  visual?: boolean;
}) {
  const heroIsPhoto = hero && !hero.src.endsWith(".svg");
  const essentials = visual ? buildEssentials(sections) : [];
  const sidebarTools = visual && relatedTools ? tools.filter((t) => relatedTools.includes(t.href) || relatedTools.includes(t.slug)) : [];
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={crumbs} />

      <header className="max-w-4xl">
        <Kicker aside={`${readingTime} min de lecture`}>{kicker}</Kicker>
        <h1 className="balance mt-5 text-h1 font-bold text-ink">{frTypo(title)}</h1>
        <p className="pretty mt-6 max-w-3xl text-dek text-body">{intro}</p>
      </header>
      <Colophon publishedAt={publishedAt} updatedAt={updatedAt} readingTime={readingTime} />

      {heroIsPhoto && !visual && <EditorialFigure image={hero} priority wide className="mb-0 mt-10" />}

      <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,44rem)_minmax(0,1fr)]">
        <article className="min-w-0">
          {visual && heroIsPhoto && (
            <EditorialFigure image={hero} priority ratio="16/9" sizes="(min-width: 1024px) 704px, 100vw" className="mb-10 mt-0" />
          )}
          {visual && <EssentialBox items={essentials} />}
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
            {sidebarTools.length > 0 && (
              <nav aria-label="Outils liés" className="mt-8">
                <p className="label mb-2">Outils liés</p>
                <ul className="border-t-2 border-ink">
                  {sidebarTools.map((t) => (
                    <li key={t.href} className="border-b border-line">
                      <Link href={t.href} className="link-h block py-3 text-sm font-semibold text-ink">
                        {t.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
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
            {visual && <AdReserve slot="guide-sidebar" className="mt-8" />}
          </div>
        </aside>
      </div>

      {(relatedTools || relatedGuides || relatedVehicleIds) && (
        <div className="mt-section grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {relatedTools && (
            <div className={visual ? "lg:hidden" : undefined}>
              <RelatedTools hrefs={relatedTools} />
            </div>
          )}
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
          author: author.name,
          publishedAt,
          updatedAt,
          image: hero ? shareImageOf(hero) : undefined,
          section,
        })}
      />
    </Container>
  );
}
