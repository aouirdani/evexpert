import Link from "next/link";
import type { Vehicle } from "@/types";
import { METRICS, METRIC_GROUPS } from "@/lib/comparison-metrics";
import { vehicleHref } from "@/lib/vehicle-utils";
import { DataBadge } from "@/components/ui/DataBadge";
import { formatNumber } from "@/lib/format";

/** Unité et décimales de l'écart chiffré, par critère mesurable. Les autres critères n'ont pas d'écart. */
const DELTA: Record<string, [unit: string, digits: number]> = {
  gross: ["kWh", 1],
  usable: ["kWh", 1],
  range: ["km", 0],
  cons: ["kWh/100 km", 1],
  consw: ["kWh/100 km", 1],
  ac: ["kW", 1],
  dc: ["kW", 0],
  t1080: ["min", 0],
  power: ["kW", 0],
  torque: ["Nm", 0],
  acc: ["s", 1],
  top: ["km/h", 0],
  weight: ["kg", 0],
  boot: ["L", 0],
  bootmax: ["L", 0],
  cost: ["€", 2],
};

const rowGrid = { 2: "max-sm:grid-cols-2", 3: "max-sm:grid-cols-3" } as const;

/**
 * Tableau comparatif par catégories. Aucune valeur n'est désignée « meilleure » : la colonne
 * « Écart » donne seulement la distance entre la valeur la plus haute et la plus basse. Pas de note
 * globale ni de classement. Sur mobile, chaque critère devient une bande : étiquette, puis les
 * valeurs côte à côte, puis l'écart.
 */
export function ComparisonTable({ vehicles }: { vehicles: Vehicle[] }) {
  const n = vehicles.length as 2 | 3;
  const priceKnown = vehicles.some((v) => v.price !== null);
  const groups = METRIC_GROUPS.filter((g) => g !== "Prix" || priceKnown);
  const cols = n + 2;

  return (
    <div>
      <table className="w-full text-left">
        <caption className="sr-only">Comparaison détaillée des véhicules sélectionnés</caption>
        <thead className="sticky top-(--header-h) z-20 bg-paper">
          <tr className={`max-sm:grid ${rowGrid[n]} max-sm:gap-x-4`}>
            <th scope="col" className="w-[26%] font-normal max-sm:hidden">
              <span className="sr-only">Critère</span>
            </th>
            {vehicles.map((v) => (
              <th key={v.id} scope="col" className="min-w-0 border-b-2 border-ink pb-3 pr-4 pt-4 align-bottom font-normal max-sm:pr-0">
                <span className="eyebrow block text-signal-deep">{v.brand}</span>
                <Link href={vehicleHref(v, "model")} className="link-h mt-1 block text-h3 font-bold leading-tight text-ink">
                  {v.model}
                </Link>
                <span className="block truncate text-caption text-muted">{v.version}</span>
              </th>
            ))}
            <th scope="col" className="label w-[12%] border-b-2 border-ink pb-3 pt-4 text-right align-bottom max-sm:hidden">
              Écart
            </th>
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g}>
            <tr className="max-sm:block">
              <th colSpan={cols} scope="colgroup" className="label pb-2 pt-9 text-left max-sm:block">
                {g}
              </th>
            </tr>
            {METRICS.filter((m) => m.group === g).map((m) => {
              const nums = vehicles.map((v) => m.value(v)).filter((x): x is number => x !== null);
              const d = DELTA[m.key];
              const diff = d && nums.length >= 2 ? Math.max(...nums) - Math.min(...nums) : null;
              return (
                <tr key={m.key} className={`border-t border-line max-sm:grid ${rowGrid[n]} max-sm:gap-x-4`}>
                  <th scope="row" className="py-3.5 pr-4 text-left align-top text-sm font-semibold text-ink max-sm:col-span-full max-sm:pb-1 max-sm:pt-3.5">
                    {m.label}
                    {(m.type === "calculated" || m.type === "estimated") && (
                      <span className="mt-1 block">
                        <DataBadge type={m.type} />
                      </span>
                    )}
                  </th>
                  {vehicles.map((v) => {
                    const text = m.format(v);
                    return (
                      <td
                        key={v.id}
                        className={
                          text === "Non disponible"
                            ? "wrap-anywhere py-3.5 pr-4 align-top text-sm text-muted max-sm:pb-3.5 max-sm:pr-0 max-sm:pt-0"
                            : "num wrap-anywhere py-3.5 pr-4 align-top text-base font-semibold text-ink max-sm:pb-3.5 max-sm:pr-0 max-sm:pt-0"
                        }
                      >
                        {text}
                      </td>
                    );
                  })}
                  <td className="num py-3.5 text-right align-top text-sm text-muted max-sm:col-span-full max-sm:pb-3.5 max-sm:pt-0 max-sm:text-left">
                    {diff !== null && (
                      <>
                        {diff === 0 ? (
                          "identique"
                        ) : (
                          <>
                            <span aria-hidden>Δ </span>
                            <span className="sr-only">écart de </span>
                            {formatNumber(diff, d[1])}&nbsp;{d[0]}
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
      <p className="mt-8 max-w-2xl text-caption text-muted">
        Δ : écart entre la valeur la plus haute et la plus basse, sans jugement : chaque critère compte différemment selon votre usage.
        Sauf mention « Calcul EVExpert », les caractéristiques proviennent de la source spécialisée. « Non disponible » : donnée absente de la source, jamais estimée.
        {!priceKnown && " Le prix en France n'est pas encore collecté (aucune source française datée) : consultez le configurateur du constructeur."}
      </p>
    </div>
  );
}
