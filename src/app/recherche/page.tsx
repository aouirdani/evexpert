import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { SearchBar } from "@/components/layout/SearchBar";
import { searchAll, type SearchResultType } from "@/lib/search";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Recherche",
  description: "Rechercher une voiture, un outil, un guide ou un article.",
  path: "/recherche",
  noindex: true,
});

const typeLabels: Record<SearchResultType, string> = {
  vehicle: "Voiture",
  tool: "Outil",
  guide: "Guide",
  article: "Article",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchAll(query) : [];

  const groups = (Object.keys(typeLabels) as SearchResultType[])
    .map((t) => ({ type: t, items: results.filter((r) => r.type === t) }))
    .filter((g) => g.items.length);

  return (
    <Container className="pb-section pt-8">
      <PageHeader
        title="Recherche"
        description="Trouvez une voiture, un calculateur, un guide ou un article."
      />
      <div className="mt-8 max-w-2xl">
        <SearchBar size="lg" defaultValue={query} />
      </div>

      {query && (
        <p className="mt-8 text-sm text-muted">
          <span className="num text-data-md font-bold text-ink">{results.length}</span> résultat{results.length > 1 ? "s" : ""} pour «&nbsp;{query}&nbsp;»
        </p>
      )}

      {groups.map((g) => (
        <section key={g.type} className="mt-8" aria-labelledby={`res-${g.type}`}>
          <h2 id={`res-${g.type}`} className="label mb-2">
            {typeLabels[g.type]}s <span className="num text-ink">{g.items.length}</span>
          </h2>
          <ul className="border-t-2 border-ink">
            {g.items.map((r) => (
              <li key={`${r.type}-${r.href}`} className="border-b border-line">
                <Link href={r.href} className="group grid gap-x-8 gap-y-1 py-4 md:grid-cols-[minmax(0,20rem)_1fr]">
                  <span className="text-base font-bold text-ink">
                    <span className="link-h group-hover:[background-size:100%_2px]">{r.title}</span>
                  </span>
                  <span className="text-sm text-muted">{r.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {query && results.length === 0 && (
        <p className="mt-8 border-t-2 border-ink pt-5 text-body">
          Aucun résultat. Essayez un autre terme (marque, modèle, « recharge », « TCO »…).
        </p>
      )}
    </Container>
  );
}
