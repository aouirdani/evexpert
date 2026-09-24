import type { DataType } from "@/types";
import { cx } from "@/lib/cx";

const config: Record<DataType, { label: string; hint: string; tone: string }> = {
  official: {
    label: "Source officielle",
    hint: "Donnée issue d'un document officiel (constructeur ou autorité publique).",
    tone: "bg-signal-tint text-signal-deep ring-signal-deep/25",
  },
  specialized: {
    label: "Source spécialisée",
    hint: "Donnée relevée dans une base spécialisée reconnue, non vérifiée auprès du constructeur.",
    tone: "bg-info-bg text-info ring-info/25",
  },
  calculated: {
    label: "Calcul EVExpert",
    hint: "Valeur calculée par EVExpert à partir des données affichées.",
    tone: "bg-paper-deep text-body ring-line",
  },
  estimated: {
    label: "Estimation EVExpert",
    hint: "Estimation reposant sur des hypothèses explicites : elle peut différer de votre usage réel.",
    tone: "bg-warn-bg text-warn ring-warn/25",
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
      className={cx(
        "inline-flex items-center whitespace-nowrap rounded-sm px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        c.tone,
        className,
      )}
    >
      {c.label}
    </span>
  );
}

/** Légende expliquant les quatre natures de données (liste à filets, pas de boîtes). */
export function DataLegend({ className }: { className?: string }) {
  return (
    <dl className={cx("grid gap-x-10 text-sm sm:grid-cols-2", className)}>
      {(Object.keys(config) as DataType[]).map((t) => (
        <div key={t} className="border-t border-line py-4">
          <dt>
            <DataBadge type={t} />
          </dt>
          <dd className="mt-2 max-w-md text-muted">{config[t].hint}</dd>
        </div>
      ))}
    </dl>
  );
}
