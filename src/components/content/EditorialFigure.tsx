import Image from "next/image";
import type { EditorialImage } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Figure éditoriale : photographie (JPEG, servie en AVIF/WebP par next/image) ou schéma SVG statique
 * (public/editorial), même cadre ink de 2 px pour un ensemble cohérent, dimensions intrinsèques
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
  const isSchema = image.src.endsWith(".svg");
  return (
    <figure className={cn("my-8", className)}>
      <div className={cn("overflow-hidden rounded-xl border-2 border-ink bg-surface", !isSchema && "aspect-[2/1]")}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 768px, 100vw"
          priority={priority}
          unoptimized={isSchema}
          className={isSchema ? "h-auto w-full" : "h-full w-full object-cover"}
        />
      </div>
      {image.caption && <figcaption className="mt-2 text-sm leading-relaxed text-muted">{image.caption}</figcaption>}
      {isSchema && (
        <a
          href={image.src}
          target="_blank"
          rel="noopener"
          className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-signal-deep underline underline-offset-4 sm:hidden"
        >
          Ouvrir le schéma en grand
        </a>
      )}
    </figure>
  );
}
