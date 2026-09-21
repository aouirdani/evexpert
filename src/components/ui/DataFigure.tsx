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
 * Dans un `<dl>` (index chiffré), l'étiquette est un `<dt>` et la valeur un `<dd>`.
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
  const labelCls = cn("label", onInk ? "text-ink-muted" : "text-muted");
  const valueCls = cn("num mt-2 font-bold", sizes[size], onInk ? "text-paper" : "text-ink");
  const content = missing ? (
    <>
      <span aria-hidden>—</span>
      <span className="sr-only">Non disponible</span>
    </>
  ) : (
    <>
      {value}
      {unit && <span className="unit">{unit}</span>}
    </>
  );
  return (
    <div className={cn("min-w-0", className)}>
      <dt className={labelCls}>{label}</dt>
      <dd className={valueCls}>{content}</dd>
      {note && <dd className={cn("mt-1.5 text-caption", onInk ? "text-ink-muted" : "text-muted")}>{note}</dd>}
    </div>
  );
}
