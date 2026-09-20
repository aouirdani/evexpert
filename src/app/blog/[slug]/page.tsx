import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentSections } from "@/components/ContentSections";
import { Faq } from "@/components/ui/Faq";
import { RelatedTools, RelatedVehicles } from "@/components/related";
import { AdSlot } from "@/components/ads/AdSlot";
import { Badge } from "@/components/ui/primitives";
import { JsonLd } from "@/components/ui/JsonLd";
import { articleJsonLd, faqJsonLd } from "@/lib/seo";
import { articles, getArticle } from "@/data/articles";
import { formatDateFr } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return buildMetadata({
    title: a.title,
    description: a.description,
    path: `/blog/${slug}`,
    ogType: "article",
    publishedTime: a.publishedAt,
    modifiedTime: a.updatedAt,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Blog", href: "/blog" },
          { name: a.title, href: `/blog/${slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/blog?categorie=${encodeURIComponent(a.category)}`}>
            <Badge tone="emerald">{a.category}</Badge>
          </Link>
          <span className="inline-flex items-center gap-1 text-sm text-slate-500">
            <Clock className="h-4 w-4" aria-hidden /> {a.readingTime} min de lecture
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {a.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          <span>Par {a.author}</span>
          <span>Publié le {formatDateFr(a.publishedAt)}</span>
          {a.updatedAt !== a.publishedAt && (
            <span>Mis à jour le {formatDateFr(a.updatedAt)}</span>
          )}
        </div>

        <p className="mt-6 text-lg font-medium leading-relaxed text-slate-700">
          {a.intro}
        </p>

        <div className="my-8">
          <AdSlot slot="article-inline" format="inline" />
        </div>

        <div className="mt-4">
          <ContentSections sections={a.sections} />
        </div>

        {a.relatedTools && <RelatedTools hrefs={a.relatedTools} />}
        {a.relatedVehicleIds && <RelatedVehicles ids={a.relatedVehicleIds} />}

        {a.faq && (
          <>
            <Faq items={a.faq} />
            <JsonLd data={faqJsonLd(a.faq)} />
          </>
        )}

        {a.sources && a.sources.length > 0 && (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">Sources</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {a.sources.map((s) => (
                <li key={s.url}>
                  <Link href={s.url} className="text-emerald-700 hover:underline">
                    {s.label}
                  </Link>{" "}
                  <span className="text-slate-500">
                    (consulté le {formatDateFr(s.accessed)})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <JsonLd
        data={articleJsonLd({
          title: a.title,
          description: a.description,
          path: `/blog/${slug}`,
          author: a.author,
          publishedAt: a.publishedAt,
          updatedAt: a.updatedAt,
        })}
      />
    </Container>
  );
}
