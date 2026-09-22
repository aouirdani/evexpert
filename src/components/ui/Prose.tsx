import type { ArticleSection } from "@/types";
import { slugify } from "@/lib/format";
import { Inline } from "@/components/content/Inline";
import { EditorialFigure } from "@/components/content/EditorialFigure";
import { BarChart } from "@/components/content/BarChart";

function sectionId(heading: string): string {
  return slugify(heading);
}

/** Sommaire (ancres) construit à partir des titres H2 des sections. */
export function TableOfContents({ sections, className }: { sections: ArticleSection[]; className?: string }) {
  const items = sections.filter((s) => s.heading && (s.level ?? 2) === 2);
  if (items.length < 3) return null;
  return (
    <nav aria-label="Sommaire" className={className}>
      <p className="label mb-2">Dans cet article</p>
      <ol className="border-t-2 border-ink">
        {items.map((s, i) => (
          <li key={s.heading} className="border-b border-line">
            <a
              href={`#${sectionId(s.heading!)}`}
              className="group flex gap-3 py-2.5 text-sm font-medium leading-snug text-body transition-colors duration-150 hover:text-ink"
            >
              <span className="num w-5 shrink-0 text-signal-deep">{String(i + 1).padStart(2, "0")}</span>
              <span>{s.heading}</span>
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
              <div className="relative mt-6 overflow-x-auto">
                <table className="w-full min-w-[26rem] text-left text-sm">
                  {s.table.caption && (
                    <caption className="label pb-2 text-left">{s.table.caption}</caption>
                  )}
                  <thead>
                    <tr>
                      {s.table.headers.map((h) => (
                        <th key={h} scope="col" className="label whitespace-nowrap pb-2.5 pr-4 text-left font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="border-t-2 border-ink">
                    {s.table.rows.map((row, r) => (
                      <tr key={r} className="border-t border-line first:border-t-0">
                        {row.map((cell, c) =>
                          c === 0 ? (
                            <th key={c} scope="row" className="py-2.5 pr-4 text-left align-top font-semibold text-ink">
                              <Inline text={cell} />
                            </th>
                          ) : (
                            <td key={c} className="num whitespace-nowrap py-2.5 pr-4 align-top text-body">
                              <Inline text={cell} />
                            </td>
                          ),
                        )}
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
