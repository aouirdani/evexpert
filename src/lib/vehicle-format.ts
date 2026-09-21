import { formatNumber } from "@/lib/utils";

export const NA = "Non disponible";

/** Formate une valeur numérique nullable avec unité ; « Non disponible » si absente. */
export function fmt(value: number | null | undefined, unit = "", digits = 0): string {
  if (value === null || value === undefined) return NA;
  return `${formatNumber(value, digits)}${unit ? ` ${unit}` : ""}`;
}

export function fmtText(value: string | null | undefined): string {
  return value && value.trim() ? value : NA;
}
