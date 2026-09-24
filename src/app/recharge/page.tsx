import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { GuideCard } from "@/components/cards";
import { chargingTopics } from "@/data/charging";
import { getGuides } from "@/data/guides";
import { SOURCES } from "@/data/sources";
import { EDITORIAL_PHOTOS } from "@/data/editorial/media";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

// Régénération quotidienne : une donnée modifiée en base apparaît sans redéploiement.
export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Recharge d'une voiture électrique",
  description:
    "Recharge AC ou DC, puissances (7,4, 11, 22 kW), connecteurs Type 2 et CCS, à domicile ou sur borne publique : temps et coûts avec calculateurs.",
  path: "/recharge",
});

const modes = [
  {
    key: "ac",
    title: "Recharge AC",
    power: "3,7 à 22",
    photo: EDITORIAL_PHOTOS["puissance-borne-7-11-22-kw"]?.image,
    rows: [
      ["Où", "Domicile, travail, voirie"],
      ["Connecteur", "Type 2"],
      ["Usage", "Quotidien"],
    ],
  },
  {
    key: "dc",
    title: "Recharge DC (rapide)",
    power: "50 et plus",
    photo: EDITORIAL_PHOTOS["recharge-ac-ou-dc"]?.image,
    rows: [
      ["Où", "Autoroute, pôles d'échange"],
      ["Connecteur", "CCS Combo 2"],
      ["Usage", "Longs trajets"],
    ],
  },
];

// Guides dont la photo illustre déjà les deux modes de recharge, plus haut.
const usedAbove = new Set(["puissance-borne-7-11-22-kw", "recharge-ac-ou-dc"]);

export default async function RechargePage() {
  const rechargeGuides = (await getGuides()).filter((g) => g.category === "recharge").slice(0, 6);
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Recharge", href: "/recharge" }]} />
      <PageHeader
        eyebrow="Recharge"
        title="Recharge d'une voiture électrique : puissances, connecteurs, coûts"
        description="Recharger, c'est choisir un lieu, une puissance et un tarif. Ces pages vous aident à comprendre ces trois choix et à les chiffrer."
      />

      <section className="mt-16" aria-labelledby="modes">
        <h2 id="modes" className="text-h2 font-bold text-ink">Les deux modes de recharge</h2>
        <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {modes.map((m) => (
            <article key={m.key}>
              {m.photo && (
                <Image
                  src={m.photo.src}
                  alt={m.photo.alt}
                  width={m.photo.width}
                  height={m.photo.height}
                  sizes="(min-width: 1152px) 560px, (min-width: 768px) 46vw, 100vw"
                  className="aspect-[3/2] w-full object-cover"
                />
              )}
              <div className="mt-5 border-t-2 border-ink pt-4">
                <h3 className="label">{m.title}</h3>
                <p className="num mt-2 text-data-lg font-bold text-ink">
                  {m.power}
                  <span className="unit">kW</span>
                </p>
                <dl className="mt-5">
                  {m.rows.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line py-2.5 text-sm">
                      <dt className="text-muted">{k}</dt>
                      <dd className="font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-2 text-caption text-muted">Images d&apos;illustration générées par IA, véhicules et lieux génériques.</p>
        <p className="mt-4 text-sm text-body">
          Détail : <Link href="/guides/recharge-ac-ou-dc" className="link-u font-semibold text-signal-deep">recharge AC ou DC, quelle différence ?</Link>
        </p>
      </section>

      <section className="mt-section grid gap-x-12 gap-y-6 lg:grid-cols-12" aria-labelledby="connecteurs">
        <h2 id="connecteurs" className="text-h2 font-bold text-ink lg:col-span-4">Connecteurs</h2>
        <ul className="border-t-2 border-ink lg:col-span-8">
          {chargingTopics.map((t) => (
            <li key={t.slug} className="border-b border-line">
              <Link href={`/recharge/${t.slug}`} className="group flex items-start justify-between gap-6 py-5">
                <span>
                  <span className="block text-lg font-bold text-ink">
                    <span className="link-h group-hover:[background-size:100%_2px]">{t.shortTitle}</span>
                  </span>
                  <span className="mt-1 block max-w-xl text-sm text-muted">{t.description}</span>
                </span>
                <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-section grid gap-x-12 gap-y-6 lg:grid-cols-12" aria-labelledby="outils-recharge">
        <h2 id="outils-recharge" className="text-h2 font-bold text-ink lg:col-span-4">Calculer votre recharge</h2>
        <ul className="border-t-2 border-ink lg:col-span-8">
          {[
            { href: "/outils/cout-recharge-voiture-electrique", label: "Coût d'une recharge" },
            { href: "/outils/temps-recharge", label: "Temps de recharge" },
            { href: "/outils/puissance-borne-recharge", label: "Puissance de borne" },
          ].map((t, i) => (
            <li key={t.href} className="border-b border-line">
              <Link href={t.href} className="group flex items-baseline gap-5 py-4">
                <span className="num w-7 shrink-0 text-sm font-semibold text-signal-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-base font-bold text-ink">
                  <span className="link-h group-hover:[background-size:100%_2px]">{t.label}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 self-center text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-section" aria-labelledby="guides-recharge">
        <div className="mb-8 border-t-2 border-ink pt-4">
          <h2 id="guides-recharge" className="text-h2 font-bold text-ink">Guides sur la recharge</h2>
        </div>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rechargeGuides.map((g) => (
            <GuideCard key={g.slug} guide={g} showImage={!usedAbove.has(g.slug)} />
          ))}
        </div>
      </section>

      <section className="mt-section grid gap-x-12 gap-y-6 lg:grid-cols-12" aria-labelledby="bornes">
        <h2 id="bornes" className="text-h2 font-bold text-ink lg:col-span-4">Trouver une borne</h2>
        <div className="prose-ev lg:col-span-8 lg:max-w-2xl">
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
