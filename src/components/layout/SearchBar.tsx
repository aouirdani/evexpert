"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SearchBar({
  placeholder = "Rechercher une voiture, un outil ou un guide...",
  className,
  size = "md",
  defaultValue = "",
}: {
  placeholder?: string;
  className?: string;
  size?: "md" | "lg";
  defaultValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/recherche?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={cn("relative w-full", className)}
    >
      <label htmlFor="site-search" className="sr-only">
        Rechercher
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        id="site-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
          size === "lg" ? "py-3.5 text-base" : "py-2.5 text-sm",
        )}
      />
    </form>
  );
}
