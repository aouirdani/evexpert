import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Database,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/layout/SearchBar";
import { SectionHeading, ButtonLink } from "@/components/ui/primitives";
import { ToolCard, ArticleCard, GuideCard } from "@/components/cards";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { HeroVisual } from "@/components/home/HeroVisual";
import { AdSlot } from "@/components/ads/AdSlot";
import { tools } from "@/data/tools";
import { getAllVehicles } from "@/data/vehicles";
import { guides } from "@/data/guides";
import { articles } from "@/data/articles";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `Voiture électrique : calculateurs, comparatifs et guides`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const vehicles = getAllVehicles().slice(0, 6);
  const popularTools = tools.slice(0, 6);
  const featuredGuides = guides.slice(0, 4);
  const latestArticles = articles.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <Container className="relative py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                <BadgeCheck className="h-4 w-4" aria-hidden />
                {siteConfig.tagline}
              </span>
              <h1 className="display mt-5 text-4xl font-extrabold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
                Tout pour mieux comprendre la voiture électrique
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                Comparez les modèles, estimez votre autonomie, calculez vos coûts
                de recharge et découvrez le coût réel d&apos;un véhicule électrique.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/comparer" variant="primary">
                  Comparer les voitures
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/outils" variant="outline">
                  Voir les calculateurs
                </ButtonLink>
              </div>
              <div className="mt-8 max-w-xl">
                <SearchBar
                  placeholder="Quelle voiture électrique recherchez-vous ?"
                  size="lg"
                />
              </div>
            </div>

            <HeroVisual />
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="grid gap-6 py-8 sm:grid-cols-3">
          {[
            { title: "Calculs transparents", text: "Des formules affichées, pas de boîte noire." },
            { title: "Données identifiées", text: "Les données d'exemple sont clairement signalées." },
            { title: "Sans compte, sans pub imposée", text: "Utile même sans publicité, respectueux du RGPD." },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-sm font-bold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Popular tools */}
      <Container className="py-14">
        <SectionHeading
          eyebrow="Outils"
          title="Calculateurs populaires"
          description="Des outils simples et transparents pour estimer vos coûts et votre autonomie."
          action={
            <Link href="/outils" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
              Tous les outils <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </Container>

      {/* Vehicles */}
      <section className="bg-slate-50 py-14">
        <Container>
          <SectionHeading
            eyebrow="Modèles"
            title="Comparez les voitures électriques"
            description="Un aperçu de véhicules électriques (données d'exemple) pour explorer le comparateur."
            action={
              <Link href="/voitures-electriques" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
                Toutes les voitures <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-6">
        <AdSlot slot="home-leaderboard" format="leaderboard" />
      </Container>

      {/* Guides */}
      <Container className="py-14">
        <SectionHeading
          eyebrow="Guides"
          title="Comprendre la voiture électrique"
          description="Des guides pédagogiques pour choisir, recharger et entretenir votre véhicule."
          action={
            <Link href="/guides" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
              Tous les guides <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredGuides.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </Container>

      {/* Blog */}
      <section className="bg-slate-50 py-14">
        <Container>
          <SectionHeading
            eyebrow="Blog"
            title="Les dernières publications"
            description="Analyses et explications, sans contenu automatisé de masse."
            action={
              <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
                Voir le blog <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Container>
      </section>

      {/* Why EVExpert */}
      <Container className="py-14">
        <SectionHeading
          eyebrow="Notre approche"
          title={`Pourquoi utiliser ${siteConfig.name} ?`}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Calculator, title: "Des calculateurs utiles", text: "Coût de recharge, autonomie, TCO : des outils qui calculent vraiment, avec des formules transparentes." },
            { icon: Database, title: "Des données structurées", text: "Une base de véhicules typée, pensée pour accueillir demain des données sourcées et vérifiées." },
            { icon: FileText, title: "Des sources transparentes", text: "Chaque donnée factuelle vise une source et une date de mise à jour. Les données d'exemple sont clairement identifiées." },
            { icon: RefreshCw, title: "Une information à jour", text: "Le contenu est daté et destiné à être régulièrement actualisé." },
            { icon: BadgeCheck, title: "Des guides pratiques", text: "Des explications claires pour décider en connaissance de cause, sans jargon inutile." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
