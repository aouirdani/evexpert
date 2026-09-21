import type { ArticleSection } from "@/types";
import { Prose } from "@/components/ui/Prose";

/** Alias conservé pour les pages existantes : rendu éditorial unifié. */
export function ContentSections({ sections }: { sections: ArticleSection[] }) {
  return <Prose sections={sections} />;
}
