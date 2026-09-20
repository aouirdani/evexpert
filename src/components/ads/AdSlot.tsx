import { adsConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  /** Emplacement logique, utile pour la configuration future. */
  slot: string;
  format?: "leaderboard" | "rectangle" | "inline";
  className?: string;
}

const sizes: Record<NonNullable<AdSlotProps["format"]>, string> = {
  leaderboard: "min-h-[90px]",
  rectangle: "min-h-[250px]",
  inline: "min-h-[120px]",
};

/**
 * Emplacement publicitaire prêt pour Google AdSense.
 * - Désactivé par défaut (ADSENSE_ENABLED != "true").
 * - N'affiche jamais de fausse publicité : un placeholder neutre en dev.
 * - Réserve l'espace pour éviter le layout shift (CLS).
 */
export function AdSlot({ slot, format = "leaderboard", className }: AdSlotProps) {
  const active = adsConfig.enabled && adsConfig.clientId;

  return (
    <aside
      aria-label="Emplacement publicitaire"
      className={cn(
        "flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400",
        sizes[format],
        className,
      )}
      data-ad-slot={slot}
    >
      {active ? (
        // En production, l'intégration AdSense (script + <ins class="adsbygoogle">)
        // sera injectée ici une fois le compte validé.
        <span className="sr-only">Publicité</span>
      ) : (
        <span>Emplacement publicitaire</span>
      )}
    </aside>
  );
}
