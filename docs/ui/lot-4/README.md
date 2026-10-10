# EVExpert — UI/UX lot 4 : navigation et présentation éditoriale

Le lot 4 harmonise le header, les cartes de guides/articles, les sommaires et le footer dans la direction EVExpert Signature. Les mécanismes de navigation et de recherche, les contenus et les fonctionnalités sont conservés. Les comparaisons locales n’identifient pas de régression critique imputable à ces retouches.

**Périmètre final : cinq fichiers existants modifiés et une feuille CSS ciblée ajoutée.** Aucune dépendance installée, configuration modifiée, opération de base de données, migration, nouvelle route, suppression de contenu, commit, push ou publication. Les travaux antérieurs, dont les contenus non déployés, sont conservés. Arrêt après le lot 4.

## Référence et méthode

Les rapports [lots 0/1](../lot-0-1/README.md), [référence](../lot-0-1/REFERENCE.md), [lot 2](../lot-2/README.md) et [lot 3](../lot-3/README.md) ont été consultés. Le diagnostic complémentaire du catalogue, conservé dans `/private/tmp/evexpert-lcp-postlot3/results-full/`, concluait à un LCP médian mobile de 2 857,05 → 2 857,63 ms sur six répétitions par build, sans régression reproductible.

Une nouvelle référence a été capturée sur le build de production pré-lot 4, avec le catalogue local forcé, puis comparée au build final : même serveur `http://localhost:3102`, Chrome **154.0.8037.98**, Lighthouse **12.8.2**, mêmes profils et même ordre. Le build pré-lot 4 a continué à servir les mesures « avant » pendant les retouches des sources ; aucun serveur de développement avec rechargement automatique n’a été utilisé.

Les sources initiales sont sauvegardées dans `/private/tmp/evexpert-lot-4-originals/`. Une copie du build pré-lot 4 et des dépendances déjà présentes est conservée dans `/private/tmp/evexpert-lot4-before-build/` pour les mesures complémentaires. Aucune installation n’a été nécessaire.

Pièces de référence : [statut Git initial](initial-git-status.txt), [empreintes initiales](before/source-hashes.json), [comparaison des fichiers](files-changed.json), [comparaison des contrôles](comparison.json), [manifestes de rendu](rendering-comparison.json), [vérification des composants](source-semantics.json). Le [patch du lot 4](lot-4.patch) compare les fichiers à la sauvegarde de début de lot, **pas au HEAD Git**, qui ne contient pas tous les travaux préexistants.

## Audit ciblé et décisions

Les valeurs de taille ci-dessous sont des constats de confort d’utilisation, pas une déclaration automatique de non-conformité WCAG. Les surfaces, couleurs et filets relèvent de l’harmonisation visuelle approuvée.

| Élément audité | Constat | Décision du lot 4 |
|---|---|---|
| `layout/Header.tsx` | Alignement flex déjà correct ; hauteur du header stable, 56 px sur mobile et 64 px sur desktop. Aire du logo 36 px, action Comparer desktop 36 px, champ compact 40 px. | Porter ces trois cibles à au moins 44 px de hauteur, sans déplacer le logo ou modifier la hauteur du header. Hover discret des liens desktop. |
| `layout/NavLink.tsx` | Véritables liens, état actif et focus existants ; petit îlot client pour le chemin courant. | Source intacte. Accent volt du lien Comparer dans le menu mobile, via le seul périmètre du header. |
| Menus et recherche mobiles | Deux `<details name="site-panel">` exclusifs, panneaux à défilement natif ; actions de 44/48 px déjà satisfaisantes. | Mécanisme, libellés et destinations intacts ; focus des summaries conservé visible et rentré dans la cible. |
| `layout/SearchBar.tsx` et `/recherche` | Formulaire GET avec label, champ et paramètres existants ; conventions Field du lot 2 déjà utilisées. | Aucun changement de recherche, de placeholder, de résultats ou d’événement. Taille ajustée uniquement dans le header. |
| `layout/Breadcrumbs.tsx` | Navigation HTML, liens et JSON-LD existants ; gestion mobile déjà prévue. | Aucun changement nécessaire. |
| `guides/GuideCardVisual.tsx` | Hiérarchie titre/extrait déjà exploitable ; cadre moins cohérent avec les panneaux des lots 2/3. Les cartes sans image réservent une grande tuile 16:9 vide. | Cadre clair harmonisé, catégorie/date mieux séparées ; repère décoratif compact de 40 px pour les seules cartes sans image. Aucun texte ou visuel remplacé. |
| `guides/GuidesBrowser.tsx`, `BlogBrowser.tsx` | Rubriques, filtres clavier, liens et contenu HTML serveur satisfaisants. | Logique et grilles de listes intactes. La carte partagée reçoit seule les retouches. |
| `ui/Prose.tsx` | Sommaires HTML à ancres, mobile/desktop ; le sommaire de sidebar précède notamment une réserve publicitaire. | Seulement le filet et les états hover/focus du sommaire. Aucune dimension, ancre, ligne ou règle de rendu du corps éditorial changée. |
| `content/ArticleView.tsx`, figures et colophon | Organisation article/sidebar, illustrations, sources, outils et dates déjà cohérents. | Intacts, y compris la réservation `guide-sidebar` et son sticky parent. |
| `related/*`, `layout/SectionNav.tsx` | Navigation secondaire sémantique, ancres/défilement natifs et hiérarchie existante satisfaisants. | Aucun changement. |
| `layout/Footer.tsx` | Ordre des colonnes et liens satisfaisants ; liens souvent hauts de 32 px et espace entre colonnes peu favorable à 320 px. | Liens d’au moins 44 px de hauteur, underline au hover/focus, écart entre colonnes de 16 px sous 384 px. Ordre et nombre d’entrées conservés. |
| `ConsentRevocationButton.tsx`, `ads/*`, intégrations Google | Comportements sensibles indépendants de la présentation éditoriale. | Sources intactes ; seul le bouton propre au footer gagne une hauteur de 44 px. Aucun sélecteur appliqué aux widgets Google. |
| Accueil et Hero | Présentation et ordre protégés ; les cartes de lecture de l’accueil n’utilisent pas `GuideCardVisual`. | Hero, contenu et sections intacts. Seuls le header et le footer partagés reçoivent leurs retouches. |

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/components/layout/Header.tsx` | Classe privée sur le header existant ; aucune modification de JSX fonctionnel. |
| `src/components/layout/Footer.tsx` | Classes privées sur le footer, sa grille et ses liens ; données de navigation conservées. |
| `src/components/guides/GuideCardVisual.tsx` | Classes privées et attribut de présentation indiquant la présence d’une image ; mêmes tags, données, liens, dates et props Image. |
| `src/components/ui/Prose.tsx` | Classe privée sur TableOfContents ; rendu Prose inchangé. |
| `src/app/globals.css` | Un import supplémentaire de la feuille ciblée ; règles, tokens, polices et valeurs préexistantes intacts. |
| `src/components/layout/refinements.css` — ajout | Styles limités aux nouveaux préfixes `evx-header`, `evx-footer` et `evx-editorial-*`. |

**321 des 326 fichiers préexistants capturés sont identiques**, cinq modifiés, un ajouté, aucun supprimé. Les fichiers de configuration capturés, les assets publics, données, formules, tests et intégrations ne changent pas. La comparaison de `.env.local` avec la copie de référence confirme aussi son intégrité, sans enregistrer ses valeurs.

Les arbres TypeScript des quatre composants sont identiques après exclusion explicite des seules classes, de l’attribut de présentation de la carte et des commentaires. Imports, événements, expressions de contenu, conditions fonctionnelles et destinations restent identiques. Aucun hook, état ou îlot client ajouté.

## Présentation finale

Palette et polices conservées : fond `#F3F6FC`, encre `#071A3A`, cobalt `#1448C8`, volt `#C8FF2E`, Schibsted Grotesk et IBM Plex Mono.

- Cartes : surface blanche, bordure de 1 px, filet supérieur cobalt de 2 px, rayon 8 px, padding 16 px. Catégorie en cobalt, durée gardée ensemble, métadonnées autorisées à revenir à la ligne, date séparée par un filet et 12 px d’espace. Titres/extraits complets, sans ellipse ajoutée.
- Illustrations : mêmes fichiers, textes alternatifs, dimensions intrinsèques, `sizes`, priorités et mécanismes Next Image. Le zoom décoratif au hover est neutralisé dans ces cartes. Aucune image ou police supplémentaire.
- Cartes sans image : conservation du nœud décoratif `aria-hidden`, réduit à 40 px et accompagné d’un petit filet cobalt CSS ; aucune illustration artificielle.
- Navigation : mêmes menus natifs et hauteur de header ; recherche et action desktop plus confortables. Comparer mobile reprend l’accent volt du desktop et conserve son état actif distinct.
- Footer : deux colonnes mobiles et quatre à partir du breakpoint existant, mêmes titres et liens, cibles verticales agrandies. Le footer peut être plus haut ; le contenu et les réservations situés avant lui ne bougent pas.
- Sommaires : filet cobalt et survol/focus discrets, sans changement de padding ou de dimensions. Transition de bordure des cartes limitée à 150 ms et désactivée en mouvement réduit.

## Captures avant/après

**69 JPEG avant et 69 après**, mêmes pages/largeurs : [référence](before/), [lot 4](after/).

| Cas | Avant | Après |
|---|---|---|
| Guides, cartes 390 px | [capture](before/_guides-cards-390.jpg) | [capture](after/_guides-cards-390.jpg) |
| Guides, cartes 1440 px | [capture](before/_guides-cards-1440.jpg) | [capture](after/_guides-cards-1440.jpg) |
| Article sans image, blog 320 px | [capture](before/_blog-cards-320.jpg) | [capture](after/_blog-cards-320.jpg) |
| Menu mobile 320 px | [capture](before/menu-320.jpg) | [capture](after/menu-320.jpg) |
| Recherche mobile 390 px | [capture](before/search-390.jpg) | [capture](after/search-390.jpg) |
| Footer 320 px | [capture](before/footer-320.jpg) | [capture](after/footer-320.jpg) |
| Article à sidebar 1440 px | [capture](before/_guides_temps-recharge-voiture-electrique-1440.jpg) | [capture](after/_guides_temps-recharge-voiture-electrique-1440.jpg) |
| Accueil 1440 px | [capture](before/home-1440.jpg) | [capture](after/home-1440.jpg) |

Les cartes, le menu, la recherche, le footer et les états de focus ont été inspectés visuellement. Les captures de vidéo ne constituent pas une comparaison de pixels reproductible image par image ; les géométries et comportements du Hero sont comparés séparément.

## Validation technique et fonctionnelle

| Contrôle | Résultat |
|---|---|
| Lint | `npm run lint` : OK. |
| TypeScript | `npm run typecheck` : OK. |
| Tests unitaires | `npm test -- --config vitest.unit.config.ts` : **160 tests, 15 fichiers**, tous réussis. Configuration préexistante sans setup DB ; aucun test DB destructif lancé. |
| Build | `EVEXPERT_DATA_SOURCE=local npm run build` : OK, 192 entrées générées comme la référence. |
| Routes/rendu | Manifestes de routes et app-paths identiques ; 191 entrées dans le manifeste prerender avant/après, mêmes revalidate, expirations, routes dynamiques et not-found. La recherche reste SSR. |
| Responsive général | **17 pages × 5 largeurs = 85 cas** : géométries capturées identiques, document sans débordement. Catalogue, marques, modèles, version, comparateur, outils et accueil couverts. |
| Responsive ciblé | **8 pages × 5 largeurs = 40 cas** : accueil, catalogue, Guides, Blog, guide à sidebar, article LFP/NMC, Méthodologie et recherche ; pas de débordement global, texte de carte coupé ni lien de footer hors viewport. |
| Largeurs | 320, 390, 768, 1024 et 1440 px, Chrome émulé. |
| Menus/recherche | Tab, Entrée, ouverture/fermeture, exclusivité des deux details, focus visible et navigation Blog testés aux cinq largeurs. Recherche aboutissant exactement à `/recherche?q=kona`. Résultats identiques à la référence. |
| Filtres éditoriaux | **13 scénarios** clavier Guides/Blog ; mêmes états actifs, ensembles ordonnés de liens visibles et URLs. |
| Cartes/liens | Focus visible sur les cartes, liens étirés préservés ; Entrée ouvre les guides/articles attendus. |
| Sommaires | Liens et dimensions identiques ; ancres mobile/desktop présentes et atteintes. Après stabilisation du scroll natif, positions exactement identiques à la référence. |
| Footer | Navigation clavier vers Confidentialité aux cinq largeurs ; labels complets, focus visible. Bouton de consentement à 44 px de hauteur. |
| Calculateurs | **20 cas** par défaut/fixes, dont les estimateurs sur fiches : valeurs et résultats exactement identiques. Tables accessibles TCO et essence/électrique identiques. |
| Catalogue/comparateur | Recherche Kona, sélection de trois véhicules, limite de sélection, remise à zéro, lien de comparaison, copie contrôlée et focus de tableaux inchangés. |
| Hero | Sources, attributs vidéo, texte, ordre des sections et géométrie à cinq largeurs identiques. Pause/reprise desktop et modes mobile/mouvement réduit préexistants vérifiés. |
| Accessibilité automatisée | Axe WCAG 2 A/AA et 2.1 AA : zéro violation sur Guides mobile testé. Lighthouse accessibilité : 100 sur les 72 passages. Ce contrôle n’est pas une certification. |
| Erreurs navigateur | Aucune erreur JavaScript dans les parcours finaux capturés. |

[Résultats des commandes](validation.json), [géométrie générale](after/geometry.json), [géométrie ciblée](after/navigation-geometry.json), [menus](after/navigation-menus.json), [filtres](after/editorial-filters.json), [sommaires stabilisés](after/editorial-toc-settled.json), [footer clavier](after/footer-keyboard.json), [calculateurs](after/calculators.json), [interactions](after/interactions.json), [Hero](after/hero.json) et [géométrie du Hero](after/hero-geometry.json).

Le build a été relancé après l’enregistrement du rapport et des protocoles pour contrôler le scan Tailwind des documents. Il réussit ; les fichiers sources capturés sont intacts et tous les assets locaux mesurés (CSS, JavaScript, polices) gardent leurs noms hachés et leurs tailles. [Contrôle final](final-build-validation.json), [CSS mesuré](measured-css-hashes.json).

### Précautions du protocole

Un essai navigateur simultané a été interrompu par la fermeture de Chrome ; la série ciblée a ensuite été relancée entièrement et séquentiellement. Les changements de viewport passent par une page vide pour éviter d’attendre le chargement complet des scripts tiers lors du rechargement automatique de Puppeteer. Aucun test navigateur ou build concurrent pendant Lighthouse.

Une attente fixe de 500 ms ne stabilisait pas toujours le défilement fluide des ancres. Un second contrôle attend la fin effective du scroll : cible et position identiques avant/après, 159,97 px sur mobile et 168,09 px sur desktop pour l’ancre testée.

La copie temporaire du build contenait un alias Turbopack relatif vers la dépendance `pg`, valide dans le dépôt mais invalide depuis `/private/tmp`. Ce lien a été réancré **uniquement dans la copie temporaire**, vers la dépendance déjà copiée, puis les contrôles SSR/liens ont été relancés. Aucun fichier de configuration ou dépendance du dépôt modifié. Les mesures Lighthouse de cette copie n’ont aucune erreur runtime ni ressource locale HTTP en erreur.

## SEO, Search Console et liens internes

Les **190 routes de référence** sont conservées : 186 pages HTML et quatre ressources, toutes HTTP 200 ; **58 pages noindex**, comme avant.

Comparaison exacte des titles, descriptions et autres metadata dont Open Graph/Twitter/vérifications Google, canonicals, directives/en-têtes robots, JSON-LD, H1/H2/H3 et IDs, href/ancres/labels des liens, texte brut serveur et ajouts UI des lots précédents. Aucun nouveau texte éditorial ou d’interface ajouté à ces pages dans ce lot.

Sitemap, robots.txt, ads.txt, RSS et huit redirections identiques. Le rendu sémantique des arbres header/main/footer est identique sur les 190 routes après exclusion des seules classes, styles et de l’attribut de présentation des cartes ; tags, texte, images, attributs ARIA, IDs et destinations sont conservés. Le HTML octet par octet diffère naturellement par les classes et les URLs hachées des assets de build.

Le contrôle étendu couvre **198 destinations internes distinctes** et **1 237 occurrences de liens à fragment**. Les destinations répondent sans HTTP 4xx/5xx. Une anomalie préexistante est conservée et signalée : **90 occurrences vers `/methodologie#autonomie`**, dont la cible ID n’existe pas. La route Méthodologie répond HTTP 200 ; ce défaut d’ancre ne crée pas une nouvelle 404. Il demande un correctif séparé et une validation explicite puisqu’il concerne le maillage protégé.

[SEO avant](before/seo.json), [après](after/seo.json), [structure sémantique](after/semantic-structure.json), [ressources/redirections](after/assets-redirects.json), [liens/ancres avant](before/internal-links-check.json) et [après](after/internal-links-check.json).

## AdSense et consentement

Les identifiants, coordonnées, dimensions et visibilité des réservations publicitaires sont identiques dans les **85 cas généraux et 40 cas ciblés**. Aucun déplacement de sidebar, de sommaire ou de bloc publicitaire. Le garde-fou existant vérifie la balise de compte, le chargement unique du script et ads.txt : conforme sur **124 pages du sitemap**.

Sources et configurations AdSense, GA4, Search Console et Funding Choices intactes. Le bouton de gestion des cookies conserve son handler. Le test contrôlé vérifie l’ajout exact du callback de révocation lorsque l’API est disponible, et l’absence d’erreur lorsqu’elle ne l’est pas ; résultats identiques avant/après. **Aucun consentement réel n’a été donné ou retiré pour le test.**

Le remplissage réel des annonces, les auto ads et l’interface de consentement Google ne sont pas reproduits par ces tests locaux. Leur comportement en production devra être contrôlé sur un environnement autorisé avant une publication ultérieure.

## Lighthouse — comparaison en laboratoire

**30 passages avant et 30 après**, trois répétitions par chacun des dix couples page/profil. Six répétitions supplémentaires par build pour l’accueil desktop : **72 passages au total**. Versions, profils, paramètres de throttling simulé et port identiques ; caches réinitialisés par Lighthouse, scripts Google conservés. Aucune mesure terrain CrUX, INP ou PageSpeed exécutée par Google ; le TBT ne mesure pas l’INP.

### Série principale : médianes sur trois passages

| Page / profil | Score avant → après | LCP s | FCP s | TBT ms | CLS |
|---|---:|---:|---:|---:|---:|
| `/` / mobile | 95 → 95 | 2.935 → 2.935 | 0.907 → 0.907 | 18 → 16 | 0 → 0 |
| `/` / desktop | 100 → 94 | 0.629 → 1.648 | 0.245 → 0.244 | 0 → 0 | 0 → 0 |
| `/guides` / mobile | 93 → 94 | 3.161 → 3.158 | 0.907 → 0.907 | 15 → 14.5 | 0 → 0 |
| `/blog` / mobile | 93 → 93 | 3.236 → 3.237 | 0.908 → 0.908 | 18 → 17 | 0 → 0 |
| `/guides/temps-recharge-voiture-electrique` / mobile | 95 → 95 | 2.935 → 2.932 | 0.907 → 0.905 | 16 → 11 | 0 → 0 |
| `/guides/temps-recharge-voiture-electrique` / desktop | 100 → 100 | 0.607 → 0.627 | 0.245 → 0.244 | 0 → 0 | 0 → 0 |
| `/blog/lfp-ou-nmc-ce-que-montrent-les-donnees` / mobile | 95 → 95 | 2.934 → 2.935 | 0.906 → 0.906 | 18 → 12.5 | 0 → 0 |
| `/blog/lfp-ou-nmc-ce-que-montrent-les-donnees` / desktop | 100 → 100 | 0.629 → 0.627 | 0.246 → 0.244 | 0 → 0 | 0 → 0 |
| `/voitures-electriques` / mobile | 96 → 96 | 2.856 → 2.857 | 0.904 → 0.904 | 20 → 17.5 | 0 → 0 |
| `/voitures-electriques` / desktop | 100 → 100 | 0.606 → 0.606 | 0.244 → 0.244 | 0 → 0 | 0 → 0 |

### Accueil desktop : répétitions nécessaires

La baisse apparente de la série à trois passages s’accompagne d’un changement de candidat LCP : poster deux fois et vidéo une fois avant, poster une fois et vidéo deux fois après. Ce comportement apparaissait déjà dans le rapport du lot 3.

La série complémentaire a été exécutée dans l’ordre **après puis avant**, à partir des mêmes builds et du même port. En conservant tous les passages, neuf mesures par build donnent :

| Mesure | Avant | Après |
|---|---:|---:|
| Répartition LCP | 5 posters / 4 vidéos | 5 posters / 4 vidéos |
| Score médian global | 100 | 100 |
| LCP médian global | 0.658 s | 0.629 s |
| LCP médian des passages poster | 0.629 s | 0.627 s |
| LCP médian des passages vidéo | 1.667 s | 1.659 s |
| CLS / TBT | 0 / 0 | 0 / 0 |

La différence de la première petite série n’est pas reproductible. Les durées par candidat et leurs fréquences restent proches ; aucun motif démontré de retoucher le Hero. Le meilleur passage ou la médiane globale ne constituent pas un gain attribuable au design.

### Éléments LCP et coûts observés

Les candidats LCP restent les mêmes : H1 de l’accueil mobile et des Guides, paragraphe d’introduction du Blog et du catalogue mobile, paragraphe du guide mobile, illustration LFP/NMC, image du guide desktop, H1 du catalogue desktop. Seul le choix poster/vidéo de l’accueil varie entre passages.

Le LCP desktop du guide augmente légèrement, **+19,4 ms** en médiane, avec score 100, FCP stable et mêmes image/contenu/géométrie. Cette petite différence est signalée ; les mesures ne permettent pas d’en établir la cause. Les autres LCP mobiles médians varient d’environ −3,5 à +0,9 ms. **CLS nul sur les 72 passages**, accessibilité 100 ; aucune hausse importante du TBT. Les écarts de TBT ne sont pas présentés comme un gain causal du design.

| Ressource locale | Avant | Après | Delta |
|---|---:|---:|---:|
| Feuille CSS minifiée, octets bruts | 69 475 | 71 725 | +2 250 |
| CSS transféré observé, octets | 14 259 | 14 705 | +446 |
| Fonts transférées, octets | 68 312 | 68 312 | 0 |
| JS accueil mobile, octets | 193 175 | 193 175 | 0 |
| JS catalogue mobile, octets | 193 884 | 193 884 | 0 |
| JS Guides mobile, octets | 184 798 | 184 848 | +50 |
| JS Blog mobile, octets | 190 781 | 190 829 | +48 |

Une seule requête stylesheet, les mêmes quatre fichiers de polices et aucun nouvel îlot client. Les petits deltas des chunks partagés/préchargés atteignent **+98 octets** sur les profils desktop capturés. Aucun coût de nouvelle bibliothèque, animation permanente ou script tiers. Les transferts incluent les surcoûts HTTP observés ; ils ne sont pas une analyse exhaustive du bundle.

Les LCP mobiles restent environ **2,85–3,24 s**, au-dessus de l’objectif indicatif 2,5 s déjà non atteint dans ces références. Cette harmonisation ne résout pas ce sujet de performance terrain et ne garantit pas de score PageSpeed.

[Passages individuels et médianes](LIGHTHOUSE.md), [comparaison détaillée](lighthouse-comparison.json), [analyse accueil desktop](home-desktop-analysis.json), [30 avant](before/lighthouse.json), [30 après](after/lighthouse.json), [six répétitions avant](before-home-desktop-repeat/lighthouse.json) et [six après](after-home-desktop-repeat/lighthouse.json). Les LHR complets sont conservés dans ces dossiers.

## Risques restants et contrôles non effectués

- Safari/iOS, appareils physiques, zoom à 200 %, VoiceOver/NVDA : non testés. Responsive émulé Chrome, contrôles clavier et diagnostics automatisés seulement.
- CrUX/INP, performances du réseau de production, Supabase live et consoles GSC/GA4/AdSense : non consultés ou mesurés. Aucun déploiement effectué.
- Consentement Google réel et annonces effectivement remplies/auto ads : non reproduits ; code, réservations et callback contrôlés. Validation nécessaire sur environnement autorisé avant publication.
- L’ancre `/methodologie#autonomie` absente est un défaut préexistant du maillage : 90 occurrences dans l’inventaire. Aucune correction de lien ou d’ID introduite dans ce lot.
- Le footer gagne de la hauteur pour ses cibles tactiles ; les cartes illustrées sont moins larges à l’intérieur de leur colonne du fait du padding. Captures disponibles pour validation humaine du compromis de densité.
- LCP mobile supérieur à 2,5 s et variation poster/vidéo desktop préexistants ; suivi terrain nécessaire. Écart du guide desktop de 19 ms conservé dans le rapport.
- Avertissements Next préexistants : racine Turbopack inférée depuis le lockfile parent et Cache-Control personnalisé des assets. Configurations conservées.
- Les dépassements internes de certaines valeurs d’estimateurs mentionnés au lot 3 restent hors périmètre ; aucun débordement global nouveau.

## Proposition précise du lot 5 — soumis à validation

**Lot limité à la lisibilité des résultats du comparateur et des estimateurs de fiches**, conformément aux défauts internes déjà signalés au lot 3. Aucun changement engagé.

1. Capturer les libellés longs et valeurs/unités qui dépassent dans `src/components/comparison/ComparisonTable.tsx` et `src/components/vehicles/VehicleCostEstimator.tsx`, aux cinq largeurs ; reprendre les jeux fixes et les sélections/URLs partagées de ce lot.
2. Ajuster seulement retour à la ligne, largeur des cellules, espacement et alignement dans ces deux composants. Examiner `src/components/comparison/ComparisonBuilder.tsx` uniquement si le défaut provient de son cadre. Conserver tableaux/listes sémantiques, provenance, unités, valeurs absentes, événements et formules.
3. Comparer à nouveau les 190 routes, les vingt résultats fixes, les liens, la sélection et la copie, le clavier, les réservations et Lighthouse mobile/desktop sur Comparer et une fiche multiversion. Lot accepté uniquement après revue des captures et absence de régression importante.

Le défaut de l’ancre Méthodologie mérite un **correctif séparé avec validation SEO explicite** : vérifier `src/components/ui/DataBadge.tsx` et `src/app/methodologie/page.tsx`, puis décider d’une compatibilité d’ancre sans toucher aux URLs ou aux textes. Il n’est pas inclus implicitement dans les retouches visuelles proposées.

**Arrêt après le lot 4. Aucune action du lot 5, publication ou modification supplémentaire sans validation.**
