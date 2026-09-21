import type { FaqItem } from "@/types";

export function Faq({ items, title = "Questions fréquentes" }: { items: FaqItem[]; title?: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-10">
      <h2 id="faq-heading" className="text-h2 font-bold text-ink">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
        {items.map((item, i) => (
          <details key={i} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
              {item.question}
              <span className="text-signal-deep transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-body">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
