import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article, EditorialImage, Guide, Tool, Vehicle } from "@/types";
import { Section, Kicker } from "@/components/layout/Section";
import { ArrowLink, ButtonLink, SectionHeading } from "@/components/ui/primitives";
import { DataLegend } from "@/components/ui/DataBadge";
import { Delta } from "@/components/ui/Delta";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleRow, VehicleRowsHead } from "@/components/vehicles/VehicleRow";
import { RangeDistribution } from "@/components/home/RangeDistribution";
import { guideCategoryLabels } from "@/data/guides/labels";
import { batteryConsumption100 } from "@/lib/vehicle-calcs";
import { fmt } from "@/lib/vehicle-format";
import { vehicleTitle } from "@/lib/vehicle-utils";
import { cn, formatDateFr, formatNumber } from "@/lib/utils";

/* Sections de la page d'accueil. Tout est Server Component, sans JavaScript client. */

type WithHref = Vehicle & { href: string };

/* ------------------------------------------------------------------ */
/* 01 · Autonomie : la répartition du catalogue                         */
/* ------------------------------------------------------------------ */

const bands: { label: string; test: (km: number) => boolean }[] = [
  { label: "Moins de 300 km", test: (km) => km < 300 },
  { label: "300 à 450 km", test: (km) => km >= 300 && km < 450 },
  { label: "450 à 600 km", test: (km) => km >= 450 && km < 600 },
  { label: "Plus de 600 km", test: (km) => km >= 600 },
];

export function RangeFinder({ vehicles }: { vehicles: WithHref[] }) {
  const ranges = vehicles.map((v) => v.rangeWltp);
  const lo = Math.min(...ranges);
  const hi = Math.max(...ranges);
  return (
    <Section labelledBy="autonomie">
      <SectionHeading
        id="autonomie"
        numeral="01"
        eyebrow="Autonomie"
        title="Quelle autonomie vous faut-il ?"
        description={`${vehicles.length} versions, de ${formatNumber(lo)} à ${formatNumber(hi)} km WLTP : une mesure de laboratoire, plus haute que l'usage réel.`}
        action={<ArrowLink href="/guides/calculer-autonomie-reelle">Estimer son autonomie réelle</ArrowLink>}
      />
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RangeDistribution ranges={ranges} />
        </div>
        <ol className="lg:col-span-5">
          {bands.map((b) => {
            const inBand = vehicles.filter((v) => b.test(v.rangeWltp)).sort((x, y) => y.rangeWltp - x.rangeWltp);
            // Un lien par modèle (les versions d'un même modèle se suivent), trois au plus.
            const seen = new Set<string>();
            const top = inBand.filter((v) => {
              const k = `${v.brandSlug}/${v.modelSlug}`;
              if (seen.has(k)) return false;
              seen.add(k);
              return true;
            }).slice(0, 3);
            return (
              <li key={b.label} className="border-t border-line py-4 first:border-t-2 first:border-ink first:pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-base font-bold text-ink">{b.label}</p>
                  <p className="num text-data-md font-bold text-ink">
                    {inBand.length}
                    <span className="unit">version{inBand.length > 1 ? "s" : ""}</span>
                  </p>
                </div>
                {top.length > 0 && (
                  <p className="mt-1.5 text-sm text-muted">
                    {top.map((v, i) => (
                      <span key={v.id}>
                        {i > 0 && " · "}
                        <Link href={v.href} className="link-u text-body">
                          {v.brand} {v.model}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Sélection                                                      */
/* ------------------------------------------------------------------ */

export function Selection({
  featured,
  brands,
  total,
}: {
  featured: WithHref[];
  brands: { slug: string; name: string; count: number }[];
  total: number;
}) {
  return (
    <Section labelledBy="selection" spacing="none" className="pb-section">
      <SectionHeading
        id="selection"
        numeral="02"
        eyebrow="Sélection"
        title="Six modèles pour commencer"
        description="Autonomie, batterie, recharge rapide : chaque fiche indique sa source et sa date de relevé."
        action={<ArrowLink href="/voitures-electriques">Les {total} versions</ArrowLink>}
      />

      <table className="hidden w-full sm:table">
        <caption className="sr-only">Six modèles du catalogue : autonomie, batterie et puissance de charge</caption>
        <VehicleRowsHead />
        <tbody>
          {featured.map((v) => (
            <VehicleRow key={v.id} vehicle={v} href={v.href} />
          ))}
        </tbody>
      </table>
      <div className="grid gap-4 sm:hidden">
        {featured.slice(0, 4).map((v) => (
          <VehicleCard key={v.id} vehicle={v} href={v.href} />
        ))}
      </div>

      <nav aria-label="Marques" className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-line pt-4">
        <span className="label mr-1">Par marque</span>
        {brands.map((b) => (
          <Link key={b.slug} href={`/voitures-electriques/${b.slug}`} className="link-u text-sm font-medium text-ink">
            {b.name} <span className="num text-muted">{b.count}</span>
          </Link>
        ))}
      </nav>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Comparer                                                       */
/* ------------------------------------------------------------------ */

type Row = { label: string; a: number | null; b: number | null; unit: string; digits?: number };

const rowsOf = (a: Vehicle, b: Vehicle): Row[] => [
  { label: "Autonomie WLTP", a: a.rangeWltp, b: b.rangeWltp, unit: "km" },
  { label: "Batterie utile", a: a.batteryUsable, b: b.batteryUsable, unit: "kWh", digits: 1 },
  { label: "Charge DC max", a: a.chargingDC, b: b.chargingDC, unit: "kW" },
  { label: "Recharge 10 → 80 %", a: a.chargingTime10to80, b: b.chargingTime10to80, unit: "min" },
  { label: "Conso. calculée", a: batteryConsumption100(a), b: batteryConsumption100(b), unit: "kWh/100 km", digits: 1 },
];

export function CompareSpotlight({ comparisons }: { comparisons: { slug: string; vehicles: Vehicle[] }[] }) {
  const duel = comparisons[0];
  const [a, b] = duel?.vehicles ?? [];
  return (
    <Section tone="deep" labelledBy="compare">
      <SectionHeading
        id="compare"
        numeral="03"
        eyebrow="Comparateur"
        title="Deux modèles, un seul tableau"
        description={"Le comparateur met deux ou trois modèles côte à côte et chiffre l'écart. Il ne désigne jamais une «\u00a0meilleure\u00a0» voiture."}
        action={
          <ButtonLink href="/comparer" variant="primary">
            Ouvrir le comparateur
          </ButtonLink>
        }
      />

      {duel && a && b && (
        <div className="relative">
          <table className="w-full text-left">
            <caption className="sr-only">
              Exemple de comparaison : {vehicleTitle(a)} contre {vehicleTitle(b)}
            </caption>
            <thead>
              <tr className="align-bottom">
                <th scope="col" className="w-[30%] pb-5 sm:w-[28%]">
                  <span className="sr-only">Critère</span>
                </th>
                {[a, b].map((v) => (
                  <th key={v.id} scope="col" className="pb-5 pr-3 font-normal sm:pr-6">
                    <span className="eyebrow block text-signal-deep">{v.brand}</span>
                    <span className="mt-1 block text-h3 font-bold text-ink sm:text-h2">{v.model}</span>
                    <span className="block text-sm text-muted">{v.version}</span>
                  </th>
                ))}
                <th scope="col" className="label hidden w-[14%] pb-5 text-right sm:table-cell">Écart</th>
              </tr>
            </thead>
            <tbody>
              {rowsOf(a, b).map((r) => (
                <tr key={r.label} className="border-t border-ink/15">
                  <th scope="row" className="label py-4 pr-3 text-left sm:pr-4">{r.label}</th>
                  {[r.a, r.b].map((val, i) => (
                    <td key={i} className="num wrap-anywhere py-4 pr-3 text-data-md font-bold text-ink sm:pr-6">
                      {val === null ? (
                        <>
                          <span aria-hidden className="text-muted">—</span>
                          <span className="sr-only">Non disponible</span>
                        </>
                      ) : (
                        <>
                          {formatNumber(val, r.digits ?? 0)}
                          <span className="unit">{r.unit}</span>
                        </>
                      )}
                    </td>
                  ))}
                  <td className="hidden py-4 text-right sm:table-cell">
                    <Delta a={r.a} b={r.b} unit={r.unit} digits={r.digits} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {duel && (
        <p className="mt-4 text-caption text-muted">
          Caractéristiques : source spécialisée. Consommation calculée par EVExpert (capacité utile ÷ autonomie WLTP).{" "}
          <Link href={`/comparer/${duel.slug}`} className="link-u font-semibold text-signal-deep">
            Voir la comparaison détaillée
          </Link>
        </p>
      )}

      <div className="mt-12">
        <p className="label mb-1">Autres duels</p>
        <ul className="grid gap-x-10 sm:grid-cols-3">
          {comparisons.slice(0, 3).map((c) => (
            <li key={c.slug}>
              <Link href={`/comparer/${c.slug}`} className="group flex min-h-16 items-center justify-between gap-3 border-t border-ink/15 py-3">
                <span className="text-sm font-semibold text-ink">
                  {vehicleTitle(c.vehicles[0])} <span className="font-normal text-muted">contre</span> {vehicleTitle(c.vehicles[1])}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Recharge                                                       */
/* ------------------------------------------------------------------ */

const chargeItems = [
  { href: "/guides/recharge-ac-ou-dc", t: "AC ou DC ?", d: "Où se fait la conversion du courant, et pourquoi la recharge rapide est en continu." },
  { href: "/guides/puissance-borne-7-11-22-kw", t: "7,4, 11 ou 22 kW", d: "La puissance utilisée est celle du maillon le plus faible entre borne et voiture." },
  { href: "/guides/combien-coute-recharge-domicile", t: "Combien ça coûte ?", d: "Énergie, rendement, tarif du kWh : le calcul détaillé, avec exemples." },
];

export function ChargingFeature({ photo }: { photo?: EditorialImage }) {
  return (
    <Section labelledBy="recharge" spacing="none" className="py-section">
      <div className="grid items-start gap-x-14 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Kicker aside="04">Recharge</Kicker>
          <h2 id="recharge" className="balance mt-5 text-h1 font-bold text-ink">
            Recharger, c&apos;est une puissance, un lieu et un tarif.
          </h2>
          <ul className="mt-8">
            {chargeItems.map((c) => (
              <li key={c.href} className="border-t border-line first:border-ink first:border-t-2">
                <Link href={c.href} className="group flex items-start gap-4 py-4">
                  <span className="flex-1">
                    <span className="text-lg font-bold text-ink">
                      <span className="link-h group-hover:[background-size:100%_2px]">{c.t}</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted">{c.d}</span>
                  </span>
                  <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <ArrowLink href="/recharge">Tout le dossier recharge</ArrowLink>
          </div>
        </div>

        {photo && (
          <figure className="lg:col-span-7">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1152px) 640px, (min-width: 1024px) 55vw, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="mt-3 text-caption text-muted">{photo.caption}</figcaption>
          </figure>
        )}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · À lire                                                         */
/* ------------------------------------------------------------------ */

export function ReadingSection({
  lead,
  guides,
  articles,
  guideTotal,
}: {
  lead?: Guide;
  guides: Guide[];
  articles: Article[];
  guideTotal: number;
}) {
  return (
    <Section labelledBy="lire" spacing="none" className="pb-section">
      <SectionHeading
        id="lire"
        numeral="05"
        eyebrow="Comprendre"
        title="Guides et analyses"
        action={<ArrowLink href="/guides">Les {guideTotal} guides</ArrowLink>}
      />
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
        {lead && (
          <article className="group relative lg:col-span-7">
            {lead.hero && (
              <Image
                src={lead.hero.src}
                alt=""
                width={lead.hero.width}
                height={lead.hero.height}
                sizes="(min-width: 1152px) 640px, (min-width: 1024px) 55vw, 100vw"
                className="aspect-[3/2] h-auto w-full object-cover"
              />
            )}
            <Kicker className="mt-5" aside={`${lead.readingTime} min`}>
              {guideCategoryLabels[lead.category]}
            </Kicker>
            <h3 className="balance mt-3 text-h2 font-bold text-ink">
              <Link
                href={`/guides/${lead.slug}`}
                className="link-h after:absolute after:inset-0 after:content-[''] group-hover:[background-size:100%_2px]"
              >
                {lead.title}
              </Link>
            </h3>
            <p className="pretty mt-3 max-w-xl text-body">{lead.description}</p>
          </article>
        )}
        <div className={cn("min-w-0", lead ? "lg:col-span-5" : "lg:col-span-12")}>
          <ul className="border-t-2 border-ink">
            {guides.map((g) => (
              <li key={g.slug} className="border-b border-line">
                <Link href={`/guides/${g.slug}`} className="group flex items-start gap-4 py-4">
                  <span className="flex-1">
                    <span className="eyebrow block text-signal-deep">{guideCategoryLabels[g.category]}</span>
                    <span className="mt-1 block text-base font-bold text-ink">
                      <span className="link-h group-hover:[background-size:100%_2px]">{g.title}</span>
                    </span>
                  </span>
                  <ArrowRight className="mt-5 h-4 w-4 shrink-0 text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="label mb-1 mt-9">Analyses récentes</p>
          <ul className="border-t-2 border-ink">
            {articles.map((a) => (
              <li key={a.slug} className="border-b border-line">
                <Link href={`/blog/${a.slug}`} className="group block py-4">
                  <span className="label block">
                    {a.category} · <time dateTime={a.updatedAt}>{formatDateFr(a.updatedAt)}</time>
                  </span>
                  <span className="mt-1 block text-base font-bold text-ink">
                    <span className="link-h group-hover:[background-size:100%_2px]">{a.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <ArrowLink href="/blog">Toutes les analyses</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · Outils                                                         */
/* ------------------------------------------------------------------ */

export function ToolsLedger({ tools }: { tools: Tool[] }) {
  return (
    <Section tone="deep" labelledBy="outils">
      <SectionHeading
        id="outils"
        numeral="06"
        eyebrow="Calculateurs"
        title="Faites le calcul vous-même"
        description="Chaque outil affiche sa formule, un exemple chiffré, ses limites et une FAQ."
        action={<ArrowLink href="/outils">Tous les outils</ArrowLink>}
      />
      <ol className="grid gap-x-14 border-t border-ink/15 md:grid-cols-2">
        {tools.map((t, i) => (
          <li key={t.slug} className="border-b border-ink/15">
            <Link href={t.href} className="group flex items-baseline gap-5 py-5">
              <span className="num w-7 shrink-0 text-sm font-semibold text-signal-deep">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1">
                <span className="block text-lg font-bold text-ink">
                  <span className="link-h group-hover:[background-size:100%_2px]">{t.shortTitle}</span>
                </span>
                <span className="mt-1 block text-sm text-muted">{t.description}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 self-center text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · Méthode                                                        */
/* ------------------------------------------------------------------ */

export function DataTrust() {
  return (
    <Section labelledBy="confiance" spacing="none" className="pt-section">
      <div className="grid gap-x-14 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Kicker aside="07">Méthode</Kicker>
          <h2 id="confiance" className="balance mt-5 text-h1 font-bold text-ink">
            Un chiffre, une source, une nature.
          </h2>
          <p className="pretty mt-5 max-w-md text-body">
            Chaque fiche renvoie à sa source et à sa date de relevé. Les formules et hypothèses sont affichées,
            et une donnée absente est écrite « Non disponible », jamais estimée.
          </p>
          <div className="mt-4">
            <ArrowLink href="/methodologie">Lire la méthodologie</ArrowLink>
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="label mb-3">Quatre natures de données</p>
          <DataLegend />
        </div>
      </div>
    </Section>
  );
}
