import { RANGE_SCALE_MAX } from "@/lib/vehicle-format";
import { formatNumber } from "@/lib/format";

const BIN = 25; // km par colonne de points

/**
 * Répartition des autonomies WLTP du catalogue : un point par version, empilés par tranche de
 * 25 km. Une donnée réelle, en SVG statique (aucun JavaScript). L'axe est gradué en HTML pour que
 * les libellés restent lisibles quelle que soit la largeur.
 */
export function RangeDistribution({ ranges, ticks = [300, 450, 600] }: { ranges: number[]; ticks?: number[] }) {
  const min = Math.floor(Math.min(...ranges) / 100) * 100;
  const max = RANGE_SCALE_MAX;
  const span = max - min;
  const bins = new Map<number, number>();
  for (const r of ranges) {
    const k = Math.min(Math.floor((r - min) / BIN), Math.ceil(span / BIN) - 1);
    bins.set(k, (bins.get(k) ?? 0) + 1);
  }
  const rows = Math.max(...bins.values());
  const step = BIN; // 1 unité SVG = 1 km ; un point occupe une case de 25 × 25
  const height = rows * step + 6;
  const dots = [...bins.entries()].flatMap(([k, n]) =>
    Array.from({ length: n }, (_, i) => ({ cx: k * BIN + BIN / 2, cy: height - 3 - (i + 0.5) * step })),
  );
  const pos = (km: number) => `${((km - min) / span) * 100}%`;
  const lo = Math.min(...ranges);
  const hi = Math.max(...ranges);
  return (
    <figure>
      <div className="relative">
        <svg
          viewBox={`0 0 ${span} ${height}`}
          role="img"
          aria-label={`Répartition des ${ranges.length} versions du catalogue selon leur autonomie WLTP, de ${formatNumber(lo)} à ${formatNumber(hi)} km.`}
          className="block h-auto w-full"
        >
          {ticks.map((t) => (
            <line key={t} x1={t - min} x2={t - min} y1={0} y2={height} className="stroke-line" strokeWidth={1} vectorEffect="non-scaling-stroke" strokeDasharray="3 4" />
          ))}
          {dots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={step * 0.36} className="fill-ink" />
          ))}
          <line x1={0} x2={span} y1={height - 1} y2={height - 1} className="stroke-ink" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
        <div aria-hidden className="relative mt-2 h-5 text-caption text-muted">
          <span className="num absolute left-0">{min}</span>
          {ticks.map((t) => (
            <span key={t} className="num absolute -translate-x-1/2" style={{ left: pos(t) }}>
              {t}
            </span>
          ))}
          <span className="num absolute right-0">{max}</span>
        </div>
      </div>
      <figcaption className="mt-4 text-caption text-muted">
        Chaque point est une version du catalogue ; autonomie WLTP en km. Une répartition, pas un classement.
      </figcaption>
    </figure>
  );
}
