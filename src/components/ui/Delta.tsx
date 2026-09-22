import { formatNumber } from "@/lib/format";

/**
 * Écart chiffré neutre entre deux valeurs : jamais « meilleur » ou « pire », seulement la
 * distance. Valeurs égales → « identique » ; une valeur absente → rien.
 */
export function Delta({
  a,
  b,
  unit,
  digits = 0,
  className,
}: {
  a: number | null | undefined;
  b: number | null | undefined;
  unit: string;
  digits?: number;
  className?: string;
}) {
  if (a === null || a === undefined || b === null || b === undefined) return null;
  const diff = Math.abs(a - b);
  const same = Number(diff.toFixed(digits)) === 0;
  return (
    <span className={className ?? "num text-sm text-muted"}>
      {same ? (
        "identique"
      ) : (
        <>
          <span aria-hidden>Δ </span>
          <span className="sr-only">écart de </span>
          {formatNumber(diff, digits)} {unit}
        </>
      )}
    </span>
  );
}
