import type { ArticleSection } from "@/types";
import { slugify } from "@/lib/utils";

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
      className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <p className="text-sm font-bold text-slate-900">Sommaire</p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
        {items.map((s) => (
          <li key={s.heading}>
            <a
              href={`#${sectionId(s.heading!)}`}
              className="text-slate-700 hover:text-emerald-700 hover:underline"
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
              <p key={j}>{p}</p>
            ))}
            {s.list && (
              <ul>
                {s.list.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            )}
            {s.table && (
              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[420px] text-left text-sm">
                  {s.table.caption && (
                    <caption className="bg-slate-50 px-4 py-2 text-left text-xs font-semibold text-slate-600">
                      {s.table.caption}
                    </caption>
                  )}
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      {s.table.headers.map((h) => (
                        <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {s.table.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className={c === 0 ? "px-4 py-2.5 font-medium text-slate-900" : "tabular px-4 py-2.5 text-slate-700"}
                          >
                            {cell}
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
