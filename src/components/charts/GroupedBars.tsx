import { formatEuro } from "@/lib/utils";

export interface BarSeries {
  label: string;
  color: string;
}

export interface BarGroup {
  label: string;
  values: number[];
}

/**
 * Histogramme groupé en SVG pur (aucune dépendance, rendu serveur/client).
 * Un tableau masqué visuellement reprend les valeurs pour les lecteurs d'écran.
 */
export function GroupedBars({
  groups,
  series,
  title,
  format = (v: number) => formatEuro(v),
}: {
  groups: BarGroup[];
  series: BarSeries[];
  title: string;
  format?: (v: number) => string;
}) {
  const W = 640;
  const H = 300;
  const padL = 8;
  const padR = 8;
  const padT = 24;
  const padB = 44;
  const max = Math.max(1, ...groups.flatMap((g) => g.values.map((v) => Math.max(0, v))));
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const groupW = innerW / groups.length;
  const barW = Math.min(44, (groupW * 0.7) / series.length);
  const clusterW = barW * series.length + (series.length - 1) * 4;

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={title}
      >
        <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke="#D9D6CC" />
        {groups.map((g, gi) => {
          const x0 = padL + gi * groupW + (groupW - clusterW) / 2;
          return (
            <g key={g.label}>
              {g.values.map((v, si) => {
                const h = (Math.max(0, v) / max) * innerH;
                const x = x0 + si * (barW + 4);
                const y = H - padB - h;
                return (
                  <g key={series[si].label}>
                    <rect x={x} y={y} width={barW} height={h} rx={2} fill={series[si].color} />
                    <text
                      x={x + barW / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#0B1626"
                    >
                      {format(v)}
                    </text>
                  </g>
                );
              })}
              <text
                x={padL + gi * groupW + groupW / 2}
                y={H - padB + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#556174"
              >
                {g.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {series.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden />
            {s.label}
          </span>
        ))}
      </figcaption>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Groupe</th>
            {series.map((s) => (
              <th key={s.label} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.label}>
              <th scope="row">{g.label}</th>
              {g.values.map((v, i) => (
                <td key={i}>{format(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
