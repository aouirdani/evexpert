import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ComparisonBuilder, ComparisonSkeleton } from "@/components/comparison/ComparisonBuilder";
import { getAllVehicles } from "@/data/catalog";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { toCompareVehicle } from "@/lib/vehicle-lite";
import { getFeaturedComparisons } from "@/lib/comparison";
import { buildMetadata } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Comparateur de voitures électriques",
  description:
    "Comparez deux ou trois voitures électriques par catégorie : batterie, autonomie, recharge, performances, dimensions, coffre, garanties et coût aux 100 km.",
  path: "/comparer",
});

const DEFAULT_IDS = ["renault-5-e-tech-52-kwh-150-ch", "peugeot-e-208-50-kwh"];

// Page statique : `?v=id1,id2,id3` (lien partagé, « Ma sélection » du GarageBar) est lu côté client
// par ComparisonBuilder, dans un <Suspense>. Lire `searchParams` ici rendrait la page dynamique
// et ferait interroger la base à chaque requête.
export default async function ComparePage() {
  const [vehicles, featured] = await Promise.all([getAllVehicles(), getFeaturedComparisons()]);
  // Paire par défaut, en liens dans le HTML serveur : le tableau du comparateur n'est plus rendu
  // côté serveur (squelette), ces liens vers les fiches y restent donc présents sans JavaScript.
  const defaults = DEFAULT_IDS.map((id) => vehicles.find((x) => x.id === id)).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Comparer", href: "/comparer" }]} />
      <PageHeader
        eyebrow="Comparateur"
        title="Comparateur de voitures électriques"
        description="Choisissez deux ou trois modèles et comparez-les critère par critère. Le comparateur chiffre les écarts mesurables, jamais un classement global : le meilleur choix dépend de votre usage."
      />
      <div className="mt-12">
        <Suspense fallback={<ComparisonSkeleton />}>
          <ComparisonBuilder vehicles={vehicles.map(toCompareVehicle)} defaultIds={DEFAULT_IDS} />
        </Suspense>
        {defaults.length === 2 && (
          <p className="mt-6 text-muted">
            Comparaison proposée par défaut :{" "}
            <Link href={vehicleHref(defaults[0], "model")} className="link-u font-semibold text-signal-deep">{vehicleTitle(defaults[0])}</Link>
            {" "}contre{" "}
            <Link href={vehicleHref(defaults[1], "model")} className="link-u font-semibold text-signal-deep">{vehicleTitle(defaults[1])}</Link>.
          </p>
        )}
      </div>

      <section className="mt-section grid gap-x-12 gap-y-6 lg:grid-cols-12" aria-labelledby="duels">
        <div className="lg:col-span-4">
          <h2 id="duels" className="text-h2 font-bold text-ink">Comparaisons de modèles concurrents</h2>
          <p className="mt-3 max-w-sm text-muted">
            Une sélection de duels entre modèles de même segment, avec une page détaillée pour chacun.
          </p>
        </div>
        <ul className="border-t-2 border-ink lg:col-span-8">
          {featured.map((c) => (
            <li key={c.slug} className="border-b border-line">
              <Link href={`/comparer/${c.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <span className="text-base font-bold text-ink">
                  <span className="link-h group-hover:[background-size:100%_2px]">{vehicleTitle(c.vehicles[0])}</span>{" "}
                  <span className="font-normal text-muted">contre</span>{" "}
                  <span className="link-h group-hover:[background-size:100%_2px]">{vehicleTitle(c.vehicles[1])}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-section grid gap-x-12 gap-y-6 lg:grid-cols-12" aria-labelledby="lire">
        <h2 id="lire" className="text-h2 font-bold text-ink lg:col-span-4">Comment lire un comparatif</h2>
        <div className="prose-ev lg:col-span-8 lg:max-w-2xl">
          <p>
            Les chiffres constructeur ne se comparent pas toujours directement : une batterie plus grande ne donne pas forcément plus d&apos;autonomie, et une puissance de
            charge DC élevée n&apos;est tenue que sur une partie de la charge. Regardez la <Link href="/guides/batterie-brute-batterie-utile">batterie utile</Link>, la
            consommation et le <Link href="/guides/puissance-recharge-dc">temps de charge 10-80 %</Link>{" "}
            plutôt qu&apos;un seul critère.
          </p>
          <p>
            Pour un budget complet, prolongez la comparaison avec le <Link href="/outils/tco-voiture-electrique">calculateur de coût total de possession</Link>.
          </p>
        </div>
      </section>
    </Container>
  );
}
