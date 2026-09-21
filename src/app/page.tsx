import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/layout/SearchBar";
import { ButtonLink } from "@/components/ui/primitives";
import { DataBadge } from "@/components/ui/DataBadge";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { ToolCard, ArticleCard, GuideCard } from "@/components/cards";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { tools } from "@/data/tools";
import { getAllVehicles, getBrands, getVehicleById } from "@/data/catalog";
import { versionsOf } from "@/data/catalog/selectors";
import { getGuides } from "@/data/guides";
import { getArticles } from "@/data/blog";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import { ASSUMPTIONS } from "@/data/assumptions";
import { batteryConsumption100, costPer100km } from "@/lib/vehicle-calcs";
import { getFeaturedComparisons } from "@/lib/comparison";
import { siteConfig } from "@/config/site";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { formatEuro, formatNumber } from "@/lib/utils";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Voiture électrique : comparez l'autonomie, la recharge et le coût réel",
  description: siteConfig.description,
  path: "/",
});

const homeFaq = [
  {
    question: "Comment EVExpert calcule-t-il le coût aux 100 km ?",
    answer: `Consommation côté batterie (capacité utile ÷ autonomie WLTP × 100), divisée par un rendement de charge de ${ASSUMPTIONS.chargingEfficiency} %, multipliée par le prix du kWh. Le prix par défaut est une hypothèse que vous pouvez modifier dans les calculateurs.`,
  },
  {
    question: "Les données des véhicules sont-elles officielles ?",
    answer: "Elles proviennent de la base spécialisée EV Database, pas d'un document constructeur : chaque fiche l'indique avec un badge « Source spécialisée », un lien vers la source et la date du relevé. Une donnée absente est affichée « Non disponible », jamais estimée.",
  },
  {
    question: "Quelle différence entre autonomie WLTP et autonomie réelle ?",
    answer: "Le WLTP est mesuré en laboratoire selon un cycle normalisé. Vitesse élevée, froid ou relief réduisent l'autonomie réelle. Nos estimations par scénario (ville, mixte, autoroute, hiver) sont signalées comme « Estimation EVExpert ».",
  },
  {
    question: "Pourquoi le prix des voitures n'apparaît-il pas ?",
    answer: "Les prix disponibles dans notre source concernent d'autres marchés. Plutôt que d'afficher un prix non transposable en France, nous laissons le champ « Non disponible » jusqu'à l'intégration d'une source française datée.",
  },
  {
    question: "Faut-il une borne à domicile pour posséder une voiture électrique ?",
    answer: "Ce n'est pas obligatoire, mais la recharge à domicile est en général la plus économique et la plus pratique. Le guide « recharge à domicile ou borne publique » compare les situations.",
  },
];

export default async function HomePage() {
  const all = await getAllVehicles();
  const [brands, guides, articles, comparisons] = await Promise.all([getBrands(), getGuides(), getArticles(), getFeaturedComparisons()]);
  const example = (await getVehicleById("renault-5-e-tech-52-kwh-150-ch"))!;
  const featuredIds = [
    "renault-5-e-tech-52-kwh-150-ch",
    "tesla-model-y-rwd",
    "kia-ev3-long-range",
    "skoda-elroq-85",
    "citroen-e-c3-standard-range-44-kwh",
    "hyundai-ioniq-5-84-kwh-rwd",
  ];
  const featured = (await Promise.all(featuredIds.map(getVehicleById))).filter((v): v is NonNullable<typeof v> => Boolean(v));
  const featuredGuides = guides.filter((g) =>
    ["calculer-autonomie-reelle", "combien-coute-recharge-domicile", "puissance-borne-7-11-22-kw", "recharge-ac-ou-dc", "voiture-electrique-vs-essence", "choisir-premiere-voiture-electrique"].includes(g.slug),
  );
  const latest = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);

  return (
    <>
      <section className="bg-slate-950 text-white">
        <Container className="py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">{siteConfig.tagline}</p>
              <h1 className="display mt-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl">
                Voiture électrique : comparez l&apos;autonomie, la recharge et le coût réel
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                Des calculateurs dont chaque étape est visible, des fiches techniques sourcées et des guides pour décider en connaissance de cause.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/outils" variant="primary" className="bg-emerald-500 !text-slate-950 hover:bg-emerald-400">
                  Calculer mon coût réel
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/voitures-electriques" variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-slate-900">
                  Explorer les voitures
                </ButtonLink>
              </div>
              <div className="mt-8 max-w-md">
                <SearchBar idSuffix="home" placeholder="Rechercher un modèle, un guide, un outil" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Exemple calculé sur une fiche du catalogue</p>
              <p className="mt-2 text-lg font-bold">{vehicleTitle(example)}</p>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-slate-400">Autonomie WLTP</dt>
                  <dd className="tabular text-2xl font-extrabold">{formatNumber(example.rangeWltp)} km</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Batterie utile</dt>
                  <dd className="tabular text-2xl font-extrabold">{formatNumber(example.batteryUsable, 1)} kWh</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Consommation calculée</dt>
                  <dd className="tabular text-2xl font-extrabold">{formatNumber(batteryConsumption100(example), 1)}<span className="text-sm font-semibold text-slate-400"> kWh/100 km</span></dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Coût aux 100 km</dt>
                  <dd className="tabular text-2xl font-extrabold text-emerald-400">{formatEuro(costPer100km(example, ASSUMPTIONS.homePrice), 2)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-slate-400">
                À {formatNumber(ASSUMPTIONS.homePrice, 2)} €/kWh (hypothèse modifiable), rendement de charge {ASSUMPTIONS.chargingEfficiency} %.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <DataBadge type="specialized" />
                <DataBadge type="calculated" />
              </div>
              <Link href={vehicleHref(example)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:underline">
                Voir la fiche complète <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-slate-50" aria-label="Le site en chiffres">
        <Container className="py-6">
          <dl className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {[
              [String(all.length), "versions de véhicules"],
              [String(brands.length), "marques"],
              [String(tools.length), "calculateurs"],
              [String(guides.length), "guides sourcés"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="tabular block text-2xl font-extrabold text-slate-900">{n}</span>
                  <span className="text-sm text-slate-600">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="mt-16">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Outils populaires</h2>
            <p className="mt-2 text-slate-700">Chaque outil affiche sa formule, un exemple chiffré, ses limites et une FAQ.</p>
          </div>
          <Link href="/outils" className="text-sm font-semibold text-emerald-800 hover:underline">Tous les outils</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </Container>

      <Container className="mt-16">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Explorer les voitures électriques</h2>
            <p className="mt-2 text-slate-700">Autonomie, batterie, puissance de recharge et coût calculé, avec la source de chaque fiche.</p>
          </div>
          <Link href="/voitures-electriques" className="text-sm font-semibold text-emerald-800 hover:underline">Voir les {all.length} versions</Link>
        </div>
        <nav aria-label="Marques" className="mt-5 flex flex-wrap gap-2">
          {brands.map((b) => (
            <Link key={b.slug} href={`/voitures-electriques/${b.slug}`} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:border-emerald-500 hover:text-emerald-800">
              {b.name}
            </Link>
          ))}
        </nav>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <VehicleCard key={v.id} vehicle={v} href={vehicleHref(v, versionsOf(all, v.brandSlug, v.modelSlug).length > 1 ? "version" : "model")} />
          ))}
        </div>
      </Container>

      <Container className="mt-16">
        <div className="grid gap-8 rounded-3xl bg-slate-50 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Comparer, sans classement artificiel</h2>
            <p className="mt-3 text-slate-700">
              Le comparateur met deux ou trois modèles côte à côte, par catégorie : batterie, autonomie, recharge, performances, dimensions, coffre, garanties et coût d&apos;usage.
              Il signale uniquement des différences mesurables (autonomie WLTP la plus élevée, temps de charge le plus court…), jamais une « meilleure voiture ».
            </p>
            <div className="mt-6">
              <ButtonLink href="/comparer" variant="secondary">Ouvrir le comparateur</ButtonLink>
            </div>
          </div>
          <ul className="space-y-3">
            {comparisons.slice(0, 3).map((c) => (
              <li key={c.slug}>
                <Link href={`/comparer/${c.slug}`} className="block rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-900 hover:border-emerald-500 hover:text-emerald-800">
                  {vehicleTitle(c.vehicles[0])} <span className="font-normal text-slate-600">contre</span> {vehicleTitle(c.vehicles[1])}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Recharge : AC, DC et coûts</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { href: "/guides/recharge-ac-ou-dc", t: "AC ou DC ?", d: "Où se fait la conversion du courant, et pourquoi la recharge rapide est en continu." },
            { href: "/guides/puissance-borne-7-11-22-kw", t: "7,4, 11 ou 22 kW", d: "La puissance utilisée est celle du maillon le plus faible entre borne et voiture." },
            { href: "/guides/combien-coute-recharge-domicile", t: "Combien ça coûte ?", d: "Énergie, rendement, tarif du kWh : le calcul détaillé, avec exemples." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-400 hover:shadow-md">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800">{c.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{c.d}</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-700">
          Tout le dossier : <Link href="/recharge" className="font-medium text-emerald-800 underline">recharge d&apos;une voiture électrique</Link>.
        </p>
      </Container>

      <Container className="mt-16">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Guides</h2>
          <Link href="/guides" className="text-sm font-semibold text-emerald-800 hover:underline">Les {guides.length} guides</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredGuides.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </Container>

      <Container className="mt-16">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Analyses récentes</h2>
          <Link href="/blog" className="text-sm font-semibold text-emerald-800 hover:underline">Tout le blog</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Container>

      <Container className="mt-16">
        <section aria-labelledby="confiance" className="rounded-3xl border border-slate-200 p-6 sm:p-10">
          <h2 id="confiance" className="text-2xl font-bold text-slate-900 sm:text-3xl">Notre engagement de transparence</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            <li className="text-slate-700"><strong className="block text-slate-900">Sources citées</strong>Chaque fiche renvoie à sa source et à sa date de relevé.</li>
            <li className="text-slate-700"><strong className="block text-slate-900">Calculs visibles</strong>Formules, hypothèses et exemples sont affichés, jamais cachés.</li>
            <li className="text-slate-700"><strong className="block text-slate-900">Estimations signalées</strong>Nous distinguons données sourcées, calculs et estimations.</li>
          </ul>
          <p className="mt-5"><Link href="/methodologie" className="font-semibold text-emerald-800 underline">Lire la méthodologie</Link></p>
        </section>
      </Container>

      <Container>
        <Faq items={homeFaq} title="Questions fréquentes" />
        <JsonLd data={faqJsonLd(homeFaq)} />
      </Container>
    </>
  );
}
