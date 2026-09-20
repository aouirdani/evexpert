import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleCard } from "@/components/cards";
import { articles, articleCategories } from "@/data/articles";
import { buildMetadata } from "@/lib/seo";
import type { ArticleCategory } from "@/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  return buildMetadata({
    title: categorie ? `Blog — ${categorie}` : "Blog sur la voiture électrique",
    description:
      "Actualités, guides, comparatifs et analyses sur la voiture électrique, la recharge et la batterie.",
    path: categorie ? `/blog?categorie=${categorie}` : "/blog",
    // Filtered views are canonicalised to /blog and not indexed separately.
    noindex: Boolean(categorie),
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const active = categorie as ArticleCategory | undefined;
  const list = active
    ? articles.filter((a) => a.category === active)
    : articles;

  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
      <PageHeader
        eyebrow="Blog"
        title="Le blog EVExpert"
        description="Des articles originaux et utiles sur la voiture électrique. Pas de contenu automatisé de masse."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${!active ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-emerald-300"}`}
        >
          Tout
        </Link>
        {articleCategories.map((c) => (
          <Link
            key={c}
            href={`/blog?categorie=${encodeURIComponent(c)}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${active === c ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-emerald-300"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {list.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
          Aucun article dans cette catégorie pour le moment.
        </p>
      )}
    </Container>
  );
}
