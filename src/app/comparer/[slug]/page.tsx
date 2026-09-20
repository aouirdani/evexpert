import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { DemoNotice } from "@/components/ui/SourceBadge";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { getFeaturedComparisons, parseComparison } from "@/lib/comparison";
import { vehicleTitle } from "@/data/vehicles";
import { formatEuro, formatNumber } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getFeaturedComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = parseComparison(slug);
  if (!pair) return { robots: { index: false, follow: true } };
  const [a, b] = pair;
  return buildMetadata({
    title: `${a.brand} ${a.model} vs ${b.brand} ${b.model} : comparatif`,
    description: `Comparatif ${vehicleTitle(a)} vs ${vehicleTitle(b)} : prix, autonomie, batterie, recharge et performances (données d'exemple).`,
    path: `/comparer/${slug}`,
  });
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = parseComparison(slug);
  if (!pair) notFound();
  const [a, b] = pair;

  const faq = [
    {
      question: `Quelle voiture a la meilleure autonomie, ${a.model} ou ${b.model} ?`,
      answer: `Selon les données d'exemple, la ${a.rangeWltp >= b.rangeWltp ? `${a.brand} ${a.model}` : `${b.brand} ${b.model}`} affiche la meilleure autonomie WLTP (${formatNumber(Math.max(a.rangeWltp, b.rangeWltp))} km contre ${formatNumber(Math.min(a.rangeWltp, b.rangeWltp))} km).`,
    },
    {
      question: `Laquelle est la moins chère ?`,
      answer: `La ${a.price <= b.price ? `${a.brand} ${a.model}` : `${b.brand} ${b.model}`} est la plus abordable, à partir de ${formatEuro(Math.min(a.price, b.price))} (prix indicatif).`,
    },
  ];

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Comparer", href: "/comparer" },
          { name: `${a.model} vs ${b.model}`, href: `/comparer/${slug}` },
        ]}
      />
      <PageHeader
        eyebrow="Comparatif"
        title={`${a.brand} ${a.model} vs ${b.brand} ${b.model}`}
        description={`Comparaison détaillée entre la ${vehicleTitle(a)} et la ${vehicleTitle(b)}.`}
      />
      <div className="mt-6">
        <DemoNotice />
      </div>
      <div className="mt-8">
        <ComparisonTable vehicles={[a, b]} />
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href={`/voitures-electriques/${a.brandSlug}/${a.modelSlug}`} className="font-medium text-emerald-700 hover:underline">
          Fiche {a.brand} {a.model} →
        </Link>
        <Link href={`/voitures-electriques/${b.brandSlug}/${b.modelSlug}`} className="font-medium text-emerald-700 hover:underline">
          Fiche {b.brand} {b.model} →
        </Link>
        <Link href="/outils/tco-voiture-electrique" className="font-medium text-emerald-700 hover:underline">
          Comparer le coût total (TCO) →
        </Link>
      </div>

      <Faq items={faq} />
      <JsonLd data={faqJsonLd(faq)} />
    </Container>
  );
}
