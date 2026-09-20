import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { SearchBar } from "@/components/layout/SearchBar";
import { Badge } from "@/components/ui/primitives";
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
  const results = query ? searchAll(query) : [];

  return (
    <Container className="py-10">
      <PageHeader
        title="Recherche"
        description="Trouvez une voiture, un calculateur, un guide ou un article."
      />
      <div className="mt-6 max-w-2xl">
        <SearchBar size="lg" defaultValue={query} />
      </div>

      {query && (
        <p className="mt-6 text-sm text-slate-600">
          {results.length} résultat(s) pour «&nbsp;{query}&nbsp;»
        </p>
      )}

      <div className="mt-4 space-y-3">
        {results.map((r) => (
          <Link
            key={`${r.type}-${r.href}`}
            href={r.href}
            className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm"
          >
            <div className="mb-1.5">
              <Badge tone="blue">{typeLabels[r.type]}</Badge>
            </div>
            <h2 className="text-base font-bold text-slate-900">{r.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{r.description}</p>
          </Link>
        ))}
        {query && results.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Aucun résultat. Essayez un autre terme (marque, modèle, « recharge », « TCO »…).
          </p>
        )}
      </div>
    </Container>
  );
}
