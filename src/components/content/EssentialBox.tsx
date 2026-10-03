import type { Essential } from "@/lib/essentials";
import { frTypo } from "@/lib/format";

/**
 * Encadré « L'essentiel » en tête d'article : les réponses directes de chaque section, avec un lien
 * vers la section. Landmark `aside` étiqueté, sans nouvel intertitre (le plan de la page ne change pas).
 */
export function EssentialBox({ items }: { items: Essential[] }) {
  if (!items.length) return null;
  return (
    <aside aria-labelledby="essentiel-label" className="mb-10 rounded-md bg-signal-tint p-5 sm:p-6">
      <p id="essentiel-label" className="eyebrow text-signal-deep">L&apos;essentiel</p>
      <ul className="mt-4 space-y-4">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="link-u text-sm font-bold text-ink">
              {frTypo(it.heading)}
            </a>
            <p className="mt-1 text-sm text-body">{frTypo(it.text)}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
