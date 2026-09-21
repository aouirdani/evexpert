import Link from "next/link";
import type { Vehicle } from "@/types";
import { METRICS, METRIC_GROUPS, objectiveDifferences } from "@/lib/comparison";
import { vehicleHref, vehicleTitle } from "@/data/vehicles";
import { DataBadge } from "@/components/ui/DataBadge";

/**
 * Tableau comparatif par catégories. La mise en évidence signale seulement la
 * valeur la plus haute/basse quand elle est objectivement mesurable : il n'y a
 * ni note globale ni « meilleure voiture ».
 */
export function ComparisonTable({ vehicles }: { vehicles: Vehicle[] }) {
  const diffs = objectiveDifferences(vehicles);

  function bestOf(key: string): number | null {
    const m = METRICS.find((x) => x.key === key)!;
    if (!m.best) return null;
    const nums = vehicles.map((v) => m.value(v)).filter((n): n is number => n !== null);
    if (nums.length < 2) return null;
    const t = m.best === "max" ? Math.max(...nums) : Math.min(...nums);
    return nums.filter((n) => n === t).length === 1 ? t : null;
  }

  return (
    <div>
      {diffs.length > 0 && (
        <section aria-labelledby="diffs" className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 id="diffs" className="text-lg font-bold text-slate-900">Différences objectives</h2>
          <p className="mt-1 text-sm text-slate-600">
            Calculées à partir des données du tableau. Ce ne sont pas des classements : chaque critère compte différemment selon votre usage.
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {diffs.map((d) => (
              <li key={d.label} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
                <span className="text-slate-600">{d.label} : </span>
                <span className="font-semibold text-slate-900">{d.vehicle.brand} {d.vehicle.model}</span>{" "}
                <span className="tabular text-slate-700">({d.display})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">Comparaison détaillée des véhicules sélectionnés</caption>
          <thead className="bg-slate-950 text-white">
            <tr>
              <th scope="col" className="sticky left-0 bg-slate-950 px-4 py-3 font-semibold">Critère</th>
              {vehicles.map((v) => (
                <th key={v.id} scope="col" className="px-4 py-3 font-semibold">
                  <Link href={vehicleHref(v, "model")} className="underline underline-offset-2 hover:text-emerald-300">
                    {vehicleTitle(v)}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          {METRIC_GROUPS.map((g) => (
            <tbody key={g} className="divide-y divide-slate-100">
              <tr className="bg-slate-50">
                <th colSpan={vehicles.length + 1} scope="colgroup" className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-700">
                  {g}
                </th>
              </tr>
              {METRICS.filter((m) => m.group === g).map((m) => {
                const best = bestOf(m.key);
                return (
                  <tr key={m.key}>
                    <th scope="row" className="sticky left-0 bg-white px-4 py-2.5 font-medium text-slate-700">
                      {m.label}
                      <span className="ml-2 align-middle">
                        <DataBadge type={m.type} />
                      </span>
                    </th>
                    {vehicles.map((v) => {
                      const n = m.value(v);
                      const isBest = best !== null && n === best;
                      return (
                        <td
                          key={v.id}
                          className={
                            isBest
                              ? "tabular bg-emerald-50 px-4 py-2.5 font-bold text-emerald-900"
                              : m.format(v) === "Non disponible"
                                ? "px-4 py-2.5 text-slate-500"
                                : "tabular px-4 py-2.5 text-slate-900"
                          }
                        >
                          {m.format(v)}
                          {isBest && <span className="sr-only"> ({m.highlight})</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-600">
        Fond vert : valeur la plus haute ou la plus basse parmi les véhicules comparés (uniquement pour les critères mesurables). « Non disponible » : donnée absente de la source, jamais estimée.
      </p>
    </div>
  );
}
