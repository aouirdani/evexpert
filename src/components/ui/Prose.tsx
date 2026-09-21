import type { ArticleSection } from "@/types";
import { slugify } from "@/lib/utils";
import { Inline } from "@/components/content/Inline";
import { EditorialFigure } from "@/components/content/EditorialFigure";
import { BarChart } from "@/components/content/BarChart";

function sectionId(heading: string): string {
  return slugify(heading);
}

/** Sommaire (ancres) construit à partir des titres H2 des sections. */
export function TableOfContents({ sections }: { sections: ArticleSection[] }) {
  const items = sections.filter((s) => s.heading && (s.level ?? 2) === 2);
  if (items.length < 3) return null;
  return (
    <nav
      aria-label="Sommaire"
      className="mt-8 rounded-2xl border border-line bg-surface p-5"
    >
      <p className="text-sm font-bold text-ink">Sommaire</p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
        {items.map((s) => (
          <li key={s.heading}>
            <a
              href={`#${sectionId(s.heading!)}`}
              className="text-body hover:text-signal-deep hover:underline"
            >
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Rend des sections éditoriales : titres, paragraphes, listes et tableaux. */
export function Prose({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="prose-ev">
      {sections.map((s, i) => {
        const Heading = (s.level ?? 2) === 3 ? "h3" : "h2";
        return (
          <section key={i}>
            {s.heading && (
              <Heading id={sectionId(s.heading)}>{s.heading}</Heading>
            )}
            {s.paragraphs.map((p, j) => (
              <p key={j}>
                <Inline text={p} />
              </p>
            ))}
            {s.image && <EditorialFigure image={s.image} />}
            {s.chart && <BarChart spec={s.chart} />}
            {s.list && (
              <ul>
                {s.list.map((li, j) => (
                  <li key={j}>
                    <Inline text={li} />
                  </li>
                ))}
              </ul>
            )}
            {s.table && (
              <div className="mt-5 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[420px] text-left text-sm">
                  {s.table.caption && (
                    <caption className="bg-paper-deep px-4 py-2 text-left text-xs font-semibold text-muted">
                      {s.table.caption}
                    </caption>
                  )}
                  <thead className="bg-paper-deep text-muted">
                    <tr>
                      {s.table.headers.map((h) => (
                        <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {s.table.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className={c === 0 ? "px-4 py-2.5 font-medium text-ink" : "tabular px-4 py-2.5 text-body"}
                          >
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
