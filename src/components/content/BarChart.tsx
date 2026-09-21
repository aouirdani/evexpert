import type { BarChartSpec } from "@/types";
import { formatNumber } from "@/lib/utils";

/**
 * Graphique en barres horizontales en HTML + CSS : les libellés et les valeurs sont du vrai
 * texte (lisible, indexable, sans JavaScript) ; seules les barres sont décoratives
 * (aria-hidden). Une seule couleur : la longueur est une donnée, pas un classement.
 */
export function BarChart({ spec }: { spec: BarChartSpec }) {
  const max = spec.max ?? Math.max(...spec.bars.map((b) => b.value), 1);
  return (
    <figure className="my-8 rounded-xl border border-line bg-surface p-5">
      <p className="eyebrow text-muted">{spec.title}</p>
      <ul className="mt-4 space-y-3">
        {spec.bars.map((b) => (
          <li key={b.label} className="grid gap-1 sm:grid-cols-[minmax(0,13rem)_1fr_auto] sm:items-center sm:gap-4">
            <span className="text-sm font-medium text-ink">{b.label}</span>
            <span aria-hidden className="relative block h-2 rounded-sm bg-paper-deep">
              <span
                className="absolute inset-y-0 left-0 rounded-sm bg-ink"
                style={{ width: `${Math.max(2, Math.min(100, (b.value / max) * 100))}%` }}
              />
            </span>
            <span className="tabular text-sm font-semibold text-ink sm:min-w-20 sm:text-right">
              {b.display ?? formatNumber(b.value)} <span className="font-normal text-muted">{spec.unit}</span>
            </span>
          </li>
        ))}
      </ul>
      {spec.caption && <figcaption className="mt-4 text-sm leading-relaxed text-muted">{spec.caption}</figcaption>}
    </figure>
  );
}
