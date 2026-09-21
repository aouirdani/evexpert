import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClass } from "@/components/ui/Field";

/**
 * Recherche en formulaire GET natif : aucun JavaScript client requis.
 * `idSuffix` évite les id dupliqués quand la barre apparaît plusieurs fois.
 */
export function SearchBar({
  placeholder = "Rechercher une voiture, un outil ou un guide",
  className,
  size = "md",
  defaultValue = "",
  idSuffix = "main",
}: {
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  defaultValue?: string;
  idSuffix?: string;
}) {
  const id = `site-search-${idSuffix}`;
  return (
    <form role="search" action="/recherche" method="get" className={cn("relative w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Rechercher sur EVExpert
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <input
        id={id}
        name="q"
        type="search"
        enterKeyHint="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          fieldClass,
          "pl-9 pr-3",
          size === "sm" && "h-10 py-0 text-sm",
          size === "md" && "py-2.5 text-sm",
          size === "lg" && "py-3.5 text-base",
        )}
      />
    </form>
  );
}
