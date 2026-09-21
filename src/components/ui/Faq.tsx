import type { FaqItem } from "@/types";

/** Questions fréquentes : liste à filets, `<details>` natifs (aucun JavaScript). */
export function Faq({
  items,
  title = "Questions fréquentes",
  layout = "stacked",
}: {
  items: FaqItem[];
  title?: string;
  /** `split` : titre à gauche, questions à droite (pages larges) ; `stacked` : colonne de lecture. */
  layout?: "stacked" | "split";
}) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <div className={layout === "split" ? "grid gap-x-14 gap-y-6 lg:grid-cols-12" : "grid gap-y-6"}>
        <h2 id="faq-heading" className={layout === "split" ? "balance text-h2 font-bold text-ink lg:col-span-4" : "balance text-h2 font-bold text-ink"}>
          {title}
        </h2>
        <div className={layout === "split" ? "border-t-2 border-ink lg:col-span-8" : "border-t-2 border-ink"}>
          {items.map((item, i) => (
            <details key={i} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-bold leading-snug text-ink [&::-webkit-details-marker]:hidden">
                <span className="transition-colors duration-150 group-hover:text-signal-deep">{item.question}</span>
                <span
                  className="num mt-0.5 text-2xl font-normal leading-none text-signal-deep transition-transform duration-150 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="pretty pb-6 pr-10 text-body">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
