import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataLegend } from "@/components/ui/DataBadge";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { SOURCE_ROLES } from "@/data/sources";
import { getCatalog } from "@/data/catalog";
import { buildMetadata } from "@/lib/seo";
import { formatDateFr } from "@/lib/utils";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Sources des données",
  description:
    "D'où viennent les données d'EVExpert : source des fiches véhicules, références externes citées, date de relevé et politique de correction.",
  path: "/sources",
});

export default async function SourcesPage() {
  const catalog = await getCatalog();
  const n = catalog.vehicles.length;
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Sources", href: "/sources" }]} />
      <PageHeader
        eyebrow="Transparence"
        title="Sources des données"
        description="Chaque donnée importante peut être rattachée à une source. Voici lesquelles, et comment nous les utilisons."
      />
      <div className="mt-3">
        <LastUpdated date="2026-09-21" />
      </div>

      <section className="mt-10 max-w-3xl" aria-labelledby="vehicules">
        <h2 id="vehicules" className="text-2xl font-bold text-slate-900">Fiches véhicules</h2>
        <div className="prose-ev">
          <p>
            Les caractéristiques des {n} versions du catalogue proviennent de{" "}
            <a href="https://ev-database.org/" target="_blank" rel="noopener noreferrer nofollow">EV Database</a>, une base spécialisée. Elles ont été relevées le{" "}
            {formatDateFr(catalog.checkedAt)}. Ce n&apos;est pas une source constructeur : chaque fiche l&apos;indique (« Source spécialisée ») et renvoie vers la fiche d&apos;origine.
          </p>
          <p>
            Une donnée absente de la source est affichée « Non disponible ». Le prix en France et la garantie véhicule ne sont pas collectés à ce stade. Notre priorité future est
            d&apos;ajouter des sources constructeur pour les points importants.
          </p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="natures">
        <h2 id="natures" className="text-2xl font-bold text-slate-900">Nature des données</h2>
        <DataLegend className="mt-4" />
        <p className="mt-3 text-sm text-slate-700">
          Détail des méthodes : <Link href="/methodologie" className="font-medium text-emerald-800 underline">page Méthodologie</Link>.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="refs">
        <h2 id="refs" className="text-2xl font-bold text-slate-900">Références externes citées</h2>
        <p className="mt-2 max-w-3xl text-slate-700">
          Ces liens ont été ouverts avec succès à la date indiquée. Nous ne citons pas de source que nous n&apos;avons pas consultée.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Sources externes et usage sur EVExpert</caption>
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Source</th>
                <th scope="col" className="px-5 py-3 font-semibold">Usage sur EVExpert</th>
                <th scope="col" className="px-5 py-3 font-semibold">Consultée le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SOURCE_ROLES.map(({ source, usage }) => (
                <tr key={source.url}>
                  <th scope="row" className="px-5 py-3 font-medium">
                    <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="text-emerald-800 underline underline-offset-2">
                      {source.label}
                    </a>
                  </th>
                  <td className="px-5 py-3 text-slate-700">{usage}</td>
                  <td className="tabular px-5 py-3 text-slate-700">{formatDateFr(source.accessed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 max-w-3xl" aria-labelledby="corrections">
        <h2 id="corrections" className="text-2xl font-bold text-slate-900">Corrections</h2>
        <div className="prose-ev">
          <p>
            Une erreur ? Signalez-la via la <Link href="/contact">page Contact</Link> avec le modèle, la donnée et la source à l&apos;appui : nous corrigeons et mettons la date à jour.
          </p>
        </div>
      </section>
    </Container>
  );
}
