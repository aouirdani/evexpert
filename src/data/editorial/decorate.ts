import type { Article, Guide, Vehicle } from "@/types";
import { linkifySections } from "@/lib/editorial-links";
import type { ArticleSection, EditorialImage } from "@/types";
import { EDITORIAL_HEROES, EDITORIAL_PHOTOS } from "./media";
import { EDITORIAL_META } from "./meta";

/**
 * Image principale et schéma d'un contenu. Sans photo : le schéma (s'il existe) est l'image
 * principale. Avec photo : la photo est l'image principale et le schéma descend dans le corps,
 * après la section `schemaAfter` (jamais collé à la photo). Échoue à la construction si la
 * section visée n'existe pas.
 */
function placeImages(slug: string, sections: ArticleSection[]): { hero?: EditorialImage; sections: ArticleSection[] } {
  const schema = EDITORIAL_HEROES[slug];
  const photo = EDITORIAL_PHOTOS[slug];
  if (!photo) return { hero: schema, sections };
  if (!schema) return { hero: photo.image, sections };
  const target = photo.schemaAfter;
  if (!target || !sections.some((s) => s.heading === target)) {
    throw new Error(`Section « ${target} » introuvable pour placer le schéma de ${slug}`);
  }
  return { hero: photo.image, sections: sections.map((s) => (s.heading === target ? { ...s, image: schema } : s)) };
}

/**
 * Ajoute aux guides et articles construits depuis le catalogue : image principale, titre/description
 * pour les résultats de recherche, et liens internes (modèles du catalogue et expressions thématiques).
 */
export function decorateGuides(guides: Guide[], vehicles: Vehicle[]): Guide[] {
  return guides.map((g) => {
    const { hero, sections } = placeImages(g.slug, g.sections);
    return { ...g, ...EDITORIAL_META[g.slug], hero, sections: linkifySections(sections, vehicles, `/guides/${g.slug}`) };
  });
}

export function decorateArticles(articles: Article[], vehicles: Vehicle[]): Article[] {
  return articles.map((a) => {
    const { hero, sections } = placeImages(a.slug, a.sections);
    return { ...a, ...EDITORIAL_META[a.slug], hero, sections: linkifySections(sections, vehicles, `/blog/${a.slug}`) };
  });
}
