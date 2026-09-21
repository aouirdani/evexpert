/**
 * Géométrie du symbole EVExpert (grille 64 × 64).
 * Source de vérité : scripts/build-brand-assets.py ; tests/unit/brand.test.ts
 * vérifie que ces valeurs restent identiques aux SVG de public/brand/.
 */
export const MARK = {
  /** Plaque aux coins haut-gauche et bas-droit coupés. */
  plate: "M10 0H64V54L54 64H0V10Z",
  /** « E » : montant + trois branches de longueurs croissantes (niveaux de batterie). */
  e: "M14 15H35V22H21V28.5H43V35.5H21V42H51V49H14Z",
  /** Point de signal, aligné sur l'extrémité de la branche la plus longue. */
  dot: { cx: 47.5, cy: 18.5, r: 3.5 },
} as const;
