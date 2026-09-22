"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { clearGarage } from "./garage-store";
import { useGarageIds } from "./useGarage";
import { useConsent } from "@/components/CookieBanner";
import { cx } from "@/lib/cx";

const noopSubscribe = () => () => {};

/**
 * Barre flottante globale (montée une fois dans `layout.tsx`, jamais dans le header/footer) :
 * visible dès qu'un véhicule est dans « Ma sélection ». Décalée vers le haut tant que le bandeau
 * cookies (bas de page, z-60) n'a pas de réponse, pour ne jamais le recouvrir.
 */
export function GarageBar() {
  const ids = useGarageIds();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const consent = useConsent();

  if (!hydrated || ids.length === 0) return null;

  return (
    <div
      role="status"
      className={cx(
        "fixed inset-x-4 z-50 sm:inset-x-auto sm:right-4",
        consent === null ? "bottom-24 sm:bottom-28" : "bottom-4",
      )}
    >
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
