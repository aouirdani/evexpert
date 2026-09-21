import { cn, formatNumber } from "@/lib/utils";
import { RANGE_SCALE_MAX } from "@/lib/vehicle-format";

/**
 * Barre d'autonomie relative à une échelle commune (0 → RANGE_SCALE_MAX km), en CSS pur.
 * Une seule couleur pour tous les véhicules : la longueur est une donnée, pas un classement.
 * `decorative` : la valeur est déjà écrite à côté, la barre est masquée aux lecteurs d'écran ;
 * sinon elle expose une alternative textuelle (role="img" + aria-label).
 * Dans un conteneur `group`, le trait passe au vert profond au survol.
 */
export function RangeBar({
  value,
  max = RANGE_SCALE_MAX,
  label = "Autonomie WLTP",
  decorative = false,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  decorative?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({
        role: "img",
        "aria-label": `${label} : ${formatNumber(value)} km, sur une échelle de 0 à ${formatNumber(max)} km`,
      } as const);
  return (
    <div {...a11y} className={cn("relative h-[3px] w-full bg-line", className)}>
      <div
        className="absolute inset-y-0 left-0 bg-ink transition-colors duration-200 group-hover:bg-signal-deep"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
