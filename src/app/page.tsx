import { Container } from "@/components/layout/Container";
import { ArrowLink, SectionHeading } from "@/components/ui/primitives";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { Hero } from "@/components/home/Hero";
import { ChargingBand, CompareSpotlight, ContentSection, DataTrust, QuickStart, ToolsBand } from "@/components/home/sections";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { tools } from "@/data/tools";
import { getAllVehicles, getBrands, getVehicleById } from "@/data/catalog";
import { versionsOf } from "@/data/catalog/selectors";
import { getGuides } from "@/data/guides";
import { getArticles } from "@/data/blog";
import { vehicleHref } from "@/lib/vehicle-utils";
import { ASSUMPTIONS } from "@/data/assumptions";
import { getFeaturedComparisons } from "@/lib/comparison";
import { siteConfig } from "@/config/site";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

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
      <Hero
        h1="Voiture électrique : comparez l'autonomie, la recharge et le coût réel"
        stats={[
          { value: String(all.length), label: "versions de véhicules" },
          { value: String(brands.length), label: "marques" },
          { value: String(tools.length), label: "calculateurs" },
          { value: String(guides.length), label: "guides sourcés" },
        ]}
      />

      <QuickStart brands={brands} total={all.length} />

      <section aria-labelledby="selection" className="pb-section">
        <Container>
          <SectionHeading
            id="selection"
            eyebrow="Sélection"
            title="Explorer les voitures électriques"
            description="Autonomie, batterie, puissance de recharge et coût calculé, avec la source de chaque fiche."
            action={<ArrowLink href="/voitures-electriques">Voir toutes les voitures ({all.length} versions)</ArrowLink>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {featured.map((v, i) => (
              // Sous 640 px, seules les quatre premières cartes sont affichées (page plus courte) ;
              // les six restent dans le HTML.
              <div key={v.id} className={i >= 4 ? "hidden sm:contents" : "contents"}>
                <VehicleCard vehicle={v} href={vehicleHref(v, versionsOf(all, v.brandSlug, v.modelSlug).length > 1 ? "version" : "model")} />
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted">
            Silhouettes schématiques par type de carrosserie : illustrations génériques, jamais le modèle exact. Les barres
            situent l&apos;autonomie WLTP sur une échelle commune de 0 à 800 km ; elles ne constituent pas un classement.
          </p>
        </Container>
      </section>

      <CompareSpotlight comparisons={comparisons} />
      <DataTrust />
      <ChargingBand />
      <ContentSection guides={featuredGuides} guideTotal={guides.length} articles={latest} />
      <ToolsBand tools={tools} />

      <section className="pb-section pt-4">
        <Container>
          <Faq items={homeFaq} title="Questions fréquentes" />
          <JsonLd data={faqJsonLd(homeFaq)} />
        </Container>
      </section>
    </>
  );
}
