"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GuideCardVisual, type GuideCardData } from "@/components/guides/GuideCardVisual";

export interface BlogCard extends GuideCardData {
  /** Rubrique de l'article (filtre). */
  category: string;
}

/**
 * Grille des articles du blog avec filtre par rubrique. Toutes les cartes (et leurs titres H3) sont dans
 * le HTML ; le filtre masque seulement celles qui ne correspondent pas. Sans JavaScript, tout reste visible.
 */
export function BlogBrowser({ cards }: { cards: BlogCard[] }) {
  const [active, setActive] = useState("all");
  const categories = [...new Set(cards.map((c) => c.category))];
  const chip = (selected: boolean) =>
    cn(
      "min-h-11 rounded-sm border px-4 text-sm font-semibold transition-colors duration-150",
      selected ? "border-ink bg-ink text-paper" : "border-control bg-surface text-ink hover:border-ink",
    );
  return (
    <>
      <div role="group" aria-label="Rubriques" className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="label mr-2">Rubriques</span>
        <button type="button" aria-pressed={active === "all"} onClick={() => setActive("all")} className={chip(active === "all")}>
          Toutes <span className="num">({cards.length})</span>
        </button>
        {categories.map((c) => (
          <button key={c} type="button" aria-pressed={active === c} onClick={() => setActive(c)} className={chip(active === c)}>
            {c} <span className="num">({cards.filter((x) => x.category === c).length})</span>
          </button>
        ))}
      </div>
      <h2 className="sr-only">Tous les articles</h2>
      <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <div key={c.href} className={active !== "all" && active !== c.category ? "hidden" : "contents"}>
            <GuideCardVisual guide={c} priority={i < 3} />
          </div>
        ))}
      </div>
    </>
  );
}
