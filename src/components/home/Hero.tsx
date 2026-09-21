import { SearchBar } from "@/components/layout/SearchBar";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/primitives";
import { Stat } from "@/components/ui/Stat";
import { BlueprintArt } from "./BlueprintArt";

/**
 * Hero : promesse, recherche, deux accès (comparer, explorer) et quatre chiffres réels du
 * catalogue. Le H1 est celui de la page d'accueil, inchangé. Composition éditoriale :
 * texte à gauche, planche technique décorative à droite (masquée sous 1024 px).
 */
export function Hero({
  h1,
  stats,
}: {
  h1: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <section className="on-ink bg-ink text-paper">
      <Container className="pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-signal">Expertise électrique</p>
            <h1 className="mt-4 text-h1 font-bold text-paper lg:text-[3rem] lg:leading-[1.06]">{h1}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Autonomie, batterie, recharge et coût d&apos;usage de chaque modèle, comparés côte à côte à partir de
              données sourcées : la nature de chaque chiffre est toujours indiquée.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar size="lg" idSuffix="home" placeholder="Rechercher un modèle, une marque, un guide" />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/comparer" variant="signal" size="lg">
                Comparer des voitures
              </ButtonLink>
              <ButtonLink
                href="/voitures-electriques"
                variant="outline"
                size="lg"
                className="border-line-ink text-paper hover:border-paper hover:bg-transparent"
              >
                Explorer les voitures
              </ButtonLink>
            </div>
          </div>
          <BlueprintArt className="hidden h-auto w-full lg:block" />
        </div>

        <ul
          aria-label="Le catalogue en chiffres"
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line-ink pt-8 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <li key={s.label}>
              <Stat tone="ink" label={s.label} value={s.value} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
