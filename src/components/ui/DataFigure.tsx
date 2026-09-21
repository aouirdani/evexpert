import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  xl: "text-data-xl",
  lg: "text-data-lg",
  md: "text-data-md",
} as const;

/**
 * Une donnée composée comme une cote : étiquette, valeur tabulaire, unité.
 * `tone="ink"` sur fond sombre. `value` absente → « — » (lu « Non disponible »).
 */
export function DataFigure({
  label,
  value,
  unit,
  size = "lg",
  tone = "paper",
  note,
  className,
}: {
  label: string;
  value: string | null | undefined;
  unit?: string;
  size?: keyof typeof sizes;
  tone?: "paper" | "ink";
  note?: ReactNode;
  className?: string;
}) {
  const onInk = tone === "ink";
  const missing = value === null || value === undefined || value === "";
  return (
    <div className={cn("min-w-0", className)}>
      <p className={cn("label", onInk ? "text-ink-muted" : "text-muted")}>{label}</p>
      <p className={cn("num mt-2 font-bold", sizes[size], onInk ? "text-paper" : "text-ink")}>
        {missing ? (
          <>
            <span aria-hidden>—</span>
            <span className="sr-only">Non disponible</span>
          </>
        ) : (
          <>
            {value}
            {unit && <span className="unit">{unit}</span>}
          </>
        )}
      </p>
      {note && <p className={cn("mt-1.5 text-caption", onInk ? "text-ink-muted" : "text-muted")}>{note}</p>}
    </div>
  );
}
