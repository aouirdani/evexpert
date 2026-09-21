import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { JsonLd } from "@/components/ui/JsonLd";
import { Faq } from "@/components/ui/Faq";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { RelatedGuides, RelatedTools } from "@/components/related";
import { getFeaturedComparisons, parseComparison } from "@/lib/comparison";
import { objectiveDifferences } from "@/lib/comparison-metrics";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

type Params = { slug: string };

export async function generateStaticParams() {
  return (await getFeaturedComparisons()).map((c) => ({ slug: c.slug }));
}

// Seules les comparaisons pré-générées existent : pas de page à la volée.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const pair = await parseComparison(slug);
  if (!pair) return { robots: { index: false, follow: true } };
  const [a, b] = pair;
  return buildMetadata({
    title: `${a.brand} ${a.model} vs ${b.brand} ${b.model} : comparatif`,
    description: `${vehicleTitle(a)} contre ${vehicleTitle(b)} : batterie, autonomie WLTP, recharge, performances, dimensions et coût aux 100 km comparés.`,
    path: `/comparer/${slug}`,
  });
}

export default async function ComparisonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const pair = await parseComparison(slug);
  if (!pair) notFound();
  const [a, b] = pair;
  const diffs = objectiveDifferences([a, b]);
  const range = diffs.find((d) => d.label.startsWith("Autonomie"));
  const dc = diffs.find((d) => d.label.startsWith("Puissance DC"));

  // FAQ dérivée des données affichées : chaque réponse est visible et vérifiable dans le tableau.
  const faq = [
    {
      question: `Quelle voiture a la plus grande autonomie WLTP, ${a.model} ou ${b.model} ?`,
      answer: range
        ? `Selon la source, la ${range.vehicle.brand} ${range.vehicle.model} affiche l'autonomie WLTP la plus élevée (${range.display}) contre ${(range.vehicle.id === a.id ? b : a).rangeWltp} km. L'autonomie réelle varie avec la vitesse et la température.`
        : `Les deux modèles affichent la même autonomie WLTP dans notre source.`,
    },
    {
      question: `Laquelle se recharge le plus vite en courant continu ?`,
      answer: dc
        ? `La ${dc.vehicle.brand} ${dc.vehicle.model} accepte la puissance DC maximale la plus élevée (${dc.display}). Le temps de charge 10-80 % publié figure dans le tableau ; la puissance maximale n'est tenue que sur une partie de la charge.`
        : `Les puissances DC de ces modèles ne permettent pas d'établir une différence dans notre source.`,
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
        title={`${a.brand} ${a.model} vs ${b.brand} ${b.model} : comparatif`}
        description={`${vehicleTitle(a)} et ${vehicleTitle(b)}, critère par critère, avec la nature de chaque donnée.`}
      />
      <div className="mt-3">
        <LastUpdated date={a.source.lastUpdated} label="Données relevées le" />
      </div>
      <div className="mt-8">
        <ComparisonTable vehicles={[a, b]} />
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href={vehicleHref(a, "model")} className="font-medium text-emerald-800 underline">Fiche {a.brand} {a.model}</Link>
        <Link href={vehicleHref(b, "model")} className="font-medium text-emerald-800 underline">Fiche {b.brand} {b.model}</Link>
        <Link href="/comparer" className="font-medium text-emerald-800 underline">Comparer d&apos;autres modèles</Link>
      </div>

      <Faq items={faq} />
      <JsonLd data={faqJsonLd(faq)} />

      <div className="grid gap-4 md:grid-cols-2">
        <RelatedTools hrefs={["/outils/tco-voiture-electrique", "/outils/cout-100-km"]} />
        <RelatedGuides slugs={["choisir-voiture-electrique-selon-usage", "batterie-brute-batterie-utile"]} />
      </div>
    </Container>
  );
}
