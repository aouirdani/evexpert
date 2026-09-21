import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Texte éditorial avec liens internes : `[ancre](/chemin)` devient un vrai <a> (next/link),
 * rendu côté serveur donc crawlable. Seuls les chemins internes (commençant par « / »)
 * sont acceptés ; toute autre syntaxe reste du texte brut.
 */
const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/** Texte sans balisage de lien (JSON-LD, meta descriptions, recherche). */
export function stripLinks(text: string): string {
  return text.replace(LINK, "$1");
}

export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = new RegExp(LINK.source, "g");
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link key={m.index} href={m[2]}>
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last === 0) return <>{text}</>;
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
