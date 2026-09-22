/**
 * Sous-navigation collante d'une page longue (ancres, aucun JavaScript). Elle se cale sous le
 * header (`--header-h`) ; défile horizontalement sur mobile. Les sections ciblées portent
 * `scroll-mt-[calc(var(--header-h)+4.5rem)]` pour que l'ancre ne passe pas sous les deux barres.
 */
export function SectionNav({ items, label = "Sur cette page" }: { items: { id: string; label: string }[]; label?: string }) {
  return (
    <nav
      aria-label={label}
      className="sticky top-(--header-h) z-30 -mx-4 mt-10 border-b border-line bg-paper px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
    >
      <ul className="-mb-px flex gap-7 overflow-x-auto whitespace-nowrap">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="block border-b-2 border-transparent py-3.5 text-sm font-semibold text-muted transition-colors duration-150 hover:border-ink hover:text-ink"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
