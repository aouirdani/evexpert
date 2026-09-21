import Image from "next/image";
import type { EditorialImage } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Figure éditoriale : schéma SVG statique (public/editorial), dimensions intrinsèques
 * (aucun décalage de mise en page), légende visible. Les schémas ont leur propre fond
 * « paper », identique à celui de la page : sans cadre marqué, la planche se fondait dans
 * la page (contraste 1:1, ancienne bordure 1,3:1). Le cadre ink de 2 px (16,6:1) la
 * délimite comme une planche technique. Sous 640 px le schéma est réduit à ~30 % et son
 * texte devient très petit : un lien ouvre le fichier en grand. `priority` uniquement pour l'image
 * principale, située dans le premier écran ; les autres sont chargées à la demande.
 * Les schémas SVG sont servis tels quels (pas d'optimiseur : ce sont déjà des vecteurs légers).
 */
export function EditorialFigure({
  image,
  priority = false,
  className,
}: {
  image: EditorialImage;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-hidden rounded-xl border-2 border-ink bg-surface">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 768px, 100vw"
          priority={priority}
          unoptimized={image.src.endsWith(".svg")}
          className="h-auto w-full"
        />
      </div>
      {image.caption && <figcaption className="mt-2 text-sm leading-relaxed text-muted">{image.caption}</figcaption>}
      <a
        href={image.src}
        target="_blank"
        rel="noopener"
        className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-signal-deep underline underline-offset-4 sm:hidden"
      >
        Ouvrir le schéma en grand
      </a>
    </figure>
  );
}
