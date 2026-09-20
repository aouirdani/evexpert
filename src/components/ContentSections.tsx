import type { ArticleSection } from "@/types";

export function ContentSections({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((s, i) => (
        <section key={i}>
          {s.heading && (
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {s.heading}
            </h2>
          )}
          <div className="mt-3 space-y-4">
            {s.paragraphs.map((p, j) => (
              <p key={j} className="leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
