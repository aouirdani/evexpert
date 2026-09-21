import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article, Guide, Tool, Vehicle } from "@/types";
import { Container } from "@/components/layout/Container";
import { ArrowLink, ButtonLink, Chip, SectionHeading } from "@/components/ui/primitives";
import { DataBadge, DataLegend } from "@/components/ui/DataBadge";
import { DynamicIcon } from "@/components/cards";
import { guideCategoryLabels } from "@/data/guides/labels";
import { batteryConsumption100 } from "@/lib/vehicle-calcs";
import { fmt } from "@/lib/vehicle-format";
import { vehicleTitle } from "@/lib/vehicle-utils";
import { formatDateFr } from "@/lib/utils";

/* Sections de la page d'accueil. Tout est Server Component, sans JavaScript client. */

/* ------------------------------------------------------------------ */
/* Que recherchez-vous ?                                               */
/* ------------------------------------------------------------------ */

export function QuickStart({
  brands,
  total,
}: {
  brands: { slug: string; name: string; count: number }[];
  total: number;
}) {
  // Les dix marques les mieux représentées, présentées par ordre alphabétique.
  const ranked = [...brands].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"));
  const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "fr");
  const top = ranked.slice(0, 10).sort(byName);
  // Les autres marques restent liées depuis l'accueil (maillage interne), en texte discret.
  const others = ranked.slice(10).sort(byName);
  return (
    <section aria-labelledby="quick" className="py-section">
      <Container>
        <SectionHeading id="quick" eyebrow="Démarrer" title="Que recherchez-vous ?" />
        <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <p className="eyebrow text-signal-deep">01 · Trouver</p>
            <h3 className="mt-2 text-h2 font-bold text-ink">Trouver une voiture électrique</h3>
            <p className="mt-3 max-w-lg text-body">
              Filtrez par marque, carrosserie, autonomie ou puissance de charge, puis ouvrez la fiche avec sa source.
            </p>
            <ul aria-label="Marques" className="mt-6 flex flex-wrap gap-2">
              {top.map((b) => (
                <li key={b.slug}>
                  <Chip href={`/voitures-electriques/${b.slug}`} count={b.count}>
                    {b.name}
                  </Chip>
                </li>
              ))}
            </ul>
            {others.length > 0 && (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Autres marques :{" "}
                {others.map((b, i) => (
                  <span key={b.slug}>
                    {i > 0 && " · "}
                    <Link href={`/voitures-electriques/${b.slug}`} className="text-body underline-offset-4 hover:text-ink hover:underline">
                      {b.name}
                    </Link>
                  </span>
                ))}
              </p>
            )}
            <div className="mt-6">
              <ArrowLink href="/voitures-electriques">Voir les {total} versions</ArrowLink>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/comparer"
              className="on-ink group block rounded-2xl bg-ink p-6 text-paper transition-colors hover:bg-ink-raised sm:p-8"
            >
              <p className="eyebrow text-signal">02 · Comparer</p>
              <h3 className="mt-2 text-h2 font-bold">Comparer des voitures</h3>
              <p className="mt-3 text-ink-muted">
                Deux ou trois modèles côte à côte : batterie, autonomie, recharge, dimensions, garanties.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-signal">
                Ouvrir le comparateur
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
            <ul className="divide-y divide-line border-y border-line">
              {[
                { n: "03", href: "/recharge", t: "Comprendre la recharge", d: "AC, DC, puissances de borne et connecteurs expliqués." },
                { n: "04", href: "/outils", t: "Estimer un coût", d: "Coût aux 100 km, recharge, TCO : chaque étape du calcul est visible." },
              ].map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="group flex items-start gap-4 py-5">
                    <span className="eyebrow mt-1.5 w-6 shrink-0 text-signal-deep">{r.n}</span>
                    <span className="flex-1">
                      <h3 className="text-lg font-semibold text-ink group-hover:underline">{r.t}</h3>
                      <span className="mt-1 block text-sm text-muted">{r.d}</span>
                    </span>
                    <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-signal-deep transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Comparer                                                            */
/* ------------------------------------------------------------------ */

const compareRows: { label: string; value: (v: Vehicle) => string }[] = [
  { label: "Autonomie WLTP", value: (v) => fmt(v.rangeWltp, "km") },
  { label: "Batterie utile", value: (v) => fmt(v.batteryUsable, "kWh", 1) },
  { label: "Charge DC max", value: (v) => fmt(v.chargingDC, "kW") },
  { label: "Charge 10-80 %", value: (v) => fmt(v.chargingTime10to80, "min") },
  { label: "Conso. calculée", value: (v) => fmt(batteryConsumption100(v), "kWh/100 km", 1) },
];

export function CompareSpotlight({ comparisons }: { comparisons: { slug: string; vehicles: Vehicle[] }[] }) {
  const duel = comparisons[0];
  const [a, b] = duel?.vehicles ?? [];
  return (
    <section aria-labelledby="compare" className="on-ink bg-ink py-section text-paper">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow text-signal">Comparateur</p>
            <h2 id="compare" className="mt-2 text-h2 font-bold">
              Comparer, sans classement artificiel
            </h2>
            <p className="mt-4 text-ink-muted">
              Le comparateur met deux ou trois modèles côte à côte, par catégorie : batterie, autonomie, recharge, performances, dimensions, coffre, garanties et coût d&apos;usage.
              Il signale uniquement des différences mesurables (autonomie WLTP la plus élevée, temps de charge le plus court…), jamais une « meilleure voiture ».
            </p>
            <div className="mt-8">
              <ButtonLink href="/comparer" variant="signal" size="lg">
                Ouvrir le comparateur
              </ButtonLink>
            </div>
          </div>

          {duel && a && b && (
            <div className="min-w-0">
              <div className="relative overflow-x-auto rounded-2xl border border-line-ink">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Exemple de comparaison : {vehicleTitle(a)} contre {vehicleTitle(b)}
                  </caption>
                  <thead>
                    <tr className="border-b border-line-ink">
                      <th scope="col" className="eyebrow px-4 py-3 text-ink-muted">Critère</th>
                      {[a, b].map((v) => (
                        <th key={v.id} scope="col" className="px-4 py-3 font-semibold text-paper">
                          <span className="eyebrow block text-signal">{v.brand}</span>
                          {v.model}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-ink">
                    {compareRows.map((r) => (
                      <tr key={r.label}>
                        <th scope="row" className="px-4 py-3 font-medium text-ink-muted">{r.label}</th>
                        {[a, b].map((v) => (
                          <td key={v.id} className="tabular px-4 py-3 font-semibold text-paper">{r.value(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <DataBadge type="specialized" />
                <DataBadge type="calculated" />
                <ArrowLink href={`/comparer/${duel.slug}`} tone="ink" className="sm:ml-auto">
                  Voir la comparaison détaillée
                </ArrowLink>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 border-t border-line-ink pt-8">
          <h3 className="eyebrow text-ink-muted">Comparaisons de modèles concurrents</h3>
          <ul className="mt-4 grid gap-x-8 sm:grid-cols-3">
            {comparisons.slice(0, 3).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/comparer/${c.slug}`}
                  className="group flex min-h-14 items-center justify-between gap-3 border-b border-line-ink py-3 text-sm font-semibold text-paper"
                >
                  <span>
                    {vehicleTitle(c.vehicles[0])} <span className="font-normal text-ink-muted">contre</span> {vehicleTitle(c.vehicles[1])}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-signal transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Transparence des données                                            */
/* ------------------------------------------------------------------ */

const trust = [
  { t: "Sources citées", d: "Chaque fiche renvoie à sa source et à sa date de relevé." },
  { t: "Calculs visibles", d: "Formules, hypothèses et exemples sont affichés, jamais cachés." },
  { t: "Estimations signalées", d: "Nous distinguons données sourcées, calculs et estimations." },
];

export function DataTrust() {
  return (
    <section aria-labelledby="confiance" className="bg-paper-deep py-section">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="eyebrow text-signal-deep">Données</p>
            <h2 id="confiance" className="mt-2 text-h2 font-bold text-ink">
              Notre engagement de transparence
            </h2>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {trust.map((x, i) => (
                <li key={x.t} className="flex gap-4 py-4">
                  <span className="eyebrow mt-1 w-6 shrink-0 text-signal-deep">0{i + 1}</span>
                  <p className="text-body">
                    <strong className="block text-ink">{x.t}</strong>
                    {x.d}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <ArrowLink href="/methodologie">Lire la méthodologie</ArrowLink>
            </div>
          </div>
          <div>
            <h3 className="eyebrow mb-4 text-muted">Quatre natures de données</h3>
            <DataLegend />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Recharge                                                            */
/* ------------------------------------------------------------------ */

const chargeItems = [
  { href: "/guides/recharge-ac-ou-dc", t: "AC ou DC ?", d: "Où se fait la conversion du courant, et pourquoi la recharge rapide est en continu." },
  { href: "/guides/puissance-borne-7-11-22-kw", t: "7,4, 11 ou 22 kW", d: "La puissance utilisée est celle du maillon le plus faible entre borne et voiture." },
  { href: "/guides/combien-coute-recharge-domicile", t: "Combien ça coûte ?", d: "Énergie, rendement, tarif du kWh : le calcul détaillé, avec exemples." },
];

export function ChargingBand() {
  return (
    <section aria-labelledby="recharge" className="py-section">
      <Container>
        <SectionHeading
          id="recharge"
          eyebrow="Recharge"
          title="Recharge : AC, DC et coûts"
          action={<ArrowLink href="/recharge">Tout le dossier : recharge d&apos;une voiture électrique</ArrowLink>}
        />
        <ul className="grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {chargeItems.map((c, i) => (
            <li key={c.href}>
              <Link href={c.href} className="group block h-full p-6 transition-colors hover:bg-surface md:p-8">
                <p className="eyebrow text-signal-deep">0{i + 1}</p>
                <h3 className="mt-3 text-h3 font-bold text-ink group-hover:underline">{c.t}</h3>
                <p className="mt-2 text-sm text-muted">{c.d}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-deep">
                  Lire le guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Guides et analyses                                                  */
/* ------------------------------------------------------------------ */

export function ContentSection({
  guides,
  guideTotal,
  articles,
}: {
  guides: Guide[];
  guideTotal: number;
  articles: Article[];
}) {
  return (
    <section aria-label="Guides et analyses" className="pb-section">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="Comprendre"
              title="Guides"
              action={<ArrowLink href="/guides">Les {guideTotal} guides</ArrowLink>}
            />
            <ul className="divide-y divide-line border-y border-line">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="group flex items-start gap-4 py-4">
                    <span className="flex-1">
                      <span className="eyebrow block text-signal-deep">{guideCategoryLabels[g.category]}</span>
                      <h3 className="mt-1 text-base font-semibold text-ink group-hover:underline">{g.title}</h3>
                      <span className="mt-1 hidden text-sm text-muted sm:line-clamp-2 sm:block lg:line-clamp-1">{g.description}</span>
                    </span>
                    <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-signal-deep transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Données"
              title="Analyses récentes"
              action={<ArrowLink href="/blog">Tout le blog</ArrowLink>}
            />
            <ul className="divide-y divide-line border-y border-line">
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/blog/${a.slug}`} className="group block py-4">
                    <span className="eyebrow block text-muted">
                      {a.category} · {a.readingTime} min · <time dateTime={a.updatedAt}>{formatDateFr(a.updatedAt)}</time>
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-ink group-hover:underline">{a.title}</h3>
                    <span className="mt-1 hidden text-sm text-muted sm:line-clamp-2 sm:block">{a.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Outils                                                              */
/* ------------------------------------------------------------------ */

export function ToolsBand({ tools }: { tools: Tool[] }) {
  return (
    <section aria-labelledby="outils" className="on-ink bg-ink py-section text-paper">
      <Container>
        <SectionHeading
          id="outils"
          tone="ink"
          eyebrow="Calculateurs"
          title="Outils populaires"
          description="Chaque outil affiche sa formule, un exemple chiffré, ses limites et une FAQ."
          action={<ArrowLink href="/outils" tone="ink">Tous les outils</ArrowLink>}
        />
        <ul className="grid gap-x-10 border-t border-line-ink md:grid-cols-2">
          {tools.map((t) => (
            <li key={t.slug} className="border-b border-line-ink">
              <Link href={t.href} className="group flex items-start gap-4 py-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line-ink text-signal">
                  <DynamicIcon name={t.icon} className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <h3 className="text-base font-semibold text-paper group-hover:underline">{t.shortTitle}</h3>
                  <span className="mt-1 block text-sm text-ink-muted">{t.description}</span>
                </span>
                <ArrowRight className="mt-2.5 h-4 w-4 shrink-0 text-signal transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
