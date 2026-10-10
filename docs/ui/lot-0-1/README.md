# EVExpert — UI/UX lots 0 et 1

Les lots 0 et 1 sont terminés sur le dépôt local. Sept composants ont été corrigés. Aucun commit, push, déploiement, accès DB, installation de dépendance ou changement de configuration. Les travaux éditoriaux préexistants sont conservés. Direction Cobalt & volt, Schibsted Grotesk et IBM Plex Mono inchangées.

## Référence du lot 0

La référence détaillée prise avant modification se trouve dans [REFERENCE.md](REFERENCE.md).

- Build local de production, catalogue local forcé, `http://localhost:3102`.
- 186 pages HTML, dont recherche, versions et duels noindex ; capture totale de 190 routes avec manifest, RSS, robots et sitemap.
- Métadonnées complètes (dont OG/Twitter), canonicals, robots, JSON-LD, intertitres/IDs, liens/ancres, texte HTML et empreintes enregistrés.
- 9 pages × 5 largeurs = 45 cas responsive avant/après ; 19 captures par phase, dont 7 vues de focus.
- 8 calculateurs × 2 jeux de saisie = 16 références ; entrées, résultats, tableaux et texte rendus enregistrés.
- Hero vidéo, pause/reprise et mouvement réduit ; coordonnées des réservations publicitaires.
- 15 passages Lighthouse avant et 15 après, paramètres strictement identiques, navigateur Chrome 154.0.8037.98 et Lighthouse 12.8.2 déjà présents.

Pages représentatives : accueil, catalogue, Renault, Renault 5 E-Tech, Tesla Model 3 multiversions, version Model 3 RWD, comparateur, huit outils, recharge, guides, guide temps de recharge, blog, article LFP/NMC et recherche Kona. Inventaire exact dans `before/environment.json` et `before/seo.json`.

## Fichiers source modifiés et corrections

| Fichier | Correction |
|---|---|
| `src/components/charts/GroupedBars.tsx` | Déplace `sr-only` vers un conteneur qui confine réellement le tableau. Le tableau, caption, entêtes, cellules et nombres restent présents. Figure relative pour borner le positionnement. Traite TCO et Essence vs électrique. |
| `src/components/vehicles/VehicleRow.tsx` | Ajoute un contour cobalt de 2 px sur le pseudo-élément du véritable lien étiré. Décalage intérieur de −2 px pour éviter le découpage par les conteneurs de tableaux. |
| `src/components/vehicles/ModelOverview.tsx` | Même indicateur pour les liens de versions. Aucun href ou contenu changé. |
| `src/components/garage/GarageToggle.tsx` | Cible de sélection 44 × 44 px, contre 32 × 32 auparavant ; boutons avec libellé conservent leur largeur naturelle. États, limite et logique inchangés. |
| `src/components/garage/GarageBar.tsx` | Vidage 44 × 44 contre 28 × 28 ; lien Comparer haut de 44 px. Texte flexible et espacement ajusté pour conserver la barre dans 320 px. Position fixe existante conservée. |
| `src/components/vehicles/VehicleCard.tsx` | Retire les ellipsis marque/version, autorise les retours à la ligne et réserve la place au bouton. Sous 375 px, réduit la colonne d’autonomie à 88 px et place batterie/DC sur une ligne commune plus large pour éviter leur chevauchement. Préserve toutes les données et destinations. |
| `src/components/comparison/ComparisonBuilder.tsx` | Cible de copie de 276,16 × 44 px contre environ 258 × 20 px, sans changement de logique de copie ou de sélection. |

Rapports et preuves ajoutés dans `docs/ui/lot-0-1/`, sans intégration à l’application. Le patch exact limité aux sept composants est [lot-1.patch](lot-1.patch).

## Responsive, clavier, interactions et accessibilité

| Contrôle | Résultat |
|---|---|
| 320, 390, 768, 1024, 1440 px sur les 9 pages représentatives | 45/45 cas : largeur de document = largeur de viewport. |
| TCO à 320 / 390 px | 453 / 453 px avant → 320 / 390 px après. |
| Essence vs électrique à 320 / 390 px | 423 / 423 px avant → 320 / 390 px après. |
| Cartes du catalogue | 47 présentes à chaque largeur, zéro marque/version coupée par ellipsis ou débordement du texte. |
| Liens de tableaux | Sept parcours Tab : contour `solid 2px rgb(20,72,200)`, mêmes destinations. Activation Entrée vers la fiche CLA vérifiée. |
| Sélection | Tap/clic réel et clavier aux cinq largeurs ; 3 sélectionnés, 44 autres désactivés, vidage et URL du comparateur préservés. Barre sans débordement. |
| Copie | Entrée déclenche la copie exacte de l’URL de comparaison ; état « Lien copié » observé. API presse-papiers simulée uniquement dans le navigateur de test. |
| Filtre Kona | Même résultat : une version, même lien vers le modèle. |
| Tableaux accessibles des histogrammes | Présents et non ignorés dans l’arbre d’accessibilité Chrome : TCO 21 cellules/entêtes ; Essence vs électrique 12. |
| Erreurs JavaScript | Aucune erreur `pageerror` dans la série finale. |

Le contrôle visuel des captures confirme les retours à la ligne et l’espace disponible pour les actions. À 320 px, certains noms longs peuvent se répartir sur plusieurs lignes, y compris dans un mot : le texte intégral est conservé. Le nombre de cartes visibles par écran peut diminuer légèrement en raison des noms complets et des cibles tactiles agrandies.

## Calculs et fonctions métier

Comparaison exacte des 16 jeux : zéro différence des valeurs des champs, résultats ou tableaux. Aucune formule modifiée.

Exemple TCO A/B : état initial 30 980 € / 33 081 € ; jeu fixe 45 248 € / 48 680 €, identiques avant/après. Les saisies exactes de chaque outil sont conservées dans `before/calculators.json` et `after/calculators.json` ; le protocole définit explicitement les valeurs alternatives.

## SEO, Hero et intégrations protégées

- Capture SEO des 190 routes strictement identique : statuts, titres/descriptions et toutes les metadata, canonical, robots, JSON-LD, H1/H2/H3, IDs, liens/ancres et texte HTML. 186 pages HTML restent HTTP 200 ; directives noindex conservées.
- Sitemap, robots.txt, RSS, ads.txt et les huit redirections : réponses et contenu identiques. Aucun changement de route, slug ou canonical.
- 313 des 320 empreintes source/configuration/asset/test sont identiques ; seules les sept modifications autorisées changent. Cela couvre notamment les données catalogue, contenus éditoriaux préexistants, fonctions de calcul, SEO, polices, vidéo, layouts et code Google.
- Hero et texte adjacent inchangés, toutes les sections et leur ordre conservés. Vidéo jouée à 1440 px, pause/reprise vérifiées ; comportement mobile et mouvement réduit identiques à l’existant.
- Réservations AdSense capturées : mêmes identifiants, dimensions, positions et visibilité aux cinq largeurs. Scripts, consentement et analytics non modifiés. Contrôle existant `check-adsense.mjs` passé sur 124 pages du sitemap.

La comparaison sémantique exclut volontairement les classes CSS, le wrapper accessible ajouté et les URLs de chunks Next hachés, qui changent lors du build. Elle inclut le texte et les véritables liens rendus dès le HTML serveur.

## Validation technique

- `npm run lint` : OK.
- `npm run typecheck` : OK.
- `npm test -- --config vitest.unit.config.ts` : 15 fichiers, 160 tests réussis. Configuration unitaire préexistante sans setup DB.
- `EVEXPERT_DATA_SOURCE=local npm run build` : OK.
- Comparaison automatisée : 20 contrôles réussis, détails dans [comparison.json](comparison.json).
- `git diff --check` : OK.

Avertissements de build déjà présents : racine Turbopack inférée depuis un lockfile parent ; en-tête Cache-Control personnalisé pour les ressources Next. Ils sont documentés et laissés inchangés. Le premier build sous sandbox n’a pas pu télécharger IBM Plex Mono ; le build autorisé avec réseau a ensuite réussi sans modification de police.

## Lighthouse : comparaison de laboratoire

Trois passages par couple page/profil, dans le même ordre avant/après. Mêmes paramètres détaillés, Chrome, machine et serveur local. Cache navigateur réinitialisé par Lighthouse, pages/assets locaux parcourus avant chaque série, scripts Google conservés. Les médianes ne sont pas des mesures terrain et le TBT ne mesure pas l’INP.

| Page / profil | Score avant → après | LCP avant → après (s) | FCP avant → après (s) | TBT avant → après (ms) | CLS |
|---|---:|---:|---:|---:|---:|
| / / mobile | 95 → 95 | 2.933 → 2.860 | 0.905 → 0.906 | 11.5 → 11.5 | 0 → 0 |
| / / desktop | 100 → 100 | 0.626 → 0.627 | 0.244 → 0.243 | 0 → 0 | 0 → 0 |
| /voitures-electriques / mobile | 96 → 96 | 2.854 → 2.705 | 0.903 → 0.903 | 11.5 → 15 | 0 → 0 |
| /comparer / mobile | 96 → 96 | 2.707 → 2.855 | 0.904 → 0.904 | 9 → 9 | 0 → 0 |
| /outils/tco-voiture-electrique / mobile | 96 → 96 | 2.856 → 2.856 | 0.904 → 0.905 | 9 → 9.5 | 0 → 0 |

Les médianes des scores sont préservées, et le CLS reste nul sur les 30 passages. Les variations de LCP doivent rester visibles : le comparateur passe de 2,707 à 2,855 s en médiane, dans une plage observée commune d’environ 2,706–2,857 s ; aucune promesse d’amélioration n’est déduite de cette petite série. Le TBT médian catalogue passe de 11,5 à 15 ms.

Accueil desktop après : scores **100, 93, 100**, contre **100, 100, 100** avant. Le passage à 93 retient la vidéo comme LCP (1,736 s), alors que les deux autres retiennent le poster (~0,625 s). Le code, les fichiers et le comportement du Hero sont inchangés ; cette observation ne suffit pas à attribuer causalement le passage lent au lot. La variabilité vidéo/poster avait déjà été observée lors de l’audit de production. Elle doit être surveillée ; aucun score uniforme ou résultat PageSpeed terrain n’est garanti.

Les LCP mobiles locaux restent autour de 2,7–2,9 s, au-dessus de l’objectif indicatif de 2,5 s. Le lot conserve les scores médians et n’inclut aucune modification du chargement du Hero ou des scripts Google pour poursuivre cet objectif.

| Phase | Passage | Page | Profil | Performance | FCP (ms) | LCP (ms) | CLS | TBT (ms) |
|---|---:|---|---|---:|---:|---:|---:|---:|
| avant | 1 | / | mobile | 95 | 905.1 | 2932.7 | 0 | 19.0 |
| avant | 2 | / | desktop | 100 | 243.8 | 626.0 | 0 | 0.0 |
| avant | 3 | /voitures-electriques | mobile | 96 | 902.9 | 2854.4 | 0 | 11.5 |
| avant | 4 | /comparer | mobile | 96 | 904.4 | 2706.6 | 0 | 10.0 |
| avant | 5 | /outils/tco-voiture-electrique | mobile | 96 | 905.4 | 2708.2 | 0 | 11.5 |
| avant | 6 | / | mobile | 95 | 906.5 | 2934.7 | 0 | 11.5 |
| avant | 7 | / | desktop | 100 | 244.3 | 626.4 | 0 | 0.0 |
| avant | 8 | /voitures-electriques | mobile | 96 | 903.2 | 2855.1 | 0 | 14.0 |
| avant | 9 | /comparer | mobile | 96 | 904.7 | 2857.1 | 0 | 9.0 |
| avant | 10 | /outils/tco-voiture-electrique | mobile | 96 | 903.9 | 2855.9 | 0 | 9.0 |
| avant | 11 | / | mobile | 96 | 904.6 | 2857.3 | 0 | 11.0 |
| avant | 12 | / | desktop | 100 | 243.1 | 624.7 | 0 | 0.0 |
| avant | 13 | /voitures-electriques | mobile | 96 | 902.9 | 2704.4 | 0 | 11.5 |
| avant | 14 | /comparer | mobile | 96 | 904.4 | 2706.7 | 0 | 9.0 |
| avant | 15 | /outils/tco-voiture-electrique | mobile | 96 | 903.8 | 2855.8 | 0 | 9.0 |
| après | 1 | / | mobile | 95 | 905.6 | 2933.4 | 0 | 14.0 |
| après | 2 | / | desktop | 100 | 244.8 | 627.5 | 0 | 0.0 |
| après | 3 | /voitures-electriques | mobile | 96 | 903.5 | 2705.3 | 0 | 12.5 |
| après | 4 | /comparer | mobile | 96 | 903.5 | 2855.3 | 0 | 9.0 |
| après | 5 | /outils/tco-voiture-electrique | mobile | 96 | 904.0 | 2856.1 | 0 | 9.5 |
| après | 6 | / | mobile | 95 | 906.5 | 2859.7 | 0 | 11.5 |
| après | 7 | / | desktop | 93 | 243.2 | 1736.1 | 0 | 0.0 |
| après | 8 | /voitures-electriques | mobile | 96 | 903.3 | 2704.9 | 0 | 15.0 |
| après | 9 | /comparer | mobile | 96 | 904.2 | 2706.4 | 0 | 10.5 |
| après | 10 | /outils/tco-voiture-electrique | mobile | 96 | 904.6 | 2707.1 | 0 | 11.5 |
| après | 11 | / | mobile | 96 | 904.5 | 2856.8 | 0 | 11.5 |
| après | 12 | / | desktop | 100 | 242.9 | 624.4 | 0 | 0.0 |
| après | 13 | /voitures-electriques | mobile | 96 | 903.5 | 2855.3 | 0 | 19.0 |
| après | 14 | /comparer | mobile | 96 | 903.7 | 2856.0 | 0 | 6.5 |
| après | 15 | /outils/tco-voiture-electrique | mobile | 96 | 904.7 | 2857.0 | 0 | 9.0 |

Les JSON complets sont dans `before/lighthouse.json` et `after/lighthouse.json`. L’accessibilité automatisée vaut 100, mais le lot 0 avait démontré qu’un tel score n’exclut pas un défaut de focus.

## Limites et risques restants

- Aucun Safari, appareil physique, VoiceOver ou NVDA testé. Les tests tactiles sont émulés ; la présence du tableau est vérifiée dans l’arbre d’accessibilité Chrome.
- Pas d’INP/CrUX terrain ni d’exécution PageSpeed par Google sur le code modifié ; il n’est pas déployé. Les variations de réseau, consentement, CPU et annonces peuvent modifier les résultats.
- Aucune annonce réelle ni dialogue Funding Choices visible dans le protocole ; la coexistence réelle de la barre de sélection avec une CMP/annonce mobile reste à vérifier dans un environnement autorisé. Réservations et intégrations existantes sont conservées.
- Copie testée avec une API contrôlée : permission presse-papiers du système et fallback sur ancien navigateur non exercés. Logique existante inchangée.
- Les tests d’intégration DB ne sont pas lancés : leur setup par défaut recrée la base et applique des migrations, incompatible avec cette mission.
- Pas d’accès aux consoles GSC, GA4, AdSense ou Vercel. Contrôles effectués sur sources, HTML et rendu local.
- Certaines cartes gagnent en hauteur ; aucun texte, résultat ni lien n’est supprimé.

Aucune régression critique fonctionnelle ou SEO détectée. Aucun rollback nécessaire. Le patch limité permettrait de revenir uniquement sur ce lot ; aucune commande Git destructive n’a été utilisée.

## Reproduire la comparaison

Le protocole exécuté est conservé dans `capture.mjs.txt`, et les assertions dans `compare.py.txt`. Les fichiers texte évitent de les charger dans l’application. Le chemin des modules Chrome/Lighthouse est celui du cache déjà présent sur cette machine ; aucune dépendance ajoutée au projet.

1. Construire puis servir la version à mesurer avec `EVEXPERT_DATA_SOURCE=local`, port 3102.
2. Copier `capture.mjs.txt` vers un fichier temporaire `.mjs` et exécuter `node <capture.mjs> <phase> http://localhost:3102`, puis la même commande avec `--lighthouse`. Cela écrit les preuves de cette phase ; conserver les références existantes avant toute nouvelle capture.
3. Comparer les JSON et exécuter les assertions Python enregistrées.

Les premières captures de référence ont été complétées par une reprise des seuls parcours clavier (`--resume`) et par les vues de détail catalogue/TCO (`--screens`). Les validations finales comportent aussi les taps/clics aux cinq largeurs et la vérification de l’arbre d’accessibilité. Les deux séries Lighthouse utilisent exactement les mêmes paramètres et cas.

## Lot suivant proposé, sans implémentation

Lot 2 limité aux champs : relier les aides aux inputs via `aria-describedby`, harmoniser les états focus/erreur et l’espace des unités lorsque nécessaire. Conserver formules, libellés utiles, données, routes et intégrations. Reprendre les mêmes références SEO/calculs et contrôler les performances. Aucun changement du Hero, de la navigation, des publicités ou du SEO dans ce lot proposé.

Arrêt après le lot 1. Toute modification supplémentaire attend une validation explicite.
