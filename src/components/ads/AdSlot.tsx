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
 * Conteneur publicitaire Google AdSense — INACTIF par défaut.
 * - Ne rend RIEN tant que ADSENSE_ENABLED != "true" ou que l'identifiant éditeur est absent :
 *   aucun faux emplacement, aucune fausse publicité, aucun espace vide.
 * - Une fois actif, réserve une hauteur fixe (pas de décalage de mise en page) et affiche
 *   la mention « Publicité » exigée pour distinguer l'annonce du contenu.
 * - Le script AdSense lui-même n'est jamais chargé sans consentement (à brancher au moment de l'activation).
 */
export function AdSlot({ slot, format = "leaderboard", className }: AdSlotProps) {
  if (!adsConfig.enabled || !adsConfig.clientId) return null;
  return (
    <aside aria-label="Publicité" data-ad-slot={slot} className={cn("w-full overflow-hidden", sizes[format], className)}>
      <p className="text-center text-[11px] uppercase tracking-wide text-muted">Publicité</p>
    </aside>
  );
}
