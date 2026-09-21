import Image from "next/image";
import type { EditorialImage } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Figure éditoriale : photographie (JPEG, servie en AVIF/WebP par next/image) ou schéma SVG statique
 * (public/editorial). Dimensions intrinsèques (aucun décalage de mise en page), légende visible.
 * Les schémas ont leur propre fond « paper », identique à celui de la page : sans cadre marqué, la
 * planche se fondait dans la page (contraste 1:1). Le cadre ink de 2 px (16,6:1) la délimite comme
 * une planche technique ; les photos, elles, sont posées sans cadre. Dans un texte (`.prose-ev`), la
 * légende est numérotée « Fig. n » par un compteur CSS. Sous 640 px le schéma est réduit à ~30 % et
 * son texte devient très petit : un lien ouvre le fichier en grand. `priority` uniquement pour
 * l'image principale, dans le premier écran ; les autres sont chargées à la demande. Les schémas SVG
 * sont servis tels quels (pas d'optimiseur : ce sont déjà des vecteurs légers).
 */
export function EditorialFigure({
  image,
  priority = false,
  wide = false,
  className,
}: {
  image: EditorialImage;
  priority?: boolean;
  /** Photo d'ouverture pleine largeur de page (sinon : largeur de la colonne de texte). */
  wide?: boolean;
  className?: string;
}) {
  const isSchema = image.src.endsWith(".svg");
  return (
    <figure className={cn("fig my-10", className)}>
      <div className={cn(isSchema ? "overflow-hidden rounded-sm border-2 border-ink bg-surface" : "aspect-[2/1] overflow-hidden bg-paper-deep")}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={wide ? "(min-width: 1152px) 1152px, 100vw" : "(min-width: 1024px) 704px, 100vw"}
          priority={priority}
          unoptimized={isSchema}
          className={isSchema ? "h-auto w-full" : "h-full w-full object-cover"}
        />
      </div>
      {image.caption && <figcaption className="fig-caption mt-3 max-w-2xl text-caption text-muted">{image.caption}</figcaption>}
      {isSchema && (
        <a
          href={image.src}
          target="_blank"
          rel="noopener"
          className="link-u mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-signal-deep sm:hidden"
        >
          Ouvrir le schéma en grand
        </a>
      )}
    </figure>
  );
}
