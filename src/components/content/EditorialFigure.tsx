import Image from "next/image";
import type { EditorialImage } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Figure éditoriale : schéma SVG statique (public/editorial), dimensions intrinsèques
 * (aucun décalage de mise en page), légende visible. `priority` uniquement pour l'image
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
      <div className="overflow-hidden rounded-xl border border-line bg-paper-deep">
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
    </figure>
  );
}
