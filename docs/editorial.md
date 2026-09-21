# Contenu éditorial : guides, articles, images, maillage

État après la passe éditoriale : **23 guides** (`/guides/[slug]`) et **7 analyses** (`/blog/[slug]`).
Tout est rendu côté serveur, indexable, listé dans le sitemap et calculé depuis le catalogue.

## Où vivent les contenus

| Élément | Fichier |
|---|---|
| Guides d'autonomie / de recharge / d'usage | `src/data/guides/autonomie.ts`, `recharge.ts`, `usage.ts` |
| Guides ajoutés (kW/kWh, consommation, prise domestique) | `src/data/guides/nouveaux.ts` |
| Analyses du blog | `src/data/articles.ts` |
| Photos, schémas, titre et description SEO, liens | `src/data/editorial/` (`media.ts`, `meta.ts`, `decorate.ts`) |
| Moteur de liens internes | `src/lib/editorial-links.ts` |
| Rendu | `components/content/` (`ArticleView`, `EditorialFigure`, `BarChart`, `Inline`) et `components/ui/Prose.tsx` |

Règle : tout chiffre de véhicule est **calculé depuis les fiches** (`veh(id)` ou `vehicles`) ; une donnée absente
s'affiche « Non disponible ». Aucun prix n'est inventé.

## Photographies

- 6 photos d'illustration **générées par IA** (véhicules et lieux génériques) : `public/editorial/{recharge-borne-dc-rapide,
  recharge-station-haute-puissance,recharge-wallbox-garage,recharge-prise-domestique,batterie-pack-technique,
  batterie-dessous-vehicule}.jpeg`, 1376 × 768, JPEG progressif (~175-235 Ko ; `next/image` sert de l'AVIF de 12 à 64 Ko),
  chacune avec un dérivé Open Graph `*-og.jpeg` 1200 × 630. Elles sont mentionnées comme images générées dans leur légende.
- Déclarées dans `EDITORIAL_PHOTOS` (`src/data/editorial/media.ts`) : `image` (alt, légende) et `schemaAfter` (section après
  laquelle descend le schéma technique du même article). `decorate.ts` place la photo en image principale (sous l'introduction,
  `priority`, cadrée en 2:1) et le schéma dans le corps ; la construction échoue si la section visée n'existe pas.
- **Jamais sur une fiche véhicule** : une photo générique pourrait passer pour le modèle concerné.
- Sources trop lourdes ? Ne pas recompresser à l'aveugle : q88 progressif = ~76 % plus léger, PSNR ≈ 40 dB.
- Cadrage 2:1 (et non 16:9) : une photo 16:9 pleine largeur devenait l'élément LCP mobile le plus grand (LCP ≈ 2,9 s, Lighthouse 93-96) ;
  en 2:1, LCP ≈ 2,2 s (99). À garder si vous ajoutez des photos.

## Images

- **Schémas** (`public/editorial/*.svg`, 1200 × 675, générés par `python3 scripts/build-editorial-figures.py`) : originaux,
  fond paper, traits ink, accent lime, texte converti en contours (aucune police requise), ~25-42 Ko chacun (~9-14 Ko gzip).
  Chaque schéma explique un mécanisme ; les exemples chiffrés sont signalés « exemple » ou « illustratif ».
- **Copie PNG** (même nom, `.png`) : les réseaux sociaux et Google Discover n'affichent pas le SVG. Elle sert de
  `og:image`, `twitter:image` et d'`image` du JSON-LD ; la page affiche le SVG.
- Affichage : `next/image` (SVG servi tel quel), dimensions intrinsèques, légende visible, `priority` uniquement pour l'image
  principale (première image de l'écran), le reste est chargé à la demande.
- **Graphiques** (`BarChart`) : barres en HTML + CSS, libellés et valeurs en vrai texte, calculés depuis le catalogue,
  aucun JavaScript. Une couleur, jamais de classement implicite.
- Ajouter un schéma : fonction `fig_*` dans le script, entrée dans `FIGURES`, puis `EDITORIAL_HEROES` (`alt` descriptif,
  légende reprenant les chiffres importants : aucune information ne doit être uniquement dans l'image).
- Un contenu n'a pas d'image s'il n'y a rien à expliquer visuellement : pas d'image décorative.

## Maillage interne

Les textes sont écrits en clair ; `linkifySections` ajoute les liens à la construction :

- première occurrence d'un modèle du catalogue (`Renault 5 E-Tech 52 kWh 150 ch` → fiche du modèle), dans les paragraphes,
  listes et cellules de tableau ;
- première occurrence d'expressions thématiques (`PHRASE_RULES` : « capacité utile », « WLTP », « recharge AC »…) ;
- un lien par cible et par page, jamais dans un titre ni vers la page elle-même, 2 liens thématiques par section au plus
  et 6 par page. L'ancre est le texte tel qu'il est écrit.
- Lien manuel : `[ancre](/chemin)` dans une chaîne (chemins internes uniquement ; pas dans les FAQ, qui alimentent le JSON-LD).
- `<Inline>` rend de vrais `<a>` (next/link) côté serveur : liens crawlables sans JavaScript.
- Mise en page (`ArticleView`) : rubrique, H1, chapô, `Colophon`, photo d'ouverture pleine largeur (si l'image principale est une photo ; un schéma reste dans la colonne de texte), colonne de texte de 44 rem, sommaire collant à droite (en tête de texte en mobile), outils/guides/fiches associés en pied.

## SEO

- `<title>` : `metaTitle` (≈ 50 caractères) + « | EVExpert » ; le H1 reste le titre éditorial. `metaDescription` si la
  description éditoriale dépasse ~160 caractères.
- `buildMetadata` : titre **absolu** (le gabarit du layout ajoutait « | EVExpert » une seconde fois) ; `og:image` et
  `twitter:image` sur toutes les pages (image de l'article, sinon `public/brand/og-image.png`).
- JSON-LD : guides `Article`, analyses `BlogPosting` (`headline`, dates, `articleSection` = surtitre visible, `image` = le
  schéma affiché quand il existe), `FAQPage` reprenant la FAQ visible, `BreadcrumbList` reprenant le fil d'Ariane.
- Sitemap : guides et analyses avec leurs dates de mise à jour ; l'image principale est déclarée (`<image:image>`) quand elle
  existe. `robots.txt` inchangé (`/recherche` et `/api/` exclus). Pages de version non indexables : inchangées.
- Après un déploiement : soumettre le sitemap dans la Search Console (rien n'est automatisé).

## Contrôles

`tests/unit/editorial.test.ts` vérifie : slugs uniques, clés média/méta valides, images et copies PNG (dimensions, poids),
SVG autonomes, liens internes résolus, ≥ 2 liens dans chaque texte, aucun lien vers soi-même ni doublon, longueurs de
titres/descriptions, FAQ sans balisage, ancres uniques, graphiques valides.
