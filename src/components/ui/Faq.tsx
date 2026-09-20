import type { FaqItem } from "@/types";

export function Faq({ items, title = "Questions fréquentes" }: { items: FaqItem[]; title?: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-10">
      <h2 id="faq-heading" className="text-2xl font-bold text-slate-900">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item, i) => (
          <details key={i} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-slate-900">
              {item.question}
              <span className="text-emerald-600 transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
