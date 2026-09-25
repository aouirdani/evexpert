"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { clearGarage } from "./garage-store";
import { useGarageIds } from "./useGarage";

const noopSubscribe = () => () => {};

/**
 * Barre flottante globale (montée une fois dans `layout.tsx`, jamais dans le header/footer) :
 * visible dès qu'un véhicule est dans « Ma sélection ».
 *
 * En bas à GAUCHE dès `sm:` (jamais à droite) : `VehicleRow` place sa colonne « Sélection »
 * (le même bouton Comparer) au bord droit de chaque tableau. Une barre à droite se superposait
 * régulièrement à cette colonne selon la position de défilement — clic absorbé par la barre,
 * bouton de la ligne inatteignable, sans aucun retour pour l'utilisateur. Trouvé en testant le
 * parcours réel (voir la review avant mise en ligne), pas par un simple contrôle visuel.
 */
export function GarageBar() {
  const ids = useGarageIds();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  if (!hydrated || ids.length === 0) return null;

  return (
    <div role="status" className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:left-4">
      <div className="on-ink flex items-center gap-4 rounded-sm bg-ink px-4 py-3 text-paper shadow-lg">
        <p className="text-sm font-semibold">
          <span className="num">{ids.length}</span>
          <span className="text-ink-muted"> / 3 dans ma sélection</span>
        </p>
        <Link
          href={`/comparer?v=${ids.join(",")}`}
          className="rounded-sm bg-signal px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-[#c8f65c]"
        >
          Comparer
        </Link>
        <button
          type="button"
          onClick={() => clearGarage()}
          aria-label="Vider ma sélection"
          className="ml-auto inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-ink-raised hover:text-paper"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
