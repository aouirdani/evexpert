import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { GuideCard } from "@/components/cards";
import { chargingTopics } from "@/data/charging";
import { guides } from "@/data/guides";
import { SOURCES } from "@/data/sources";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Recharge d'une voiture électrique : puissances, connecteurs, coûts",
  description:
    "Tout comprendre sur la recharge : AC ou DC, 7,4, 11, 22 kW, connecteurs Type 2 et CCS, recharge à domicile ou sur borne publique, temps et coûts avec calculateurs.",
  path: "/recharge",
});

export default function RechargePage() {
  const rechargeGuides = guides.filter((g) => g.category === "recharge").slice(0, 6);
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Recharge", href: "/recharge" }]} />
      <PageHeader
        eyebrow="Recharge"
        title="Recharge d'une voiture électrique : puissances, connecteurs, coûts"
        description="Recharger, c'est choisir un lieu, une puissance et un tarif. Ces pages vous aident à comprendre ces trois choix et à les chiffrer."
      />

      <section className="mt-10" aria-labelledby="modes">
        <h2 id="modes" className="text-2xl font-bold text-slate-900">Les deux modes de recharge</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Comparaison de la recharge AC et DC</caption>
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold"> </th>
                <th scope="col" className="px-5 py-3 font-semibold">Recharge AC</th>
                <th scope="col" className="px-5 py-3 font-semibold">Recharge DC (rapide)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><th scope="row" className="px-5 py-3 font-medium text-slate-900">Où</th><td className="px-5 py-3">Domicile, travail, voirie</td><td className="px-5 py-3">Autoroute, pôles d&apos;échange</td></tr>
              <tr><th scope="row" className="px-5 py-3 font-medium text-slate-900">Puissances</th><td className="tabular px-5 py-3">3,7 à 22 kW</td><td className="tabular px-5 py-3">50 kW et plus</td></tr>
              <tr><th scope="row" className="px-5 py-3 font-medium text-slate-900">Connecteur</th><td className="px-5 py-3">Type 2</td><td className="px-5 py-3">CCS Combo 2</td></tr>
              <tr><th scope="row" className="px-5 py-3 font-medium text-slate-900">Usage</th><td className="px-5 py-3">Quotidien</td><td className="px-5 py-3">Longs trajets</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          Détail : <Link href="/guides/recharge-ac-ou-dc" className="font-medium text-emerald-800 underline">recharge AC ou DC, quelle différence ?</Link>
        </p>
      </section>

      <section className="mt-12" aria-labelledby="connecteurs">
        <h2 id="connecteurs" className="text-2xl font-bold text-slate-900">Connecteurs</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {chargingTopics.map((t) => (
            <Link key={t.slug} href={`/recharge/${t.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-md">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800">{t.shortTitle}</h3>
              <p className="mt-1 text-sm text-slate-600">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="outils-recharge">
        <h2 id="outils-recharge" className="text-2xl font-bold text-slate-900">Calculer votre recharge</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { href: "/outils/cout-recharge-voiture-electrique", label: "Coût d'une recharge" },
            { href: "/outils/temps-recharge", label: "Temps de recharge" },
            { href: "/outils/puissance-borne-recharge", label: "Puissance de borne" },
          ].map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-900 hover:border-emerald-400 hover:text-emerald-800">
                {t.label} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="guides-recharge">
        <h2 id="guides-recharge" className="text-2xl font-bold text-slate-900">Guides sur la recharge</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rechargeGuides.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </section>

      <section className="mt-12 max-w-3xl" aria-labelledby="bornes">
        <h2 id="bornes" className="text-2xl font-bold text-slate-900">Trouver une borne</h2>
        <div className="prose-ev">
          <p>
            EVExpert ne publie pas de carte de bornes : les données de disponibilité et de prix changent en continu et doivent venir de sources à jour. Les points de recharge
            ouverts au public en France sont publiés en données ouvertes dans la{" "}
            <a href={SOURCES.irve.url} target="_blank" rel="noopener noreferrer nofollow">base nationale des IRVE sur data.gouv.fr</a>, dont s&apos;inspirent
            de nombreuses applications de cartographie. Pour le prix et la disponibilité, utilisez l&apos;application de l&apos;opérateur de la borne.
          </p>
        </div>
      </section>
      <JsonLd data={itemListJsonLd("Recharge : connecteurs", chargingTopics.map((t) => ({ name: t.title, href: `/recharge/${t.slug}` })))} />
    </Container>
  );
}
