import type { DataType } from "@/types";
import { DataBadge } from "@/components/ui/DataBadge";

export interface SpecRow {
  label: string;
  value: string;
  /** Nature de la donnée, affichée seulement si différente de celle du groupe. */
  type?: DataType;
  note?: string;
}

/**
 * Groupe de caractéristiques : filet fort, titre, lignes à filets fins. La provenance par défaut
 * (`type`) est dite une fois en tête de page et dans la section Sources ; seule une ligne d'une autre
 * nature (calcul, estimation) porte un badge.
 */
export function SpecTable({
  title,
  id,
  rows,
  type,
}: {
  title: string;
  id?: string;
  rows: SpecRow[];
  /** Nature par défaut des lignes du groupe. */
  type: DataType;
}) {
  return (
    <section aria-labelledby={id} className="min-w-0">
      <h3 id={id} className="border-t-2 border-ink pb-1 pt-3 text-base font-bold text-ink">
        {title}
      </h3>
      <dl>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t border-line py-3 text-sm first:border-t-0">
            <dt className="text-muted">{r.label}</dt>
            <dd className={r.value === "Non disponible" ? "num text-right text-muted" : "num text-right font-semibold text-ink"}>
              {r.value}
              {r.type && r.type !== type && (
                <span className="ml-2 align-middle">
                  <DataBadge type={r.type} />
                </span>
              )}
            </dd>
            {r.note && <dd className="col-span-2 text-caption text-muted">{r.note}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
