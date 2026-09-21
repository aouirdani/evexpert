import type { Article, Guide, Vehicle } from "@/types";
import { linkifySections } from "@/lib/editorial-links";
import { EDITORIAL_HEROES } from "./media";
import { EDITORIAL_META } from "./meta";

/**
 * Ajoute aux guides et articles construits depuis le catalogue : image principale, titre/description
 * pour les résultats de recherche, et liens internes (modèles du catalogue et expressions thématiques).
 */
export function decorateGuides(guides: Guide[], vehicles: Vehicle[]): Guide[] {
  return guides.map((g) => ({
    ...g,
    ...EDITORIAL_META[g.slug],
    hero: EDITORIAL_HEROES[g.slug],
    sections: linkifySections(g.sections, vehicles, `/guides/${g.slug}`),
  }));
}

export function decorateArticles(articles: Article[], vehicles: Vehicle[]): Article[] {
  return articles.map((a) => ({
    ...a,
    ...EDITORIAL_META[a.slug],
    hero: EDITORIAL_HEROES[a.slug],
    sections: linkifySections(a.sections, vehicles, `/blog/${a.slug}`),
  }));
}
