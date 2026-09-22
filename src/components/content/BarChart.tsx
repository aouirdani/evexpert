import type { BarChartSpec } from "@/types";
import { formatNumber } from "@/lib/format";

/**
 * Graphique en barres horizontales en HTML + CSS : les libellés et les valeurs sont du vrai
 * texte (lisible, indexable, sans JavaScript) ; seules les barres sont décoratives
 * (aria-hidden). Une seule couleur : la longueur est une donnée, pas un classement.
 */
export function BarChart({ spec }: { spec: BarChartSpec }) {
  const max = spec.max ?? Math.max(...spec.bars.map((b) => b.value), 1);
  return (
    <figure className="my-10 border-t-2 border-ink pt-4">
      <p className="label">{spec.title}</p>
      <ul className="mt-4 list-none pl-0">
        {spec.bars.map((b) => (
          <li key={b.label} className="mt-0 grid gap-1 border-b border-line py-3 sm:grid-cols-[minmax(0,13rem)_1fr_auto] sm:items-center sm:gap-5">
            <span className="text-sm font-semibold text-ink">{b.label}</span>
            <span aria-hidden className="relative block h-[3px] bg-line">
              <span
                className="absolute inset-y-0 left-0 bg-ink"
                style={{ width: `${Math.max(2, Math.min(100, (b.value / max) * 100))}%` }}
              />
            </span>
            <span className="num text-sm font-semibold text-ink sm:min-w-24 sm:text-right">
              {b.display ?? formatNumber(b.value)} <span className="font-normal text-muted">{spec.unit}</span>
            </span>
          </li>
        ))}
      </ul>
      {spec.caption && <figcaption className="mt-3 max-w-2xl text-caption text-muted">{spec.caption}</figcaption>}
    </figure>
  );
}
