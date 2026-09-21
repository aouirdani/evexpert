# Plan de refonte UI/UX — EVExpert

Statut : **audit et plan uniquement**. Aucun composant modifié, rien de committé. Ce document est la
référence des étapes R0 à R11 (section 14). Les tokens actuels sont décrits dans
[design-system.md](design-system.md), la ligne éditoriale dans [editorial.md](editorial.md).

Mesures de départ (build local, `EVEXPERT_DATA_SOURCE=local`) : JS ≈ 189-195 Ko gzip, CSS ≈ 9 Ko,
police 35 Ko, Lighthouse 96-100 (bruit ±2, LCP 2,1-2,8 s), comparateur 96. Ces chiffres sont le
plafond à ne pas dégrader (section 13).

Capturé pour l'audit : 12 pages × desktop 1280 / mobile 390 (accueil, catalogue, fiche, version,
comparateur, recharge, guide, article de blog, recherche, outils, index guides, index blog).

---

## 1. Problèmes actuels

Ce que le site fait bien et qu'on conserve : palette papier/encre + un seul accent, une seule
famille typographique, données sourcées, chiffres tabulaires, SVG natifs, aucune ombre lourde, zéro
CLS, Server Components. Le problème n'est pas la qualité de l'exécution, c'est l'**absence de
parti pris visuel** : tout est propre, rien n'est mémorable. On dirait un très bon système de
composants, pas une publication.

### Hiérarchie et rythme

1. **Tout a le même poids.** Cartes blanches bordées (`rounded-2xl border bg-surface`) partout :
   accueil, recharge, connecteurs, guides, recherche, outils. L'œil n'a ni point d'entrée ni ordre
   de lecture.
2. **Rythme d'accueil répétitif** : H2 + eyebrow vert + grille de cartes, six fois. Trois bandes
   `ink` (hero, comparateur, outils) + footer `ink` : le sombre perd son effet.
3. **Un eyebrow vert sur chaque section** : devenu un tic, il ne classe plus rien.
4. **Titres génériques** (« Que recherchez-vous ? », « Comprendre. Comparer. Calculer. » répétée
   dans le bandeau, le hero et le footer) : ton de landing page, pas de publication.
5. **Trois fois « Comparer des voitures »** (header, hero, footer) : le CTA n'a plus de moment.

### Typographie et données

6. **Échelle trop resserrée et un seul poids** : h2 32 px / h3 20 px / corps 16-18 px, quasi tout en
   700. Pas de vrai contraste de taille ni de graisse entre titre, chapô, étiquette et donnée.
7. **Les chiffres ne se lisent pas comme des données** hors de quelques KeyStat : « 572 km WLTP ·
   batterie 60 kWh utiles · charge AC 11 kW · DC 175 kW » est une phrase grise uniforme (recherche,
   cartes, listes). `620 km`, `77 kWh`, `10 → 80 %` devraient avoir valeur, unité, étiquette.
8. **Unités au même corps que la valeur** ou noyées dans du texte ; pas de convention unique
   (`kWh/100 km`, `kW`, `min`).
9. **Métadonnées en 12 px gris** (auteur, date, lecture) : lisibles mais anecdotiques, aucune
   structure de « colophon ».

### Catalogue et cartes

10. **47 cartes quasi identiques** : catalogue = 9 688 px de haut en desktop, **24 469 px en
    mobile**. Aucun mode dense, aucune comparaison visuelle possible d'un coup d'œil.
11. **La silhouette de carrosserie se répète 47 fois** (huit dessins) : du bruit sans information,
    et elle prend la place que devrait avoir la donnée.
12. **Micro-étiquettes qui passent à la ligne** dans les cartes : la grille de données n'est pas
    alignée d'une carte à l'autre.

### Fiche véhicule

13. **Pile linéaire** : quatre KeyStat en cartes, puis cartes de specs, puis tableaux. Pas de
    sous-navigation collante, pas d'identité de fiche (aucun visuel, aucune structure « fiche
    technique » réelle avec colonne d'étiquettes).
14. **Badge « Source spécialisée » sur presque chaque bloc** : le signal de provenance est répété
    jusqu'à ne plus rien dire. Il devrait exister par exception (estimé, calculé) et une fois en
    section Sources.
15. **Coquille** : « 416 kmd'autonomie » (espace manquante).
16. **Incohérence de statut** : la ligne « Prix en France » affiche « Non disponible » avec un badge
    « Source officielle ».

### Comparateur

17. **Trois `<select>` natifs bruts** comme point d'entrée : aucun sentiment de « A contre B ».
18. **Dix pastilles « Différences objectives » de même poids** avec un vocabulaire « Meilleur… »,
    « le plus élevé/faible » : contredit la règle « pas de classement sans donnée objective ».
19. **Ligne « Longueur » dupliquée**, DataBadge sur chaque ligne, en-têtes rognés en mobile.

### Recharge, éditorial, recherche

20. **Recharge** : bandeaux `Badge` bleus pleine largeur, trois cartes de connecteurs identiques
    (Type 2, CCS Combo 2, CHAdeMO) sans visuel ni chiffre, page longue en texte + cartes.
21. **Article** : pas de rubrique/chapô/colophon distincts ; photo après l'introduction et en 2:1
    dans une colonne de 44 rem ; Sommaire en carte blanche ; **aucune colonne latérale** (données
    clés, sommaire collant) : sur desktop, colonne étroite entourée de vide.
22. **Index guides/blog** : listes de cartes textuelles identiques ; les 6 photographies éditoriales
    ne sont pas exploitées.
23. **Recherche** : résultats en cartes blanches homogènes avec pastille « Voiture » bleue, pas de
    regroupement par type, contenu court suivi d'un grand vide avant le footer.

### Mobile et interactions

24. **Pages très hautes** (cartes pleine largeur, blocs empilés), tableaux rognés sans indice de
    défilement, titres longs sur 4 lignes (recharge, articles).
25. **Interactions réduites à un changement de bordure** : liens sans soulignement animé, aucune
    réponse sur les lignes de tableau ; pas de hiérarchie d'état (survol / focus / actif).

### « Effet template / IA »

26. Icônes Lucide utilisées comme décor (outils), grilles de cartes symétriques, badges partout,
    section titles interchangeables, hero « titre + deux boutons + bande de compteurs ». Un
    directeur artistique automobile ne ferait ni les icônes de décor ni les bandes de compteurs :
    il ferait **une cote, un filet, une légende**.

---

## 2. Principes de design

**Direction : « Revue technique automobile ».** Une publication française sobre qui présenterait des
données d'ingénieur : mise en page de magazine technique (filets, colonnes, folios, légendes
numérotées), lisibilité de fiche d'homologation, précision d'un configurateur.

Référentiel de principes (aucune copie de site) :

| Univers | Ce qu'on en retient comme principe |
|---|---|
| Magazines automobiles / presse technique | Chapô net, rubrique en tête, filets épais en haut de bloc, photo grand format avec légende, colophon |
| Publications techniques et cartographiques | Cotes (valeur + unité + étiquette), légendes numérotées « Fig. 1 », notes de bas de tableau plutôt que badges |
| Configurateurs automobiles | Une donnée dominante par écran, comparaison A/B côte à côte, états sobres |
| Sites constructeurs européens | Espace généreux, un seul accent, photo cadrée avec autorité, typographie de grande taille pour les chiffres |
| Interfaces data premium | Tableaux à filets sans cases, alignement décimal, deltas, densité contrôlée |

Règles :

1. **Le filet remplace la carte.** Une boîte bordée est réservée à ce qui est réellement un objet
   (outil interactif, résultat de calcul). Le reste est structuré par des filets (fin `line`,
   fort `ink`) et des colonnes.
2. **Une donnée est une cote** : étiquette (eyebrow) — valeur (tabulaire, grande) — unité (petite,
   `muted`). Toujours dans cet ordre, partout.
3. **Un moment fort par écran.** Le sombre est réservé à deux moments : hero et footer (plus, en
   option, le comparateur d'accueil). Le lime n'apparaît que sur ink, en point, ou en surlignage.
4. **Asymétrie contrôlée** : colonne éditoriale + colonne utilitaire, pas de grille de cartes
   symétriques par défaut.
5. **Provenance par exception.** Une source par défaut par page ; un badge uniquement quand la nature
   de la donnée change (calculée, estimée).
6. **Pas de classement sans donnée objective.** Vocabulaire neutre : « écart », « plus élevé », jamais
   « meilleur » ; delta chiffré.
7. **Mouvement utile seulement** : soulignement animé, survol de ligne, 120-200 ms. Aucun effet
   décoratif.
8. **Interdits** : dégradés, glassmorphism, blobs, néon, ombres fortes, 3D, cartes flottantes,
   icônes décoratives, animations d'entrée.

Test de décision : « Comment un directeur artistique automobile aurait-il résolu ce problème ? »
Réponse type : avec une grille, un filet et un chiffre bien composé.

---

## 3. Nouvelle grille

Grille 12 colonnes, gouttière fixe, marge de page variable. Conteneur de référence 72 rem (existant)
conservé ; on ajoute des **dispositions nommées** plutôt qu'une répétition de `max-w + mx-auto +
grid + gap`.

| Disposition | Colonnes (≥ lg) | Usage |
|---|---|---|
| `layout-editorial` | 8 (texte 44 rem) + 4 (utilitaire) | article, guide, page légale : colonne texte + sommaire collant / données clés |
| `layout-sheet` | 3 (étiquette de section) + 9 (contenu) | fiche véhicule, méthodologie : le titre de section vit dans la marge |
| `layout-index` | 12, liste à filets | catalogue vue tableau, sources, outils |
| `layout-catalogue` | 3 (filtres collants) + 9 (résultats) | catalogue |
| `layout-split` | 7 + 5 asymétrique | hero, comparateur d'accueil, bloc feature |
| `bleed` | pleine largeur, contenu sur la grille | hero, bandes ink, photo d'ouverture d'article |

Règles : marge de page 16 px (mobile) → 24 px (sm) → 32 px (lg) ; largeur de lecture 66 caractères
max ; filet horizontal comme séparateur de section (fort `ink` 1 px en tête de section, fin `line`
entre lignes) ; les titres de section peuvent sortir dans la marge gauche (`layout-sheet`) ; sur
mobile tout passe en colonne unique, le filet reste.

Nouveau : `--gutter` (var) et un composant serveur `Section` qui pose filet + espace + disposition,
pour supprimer la duplication de classes.

---

## 4. Typographie

Aucune nouvelle police. Schibsted Grotesk variable 400-800. On crée de la hiérarchie par **taille,
graisse, casse et espacement**.

| Rôle | Taille (fluide) | Graisse | Interlettrage | Notes |
|---|---|---|---|---|
| `display` (hero, grand chiffre) | 44 → 76 px | 700 | -0,035em | interligne 1,0 ; `text-wrap: balance` |
| `h1` | 34 → 54 px | 700 | -0,028em | titre de page/article |
| `dek` (chapô) | 18 → 22 px | 400 | -0,005em | `body`, interligne 1,45, 60 caractères max |
| `h2` | 24 → 32 px | 700 | -0,02em | filet fort au-dessus, numéro optionnel |
| `h3` | 18 → 20 px | 650 | -0,01em | |
| `body` | 16 → 17 px | 400 | 0 | interligne 1,7 en lecture |
| `label` (eyebrow) | 11,5-12 px | 600 | +0,08em capitales | **plus de vert par défaut** : `muted`, vert seulement pour rubrique |
| `data-xl` | 56 → 88 px | 700 | -0,04em | tabulaire, autonomie en tête de fiche |
| `data-lg` | 32 → 44 px | 650 | -0,03em | cotes de carte et de fiche |
| `data-md` | 20 px | 600 | -0,015em | tableaux |
| `unit` | 0,4-0,5 × valeur (min 12 px) | 500 | +0,02em | `muted`, aligné sur la ligne de base |
| `caption` / `meta` | 13 px | 400 | 0 | `muted`, légendes numérotées |

Règles des données : toujours `font-variant-numeric: tabular-nums lining-nums`, espace insécable
fine entre valeur et unité (`620 km`, `150 kW`, `10 → 80 %`), flèche `→` pour les plages, virgule
décimale française (`18,4 kWh/100 km`), alignement à droite dans les colonnes numériques.
**À vérifier en R1** : le sous-ensemble latin de 35 Ko contient-il `tnum`/`lnum` ? Sinon, ré-exporter
le sous-ensemble avec ces features (pas de nouvelle police, même fichier).

Utilitaires prévus : `data-xl|lg|md`, `dek`, `unit`, `label`, `caption`, `num` (tabulaire + lining).

---

## 5. Couleurs

Palette **conservée** (validée WCAG) ; on change l'usage, pas les valeurs.

| Token | Évolution |
|---|---|
| `paper`, `paper-deep`, `surface`, `ink`, `ink-raised`, `body`, `muted`, `line`, `line-ink`, `control` | inchangés |
| `signal` `#B8F13C` | uniquement sur ink : point, barre de donnée, bouton, surlignage `signal-tint` sur clair |
| `signal-deep` `#0F6B4F` | liens, rubrique d'article ; **plus d'eyebrow vert par défaut** |
| `info`/`warn`/`danger` (+bg) | uniquement pour la nature de la donnée (calculée/estimée) et les erreurs |
| **nouveau** `rule` | alias de `ink` pour filet fort (`border-rule`) — pas de nouvelle couleur |
| **nouveau** `paper-tint` | `#FBFAF7` (surface de lecture ultra-légère, optionnel) — à valider visuellement, sinon supprimé |

Répartition : ~80 % `paper`, ~10 % `ink`, ~8 % `paper-deep`, < 2 % lime. `surface` blanc réduit aux
champs de saisie et résultats d'outils. Contrastes à re-vérifier pour `muted` en 13 px.

---

## 6. Composants

Modifier :

| Composant | Changement |
|---|---|
| `Card` | devient `Sheet` : pas de bordure pleine, filet fort en haut ; variantes `boxed` (outil), `bare` |
| `SectionHeading` | disposition running-head (numéro/rubrique + filet), eyebrow neutre, `layout-sheet` en option |
| `Badge`, `Chip` | plus discrets (contour fin ou texte + point) ; `Chip` en lien souligné animé |
| `ArrowLink`, liens de prose | soulignement animé (`background-size`), flèche seulement en fin de liste |
| `Button` | garde `primary/signal/outline/ghost` ; rayon 4 px ; un seul CTA fort par écran |
| `DataBadge` | affiché seulement si nature ≠ défaut de page ; sinon note de bas de section |
| `VehicleCard` | fiche technique sans boîte (section 8) |
| `RangeBar` | 2 px, graduations 0/200/400/600/800 en option |
| `KeyStat`, `Stat` | remplacés par `DataFigure` |
| `SpecTable` | `dl` à filets, colonne d'étiquettes, valeurs alignées, sources en notes |
| `ComparisonBuilder/Table` | section 10 |
| `ArticleView`, `TableOfContents`, `EditorialFigure` | section 11 |
| Header / Footer | bandeau ink allégé (une seule occurrence de la baseline), Footer sans CTA dupliqué |

Créer (tous Server Components) :

| Composant | Rôle |
|---|---|
| `Section` | filet + espace + disposition nommée |
| `DataFigure` | étiquette / valeur / unité, tailles `xl/lg/md`, ton `paper|ink` |
| `DataRow`, `SpecList` | ligne `dl` à filets, note de source `¹` |
| `Rule` | filet fort/fin, orientation |
| `Kicker` | rubrique + numéro/folio d'article |
| `Colophon` | auteur, dates, lecture, sources en bandeau à filets |
| `Figure` numérotée | « Fig. 1 » + légende, remplace le style actuel des figures |
| `VehicleRow` | ligne dense (tableau/mobile) |
| `SectionNav` | sous-nav collante de fiche (ancres, CSS `position: sticky`) |
| `Delta` | écart chiffré neutre (`+ 42 km`) |
| `SourceNote` | notes de bas de bloc |

Client Components : inchangés (VehicleExplorer, ComparisonBuilder, calculateurs, NavLink). Aucun
nouveau Client Component prévu ; `SectionNav` actif au scroll = option < 1 Ko, à décider en R6.

---

## 7. Homepage

Priorité 1. Voir le wireframe détaillé dans la présentation (section D) ; résumé :

1. **Hero** `bleed` ink, `layout-split` 7/5. Photo conservée (`evexpert-hero.jpeg`, `priority`, non
   recadrée à droite, masque de bords), plus grande et mieux cadrée ; titre `display`, chapô `dek`,
   un CTA lime, un lien texte. Aucune stat décorative. Sous le hero, une **ligne d'index à filets**
   (compteurs réels calculés : versions, marques, guides, dernière mise à jour).
2. **01 — Choisir par autonomie** : quatre tranches (< 300, 300-450, 450-600, > 600 km) avec effectifs
   réels, liens vers le catalogue filtré. Navigation par les données.
3. **02 — Sélection** : six lignes `VehicleRow` (tableau à filets) au lieu de cartes.
4. **03 — Comparaison** : A contre B réel, tableau à filets sur `paper`, écarts chiffrés.
5. **04 — Recharge** : trois cotes (AC, DC, temps 10-80 %) issues du contenu existant.
6. **05 — À lire** : un article à la une (photo 3:2) + liste à filets asymétrique 7/5.
7. **06 — Outils** : liste numérotée à filets (pas de cartes, pas d'icônes de décor).
8. **Méthode et sources** (bande `paper-deep` courte) puis FAQ, footer.

Un seul bloc sombre entre hero et footer au maximum.

## 8. Catalogue

- Desktop : `layout-catalogue` — filtres collants à gauche (marque, carrosserie, autonomie, charge
  DC), résultats à droite ; bascule **Fiches / Tableau** (le tableau = `VehicleRow`, tri par colonne
  par le client déjà présent).
- `VehicleCard` : filet fort en haut, marque en capitales, modèle, **autonomie `data-lg`** + barre
  fine, trois cotes alignées (batterie, charge DC, conso.) sur une seule ligne d'étiquettes
  (abréviations courtes, jamais de retour à la ligne), 10-80 % si connu. **Silhouette supprimée des
  cartes** (conservée sur la fiche et en filigrane du hero de catalogue).
- Mobile : `VehicleRow` compact (≈ 110 px) : autonomie à gauche en `data-lg`, nom à droite, deux
  cotes sous le nom. 47 lignes ≈ 5 000 px au lieu de 24 469 px. Filtres en feuille repliable.
- Aucune donnée nouvelle : « — » quand absent, jamais de prix inventé.

## 9. Fiche véhicule

Ordre : **identité** (marque, modèle, version, carrosserie, silhouette) → **cotes clés** (autonomie
`data-xl`, batterie, charge DC, conso. sur une rangée à filets verticaux) → `SectionNav` collante →
**Autonomie et consommation** → **Recharge** (puissances, 10-80 %, connecteur) → **Fiche technique**
(`layout-sheet` : dimensions, motorisation, batterie) → **Coût** (scénarios, sans prix d'achat
inventé : « Non disponible ») → **Sources** (liste unique, provenance de chaque bloc).

Corrections de données incluses : espace de « 416 km d'autonomie », plus de badge « Source
officielle » sur une valeur « Non disponible », ligne « Longueur » unique. Pas de photo constructeur ;
pas de photo générique sur la fiche.

## 10. Comparateur

- Entrée : trois **emplacements A / B / C** (labels en grand, `select` natif conservé et stylé,
  option de retirer C), pas de trois listes identiques.
- Tableau : première colonne collante, en-têtes de véhicules collants, valeurs `data-md` alignées,
  **`Delta` neutre** (`+ 42 km`) en lieu et place de « Meilleur… ». Surlignage `signal-tint`
  supprimé ; option « Masquer les lignes identiques ».
- Les dix pastilles deviennent une **synthèse en trois lignes** (écarts significatifs seulement,
  avec valeurs).
- Mobile : chaque métrique = une bande (étiquette, puis A | B côte à côte) ; C via onglet.
- Vocabulaire : jamais « gagnant », « meilleur », « score ».

## 11. Éditorial

Article/guide : `Kicker` (rubrique · date) → h1 → `dek` → **photo d'ouverture** en `bleed` limité à
72 rem, 3:2 (ou schéma en ouverture pour les articles data) avec légende « Fig. 1 » → `Colophon` à
filets → `layout-editorial` : texte 44 rem + colonne 4 (Sommaire collant, « En chiffres » issu des
schémas/données de l'article, guides liés). Corps : h2 avec filet et numéro, tableaux à filets,
figures numérotées, encadrés en filet (pas en carte). Fin : « À lire ensuite » en liste à filets.
Index guides/blog : une une avec photo + liste à filets ; photos de `EDITORIAL_PHOTOS` valorisées.
Schémas/JSON-LD/`image`/sitemap inchangés.

## 12. Mobile

Lisible dès 320 px : marge 16 px, `display` plafonné (44 px), pas de titre sur plus de 3 lignes,
CTA pleine largeur, tableaux → listes `dl` ou bandes empilées, indice de défilement (fondu de bord)
si un tableau reste horizontal, sous-nav de fiche en défilement horizontal, filtres en feuille
repliable, lignes denses pour les listes longues, cibles tactiles ≥ 44 px. Objectifs de hauteur :
catalogue < 6 000 px, fiche < 7 000 px, article proportionnel au texte.

## 13. Performance et contraintes

- Server Components par défaut ; **aucun nouveau Client Component sans justification**.
- CSS uniquement (Tailwind 4) ; aucune dépendance UI ; pas de bibliothèque d'animation.
- Un seul `<Image priority>` par page ; `next/image` partout ; dimensions/aspect-ratio fixes → CLS 0.
- JS ≤ 195 Ko gzip, CSS ≤ 14 Ko gzip, police inchangée (+ éventuel re-subset si `tnum` manque).
- Lighthouse ≥ 95 sur home, catalogue, fiche, article après **chaque** étape ; comparateur ≥ 96.
- Inchangés : routes, metadata, JSON-LD, sitemap, `data/`, Drizzle/Supabase, `revalidate`, tests.
- Accessibilité : focus conservé, `aria-current`, contrastes revérifiés, `prefers-reduced-motion`.
- Micro-interactions : soulignement animé des liens (`background-size`, 160 ms), survol de ligne
  (filet passe à `ink`), focus inchangé ; jamais d'animation d'entrée.

## 14. Ordre d'implémentation

Une étape = un commit, vérification (typecheck, lint, tests, build, captures 320/390/1280,
Lighthouse) avant la suivante, jamais de `git add .`, jamais `.mcp.json`, pas de push sans demande.

| Étape | Contenu | Risque |
|---|---|---|
| R0 | Base de référence : script de captures, métriques (taille JS/CSS, Lighthouse), aucun changement d'UI | nul |
| R1 | Tokens et utilitaires typographiques (`data-*`, `unit`, `dek`, `label`, `num`), rayons, vérif `tnum`, `Rule` ; mise à jour de design-system.md | faible |
| R2 | Primitives : `Sheet`, `SectionHeading`, `Badge`, `Chip`, `ArrowLink`, `Button`, `DataFigure`, politique `DataBadge` | moyen (touche toutes les pages) |
| R3 | Dispositions : `Section`, `layout-*`, `Colophon`, `Kicker`, `SourceNote` | faible |
| R4 | `VehicleCard`, `VehicleRow`, `RangeBar`, catalogue (desktop + mobile) | moyen |
| R5 | Accueil (hero, index, tranches d'autonomie, sélection, comparaison, recharge, à lire, outils, méthode) | moyen (LCP) |
| R6 | Fiche véhicule (`SectionNav`, cotes, `SpecList`, sources, correctifs de données) | moyen |
| R7 | Comparateur (A/B/C, `Delta`, mobile) | moyen |
| R8 | Éditorial (article, guide, index) | moyen |
| R9 | Recharge, outils, recherche, pages d'information | faible |
| R10 | Passe mobile 320-390 et micro-interactions | faible |
| R11 | Recette : Lighthouse, accessibilité, tests, docs (`design-system.md`, `editorial.md`) | nul |

Points à trancher avec le propriétaire avant R4/R5 :
1. Supprimer les silhouettes des cartes (proposé : oui).
2. Annotations sur la photo du hero : seulement des libellés structurels (batterie, chargeur, prise)
   car l'image est générée et ne représente aucun modèle réel ; aucun chiffre sur l'image (proposé :
   pas d'annotation en R5, à réévaluer sur captures).
3. Comparateur : suppression complète de « Meilleur… » au profit d'écarts chiffrés (proposé : oui).

---

## Annexe — Référence R0 (avant refonte)

Poids gzip par page (`node scripts/ui-metrics.mjs`, site servi en local) :

| Page | HTML | JS | CSS |
|---|---|---|---|
| accueil | 28,9 Ko | 194,6 Ko | 9,3 Ko |
| catalogue | 25,5 Ko | 201,4 Ko | 9,3 Ko |
| fiche modèle | 20,5 Ko | 189,2 Ko | 9,3 Ko |
| version | 20,6 Ko | 189,2 Ko | 9,3 Ko |
| comparateur | 21,3 Ko | 201,9 Ko | 9,3 Ko |
| recharge | 13,9 Ko | 189,2 Ko | 9,3 Ko |
| guide | 17,0 Ko | 194,6 Ko | 9,3 Ko |
| article | 17,8 Ko | 194,6 Ko | 9,3 Ko |
| outil | 18,7 Ko | 201,3 Ko | 9,3 Ko |

Hauteur de page (px), desktop 1280 / mobile 390 :

| Page | Desktop | Mobile |
|---|---|---|
| accueil | 7 302 | 12 045 |
| catalogue | 9 688 | 24 469 |
| fiche modèle | 4 828 | 8 132 |
| version | 4 752 | 8 045 |
| comparateur | 3 784 | 5 968 |
| recharge | 2 811 | 4 980 |
| guide | 4 186 | 6 084 |
| article | 4 000 | 6 959 |
| recherche | 1 744 | 2 350 |
| outils | 3 227 | 5 625 |
| index guides | 4 210 | 8 151 |
| index blog | 2 107 | 3 729 |

Lighthouse (mobile) mesuré avant refonte : pages 96-100, LCP 2,1-2,8 s, comparateur 96.

Arbitrages du propriétaire (validés) : silhouettes retirées des cartes catalogue ; aucune annotation
chiffrée sur la photo du hero ; « Meilleur… » remplacé par des écarts chiffrés neutres. Précisions :
la refonte doit rester une **publication automobile premium** (photos, grands titres, asymétrie,
espace), pas une documentation technique ; « le filet remplace la carte » est un principe directeur,
pas une règle absolue (une boîte reste légitime pour un calcul, une interaction, un formulaire, un état
ou une mise en évidence éditoriale) ; les budgets de performance sont des garde-fous : tout dépassement
justifié par un vrai gain UX est mesuré et documenté.
