# Design system EVExpert — « Fiche technique »

Identité de marque : voir [brand.md](brand.md).

Source de vérité des tokens : `src/app/globals.css` (`@theme`). Les composants sont dans
`src/components/ui/`. Tout est Server Component sauf mention contraire.

## Principes

- Premium mais sobre : papier chaud, encre bleu-nuit, un seul accent (« signal »).
- Filets fins plutôt qu'ombres ; pas de dégradés ni de glassmorphism.
- Grands chiffres tabulaires, étiquettes en petites capitales (`eyebrow`).
- CSS et SVG natifs ; animations limitées à un survol de 120-200 ms.

## Couleurs

| Token | Valeur | Usage | Contraste |
|---|---|---|---|
| `paper` | `#F6F5F1` | fond de page | — |
| `paper-deep` | `#EDEBE4` | surfaces enfoncées, badges neutres | — |
| `surface` | `#FFFFFF` | cartes, champs | — |
| `ink` | `#0B1626` | titres, fonds sombres, bouton principal | 16,6 sur paper |
| `body` | `#33415A` | texte courant | 9,4 sur paper |
| `muted` | `#556174` | texte secondaire | 5,8 sur paper |
| `ink-muted` | `#A8B4C6` | texte secondaire sur fond `ink` | 8,7 sur ink |
| `line` | `#D9D6CC` | filets décoratifs | décoratif |
| `control` | `#7B8494` | bordure des champs | 3,5 sur paper |
| `signal` | `#B8F13C` | accent sur fond sombre, bouton `signal` | 13,6 sur ink |
| `signal-deep` | `#0F6B4F` | accent, liens, eyebrow sur fond clair | 6,0 sur paper |
| `signal-tint` | `#E3F3B5` | surlignage (meilleure valeur, badge officiel) | ink 15,3 |
| `info` / `info-bg` | `#1B4F8A` / `#E1EAF5` | source spécialisée | 6,8 |
| `warn` / `warn-bg` | `#7A4A00` / `#FAE8C2` | estimation | 6,2 |
| `danger` / `danger-bg` | `#9B1C1C` / `#FBE4E4` | erreurs | — |

Règle : **`signal` (lime) n'est jamais du texte ni une bordure sur fond clair** (1,2:1). Sur fond
clair on utilise `signal-deep` ; le lime sert de remplissage avec du texte `ink`.

## Typographie

Une seule famille : Schibsted Grotesk, variable 400-800, auto-hébergée
(`src/app/fonts/`, licence OFL, sous-ensemble latin français, ~36 Ko). Fallback ajusté
(`size-adjust`) généré par `next/font`.

| Classe | Taille | Usage |
|---|---|---|
| `text-display` | 40 → 68 px | grand chiffre, titre d'accueil |
| `text-h1` | 32 → 48 px | titre de page |
| `text-h2` | 24 → 32 px | titre de section |
| `text-h3` | 20 px | titre de carte |
| `eyebrow` | 12 px capitales | étiquettes |
| `tabular` | — | chiffres alignés |

## Rayons, ombres, espacements

- Rayons : `rounded-sm` 4 px (étiquettes), `rounded-md`/`lg`/`xl` 8 px (contrôles), `rounded-2xl`/`3xl` 12 px (cartes). `rounded-full` réservé aux éléments circulaires.
- Ombres : `shadow-xs`/`sm` quasi nulles, `shadow-md`/`lg` uniquement pour les surcouches (menus).
- Grille 4 px (échelle Tailwind). Rythme de section : `py-section`, `mt-section`.
- Largeurs : `Container width="page"` 72 rem (défaut), `"wide"` 80 rem, `"reading"` 44 rem.
- Breakpoints Tailwind (640 / 768 / 1024 / 1280), mobile-first.

## Composants

| Composant | Fichier | Notes |
|---|---|---|
| `Button`, `ButtonLink`, `buttonClass` | `ui/primitives.tsx` | variantes `primary`, `signal`, `outline`, `ghost` ; `secondary` = alias de `primary` |
| `Badge`, `Chip`, `Card`, `SectionHeading` | `ui/primitives.tsx` | tons `emerald`/`amber`/`blue` conservés (alias vers les tokens) |
| `Input`, `Select`, `Range`, `Label` | `ui/Field.tsx` | `fieldClass` pour les champs sur mesure |
| `Stat` | `ui/Stat.tsx` | grand chiffre + unité + badge ; `tone="ink"` sur fond sombre |
| `Skeleton`, `EmptyState`, `ErrorState` | `ui/states.tsx` | `role="status"` / `role="alert"` |
| `DataBadge`, `DataLegend` | `ui/DataBadge.tsx` | nature de la donnée (officielle, spécialisée, calculée, estimée) |

Surfaces sombres : ajouter la classe `on-ink` au conteneur pour que le focus clavier passe en lime.

## États

- Chargement : `Skeleton` dans un conteneur `role="status"` (voir `app/recherche/loading.tsx`).
- Vide : `EmptyState` avec une action de sortie.
- Erreur : `ErrorState` ; `app/recherche/error.tsx` (seule page rendue à la demande). Pas de `error.tsx` racine : il ajoute ~10 Ko de JS gzip à chaque page statique.

## Accessibilité

- Focus clavier : outline 2 px `signal-deep` global (`signal` sur `.on-ink`). Une carte avec lien étiré
  affiche l'anneau sur toute la carte via `has-[a:focus-visible]`.
- Champs : bordure `control` ≥ 3:1, label visible, hauteur ≥ 40 px.
- `prefers-reduced-motion` respecté globalement.

## Piège connu

`cn()` (`src/lib/utils.ts`) étend `tailwind-merge` avec `text-display|h1|h2|h3` ; sans cela une couleur
de texte déclarée après une taille personnalisée la supprimerait.
