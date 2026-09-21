import type { DataType } from "@/types";
import { DataBadge } from "@/components/ui/DataBadge";

export interface SpecRow {
  label: string;
  value: string;
  /** Nature de la donnée, affichée seulement si différente de celle du tableau. */
  type?: DataType;
  note?: string;
}

export function SpecTable({
  title,
  id,
  rows,
  type,
}: {
  title: string;
  id?: string;
  rows: SpecRow[];
  /** Nature par défaut des lignes du tableau. */
  type: DataType;
}) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-3">
        <h3 id={id} className="text-base font-bold text-slate-900">
          {title}
        </h3>
        <DataBadge type={type} />
      </div>
      <dl className="divide-y divide-slate-100">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 px-5 py-2.5 text-sm">
            <dt className="text-slate-600">{r.label}</dt>
            <dd
              className={
                r.value === "Non disponible"
                  ? "tabular text-right text-slate-500"
                  : "tabular text-right font-semibold text-slate-900"
              }
            >
              {r.value}
              {r.type && r.type !== type && (
                <span className="ml-2 align-middle">
                  <DataBadge type={r.type} />
                </span>
              )}
            </dd>
            {r.note && <dd className="col-span-2 text-xs text-slate-600">{r.note}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
