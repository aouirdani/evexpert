# Composants EVExpert — spécifications

Les exemples utilisent du HTML + classes utilitaires `ev-*` de `tokens.css`. Adapte-les au framework du projet (JSX, Vue, Blade…) sans changer les valeurs.

> **Sur EVExpert (voir SKILL.md, « Décision de direction »), direction hybride retenue** : ces
> specs servent de référence pour l'espacement, la hiérarchie typo et le polissage général, mais
> **pas** pour la palette, les rayons pilule, ni les cinq points marqués ⚠️ ci-dessous (prix,
> meilleure valeur, newsletter, lien header, comparateur mobile).

## Sommaire
1. Header
2. Boutons
3. Hero d'accueil
4. Barre de recherche véhicule (finder)
5. Carte véhicule
6. Bloc de specs (chiffres héros)
7. Liste d'outils / liste d'articles (rangées)
8. Bloc éditorial sombre
9. Fiche véhicule
10. Comparateur
11. Formulaires et simulateurs
12. Footer
13. Mobile

---

## 1. Header

- ⚠️ Sur EVExpert : le bouton d'action ne doit pas être un nouveau lien « Trouver mon VE » — il changerait le jeu de liens internes de toutes les pages (voir SKILL.md, point 4). Pointer vers un lien déjà présent dans `mainNav` (ex. Comparer, déjà mis en avant).
- Hauteur 80 px, marges `--ev-gutter`. Logo à gauche, 5 liens max au centre (14 px, poids 500), actions à droite (bouton-icône recherche 44 px rond bordé + bouton d'action).
- Sur le hero sombre : transparent, texte `--ev-on-dark`. Au scroll (> 40 px) : fond `--ev-bg` à 85 % d'opacité + `backdrop-filter: blur(12px)`, texte encre, bordure basse 1 px `--ev-line`. Transition 350 ms.
- Se masque en scrollant vers le bas, réapparaît en remontant.
- Lien actif : soulignement 1 px sous le texte, pas de couleur.
- Logo : `EV` en 700 + `Expert` en 300, 20 px, `letter-spacing: -0.02em`.

## 2. Boutons

| Variante | Fond | Texte | Bordure | Usage |
|---|---|---|---|---|
| Principal | `--ev-accent` | `--ev-on-accent` | aucune | 1 seul par vue |
| Principal sur clair | `--ev-dark` | `--ev-on-dark` | aucune | CTA sur fond clair |
| Secondaire sur sombre | transparent | `--ev-on-dark` | 1 px `--ev-dark-border` | |
| Secondaire sur clair | transparent | `--ev-ink` | 1 px `--ev-line` | |
| Lien texte | — | encre, 600 | soulignement 1 px, 4 px sous le texte | « Tout le catalogue » |

Hauteur 52 px (44 px en petit), padding horizontal 28 px, rayon pilule, 15 px poids 600. Icône flèche 18 px à droite, trait 1.6. Survol : opacité 0.85 ; la flèche glisse de 3 px vers la droite.

```html
<a href="/vehicules" class="ev-btn ev-btn--primary">Explorer les véhicules</a>
```

## 3. Hero d'accueil

- Section `.ev-dark`, contenu centré, padding haut ~88 px sous le header.
- Ordre : surtitre mono en accent → H1 sur 2 lignes (≤ 6 mots) → paragraphe 18 px `--ev-on-dark-muted` max 560 px → 2 boutons (principal accent + secondaire bordé).
- Dessous : grand visuel (photo véhicule détourée ou en situation), rayon 28 px en haut uniquement, qui touche le bas de la section.
- Aucun carrousel. Une vidéo muette en boucle est acceptable si légère (< 3 Mo) avec image poster.

## 4. Barre de recherche véhicule (finder)

- Carte blanche flottante qui chevauche le bas du hero (`margin-top: -48px`), rayon 24 px, padding 12 px, `--ev-shadow-float`.
- Grille : 3 champs + bouton (desktop) ; empilés sur mobile.
- Chaque champ : bloc `--ev-bg`, rayon 16 px, label mono 11 px majuscules gris au-dessus, valeur 16 px poids 600. `<select>` natif stylé (`appearance: none`) + chevron fin.
- Bouton : fond `--ev-dark`, « Voir N modèles » avec le nombre réel de résultats mis à jour en direct.

## 5. Carte véhicule

```html
<a class="ev-card" href="/vehicules/modele">
  <div class="ev-card__media"><img src="…" alt="Modèle, vue trois quarts avant" loading="lazy"></div>
  <div class="ev-card__body">
    <div class="ev-card__head">
      <h3>Nom du modèle</h3><span class="ev-mono ev-muted">SUV compact</span>
    </div>
    <!-- ⚠️ Sur EVExpert : pas de ligne Prix, aucune donnée de prix n'existe (voir SKILL.md, point 1).
         Remplacer par une 3e spec réellement disponible (ex. batterie utile, puissance DC). -->
    <dl class="ev-specs ev-specs--compact">
      <div><dt>Autonomie WLTP</dt><dd class="ev-mono">412 km</dd></div>
      <div><dt>Recharge 10–80 %</dt><dd class="ev-mono">28 min</dd></div>
      <div><dt>Batterie utile</dt><dd class="ev-mono">60,0 kWh</dd></div>
    </dl>
  </div>
</a>
```

- Fond `--ev-surface`, rayon 24 px, pas de bordure ni d'ombre.
- Média : hauteur 260 px, fond `--ev-surface-muted`, photo détourée centrée (`object-fit: contain`, padding 24 px). Ratio constant sur toutes les cartes.
- Corps : padding 28 px. Nom 22 px 600 + catégorie mono 12 px à droite.
- Specs : grille 3 colonnes, séparée par une ligne 1 px `--ev-line-soft`, chiffre mono 18 px 500, label 12 px gris dessous (`dt` placé visuellement sous `dd` via `flex-direction: column-reverse`).
- Survol : `translateY(-4px)`, légère montée de l'image (scale 1.03). Toute la carte est un seul lien.
- Grille : 3 colonnes desktop, 2 tablette, 1 mobile (ou défilement horizontal avec `scroll-snap`).

## 6. Bloc de specs (chiffres héros)

Pour les fiches véhicule et les résultats de simulateurs.
- Chiffre en IBM Plex Mono `--ev-text-spec-xl`, poids 400, unité plus petite (40 %) et grise collée au chiffre.
- Label au-dessus en surtitre mono.
- 3 ou 4 chiffres max par rangée, séparés par des lignes verticales 1 px.
- Animation facultative : le compteur monte de 0 à la valeur en 800 ms à la première apparition (désactivé si `prefers-reduced-motion`).
- Toujours préciser la norme (WLTP, conditions de recharge) en petit sous la rangée.

## 7. Rangées (outils, articles)

Mise en page éditoriale en liste plutôt qu'en cartes.
- Outils : grille `80px 1fr 44px` — numéro mono gris, titre 26 px 600 + description 15 px grise, flèche diagonale fine. Lignes 1 px `--ev-line` au-dessus de chaque rangée (et en dessous de la dernière). Padding vertical 32 px. Survol : la flèche tourne de 45° vers la droite.
- Articles : grille `160px 1fr 160px` — date mono, titre 24 px 500, catégorie mono majuscules alignée à droite. Padding vertical 28 px.
- En-tête de section : surtitre numéroté + H2 à gauche, lien texte à droite, alignés en bas.

## 8. Bloc éditorial sombre

- Carte `.ev-dark`, rayon 28 px, hauteur ~560 px, 2 colonnes : photo pleine hauteur à gauche, texte à droite (padding 72 px, `justify-content: space-between` : surtitre en haut, titre + texte au milieu, bouton en bas).
- Un seul par page, pour mettre en avant un guide.

## 9. Fiche véhicule

1. En-tête : fil d'Ariane mono 12 px, nom du modèle en H1, marque et catégorie en surtitre. ⚠️ Pas de prix à droite (voir SKILL.md, point 1) — laisser cet espace à une autre cote clé (autonomie) ou rien.
2. Visuel large (galerie : image principale + miniatures, pas de carrousel auto).
3. Bloc de specs héros (autonomie, recharge 10–80 %, puissance, prix).
4. Navigation d'ancres collante (Autonomie · Recharge · Dimensions · Prix & aides · Avis), fond `--ev-bg` flouté, onglet actif souligné.
5. Tableaux de caractéristiques : 2 colonnes (label gris / valeur mono), lignes 1 px, pas de fond zébré, pas de bordure extérieure.
6. Encadré « Coût réel » : lien vers les simulateurs pré-remplis avec ce modèle.
7. « Modèles similaires » : 3 cartes véhicule.

## 10. Comparateur

- Colonnes de véhicules (2 à 4) avec en-tête collant : photo réduite, nom, bouton retirer (icône, `aria-label`).
- Rangées de critères groupées par thème avec surtitre mono.
- ⚠️ Sur EVExpert : pas de point accent « meilleure valeur » (voir SKILL.md, point 2). Le principe du site est « aucun classement » : afficher l'écart chiffré (`Δ`) entre les véhicules, jamais désigner un gagnant.
- Option « Afficher uniquement les différences » (interrupteur).
- Mobile : ⚠️ le défilement horizontal avec en-têtes collants suppose que `position: sticky` fonctionne sous un ancêtre `overflow-x-auto` — ce n'est pas le cas nativement (voir SKILL.md, point 5). Prévoir un conteneur dédié pour le sticky avant de l'implémenter, sinon garder des bandes empilées.

## 11. Formulaires et simulateurs

- Champs pilule hauteur 52 px, fond `--ev-surface` (sur clair) ou transparent bordé (sur sombre), label au-dessus en mono 11 px.
- Curseurs (`input[type=range]`) : piste 2 px `--ev-line`, partie remplie `--ev-ink`, poignée 20 px encre avec bordure blanche 3 px.
- Interrupteurs segmentés (« Domicile / Borne / Rapide ») : conteneur pilule `--ev-surface-muted`, segment actif blanc avec ombre légère.
- Résultat : bloc de specs héros, mis à jour en direct (pas de bouton « Calculer » si le calcul est instantané), `aria-live="polite"`.
- Messages d'erreur : texte `--ev-danger` 13 px sous le champ, jamais uniquement en couleur.

## 12. Footer

- `.ev-dark`, padding 96 px haut / 48 px bas, `margin-top: --ev-section-gap`.
- ⚠️ Sur EVExpert : pas de bloc newsletter (voir SKILL.md, point 3) — aucune infrastructure de collecte d'e-mail n'existe. Garder l'espace pour l'accroche éditoriale (promesse du site) sans formulaire.
- Droite : 3 colonnes de liens (titre en surtitre mono gris, liens 14 px).
- Bas : ligne 1 px `--ev-dark-line`, logo géant (120 px, `line-height: 0.8`) à gauche, mentions mono 12 px à droite.

## 13. Mobile (≤ 767 px)

- Header 64 px : logo + bouton-icône recherche + bouton menu (icône 2 traits). Menu plein écran sombre, liens en 32 px 600, entrée en fondu.
- H1 44 px, H2 32 px, sections espacées de 80 px, marges 20 px.
- Hero : texte aligné à gauche, boutons pleine largeur empilés.
- Cartes véhicule : défilement horizontal avec `scroll-snap-type: x mandatory`, carte à 85 % de largeur pour laisser deviner la suivante.
- Rangées d'articles : date et catégorie sur une ligne au-dessus du titre.
- Bouton principal collant en bas des fiches véhicule (« Comparer » / « Simuler le coût »), avec `padding-bottom: env(safe-area-inset-bottom)`.
