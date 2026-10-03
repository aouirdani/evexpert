import type { ArticleSection } from "@/types";
import { slugify } from "@/lib/format";

export interface Essential {
  /** Ancre de la section (identique à celle du sommaire). */
  id: string;
  heading: string;
  /** Première phrase du premier paragraphe de la section : la réponse directe. */
  text: string;
}

const MARKDOWN_LINK = /\[([^\]]+)\]\([^)\s]*\)/g;

/** Première phrase d'un paragraphe, liens markdown réduits à leur texte. */
export function firstSentence(paragraph: string, maxLength = 240): string {
  const plain = paragraph.replace(MARKDOWN_LINK, "$1").trim();
  const m = /^([\s\S]+?[.!?])(?:\s|$)/.exec(plain);
  const sentence = m ? m[1] : plain;
  return sentence.length > maxLength ? `${sentence.slice(0, maxLength - 1).trimEnd()}…` : sentence;
}

/**
 * Encadré « L'essentiel » : les réponses directes déjà rédigées sous les intertitres H2 (premier
 * paragraphe de chaque section), réduites à leur première phrase. Aucun texte nouveau : rien n'est
 * écrit ni calculé ici.
 */
export function buildEssentials(sections: ArticleSection[], max = 4): Essential[] {
  const items: Essential[] = [];
  for (const s of sections) {
    if (items.length >= max) break;
    if (!s.heading || (s.level ?? 2) !== 2) continue;
    const first = s.paragraphs[0];
    if (!first || first.trim().length < 40) continue;
    items.push({ id: slugify(s.heading), heading: s.heading, text: firstSentence(first) });
  }
  return items;
}
