---
name: evexpert-ui
description: Direction artistique et système de design "minimaliste premium" du site EVExpert (véhicules électriques). Utilise ce skill pour TOUTE tâche front-end sur EVExpert — refonte du thème, nouvelle page, nouveau composant, retouche de style, CSS, Tailwind, typographie, couleurs, espacements, animations, responsive, mode sombre, fiches véhicules, comparateur, simulateurs, header, footer — même si l'utilisateur ne parle pas explicitement de "design" ou de "UI". Si une modification touche à ce que l'utilisateur voit à l'écran, lis ce skill avant d'écrire du code.
---

# EVExpert — UI minimaliste premium

Objectif : donner à EVExpert l'allure d'un constructeur haut de gamme (esprit Tesla / Polestar) tout en restant un média expert, riche en données. Le site doit paraître calme, précis et cher : beaucoup d'air, peu de couleurs, une typographie forte, des chiffres mis en scène.

On s'inspire d'un *esprit*, on ne copie jamais les logos, visuels, polices propriétaires ou mises en page exactes d'une marque existante.

## Workflow obligatoire

1. **Audite avant de toucher.** Identifie le stack (Next.js, Vite, WordPress, etc.), le système de style en place (Tailwind, CSS Modules, SCSS, styled-components…), la liste des pages et composants partagés. Résume ce que tu as trouvé en quelques lignes.
2. **Pose les fondations en premier**, dans un seul commit logique : polices, tokens (voir `references/tokens.css`, ou `references/tailwind.md` si le projet utilise Tailwind), styles de base (`body`, titres, liens, focus).
3. **Refonds les composants partagés** avant les pages : Header, Footer, Button, Card véhicule, bloc de specs, champs de formulaire. Spécifications dans `references/components.md`.
4. **Puis page par page**, en commençant par l'accueil, puis fiche véhicule, catalogue, comparateur, outils, articles.
5. **Ne casse jamais la logique métier.** Tu changes la présentation (markup, classes, styles), pas les appels API, le routage, le state ni les calculs. Si un changement de structure l'exige, signale-le avant.
6. **Vérifie** : build sans erreur, rendu à 390 px, 768 px, 1280 px et 1440 px, navigation clavier, contrastes.

Travaille par petites étapes vérifiables et résume à la fin de chaque étape ce qui a changé.

## Les principes (dans l'ordre d'importance)

**1. L'espace est le luxe.** Sections séparées de 128 à 160 px sur desktop (80 à 96 px sur mobile). Marges latérales de 80 px desktop, 20 px mobile. Largeur de contenu max 1280 px. En cas de doute, ajoute de l'espace plutôt que du contenu.

**2. Une typographie qui porte le design.**
- Titres et texte : **Manrope** (300 à 700). Chiffres, labels techniques, dates, surtitres : **IBM Plex Mono** (400, 500).
- Titres très grands et serrés : H1 72–88 px desktop / 44 px mobile, `letter-spacing: -0.045em`, `line-height: 0.98`. H2 44–48 px / 32 px, `-0.035em`.
- Texte courant 16–18 px, `line-height: 1.55–1.6`, largeur max ~65 caractères.
- Surtitres de section en mono, 12 px, majuscules, `letter-spacing: 0.18em`, numérotés : `01 — Véhicules`.
- Poids 600 pour les titres, jamais 800/900. Un mot peut passer en 300 pour du contraste (`EV` **600** + `Expert` 300 dans le logo).

**3. Une palette quasi monochrome.** Fond blanc cassé chaud, encre quasi noire, sections sombres pour le rythme, et **une seule** couleur d'accent (vert électrique `#C8F169`) utilisée avec parcimonie : CTA principal, surtitre sur fond sombre, indicateurs actifs. Jamais en grande surface, jamais pour du texte sur fond clair (contraste insuffisant). Détail dans `references/tokens.css`.

**4. Les chiffres sont des héros.** Autonomie, temps de recharge, prix, puissance : toujours en IBM Plex Mono, taille généreuse, avec un label court en dessous en gris. C'est la signature « expert » du site.

**5. Alternance clair / sombre.** Hero sombre, contenu sur fond clair, un bloc éditorial sombre au milieu, footer sombre. Ça crée un rythme premium sans ajouter de couleur.

**6. Formes douces, lignes fines.** Rayons : 24–28 px pour les cartes et blocs, pilule (`999px`) pour les boutons et champs. Séparateurs 1 px. Ombres rares et très diffuses (uniquement sur les éléments flottants comme la barre de recherche du hero).

**7. Mouvement discret.** Transitions 250–400 ms, `ease-out`. Survol des cartes : translation de -4 px. Apparition au scroll : fondu + 16 px de translation, une seule fois. Respecte `prefers-reduced-motion`. Pas de parallax lourd, pas de carrousels automatiques.

## Interdits

- Dégradés colorés, glassmorphism, néons, ombres portées dures.
- Plus d'une couleur d'accent, ou de la couleur "pour décorer".
- Emojis dans l'interface ; icônes pleines ou multicolores. Utilise des icônes au trait fin (stroke 1.4–1.6), par ex. Lucide.
- Polices Inter, Roboto, Arial, Poppins, Montserrat.
- Texte centré sur plus de 3 lignes, paragraphes pleine largeur.
- Cartes avec bordure gauche colorée, badges partout, trop de boutons dans une même vue (1 principal + 1 secondaire max).
- Chiffres ou statistiques inventés : si une donnée manque, laisse un placeholder explicite `[—]` et signale-le.
- `div` cliquables : utilise `<a>` ou `<button>`.

## Accessibilité (non négociable)

- Contraste texte ≥ 4.5:1 (≥ 3:1 au-delà de 24 px). Les gris de `tokens.css` sont calibrés pour ça ; n'en invente pas de plus clairs.
- Focus visible sur tout élément interactif (`outline: 2px solid` accent sur fond sombre, encre sur fond clair, `outline-offset: 3px`).
- Cibles tactiles ≥ 44 px. Tous les champs ont un `<label>` (masqué visuellement si besoin). `aria-label` sur les boutons-icônes.
- `lang="fr"` et typographie française : espace insécable avant `: ; ! ?`, guillemets « », `10–80 %`, `35 000 €`.

## Références

- `references/tokens.css` — variables CSS complètes (couleurs, typo, espacements, rayons, motion). À copier tel quel dans les styles globaux.
- `references/tailwind.md` — la même chose en configuration Tailwind (v3 et v4).
- `references/components.md` — spécifications détaillées de chaque composant (header, hero, boutons, carte véhicule, bloc specs, barre de recherche, liste d'outils, articles, footer, formulaires) avec exemples de markup.
