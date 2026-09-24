# Tokens EVExpert pour Tailwind

Garde `tokens.css` comme source de vérité (import dans le CSS global) et expose les variables à Tailwind. Ainsi, changer une couleur se fait à un seul endroit.

## Tailwind v4 (CSS-first)

Dans le CSS global, après `@import "tailwindcss";` et l'import de `tokens.css` :

```css
@theme inline {
  --color-bg: var(--ev-bg);
  --color-surface: var(--ev-surface);
  --color-surface-muted: var(--ev-surface-muted);
  --color-ink: var(--ev-ink);
  --color-ink-muted: var(--ev-ink-muted);
  --color-line: var(--ev-line);
  --color-line-soft: var(--ev-line-soft);
  --color-dark: var(--ev-dark);
  --color-dark-raised: var(--ev-dark-raised);
  --color-dark-line: var(--ev-dark-line);
  --color-dark-border: var(--ev-dark-border);
  --color-on-dark: var(--ev-on-dark);
  --color-on-dark-muted: var(--ev-on-dark-muted);
  --color-accent: var(--ev-accent);
  --color-on-accent: var(--ev-on-accent);

  --font-sans: var(--ev-font-sans);
  --font-mono: var(--ev-font-mono);

  --radius-card: var(--ev-radius-lg);
  --radius-block: var(--ev-radius-xl);

  --shadow-float: var(--ev-shadow-float);
  --ease-ev: var(--ev-ease);
}
```

## Tailwind v3 (`tailwind.config.js`)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'var(--ev-bg)',
        surface: { DEFAULT: 'var(--ev-surface)', muted: 'var(--ev-surface-muted)' },
        ink: { DEFAULT: 'var(--ev-ink)', muted: 'var(--ev-ink-muted)' },
        line: { DEFAULT: 'var(--ev-line)', soft: 'var(--ev-line-soft)' },
        dark: {
          DEFAULT: 'var(--ev-dark)', raised: 'var(--ev-dark-raised)',
          line: 'var(--ev-dark-line)', border: 'var(--ev-dark-border)',
        },
        'on-dark': { DEFAULT: 'var(--ev-on-dark)', muted: 'var(--ev-on-dark-muted)' },
        accent: { DEFAULT: 'var(--ev-accent)', on: 'var(--ev-on-accent)' },
      },
      fontFamily: {
        sans: ['Manrope', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
      borderRadius: { card: '24px', block: '28px' },
      boxShadow: { float: '0 24px 60px rgba(14,15,15,0.10)' },
      transitionTimingFunction: { ev: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      letterSpacing: { display: '-0.045em', heading: '-0.035em', label: '0.18em' },
      maxWidth: { container: '1280px' },
    },
  },
};
```

## Next.js : chargement des polices

```ts
import { Manrope, IBM_Plex_Mono } from 'next/font/google';
const manrope = Manrope({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-manrope' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-plex-mono' });
// <html lang="fr" className={`${manrope.variable} ${plexMono.variable}`}>
// puis dans tokens.css : --ev-font-sans: var(--font-manrope), 'Helvetica Neue', sans-serif; (idem mono)
```

## Classes récurrentes

- Surtitre : `font-mono text-xs uppercase tracking-label text-ink-muted` (sur sombre : `text-accent`)
- H1 : `text-[44px] md:text-[88px] leading-[0.98] font-semibold tracking-display`
- H2 : `text-[32px] md:text-5xl leading-[1.05] font-semibold tracking-heading`
- Bouton principal : `h-[52px] px-7 rounded-full bg-accent text-accent-on font-semibold text-[15px] inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-85`
- Carte : `bg-surface rounded-card overflow-hidden transition-transform duration-300 ease-ev hover:-translate-y-1`
- Section : `pt-20 md:pt-40` et conteneur `max-w-container mx-auto px-5 md:px-20`
