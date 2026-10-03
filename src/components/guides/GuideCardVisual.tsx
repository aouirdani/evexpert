import Image from "next/image";
import Link from "next/link";
import { frTypo } from "@/lib/format";

export interface GuideCardData {
  /** Adresse de la page (guide ou article). */
  href: string;
  title: string;
  excerpt: string;
  categoryLabel: string;
  readingTime: number;
  /** « Mis à jour le » (guides) ou « Publié le » (articles). */
  dateLabel?: string;
  updatedAtIso: string;
  updatedAtLabel: string;
  image?: { src: string; width: number; height: number };
}

/**
 * Carte de guide : image 16:9 (ou tuile typographique quand le guide n'a pas encore de photo),
 * rubrique, titre, extrait, date de mise à jour. Le lien est étiré sur toute la carte.
 */
export function GuideCardVisual({ guide, priority = false }: { guide: GuideCardData; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col border-t-2 border-ink pt-5">
      <div className="mb-5 aspect-video overflow-hidden rounded-sm bg-paper-deep">
        {guide.image ? (
          <Image
            src={guide.image.src}
            alt=""
            width={guide.image.width}
            height={guide.image.height}
            sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 100vw"
            priority={priority}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          // Pas encore de photo : tuile neutre qui garde la grille alignée (la rubrique est lue dans le surtitre).
          <div aria-hidden className="h-full w-full" />
        )}
      </div>
      <p className="label flex items-baseline justify-between gap-3">
        <span>{guide.categoryLabel}</span>
        <span>{guide.readingTime}&nbsp;min</span>
      </p>
      <h3 className="mt-3 text-h3 font-bold text-ink">
        <Link href={guide.href} className="link-h after:absolute after:inset-0 after:content-[''] group-hover:[background-size:100%_2px]">
          {frTypo(guide.title)}
        </Link>
      </h3>
      <p className="pretty mt-2 flex-1 text-sm text-muted">{guide.excerpt}</p>
      <p className="mt-4 text-caption text-muted">
        {guide.dateLabel ?? "Mis à jour le"} <time dateTime={guide.updatedAtIso}>{guide.updatedAtLabel}</time>
      </p>
    </article>
  );
}
