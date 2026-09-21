import type { ArticleSection, Vehicle } from "@/types";
import { vehicleHref } from "@/lib/vehicle-utils";

/**
 * Maillage interne éditorial. Les guides et articles sont écrits en texte simple ; ce module
 * transforme la première occurrence utile d'une expression (ou d'un modèle du catalogue) en
 * lien `[ancre](/chemin)`, rendu ensuite en vrai <a> par <Inline>. L'ancre est toujours le
 * texte tel qu'il est écrit : pas d'ancre imposée, pas de répétition (un lien par cible et par
 * page), jamais dans un titre, jamais vers la page elle-même.
 */
export interface PhraseRule {
  re: RegExp;
  href: string;
}

// Ordre = priorité. Chaque cible n'est liée qu'une fois par page.
export const PHRASE_RULES: PhraseRule[] = [
  { re: /calculateur d'autonomie/i, href: "/outils/autonomie-voiture-electrique" },
  { re: /calculateur de coût aux 100 km/i, href: "/outils/cout-100-km" },
  { re: /calculateur (?:de )?coût de recharge/i, href: "/outils/cout-recharge-voiture-electrique" },
  { re: /calculateur TCO/i, href: "/outils/tco-voiture-electrique" },
  { re: /(?:l'outil|calculateur) (?:sur|de) la puissance de borne/i, href: "/outils/puissance-borne-recharge" },
  { re: /capacité utile|batterie utile/i, href: "/guides/batterie-brute-batterie-utile" },
  { re: /autonomie réelle/i, href: "/guides/calculer-autonomie-reelle" },
  { re: /\bWLTP\b/, href: "/guides/wltp-definition" },
  { re: /recharge (?:AC|DC)|courant alternatif|courant continu/i, href: "/guides/recharge-ac-ou-dc" },
  { re: /temps de (?:recharge|charge)/i, href: "/guides/temps-recharge-voiture-electrique" },
  { re: /coût aux 100 km/i, href: "/guides/cout-100-km-voiture-electrique" },
  { re: /\bTCO\b|coût total de possession/, href: "/guides/calculer-tco-voiture-electrique" },
  { re: /puissance de (?:la )?borne/i, href: "/guides/puissance-borne-7-11-22-kw" },
  { re: /prise (?:domestique|renforcée|ordinaire)/i, href: "/guides/recharger-sur-prise-domestique" },
  { re: /wallbox|borne à domicile/i, href: "/guides/cout-borne-recharge-domicile" },
  { re: /kW et kWh|différence entre kW et kWh/, href: "/guides/kw-kwh-difference-voiture-electrique" },
  { re: /garantie (?:de la |de sa )?batterie/i, href: "/blog/garantie-batterie-ce-que-disent-les-donnees" },
  { re: /(?:re)?charger à 80 %|charge à 80 %/i, href: "/guides/recharger-a-80-pourcent" },
  { re: /préserver la batterie|vieillissement de la batterie/i, href: "/guides/preserver-batterie-voiture-electrique" },
  { re: /consommation (?:calculée|WLTP)/i, href: "/guides/consommation-voiture-electrique-kwh-100-km" },
  { re: /\bLFP\b/, href: "/blog/lfp-ou-nmc-ce-que-montrent-les-donnees" },
  { re: /comparateur/i, href: "/comparer" },
  { re: /\bMéthodologie\b/, href: "/methodologie" },
  { re: /\bcatalogue\b/, href: "/voitures-electriques" },
];

const MAX_PHRASE_LINKS = 6; // par page
const MAX_PHRASE_LINKS_PER_SECTION = 2; // pour répartir les liens dans l'article
const MARKUP = /(\[[^\]]+\]\(\/[^)\s]*\))/;

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Remplace la première occurrence de `re` hors des liens existants ; null si aucune. */
function linkFirst(text: string, re: RegExp, href: string): string | null {
  const parts = text.split(MARKUP); // les indices impairs sont des liens déjà posés
  for (let i = 0; i < parts.length; i += 2) {
    const m = re.exec(parts[i]);
    if (m) {
      parts[i] = `${parts[i].slice(0, m.index)}[${m[0]}](${href})${parts[i].slice(m.index + m[0].length)}`;
      return parts.join("");
    }
  }
  return null;
}

interface ModelEntry {
  key: string;
  href: string;
  re: RegExp;
}

function modelEntries(vehicles: Vehicle[]): ModelEntry[] {
  const byModel = new Map<string, Vehicle[]>();
  for (const v of vehicles) {
    const k = `${v.brandSlug}/${v.modelSlug}`;
    byModel.set(k, [...(byModel.get(k) ?? []), v]);
  }
  const entries = [...byModel.entries()].map(([key, list]) => {
    const v = list[0];
    const versions = list.map((x) => x.version).filter(Boolean).sort((a, b) => b.length - a.length).map(esc);
    const name = esc(`${v.brand} ${v.model}`);
    // Étend l'ancre à la version quand elle suit immédiatement (« Renault 5 E-Tech 52 kWh 150 ch »).
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${name}(?: (?:${versions.join("|")}))?(?![\\p{L}\\p{N}])`, "u");
    return { key, href: vehicleHref(v, "model"), re, len: name.length };
  });
  return entries.sort((a, b) => b.len - a.len);
}

/**
 * Ajoute les liens internes d'un article. `selfPath` (ex. « /guides/x ») n'est jamais ciblé.
 * Les modèles du catalogue sont liés dans les paragraphes, listes et cellules de tableau ;
 * les expressions thématiques seulement dans les paragraphes et listes.
 */
export function linkifySections(sections: ArticleSection[], vehicles: Vehicle[], selfPath: string): ArticleSection[] {
  const models = modelEntries(vehicles);
  const used = new Set<string>([selfPath]);
  let phrases = 0;
  let inSection = 0;
  for (const s of sections) {
    for (const t of [...s.paragraphs, ...(s.list ?? []), ...(s.table?.rows.flat() ?? [])]) {
      for (const m of t.matchAll(/\]\((\/[^)\s]*)\)/g)) used.add(m[1]);
    }
  }

  const vehiclesIn = (text: string): string => {
    let out = text;
    for (const m of models) {
      if (used.has(m.href)) continue;
      const next = linkFirst(out, m.re, m.href);
      if (next) {
        out = next;
        used.add(m.href);
      }
    }
    return out;
  };
  const phrasesIn = (text: string): string => {
    let out = text;
    for (const r of PHRASE_RULES) {
      if (phrases >= MAX_PHRASE_LINKS || inSection >= MAX_PHRASE_LINKS_PER_SECTION) break;
      if (used.has(r.href)) continue;
      const next = linkFirst(out, r.re, r.href);
      if (next) {
        out = next;
        used.add(r.href);
        phrases++;
        inSection++;
      }
    }
    return out;
  };

  return sections.map((s) => {
    inSection = 0;
    return {
    ...s,
    paragraphs: s.paragraphs.map((p) => phrasesIn(vehiclesIn(p))),
    list: s.list?.map((li) => phrasesIn(vehiclesIn(li))),
    table: s.table && { ...s.table, rows: s.table.rows.map((row) => row.map((cell) => vehiclesIn(cell))) },
    };
  });
}
