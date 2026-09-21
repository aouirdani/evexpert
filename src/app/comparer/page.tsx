import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ComparisonBuilder } from "@/components/comparison/ComparisonBuilder";
import { getAllVehicles } from "@/data/catalog";
import { vehicleTitle } from "@/lib/vehicle-utils";
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

export default async function ComparePage() {
  const vehicles = await getAllVehicles();
  const featured = await getFeaturedComparisons();
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Comparer", href: "/comparer" }]} />
      <PageHeader
        eyebrow="Comparateur"
        title="Comparateur de voitures électriques"
        description="Choisissez deux ou trois modèles et comparez-les critère par critère. Le comparateur met en évidence des différences mesurables, jamais un classement global : le meilleur choix dépend de votre usage."
      />
      <div className="mt-8">
        <ComparisonBuilder vehicles={vehicles} defaultIds={["renault-5-e-tech-52-kwh-150-ch", "peugeot-e-208-50-kwh"]} />
      </div>

      <section className="mt-16" aria-labelledby="duels">
        <h2 id="duels" className="text-2xl font-bold text-slate-900">Comparaisons de modèles concurrents</h2>
        <p className="mt-2 max-w-3xl text-slate-700">
          Une sélection de duels entre modèles de même segment, avec une page détaillée pour chacun.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {featured.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/comparer/${c.slug}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-900 hover:border-emerald-500 hover:text-emerald-800"
              >
                {vehicleTitle(c.vehicles[0])} <span className="font-normal text-slate-600">contre</span> {vehicleTitle(c.vehicles[1])}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="lire">
        <h2 id="lire" className="text-2xl font-bold text-slate-900">Comment lire un comparatif</h2>
        <div className="prose-ev">
          <p>
            Les chiffres constructeur ne se comparent pas toujours directement : une batterie plus grande ne donne pas forcément plus d&apos;autonomie, et une puissance de
            charge DC élevée n&apos;est tenue que sur une partie de la charge. Regardez la <Link href="/guides/batterie-brute-batterie-utile">batterie utile</Link>, la
            consommation et le <Link href="/guides/puissance-recharge-dc">temps de charge 10-80 %</Link> plutôt qu&apos;un seul critère.
          </p>
          <p>
            Pour un budget complet, prolongez la comparaison avec le <Link href="/outils/tco-voiture-electrique">calculateur de coût total de possession</Link>.
          </p>
        </div>
      </section>
    </Container>
  );
}
