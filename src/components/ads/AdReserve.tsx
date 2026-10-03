import { cn } from "@/lib/utils";

/**
 * Hauteur réservée, vide et invisible, pour un futur emplacement publicitaire en barre latérale
 * (rectangle 300 × 250). Ne contient aucun script, aucune annonce ni mention : ce n'est PAS le
 * composant AdSlot (AdSense reste inchangé). Réserver la place d'avance évite tout décalage de mise en
 * page le jour où l'emplacement est branché ; masqué sous 1024 px, où la barre latérale n'existe pas.
 */
export function AdReserve({ slot, className }: { slot: string; className?: string }) {
  return <div aria-hidden="true" data-reserved-slot={slot} className={cn("hidden h-[250px] w-full lg:block", className)} />;
}
