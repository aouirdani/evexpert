import { Section } from "@/components/layout/Section";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { Hero } from "@/components/home/Hero";
import { ChargingFeature, CompareSpotlight, DataTrust, RangeFinder, ReadingSection, Selection, ToolsLedger } from "@/components/home/sections";
import { tools } from "@/data/tools";
import { getAllVehicles, getBrands } from "@/data/catalog";
import { EDITORIAL_PHOTOS } from "@/data/editorial/media";
import { versionsOf } from "@/data/catalog/selectors";
import { getGuides } from "@/data/guides";
import { getArticles } from "@/data/blog";
import { vehicleHref } from "@/lib/vehicle-utils";
import { ASSUMPTIONS } from "@/data/assumptions";
import { getFeaturedComparisons } from "@/lib/comparison";
import { siteConfig } from "@/config/site";
import { formatDateFr } from "@/lib/format";
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
  const withHref = all.map((v) => ({
    ...v,
    href: vehicleHref(v, versionsOf(all, v.brandSlug, v.modelSlug).length > 1 ? "version" : "model"),
  }));
  const featuredIds = [
    "renault-5-e-tech-52-kwh-150-ch",
    "tesla-model-y-rwd",
    "kia-ev3-long-range",
    "skoda-elroq-85",
    "citroen-e-c3-standard-range-44-kwh",
    "hyundai-ioniq-5-84-kwh-rwd",
  ];
  const featured = featuredIds
    .map((id) => withHref.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const leadGuide = guides.find((g) => g.slug === "batterie-brute-batterie-utile");
  const featuredGuides = ["calculer-autonomie-reelle", "recharge-ac-ou-dc", "combien-coute-recharge-domicile", "voiture-electrique-vs-essence", "choisir-premiere-voiture-electrique"]
    .map((slug) => guides.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const latest = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);
  const updated = all.map((v) => v.source.lastUpdated).sort().at(-1);

  return (
    <>
      <Hero
        h1="Voiture électrique : comparez l'autonomie, la recharge et le coût réel"
        updated={updated ? formatDateFr(updated) : undefined}
        stats={[
          { value: String(all.length), label: "Versions" },
          { value: String(brands.length), label: "Marques" },
          { value: String(guides.length), label: "Guides sourcés" },
          { value: String(tools.length), label: "Calculateurs" },
        ]}
      />

      <RangeFinder vehicles={withHref} />
      <Selection featured={featured} brands={brands} total={all.length} />
      <CompareSpotlight comparisons={comparisons} />
      <ChargingFeature photo={EDITORIAL_PHOTOS["puissance-recharge-dc"]?.image} />
      <ReadingSection lead={leadGuide} guides={featuredGuides} articles={latest} guideTotal={guides.length} />
      <ToolsLedger tools={tools} />
      <DataTrust />

      <Section spacing="none" className="py-section">
        <Faq items={homeFaq} title="Questions fréquentes" layout="split" />
        <JsonLd data={faqJsonLd(homeFaq)} />
      </Section>
    </>
  );
}
