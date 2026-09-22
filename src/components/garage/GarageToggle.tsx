"use client";

import { Check, Plus } from "lucide-react";
import { GARAGE_MAX, toggleGarage } from "./garage-store";
import { useGarageIds } from "./useGarage";
import { cx } from "@/lib/cx";

/**
 * Bouton « Comparer » d'une fiche/carte véhicule : ajoute ou retire ce véhicule de « Ma
 * sélection » (voir `garage-store.ts`). Posé au-dessus du lien étiré de la carte : il arrête
 * la propagation du clic pour ne pas déclencher la navigation vers la fiche.
 *
 * `className` doit fixer la position (`absolute ...` en médaillon sur `VehicleCard`, `relative`
 * en cellule de `VehicleRow`) : sans tailwind-merge, un `position` codé en dur ici entrerait en
 * conflit avec celui de l'appelant selon l'ordre des classes dans la feuille compilée par
 * Tailwind — pas celui du texte du `className` — et gagnerait silencieusement.
 *
 * `showLabel` : texte visible (colonne dédiée d'un tableau) ; sinon icône seule (badge de carte,
 * où le texte disputerait l'espace à la marque et à la carrosserie), avec le même texte en `sr-only`.
 */
export function GarageToggle({
  id,
  className,
  showLabel = false,
}: {
  id: string;
  className: string;
  showLabel?: boolean;
}) {
  const ids = useGarageIds();
  const active = ids.includes(id);
  const full = !active && ids.length >= GARAGE_MAX;
  const label = active ? "Ajouté" : "Comparer";

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={full}
      title={full ? `Sélection pleine (max. ${GARAGE_MAX}) : retirez un véhicule pour en ajouter un autre` : label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleGarage(id);
      }}
      className={cx(
        "z-10 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-sm border bg-surface text-xs font-semibold transition-colors duration-150",
        showLabel ? "px-2.5" : "w-8",
        active
          ? "border-ink bg-ink text-paper"
          : full
            ? "cursor-not-allowed border-line text-muted/60"
            : "border-control text-ink hover:border-ink",
        className,
      )}
    >
      {active ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Plus className="h-3.5 w-3.5" aria-hidden />}
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
    </button>
  );
}
