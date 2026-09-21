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
    <Container className="pb-section pt-8">
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
        <h2 id="vehicules" className="text-h2 font-bold text-ink">Fiches véhicules</h2>
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
        <h2 id="natures" className="text-h2 font-bold text-ink">Nature des données</h2>
        <DataLegend className="mt-4" />
        <p className="mt-3 text-sm text-body">
          Détail des méthodes : <Link href="/methodologie" className="link-u font-semibold text-signal-deep">page Méthodologie</Link>.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="refs">
        <h2 id="refs" className="text-h2 font-bold text-ink">Références externes citées</h2>
        <p className="mt-2 max-w-3xl text-body">
          Ces liens ont été ouverts avec succès à la date indiquée. Nous ne citons pas de source que nous n&apos;avons pas consultée.
        </p>
        <ul className="mt-6 border-t-2 border-ink">
          {SOURCE_ROLES.map(({ source, usage }) => (
            <li key={source.url} className="grid gap-x-8 gap-y-1 border-b border-line py-4 md:grid-cols-[minmax(0,22rem)_1fr_9rem]">
              <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="link-u self-start font-semibold text-signal-deep">
                {source.label}
              </a>
              <p className="text-sm text-body">{usage}</p>
              <p className="num text-caption text-muted md:text-right">Consultée le {formatDateFr(source.accessed)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 max-w-3xl" aria-labelledby="corrections">
        <h2 id="corrections" className="text-h2 font-bold text-ink">Corrections</h2>
        <div className="prose-ev">
          <p>
            Une erreur ? Signalez-la via la <Link href="/contact">page Contact</Link> avec le modèle, la donnée et la source à l&apos;appui : nous corrigeons et mettons la date à jour.
          </p>
        </div>
      </section>
    </Container>
  );
}
