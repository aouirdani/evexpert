import type { Vehicle } from "@/types";
import { bodyTypeLabels } from "@/lib/vehicle-format";
import { formatNumber } from "@/lib/utils";
import { BodyGlyph } from "./BodyGlyph";

/**
 * Silhouette du type de carrosserie avec la cote de longueur réelle de la fiche. La silhouette est
 * générique (jamais le modèle exact) ; seule la cote est une donnée du véhicule.
 */
export function BodyDimensions({ vehicle: v }: { vehicle: Vehicle }) {
  const { length, width, height } = v.dimensions;
  return (
    <figure>
      <BodyGlyph type={v.bodyType} className="h-auto w-full text-ink" />
      <div aria-hidden className="mt-2 flex items-center">
        <span className="h-2.5 w-px bg-ink" />
        <span className="h-px flex-1 bg-ink" />
        <span className="h-2.5 w-px bg-ink" />
      </div>
      <p className="num mt-1.5 text-center text-sm font-semibold text-ink">
        {formatNumber(length)} <span className="font-normal text-muted">mm</span>
      </p>
      <figcaption className="mt-3 border-t border-line pt-3 text-caption text-muted">
        {bodyTypeLabels[v.bodyType]} · L × l × h : <span className="num">{formatNumber(length)} × {formatNumber(width)} × {formatNumber(height)} mm</span>.
        Silhouette schématique du type de carrosserie, pas le modèle exact.
      </figcaption>
    </figure>
  );
}
