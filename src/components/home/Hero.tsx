import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/primitives";
import { DataFigure } from "@/components/ui/DataFigure";
import { frTypo } from "@/lib/format";

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
 * Hero : promesse, deux accès (comparer, explorer) et l'index chiffré du catalogue. Le H1 est
 * celui de la page d'accueil, inchangé. Photo de voiture à droite dès 1024 px ; en dessous, elle
 * suit le texte, pleine largeur. Aucune annotation sur la photo : l'image est générique.
 *
 * Image : un seul <Image> (pas de double chargement), ratio d'origine préservé (aucune
 * déformation, la voiture n'est jamais coupée), `priority` car elle est dans le premier écran.
 * Le fond de studio (quasi noir) est fondu dans le navy de la section par `mix-blend-lighten` :
 * pas de bord visible. Décorative (alt vide) : le H1 porte le sens de la section.
 */
export function Hero({
  h1,
  stats,
  updated,
}: {
  h1: string;
  stats: { label: string; value: string }[];
  /** Date de relevé la plus récente des données, déjà formatée. */
  updated?: string;
}) {
  return (
    <section className="on-ink relative overflow-hidden bg-ink text-paper">
      <Container className="pb-10 pt-14 sm:pt-20 lg:pt-24">
        <div className="relative z-10 max-w-[44rem] lg:min-h-[26rem]">
          <Kicker tone="ink">Expertise électrique</Kicker>
          {/* Espace insécable avant « : » (typographie française) : le deux-points ne passe jamais en début de ligne. */}
          <h1 className="balance mt-6 text-display font-bold text-paper lg:text-[4rem]">{frTypo(h1)}</h1>
          <p className="pretty mt-7 max-w-xl text-dek text-ink-muted">
            Autonomie, batterie, recharge et coût d&apos;usage de chaque modèle, comparés côte à côte à partir de
            données sourcées. La nature de chaque chiffre est toujours indiquée.
          </p>
          <div className="mt-9 flex flex-col gap-x-8 gap-y-4 sm:flex-row sm:items-center">
            <ButtonLink href="/comparer" variant="signal" size="lg">
              Comparer des voitures
            </ButtonLink>
            <Link
              href="/voitures-electriques"
              className="link-u self-start text-base font-semibold text-paper sm:self-auto"
            >
              Explorer les {stats[0]?.value ?? ""} versions du catalogue
            </Link>
          </div>
        </div>

        <div className="pointer-events-none relative -mx-4 -mb-6 mt-8 aspect-[5/4] sm:-mx-6 sm:-mb-10 sm:aspect-[16/9] lg:absolute lg:right-0 lg:top-2 lg:mx-0 lg:mb-0 lg:mt-0 lg:aspect-[1376/768] lg:w-[68vw] lg:max-w-[1100px]">
          <Image
            src="/brand/evexpert-hero.jpeg"
            alt=""
            width={1376}
            height={768}
            priority
            sizes="(min-width: 1024px) min(68vw, 1100px), 100vw"
            style={photoMask}
            className="h-full w-full object-cover object-right mix-blend-lighten"
          />
        </div>

        <dl
          aria-label="Le catalogue en chiffres"
          className="relative z-10 mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line-ink pt-6 sm:grid-cols-4 lg:mt-16"
        >
          {stats.map((s) => (
            <DataFigure key={s.label} tone="ink" size="lg" label={s.label} value={s.value} />
          ))}
        </dl>
        {updated && (
          <p className="relative z-10 mt-6 text-caption text-ink-muted">
            Données relevées le {updated}. La source et la nature de chaque chiffre sont indiquées sur chaque fiche.
          </p>
        )}
      </Container>
    </section>
  );
}
