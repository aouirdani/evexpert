import type { DataType } from "@/types";
import { cn } from "@/lib/utils";

const config: Record<DataType, { label: string; hint: string; tone: string }> = {
  official: {
    label: "Source officielle",
    hint: "Donnée issue d'un document officiel (constructeur ou autorité publique).",
    tone: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  specialized: {
    label: "Source spécialisée",
    hint: "Donnée relevée dans une base spécialisée reconnue, non vérifiée auprès du constructeur.",
    tone: "bg-blue-50 text-blue-800 ring-blue-200",
  },
  calculated: {
    label: "Calcul EVExpert",
    hint: "Valeur calculée par EVExpert à partir des données affichées.",
    tone: "bg-slate-100 text-slate-800 ring-slate-200",
  },
  estimated: {
    label: "Estimation EVExpert",
    hint: "Estimation reposant sur des hypothèses explicites : elle peut différer de votre usage réel.",
    tone: "bg-amber-50 text-amber-900 ring-amber-200",
  },
};

export function dataTypeLabel(type: DataType): string {
  return config[type].label;
}

export function DataBadge({ type, className }: { type: DataType; className?: string }) {
  const c = config[type];
  return (
    <span
      title={c.hint}
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        c.tone,
        className,
      )}
    >
      {c.label}
    </span>
  );
}

/** Légende expliquant les quatre natures de données. */
export function DataLegend({ className }: { className?: string }) {
  return (
    <dl className={cn("grid gap-3 text-sm sm:grid-cols-2", className)}>
      {(Object.keys(config) as DataType[]).map((t) => (
        <div key={t} className="rounded-xl border border-slate-200 bg-white p-4">
          <dt>
            <DataBadge type={t} />
          </dt>
          <dd className="mt-2 text-slate-600">{config[t].hint}</dd>
        </div>
      ))}
    </dl>
  );
}
