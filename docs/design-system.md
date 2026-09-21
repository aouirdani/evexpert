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
| `text-dek` | 18 → 22 px | chapô éditorial (sous un h1) |
| `text-data-xl` / `-lg` / `-md` | 56-88 / 32-44 / 20 px | valeurs de données (autonomie de fiche, cotes de carte, tableaux) |
| `text-caption` | 13 px | légendes, métadonnées |
| `eyebrow` | 12 px capitales | rubrique |
| `label` | 11 px capitales | étiquette de donnée (couleur = 72 % du texte courant, fonctionne sur clair et sombre) |
| `num` / `tabular` | — | chiffres tabulaires |
| `unit` | 0,42 em | unité qui suit une valeur (66 % du texte courant) |
| `link-u` | — | lien à filet qui se trace au survol (160 ms) ; `.prose-ev a` l'applique |
| `rule-strong` / `rule-fine` | — | filet fort (encre, 2 px) / fin (`line`) en tête de bloc |
| `balance` / `pretty` | — | `text-wrap` |

## Rayons, ombres, espacements

- Rayons : `rounded-sm` 4 px (étiquettes), `rounded-md`/`lg`/`xl`/`2xl`/`3xl` 8 px (contrôles et encadrés). `rounded-full` réservé aux éléments circulaires.
- Ombres : `shadow-xs`/`sm` quasi nulles, `shadow-md`/`lg` uniquement pour les surcouches (menus).
- Grille 4 px (échelle Tailwind). Rythme de section : `py-section`, `mt-section` (56 → 112 px) ; `--spacing-block` (32 → 56 px) entre blocs d'une même section.
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

## Navigation (header, footer)

- Configuration : `src/config/site.ts` (`mainNav`, `secondaryNav`, `footerNav`). Toutes les routes existent ; le comparateur est `emphasis: true`.
- `Header` (Server Component) : bandeau desktop `ink` (baseline + navigation secondaire), barre sticky `paper` avec logo, cinq entrées, Comparer plein `ink` + point signal, recherche GET compacte. Mobile : deux `<details name="site-panel">` exclusifs (recherche, menu) ; panneaux ancrés sur le bas du header (`absolute top-full`), hauteur max `calc(100dvh - var(--header-h))`.
- `--header-h` (globals.css : 3,5 rem, 4 rem dès `lg`) est la source unique de la hauteur du header ; ne jamais coder de pixels.
- `NavLink` (seul Client Component de la navigation) lit `usePathname()` : `aria-current="page"` (page exacte) ou `"true"` (même section) + classe active. Ses classes sont désignées par `variant` (`nav`, `compare`, `utility`, `row`, `row-compare`, `sub`) : les passer en props gonflerait la charge utile RSC. Pas de `cn()` dedans (tailwind-merge alourdirait le JS de chaque page).
- `Footer` : fond `ink`, règle graduée SVG, bandeau éditorial (promesse + CTA Comparer/Explorer), quatre colonnes, mentions et « Gestion des cookies » (`data-cookie-settings`, relié par CookieBanner).

## Direction : publication automobile (refonte R0-R11)

Détail des décisions : [ui-redesign-plan.md](ui-redesign-plan.md).

- **Le filet structure, la boîte sert.** Filet fort (`border-t-2 border-ink`) en tête de bloc, filets fins (`line`) entre les lignes.
  Une boîte (`Card`, `rounded-2xl border bg-surface`) reste réservée aux objets : saisie d'un calculateur, source d'une fiche.
  Le résultat d'un calcul est un panneau sombre (`CalcLayout`, `on-ink`).
- **Une donnée est une cote** : `DataFigure` (étiquette `label`, valeur `num` + `text-data-*`, unité `unit`). À placer dans un `<dl>`.
- **Photos, grands titres, asymétrie** : hero et sections d'accueil en colonnes 7/5 ou 5/7, photographies éditoriales en ouverture d'article et en tête de rubrique.
- **Sombre** : hero et footer, panneaux de résultats. Le lime ne sert que sur fond sombre (point, bouton, valeur clé).
- **Provenance par exception** : la source par défaut est dite une fois (en-tête de fiche, section Source) ; un `DataBadge` n'apparaît que pour une autre nature (calcul, estimation).
- **Aucun classement** : le comparateur affiche un écart chiffré (`Δ`), jamais « meilleur ».
- **Typographie française** : `frTypo()` (`lib/utils.ts`) place une espace insécable avant `: ; ? ! »` dans les titres ; `fmt()` lie valeur et unité.

### Composants ajoutés

| Composant | Fichier | Rôle |
|---|---|---|
| `Section`, `Kicker` | `layout/Section.tsx` | fond, rythme, conteneur ; rubrique + complément |
| `SectionNav` | `layout/SectionNav.tsx` | sous-navigation collante par ancres (CSS seul) |
| `DataFigure`, `Delta` | `ui/` | cote de donnée ; écart neutre entre deux valeurs |
| `Sheet` | `ui/primitives.tsx` | bloc à filet fort |
| `VehicleCard`, `VehicleRow` (+ `VehicleRowsHead`) | `vehicles/` | fiche (compacte en mobile) et ligne de tableau ; `RangeBar` fine, survol vert |
| `VehicleHeader`, `BodyDimensions` | `vehicles/` | en-tête de fiche ; silhouette + cote de longueur réelle |
| `RangeDistribution` | `home/` | répartition des autonomies du catalogue (SVG statique, un point par version) |
| `Colophon` | `content/` | signature (rédaction, dates, lecture) |
| `EditorialFigure` | `content/` | photo pleine largeur (`wide`) ou schéma cadré ; légendes numérotées « Fig. n » (compteur CSS dans `.prose-ev`) |

### Utilitaires CSS (globals.css)

`label`, `num`, `unit`, `text-data-xl/lg/md`, `text-dek`, `text-caption`, `link-u` (inline, filet permanent + tracé au survol),
`link-h` (titre-lien : filet au survol seulement), `rule-strong/fine`, `balance`, `pretty`, `py-block`.

### Pièges

- Un `sr-only` (position absolue) dans un tableau à `overflow-x-auto` élargit la page mobile s'il n'y a pas d'ancêtre `relative` : ajouter `relative` au conteneur.
- `position: sticky` ne fonctionne pas sous un ancêtre `overflow-x-auto` : le tableau du comparateur n'a pas de conteneur défilant (bandes empilées en mobile).
- `dl` : ses enfants directs sont des `dt`/`dd` ou des `div` qui en contiennent uniquement.

## Navigation (accueil, catalogue, fiche)

- Accueil : hero ink (photo `evexpert-hero.jpeg`, un seul `<Image priority>`, aucune annotation : l'image est générique) → 01 autonomie (répartition + tranches) → 02 sélection (tableau, cartes en mobile) → 03 comparaison (`Δ`) → 04 recharge (photo) → 05 guides et analyses → 06 outils → 07 méthode → FAQ.
- Catalogue : filtres collants à gauche (repliables en mobile), tri, bascule fiches/tableau (≥ 1024 px).
- Fiche : en-tête + cotes clés, `SectionNav`, blocs en `grid-cols-12` (titre dans la marge, contenu sur 9 colonnes).
- Comparateur : emplacements A/B/C, colonne « Écart », bandes en mobile.
