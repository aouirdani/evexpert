import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  size?: "md" | "lg";
  defaultValue?: string;
  idSuffix?: string;
}) {
  const id = `site-search-${idSuffix}`;
  return (
    <form
      role="search"
      action="/recherche"
      method="get"
      className={cn("relative w-full", className)}
    >
      <label htmlFor={id} className="sr-only">
        Rechercher sur EVExpert
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30",
          size === "lg" ? "py-3.5 text-base" : "py-2.5 text-sm",
        )}
      />
    </form>
  );
}
