/**
 * Aperçu de palettes — UNIQUEMENT sur les déploiements de prévisualisation Vercel (VERCEL_ENV=preview),
 * ou en local avec PALETTE_PREVIEW=1. En production, ce composant ne rend rien : ni style, ni script, ni
 * lien (aucun octet ajouté, aucun changement visuel).
 *
 * Usage : ajouter `?palette=a`, `b` ou `c` à n'importe quelle URL (`?palette=0` pour revenir à la palette
 * actuelle) ; le choix est mémorisé pour la session. Les variantes ne redéfinissent que les jetons de
 * couleur du design system (globals.css) ; toutes passent le contraste WCAG AA (texte ≥ 4,5:1,
 * contrôles ≥ 3:1) : voir docs/palettes-apercu.md.
 */
const enabled = process.env.VERCEL_ENV === "preview" || process.env.PALETTE_PREVIEW === "1";

type Tokens = Record<string, string>;

/** Variantes « plus affirmées » : mêmes rôles que les jetons actuels, teintes et accent renforcés. */
export const PALETTES: Record<string, { label: string; tokens: Tokens }> = {
  a: {
    label: "A · Cobalt & volt",
    tokens: {
      paper: "#f3f6fc", "paper-deep": "#e4eaf6", ink: "#071a3a", "ink-raised": "#10294f",
      body: "#2c3a57", muted: "#4f5d78", "ink-muted": "#a9b8d4", line: "#d3dbec", "line-ink": "#233a63",
      control: "#74809a", signal: "#c8ff2e", "signal-deep": "#1448c8", "signal-tint": "#e8f7b0",
    },
  },
  b: {
    label: "B · Forêt & ambre",
    tokens: {
      paper: "#f6f3ea", "paper-deep": "#ece7d8", ink: "#0c2a21", "ink-raised": "#143c30",
      body: "#2f4a40", muted: "#52675e", "ink-muted": "#a9c2b6", line: "#d8d3c1", "line-ink": "#24493c",
      control: "#77877f", signal: "#ffb21e", "signal-deep": "#0a6b45", "signal-tint": "#ffe8b8",
    },
  },
  c: {
    label: "C · Graphite & cyan",
    tokens: {
      paper: "#f2f4f4", "paper-deep": "#e3e8e8", ink: "#10161c", "ink-raised": "#1b252e",
      body: "#34414a", muted: "#55626b", "ink-muted": "#aab6bf", line: "#d3dadb", "line-ink": "#2c3944",
      control: "#79868f", signal: "#2ee6d2", "signal-deep": "#00695f", "signal-tint": "#c9f7f1",
    },
  },
};

const css = Object.entries(PALETTES)
  .map(([key, p]) => `html[data-palette="${key}"]{${Object.entries(p.tokens).map(([k, v]) => `--color-${k}:${v}`).join(";")}}`)
  .join("\n");

// Lit ?palette=… (mémorisé en sessionStorage) et pose data-palette sur <html> avant le premier rendu.
const script = `(function(){try{var q=new URLSearchParams(location.search).get("palette");var s=sessionStorage;if(q!==null)s.setItem("palette",q);var p=s.getItem("palette");if(p&&"abc".indexOf(p)!==-1&&p.length===1)document.documentElement.setAttribute("data-palette",p)}catch(e){}})();`;

export function PalettePreview({ part }: { part: "head" | "switcher" }) {
  if (!enabled) return null;
  if (part === "head") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </>
    );
  }
  return (
    <nav
      aria-label="Aperçu de palette (prévisualisation uniquement)"
      className="fixed bottom-3 left-3 z-[90] flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-line bg-surface px-3 py-2 text-caption text-ink"
    >
      <span className="label">Palette</span>
      <a href="?palette=0" className="link-u font-semibold">Actuelle</a>
      {Object.entries(PALETTES).map(([key, p]) => (
        <a key={key} href={`?palette=${key}`} className="link-u font-semibold">{p.label}</a>
      ))}
    </nav>
  );
}
