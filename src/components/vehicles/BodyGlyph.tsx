import type { BodyType } from "@/types";
import { bodyGlyphId } from "@/lib/vehicle-format";

/**
 * Silhouette schématique d'un type de carrosserie (trait fin, profil). Illustration
 * générique et décorative : elle ne représente jamais le modèle exact. Le trait suit
 * `currentColor`. Les huit silhouettes vivent dans un sprite statique mis en cache
 * (public/brand/body-glyphs.svg) : chaque carte n'ajoute qu'une balise <use> au HTML.
 */
export function BodyGlyph({ type, className }: { type: BodyType; className?: string }) {
  return (
    <svg viewBox="0 0 200 72" aria-hidden focusable="false" className={className}>
      <use href={`/brand/body-glyphs.svg#${bodyGlyphId(type)}`} />
    </svg>
  );
}
