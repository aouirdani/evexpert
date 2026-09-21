import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Grand chiffre de fiche technique : étiquette en petites capitales, valeur
 * tabulaire, unité discrète. `tone="ink"` pour les surfaces sombres.
 */
export function Stat({
  label,
  value,
  unit,
  sub,
  badge,
  tone = "paper",
  size = "md",
  className,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  badge?: ReactNode;
  tone?: "paper" | "ink";
  size?: "md" | "lg";
  className?: string;
}) {
  const onInk = tone === "ink";
  return (
    <div className={cn("min-w-0", className)}>
      <p className={cn("eyebrow", onInk ? "text-ink-muted" : "text-muted")}>{label}</p>
      <p
        className={cn(
          "tabular mt-1.5 font-bold leading-none",
          size === "lg" ? "text-display" : "text-h1",
          onInk ? "text-paper" : "text-ink",
        )}
      >
        {value}
        {unit && (
          <span
            className={cn(
              "ml-1 font-semibold",
              size === "lg" ? "text-h3" : "text-base",
              onInk ? "text-ink-muted" : "text-muted",
            )}
          >
            {unit}
          </span>
        )}
      </p>
      {sub && <p className={cn("mt-1.5 text-xs", onInk ? "text-ink-muted" : "text-muted")}>{sub}</p>}
      {badge && <div className="mt-2">{badge}</div>}
    </div>
  );
}
