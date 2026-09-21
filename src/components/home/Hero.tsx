import Image from "next/image";
import { SearchBar } from "@/components/layout/SearchBar";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/primitives";
import { Stat } from "@/components/ui/Stat";

// Fondu technique des bords de la photo (haut, bas, gauche) : le studio n'est pas exactement
// du navy de marque, sans cela ses bords resteraient visibles. Ce n'est pas un effet décoratif.
const EDGE_FADE = "linear-gradient(to bottom, transparent, #000 18%, #000 78%, transparent), linear-gradient(to right, transparent, #000 14%)";
const photoMask = {
  WebkitMaskImage: EDGE_FADE,
  WebkitMaskComposite: "source-in",
  maskImage: EDGE_FADE,
  maskComposite: "intersect",
} as const;

/**
 * Hero : promesse, recherche, deux accès (comparer, explorer) et quatre chiffres réels du
 * catalogue. Le H1 est celui de la page d'accueil, inchangé. Composition éditoriale :
 * texte à gauche, photo de voiture à droite dès 1024 px ; en dessous, la photo suit le texte,
 * pleine largeur, recadrée sur la voiture.
 *
 * Image : un seul <Image> (pas de double chargement), ratio d'origine préservé (aucune
 * déformation, la voiture n'est jamais coupée), `priority` car elle est dans le premier écran.
 * Le fond de studio (quasi noir) est fondu dans le navy de la section par `mix-blend-lighten` :
 * pas de bord visible, pas de dégradé. Décorative (alt vide) : le H1 porte le sens de la section.
 */
export function Hero({
  h1,
  stats,
}: {
  h1: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <section className="on-ink relative overflow-hidden bg-ink text-paper">
      <Container className="pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pt-20">
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
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
        </div>

        <div className="pointer-events-none relative -mx-4 -mb-8 -mt-4 aspect-[5/4] sm:-mx-6 sm:-mb-14 sm:-mt-8 sm:aspect-[16/9] lg:absolute lg:right-0 lg:top-6 lg:mx-0 lg:mb-0 lg:mt-0 lg:aspect-[1376/768] lg:w-[70vw] lg:max-w-[1100px]">
          <Image
            src="/brand/evexpert-hero.jpeg"
            alt=""
            width={1376}
            height={768}
            priority
            sizes="(min-width: 1024px) min(70vw, 1100px), 100vw"
            style={photoMask}
            className="h-full w-full object-cover object-right mix-blend-lighten"
          />
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
