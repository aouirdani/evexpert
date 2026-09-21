# Identité EVExpert

Complète [design-system.md](design-system.md). Assets dans `public/brand/`, générés par
`python3 scripts/build-brand-assets.py` (voir prérequis dans le script ; outils de développement
uniquement, aucune dépendance npm). Composant : `src/components/brand/Logo.tsx`.

## Concept

**Fiche technique / carnet d'ingénieur.** Le symbole est une *plaque* (les coins haut-gauche et
bas-droit sont coupés, comme une plaque constructeur ou un connecteur) portant un **E** dont les
trois branches grandissent : trois niveaux de batterie. Un **point lime** signale l'état « chargé »
et prolonge la branche la plus longue. Aucun éclair, aucune voiture, aucune prise : le symbole
tient sur le nom, pas sur un cliché.

## Construction (grille 64 × 64)

| Élément | Géométrie |
|---|---|
| Plaque | `M10 0H64V54L54 64H0V10Z` — coins coupés de 10 u |
| « E » | montant de 7 u (x 14→21) ; branches de 7 u de haut, 6,5 u d'écart ; longueurs 14 / 22 / 30 u (haut → bas) |
| Point de signal | cercle r = 3,5 ; centre (47,5 ; 18,5), aligné sur le bord droit de la branche la plus longue |
| Variante favicon | mêmes proportions, traits de 8 u et point r = 4,5 pour rester net à 16 px |

Tout est en angles vifs, sans arrondis, sans dégradé, sans effet.

## Mot-symbole

`EVExpert` en Schibsted Grotesk : **« EV » en 800, « Expert » en 500**, interlettrage −0,02 em,
hauteur de capitales centrée sur la plaque. Dans le site, le mot est du vrai texte
(police déjà chargée) ; dans les fichiers SVG il est converti en contours, sans dépendance de police.

## Variantes et couleurs

| Fichier | Usage | Fond attendu |
|---|---|---|
| `logo.svg` | logo complet | clair (`paper`, blanc) |
| `logo-dark.svg` | logo complet | sombre (`ink`, `ink-raised`) |
| `logo-mark.svg` | symbole seul | clair |
| `logo-mark-dark.svg` | symbole seul | sombre |
| `favicon.svg` | onglet navigateur ; passe en plaque `paper` + « E » `ink` + point `signal-deep` en thème sombre | — |
| `favicon.ico` | 16 / 32 / 48 px (compatibilité, `/favicon.ico` est réécrit vers ce fichier) | — |
| `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | écran d'accueil, manifeste | fond `paper` plein cadre |
| `og-image.png` (1200 × 630) | partage social | — |

Couleurs : plaque `ink #0B1626` (sombre : `ink-raised #16263B` + filet `#2A3A52`), « E » `paper #F6F5F1`,
point `signal #B8F13C`, mot-symbole `ink` ou `paper`. Le lime n'est jamais du texte sur fond clair.

## Usage

- **Taille minimale** : symbole seul 16 px ; logo complet 24 px de haut (≈ 90 px de large).
- **Zone de protection** : au moins la largeur d'une branche (7 u, soit ≈ 11 % de la hauteur du symbole) tout autour.
- Fond clair → `logo.svg` ; fond sombre → `logo-dark.svg`. Dans le code : `<Logo />` / `<Logo tone="dark" />`
  et `<LogoMark />`, à placer dans un lien portant `aria-label` (le symbole est décoratif).
- Icônes d'application : le symbole est à 56 % du carré (zone sûre « maskable » : les coins de la plaque restent
  dans le cercle de 80 %). Le fond `paper` est plein cadre : l'OS applique lui-même le masque.

## Favicon et manifeste

- `layout.tsx` (`metadata.icons`) référence `favicon.svg`, `favicon.ico` et `apple-touch-icon.png`.
- `src/app/manifest.ts` génère `/manifest.webmanifest` (icônes 192/512, `display: "browser"` : le site n'est pas une PWA).
- `next.config.ts` : réécriture `/favicon.ico` → `/brand/favicon.ico`, cache d'un jour sur `/brand/*`
  (noms non hachés), redirection 308 de l'ancienne URL `/opengraph-image` vers `/opengraph-image.png`.

## Image Open Graph

`public/brand/og-image.png` est la source ; `src/app/opengraph-image.png` en est la copie servie par
la convention de fichier de Next.js (`og:image` et `twitter:image` de toutes les pages ; le script les
garde identiques et `tests/unit/brand.test.ts` le vérifie). Le texte alternatif est dans `opengraph-image.alt.txt`.
Composition : logo, baseline « Comprendre. Comparer. Calculer. » (points lime), sous-titre, et un panneau
« fiche technique » de trois jauges croissantes qui reprend les barres du symbole. **Les jauges sont
illustratives : elles ne représentent aucune valeur réelle.** Le titre reste lisible à 150 px de large.

## À ne pas faire

- Ne pas redessiner, étirer, pivoter, ombrer, mettre en contour ou animer le symbole ; pas de dégradé, de glow, de 3D.
- Ne pas changer la couleur du point (lime sur plaque sombre uniquement ; `signal-deep` seulement dans le favicon en thème sombre).
- Ne pas recomposer le mot-symbole dans une autre graisse ou une autre police ; ne pas séparer « EV » et « Expert ».
- Ne pas placer le logo `ink` sur un fond sombre (utiliser la variante dark).
- Ne pas remplacer le symbole par une icône de bibliothèque (Lucide, etc.) ni utiliser d'élément de marque automobile.
- Ne pas modifier `geometry.ts` sans régénérer les assets (le test de cohérence échoue sinon).
