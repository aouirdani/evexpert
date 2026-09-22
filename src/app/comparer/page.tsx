import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ComparisonBuilder } from "@/components/comparison/ComparisonBuilder";
import { getAllVehicles, getVehiclesForComparison } from "@/data/catalog";
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

const DEFAULT_IDS = ["renault-5-e-tech-52-kwh-150-ch", "peugeot-e-208-50-kwh"];

export default async function ComparePage({
  searchParams,
}: {
  /** `?v=id1,id2,id3` : lien partageable, aussi utilisé pour reprendre « Ma sélection » (localStorage, voir GarageBar). */
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  // Dédoublonné (un id répété deux fois ne doit pas comparer un véhicule avec lui-même) et
  // plafonné à 3 (autant que d'emplacements du comparateur, même sur une URL modifiée à la main).
  const requestedIds = v ? [...new Set(v.split(",").filter(Boolean))].slice(0, 3) : [];
  const [vehicles, featured, preselected] = await Promise.all([
    getAllVehicles(),
    getFeaturedComparisons(),
    requestedIds.length ? getVehiclesForComparison(requestedIds) : Promise.resolve([]),
  ]);
  // Les identifiants inconnus (lien copié après une refonte du catalogue) sont ignorés
  // silencieusement. Un seul identifiant valide est repris tel quel (ex. « Ma sélection » avec un
  // seul véhicule, ou un lien partagé prématurément) : le formulaire préremplit ce véhicule et
  // invite à en choisir un second, plutôt que de l'écarter au profit d'une paire sans rapport.
  // Zéro identifiant valide → paire par défaut.
  const initialIds = preselected.length > 0 ? preselected.map((x) => x.id) : DEFAULT_IDS;

  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Comparer", href: "/comparer" }]} />
      <PageHeader
        eyebrow="Comparateur"
        title="Comparateur de voitures électriques"
        description="Choisissez deux ou trois modèles et comparez-les critère par critère. Le comparateur chiffre les écarts mesurables, jamais un classement global : le meilleur choix dépend de votre usage."
      />
      <div className="mt-12">
        <ComparisonBuilder vehicles={vehicles} defaultIds={initialIds} />
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
