# EVExpert — UI/UX lot 2 : harmonisation ciblée

Le lot 2 harmonise les champs, les actions et les panneaux existants. Direction EVExpert Signature conservée : fond `#F3F6FC`, encre `#071A3A`, cobalt `#1448C8`, volt `#C8FF2E`, Schibsted Grotesk et IBM Plex Mono. Onze fichiers existants modifiés et un module de styles ajouté. Les composants fonctionnels et leurs événements sont conservés.

Aucune installation, modification de configuration ou de base, migration, commit, push ou publication. Les travaux éditoriaux et les corrections du lot 1 présents au démarrage sont conservés.

## Référence et cartographie

Les [conclusions des lots 0 et 1](../lot-0-1/README.md) et leur [référence](../lot-0-1/REFERENCE.md) ont été consultées avant intervention. La [cartographie des primitives et usages](MAPPING.md) explique le périmètre et les composants conservés.

Référence fraîche, avant modification des sources :

- Build de production Next.js 16.2.6, catalogue local forcé, serveur `http://localhost:3102` ; aucune connexion DB requise.
- Chrome 154.0.8037.98, Lighthouse 12.8.2, déjà présents sur la machine ; aucune dépendance ajoutée.
- 320 empreintes sources/assets/configurations/tests ; statut Git initial enregistré dans [start-status.txt](start-status.txt).
- 190 routes capturées : 186 pages HTML HTTP 200 et quatre ressources, dont la recherche dynamique ; 58 pages noindex conservées.
- Metadata complètes, canonical, robots, JSON-LD, H1/H2/H3 avec leurs IDs, liens/ancres et texte HTML serveur.
- 17 pages × 320, 390, 768, 1024, 1440 px = 85 observations responsive par phase.
- 13 pages de composants × 5 largeurs = 65 observations détaillées des champs/actions par phase.
- Huit outils et deux estimateurs véhicules, chacun en état initial et avec saisies fixes : 20 jeux de calcul par phase.
- Six préremplissages véhicule, critères fixes de l’aide au choix, filtres/tri/réinitialisations catalogue : dix scénarios supplémentaires.
- 32 captures JPEG avant et 32 après, dont vues de focus ; mêmes contextes de capture.
- 15 passages Lighthouse avant et 15 après, trois répétitions par couple page/profil, avec les profils et l’ordre des lots précédents.

Pages contrôlées : accueil ; catalogue ; marque Renault ; modèles Renault 5 E-Tech et Tesla Model 3 ; version Model 3 RWD ; comparateur ; aide au choix ; les huit outils ; guide temps de recharge. L’inventaire SEO inclut aussi les autres marques, modèles, versions, guides, articles, recharge, pages légales et duels. Les API ne sont pas appelées.

Preuves dans [before/](before/) et [after/](after/). La sauvegarde des fichiers tels qu’ils existaient au démarrage est dans `/private/tmp/evexpert-lot-2-originals/`. Le [patch propre au lot 2](lot-2.patch) est calculé par rapport à cette sauvegarde, et non par rapport au HEAD Git contenant les travaux antérieurs non commités.

## Composants audités et choix de périmètre

| Famille | Composants | Traitement |
|---|---|---|
| Boutons/liens/cartes communs | Button, ButtonLink, ArrowLink, Card, Chip, Badge | Styles par défaut conservés : ils servent aussi au Hero, aux sections d’accueil et au footer. |
| Champs | ui/Field, kit/Field, NumberInput, SelectInput, RangeInputControl, VehiclePresetSelect | Variante confortable explicite, unités séparées, descriptions accessibles. Recherche commune compacte intacte. |
| Actions spécifiques | VehicleExplorer, VehicleFinder, CopyLinkButton | Styles communs ciblés, hauteurs 44/48 px et états cohérents. |
| Panneaux | CalcLayout, TcoCalculator, EvVsPetrolCalculator, ResultCard | Surfaces, bordures, rayons et espacements partagés. |
| Données et provenance | DataBadge/DataLegend, DataFigure, Stat, Delta, SourceBadge, ComparisonTable | Déjà cohérents ; textes, nature des données, unités, couleurs sémantiques et typographie conservés. DataLegend apparaît aussi sur l’accueil. |
| États et erreurs | ErrorState, EmptyState, Skeleton, recherche/error | Rôles alert/status déjà présents ; aucun nouveau message ni nouvelle règle de validation métier. |
| Corrections du lot 1 | GarageToggle/GarageBar, VehicleCard/VehicleRow/ModelOverview, GroupedBars | Conservées intégralement. Aucun nouveau changement de ces composants. |

Les alias `rounded-md/lg/xl/2xl/3xl` ont déjà tous un rayon de 8 px : aucun changement global de tokens n’était nécessaire. `globals.css`, les polices et les primitives de l’accueil restent intacts.

## Fichiers modifiés

| Fichier | Modification du lot 2 |
|---|---|
| `src/components/ui/Field.tsx` | Ajoute des classes explicites pour contrôles confortables, cadres numériques et curseurs. `fieldClass` compact et `labelClass` conservés. |
| `src/components/ui/componentStyles.ts` — ajout | Styles d’actions et de panneaux uniquement ; aucun composant, état ou événement. |
| `src/components/calculators/kit.tsx` | Utilise les styles partagés ; colonne d’unité, chiffres/unités mono, IDs des aides et transmission de aria-describedby ; panneaux harmonisés. |
| `src/components/calculators/ChargingCostCalculator.tsx` | Relie les trois aides existantes aux champs prix, rendement et consommation. |
| `src/components/calculators/StationPowerCalculator.tsx` | Relie les aides AC/DC à leurs champs. |
| `src/components/calculators/TripPlanner.tsx` | Relie l’aide sur la puissance DC moyenne à son champ. |
| `src/components/vehicles/VehicleCostEstimator.tsx` | Relie les deux aides des tarifs domicile/public ; aucun changement des hypothèses ou résultats. |
| `src/components/calculators/TcoCalculator.tsx` | Classes de panneaux partagées pour saisies, résultats et graphique. |
| `src/components/calculators/EvVsPetrolCalculator.tsx` | Même harmonisation des panneaux ; formules et séries conservées. |
| `src/components/comparison/ComparisonBuilder.tsx` | Sélecteurs confortables et style de copie commun ; URL, sélection et logique de copie conservées. |
| `src/components/vehicles/VehicleExplorer.tsx` | Recherche, sélecteurs, curseurs, actions filtres/affichage/réinitialisation harmonisés ; mêmes options et événements. |
| `src/components/finder/VehicleFinder.tsx` | Champs et choix Oui/Non/carrosserie harmonisés ; même moteur de correspondance et mêmes critères. |

Rapports/protocoles ajoutés uniquement sous `docs/ui/lot-2/`. Aucun fichier de configuration ni test unitaire modifié dans ce lot.

## Améliorations visuelles et accessibles

| Élément | Avant | Après |
|---|---|---|
| Champs catalogue/comparateur/aide au choix | 14 px ; hauteurs/paddings différents du kit | 16 px, hauteur 48 px, rayon 8 px, bordure control et focus cobalt. |
| Saisie numérique | Unité absolue dans la zone de l’input, valeurs en sans | Deux colonnes CSS distinctes, input flexible avec min-width:0 ; valeur IBM Plex Mono 16 px, unité mono 13 px. Cadre de 48 px. |
| Curseurs concernés | Hauteur native compacte | Zone native haute de 44 px, mêmes limites/pas/valeurs/événements. |
| Choix Oui/Non / carrosserie | 40 / 36 px | 44 px ; même aria-pressed, même fond encre sélectionné, surface blanche au repos. |
| Bascules catalogue | 40 × 40 px | 44 × 44 px. |
| Filtres mobiles | 42 px | 48 px, aligné sur la recherche. |
| Copie et réinitialisations | Styles distincts, réinitialisations à hauteur du texte | Variante d’action commune, minimum 44 px, rayon 8 px, fond discret au survol. Copie conserve sa cible agrandie au lot 1. |
| Saisies des outils | Paddings 20 ou 28/36 px selon outil | 20 px mobile / 24 px dès sm, surface blanche, filet line, rayon 8 px. |
| Résultats | Paddings 24/32 ou 28/36 px, cadres différents | 24 px mobile / 32 px dès sm, fond encre, filet line-ink, rayon 8 px ; valeurs volt/papier et aria-live conservés. |
| Aides | Paragraphes sans association | IDs stables et aria-describedby explicites ; descriptions présentes dans l’arbre accessible Chrome. |

Les boutons gardent le focus global de 2 px. Les champs numériques dessinent ce focus sur leur cadre par CSS `:has(input:focus-visible)` ; aucun effet, gestionnaire de focus ou provider ajouté. Les variantes confortables prennent en charge les états HTML disabled et aria-invalid, sans changer la validation métier ni produire de nouveaux messages. Les messages d’erreur existants gardent leur rôle `alert`.

Les 14 associations d’aides définies couvrent six préremplissages, six aides de champs d’outils et deux aides de l’estimateur réutilisé sur les fiches. Cela représente 80 observations aux cinq largeurs sur les pages contrôlées. Aucun nouveau texte d’aide ajouté.

## Captures avant/après

- Champ prix/unités à 390 px : [avant](before/field-units-390.jpg), [après](after/field-units-390.jpg).
- Aide au choix à 320 px : [avant](before/finder-controls-320.jpg), [après](after/finder-controls-320.jpg).
- Aide au choix desktop : [avant](before/finder-controls-1440.jpg), [après](after/finder-controls-1440.jpg).
- Comparateur mobile : [avant](before/comparer-320.jpg), [après](after/comparer-320.jpg).
- TCO mobile : [avant](before/tco-voiture-electrique-320.jpg), [après](after/tco-voiture-electrique-320.jpg).
- Accueil desktop : [avant](before/home-1440.jpg), [après](after/home-1440.jpg).

Inspection visuelle des vues champs/unités et aide au choix : valeurs et libellés lisibles, choix en retour à la ligne à 320 px, espaces homogènes, absence d’effets ajoutés. Les captures gardent le contenu et les titres ; les positions verticales des contrôles changent naturellement avec leurs nouvelles dimensions.

## Validation par famille puis finale

1. **Champs** : lint, TypeScript, 160 tests et build ; 65 cas responsive, 13 focus, dix scénarios et vingt calculs inchangés avant de passer aux actions. Preuves dans [fields/](fields/).
2. **Actions** : build ; 15 cas sur trois pages, toutes les cibles ≥44 px, quatre parcours Tab vers les actions, mêmes scénarios filtres/aide au choix. Preuves dans [actions/](actions/).
3. **Panneaux et ensemble du lot** : lint, TypeScript, tests, build et protocole complet sur la version finale. Les curseurs catalogue/aide au choix reprennent aussi la variante déjà testée dans le kit.

| Contrôle final | Résultat |
|---|---|
| `npm run lint` | OK |
| `npm run typecheck` | OK |
| `npm test -- --config vitest.unit.config.ts` | 15 fichiers, 160 tests réussis ; setup DB désactivé par la configuration préexistante. |
| `EVEXPERT_DATA_SOURCE=local npm run build` | OK ; 192 entrées statiques générées, mécanismes de rendu conservés. |
| Responsive à 320/390/768/1024/1440 | 85/85 cas : document = viewport ; notamment TCO 320/390 px sans débordement. |
| Détails composants | 65/65 cas : aucune superposition unité/input, aucun débordement ; boutons visibles ≥44 px. |
| Navigation clavier | 13 contrôles et quatre actions atteints par Tab, focus visible 2 px ; sept liens de tableaux du lot 1 toujours visibles avec mêmes href. |
| Aides accessibles | IDs cibles présents ; noms/descriptions des champs et préremplissages observés dans l’arbre Chrome. |
| Calculs et estimateurs | Comparaison JSON exacte des vingt jeux (entrées, résultats, tableaux et texte). |
| Préremplissages/filtres/aide au choix | Dix scénarios identiques ; sélection, limite de trois véhicules, vidage, URL partagée et copie clavier vérifiés. |
| Événements | 61 attributs onChange/onClick/onSubmit JSX strictement identiques dans les onze composants modifiés ; contrôle AST. |
| Catalogue et liens | 47 cartes avec noms complets ; navigation Entrée vers le véritable lien HTML vérifiée. |
| Tableaux des graphiques | Présents dans l’arbre d’accessibilité : TCO 21 cellules/entêtes et Essence vs électrique 12. |
| Erreurs JavaScript | Aucune pageerror dans les séries finales réussies. |
| `git diff --check` | OK |

Les [vingt assertions de non-régression](comparison.json), [contrôles des composants](components-validation.json), [événements](event-validation.json) et [commandes techniques](technical-validation.json) sont enregistrés. La copie est testée avec une API presse-papiers contrôlée afin de vérifier exactement l’URL envoyée ; permission du presse-papiers système non testée.

Une première session finale Chrome a été interrompue par une erreur « detached Frame » pendant les captures. La série complète a été relancée seule et a réussi. Cette interruption du protocole n’a entraîné aucun changement de source. Le premier build sandboxé a échoué au téléchargement de la police existante ; les builds autorisés avec réseau ont réussi. Avertissements Next préexistants laissés inchangés : racine Turbopack inférée depuis un lockfile parent et Cache-Control personnalisé des assets Next.

## SEO, accueil, publicité et consentement

- JSON SEO des 190 routes **strictement identique** à la référence du lot 2 et au résultat du lot 1 : statuts, metadata dont OG/Twitter, canonical, robots, JSON-LD, H1/H2/H3 et IDs, liens/ancres, texte serveur et empreintes. Les nouvelles descriptions accessibles n’ajoutent aucun texte éditorial.
- Sitemap, robots.txt, RSS, ads.txt et huit redirections : réponses/contenus identiques.
- 309 des 320 fichiers existants capturés sont inchangés ; onze fichiers UI ciblés changent et un module de styles est ajouté. Sources de données, catalogue, calculs, routes, config, polices, vidéo, SEO, contenus et intégrations Google restent inchangés.
- Hero, texte adjacent, ordre/contenu des sections et contrôles vidéo inchangés. Pause/reprise, comportement mobile existant et mouvement réduit vérifiés.
- Réservations publicitaires : mêmes identifiants, coordonnées, dimensions et visibilité dans les 85 cas capturés. Aucun emplacement ajouté, déplacé ou supprimé.
- `check-adsense.mjs` : balise/script/ads.txt conformes sur les 124 pages du sitemap. Sources GA4, AdSense, GSC, Funding Choices et consentement intactes ; aucun consentement forcé dans les tests.

La comparaison SEO ignore les classes CSS et URLs des chunks Next hachés, mais conserve tout le contenu et les véritables liens du HTML serveur. Elle n’est pas un accès aux consoles privées Google.

## Lighthouse : laboratoire local

Trois passages par couple page/profil, mêmes Chrome/Lighthouse, serveur, URL, ordre, paramètres et caches réinitialisés par Lighthouse. Les quinze couples de paramètres avant/après sont strictement identiques. Profils mobile et desktop par défaut avec ralentissement simulé ; scripts Google conservés. Aucun autre test navigateur exécuté pendant les séries Lighthouse. Ce sont des mesures de laboratoire, pas des données terrain CrUX ni une exécution PageSpeed par Google. Le TBT ne mesure pas l’INP.

| Page / profil | Score médian avant → après | LCP (s) | FCP (s) | TBT (ms) | CLS |
|---|---:|---:|---:|---:|---:|

| / / mobile | 95 → 95 | 2.932 → 2.931 | 0.905 → 0.906 | 47.5 → 14.5 | 0 → 0 |

| / / desktop | 100 → 100 | 0.625 → 0.626 | 0.243 → 0.244 | 0.0 → 0.0 | 0 → 0 |

| /voitures-electriques / mobile | 96 → 96 | 2.853 → 2.854 | 0.903 → 0.903 | 48.0 → 13.0 | 0 → 0 |

| /comparer / mobile | 96 → 96 | 2.857 → 2.857 | 0.904 → 0.905 | 10.5 → 7.0 | 0 → 0 |

| /outils/tco-voiture-electrique / mobile | 96 → 96 | 2.858 → 2.857 | 0.905 → 0.905 | 13.5 → 10.0 | 0 → 0 |


Les scores médians sont conservés et le CLS vaut zéro sur les trente passages. L’accessibilité automatisée vaut 100 ; cela n’établit pas une conformité WCAG. Les LCP mobiles restent environ 2,7–2,9 s, au-dessus de l’objectif indicatif de 2,5 s déjà non atteint dans la référence. Les petites variations et la baisse du TBT ne permettent pas d’attribuer un gain de performance aux styles.

**Accueil desktop :** scores avant **100, 99, 100** ; après **100, 100, 94**. Le passage à 94 retient la vidéo comme LCP à **1,643 s**, les deux autres retiennent le poster à environ **0,625 s**. La référence avait elle aussi un passage vidéo à 0,966 s ; le lot 1 avait observé un passage vidéo à 1,736 s. Le Hero, ses assets et son comportement sont inchangés. Cette variabilité reste un risque de mesure et ne permet pas de conclure à une régression causée par le lot. Aucun score uniforme ni amélioration terrain garantis.

**Poids des scripts locaux observés :** médianes des transferts relevés par Lighthouse, hors scripts tiers. Accueil +722 octets ; catalogue +705 ; comparateur +856 ; TCO +507. Les constantes de styles et attributs rendent donc le bilan différent de zéro octet. Aucun nouveau composant client, état, effet, gestionnaire d’interaction ou bibliothèque ; le focus utilise CSS. Ces observations de transfert ne remplacent pas une analyse complète des bundles.

Médianes et plages dans [lighthouse-comparison.json](lighthouse-comparison.json) ; passages/paramètres détaillés dans [before/lighthouse.json](before/lighthouse.json) et [after/lighthouse.json](after/lighthouse.json). Desktop Lighthouse limité à l’accueil, mobile sur les quatre pages représentatives ; responsive desktop contrôlé sur les dix-sept pages.

| Phase | Répétition | Page | Profil | Performance | FCP (ms) | LCP (ms) | CLS | TBT (ms) |
|---|---:|---|---|---:|---:|---:|---:|---:|

| avant | 1 | / | mobile | 95 | 907.2 | 2935.7 | 0 | 57.5 |

| avant | 1 | / | desktop | 100 | 243.4 | 625.2 | 0 | 0.0 |

| avant | 1 | /voitures-electriques | mobile | 96 | 902.7 | 2854.1 | 0 | 57.5 |

| avant | 1 | /comparer | mobile | 96 | 904.0 | 2856.0 | 0 | 44.5 |

| avant | 1 | /outils/tco-voiture-electrique | mobile | 96 | 904.3 | 2706.6 | 0 | 39.5 |

| avant | 2 | / | mobile | 95 | 903.7 | 2930.5 | 0 | 47.5 |

| avant | 2 | / | desktop | 99 | 244.2 | 966.2 | 0 | 0.0 |

| avant | 2 | /voitures-electriques | mobile | 96 | 902.2 | 2853.4 | 0 | 48.0 |

| avant | 2 | /comparer | mobile | 96 | 904.3 | 2856.5 | 0 | 10.0 |

| avant | 2 | /outils/tco-voiture-electrique | mobile | 96 | 905.2 | 2857.8 | 0 | 13.5 |

| avant | 3 | / | mobile | 95 | 904.5 | 2931.9 | 0 | 12.5 |

| avant | 3 | / | desktop | 100 | 243.4 | 625.3 | 0 | 0.0 |

| avant | 3 | /voitures-electriques | mobile | 96 | 902.6 | 2704.0 | 0 | 12.5 |

| avant | 3 | /comparer | mobile | 96 | 905.4 | 2858.1 | 0 | 10.5 |

| avant | 3 | /outils/tco-voiture-electrique | mobile | 96 | 905.0 | 2857.5 | 0 | 12.0 |

| après | 1 | / | mobile | 95 | 906.1 | 2934.2 | 0 | 14.5 |

| après | 1 | / | desktop | 100 | 243.6 | 625.6 | 0 | 0.0 |

| après | 1 | /voitures-electriques | mobile | 96 | 902.9 | 2854.4 | 0 | 13.5 |

| après | 1 | /comparer | mobile | 96 | 903.5 | 2855.3 | 0 | 7.0 |

| après | 1 | /outils/tco-voiture-electrique | mobile | 96 | 904.1 | 2706.2 | 0 | 11.0 |

| après | 2 | / | mobile | 95 | 904.2 | 2931.2 | 0 | 14.5 |

| après | 2 | / | desktop | 100 | 243.5 | 625.3 | 0 | 0.0 |

| après | 2 | /voitures-electriques | mobile | 96 | 902.8 | 2854.3 | 0 | 13.0 |

| après | 2 | /comparer | mobile | 96 | 905.5 | 2858.2 | 0 | 10.5 |

| après | 2 | /outils/tco-voiture-electrique | mobile | 96 | 904.7 | 2857.1 | 0 | 9.0 |

| après | 3 | / | mobile | 96 | 906.0 | 2859.1 | 0 | 11.5 |

| après | 3 | / | desktop | 94 | 243.9 | 1642.7 | 0 | 0.0 |

| après | 3 | /voitures-electriques | mobile | 96 | 903.5 | 2705.2 | 0 | 11.0 |

| après | 3 | /comparer | mobile | 96 | 904.5 | 2856.8 | 0 | 7.0 |

| après | 3 | /outils/tco-voiture-electrique | mobile | 96 | 904.6 | 2856.9 | 0 | 10.0 |


## Risques et contrôles non effectués

- Chrome avec tailles/tactile émulés ; pas d’appareil physique, Safari/Firefox, VoiceOver ou NVDA. Les descriptions et tableaux sont vérifiés dans l’arbre accessible Chrome, sans prétendre à une validation de lecteur d’écran complet.
- Pas d’INP terrain, CrUX ni PageSpeed Google sur le code modifié, qui n’est pas déployé. LCP vidéo/poster variable ; scores locaux non garantis en production.
- Aucune annonce réelle ou dialogue Funding Choices affiché dans le protocole. Réservations et sources sont identiques, mais l’ensemble des états d’une annonce/CMP mobile réelle n’est pas validé. Aucun accès aux comptes GSC/GA4/AdSense/Vercel/Supabase.
- Tests d’intégration DB non lancés : leur setup recrée la base et applique des migrations. La suite unitaire et les parcours locaux avec données de catalogue couvrent la mission sans ce setup.
- Copie vérifiée avec API contrôlée ; permissions système, ancien navigateur et fallback execCommand non exercés. Logique de copie inchangée.
- Les champs et actions plus hauts allongent certains formulaires, et les unités mono ont une largeur différente. Le responsive et les résultats initiaux/fixes sont validés ; toutes les saisies arbitrairement longues ne sont pas exercées.
- Les états HTML disabled/aria-invalid des nouvelles classes sont définis ; aucune nouvelle règle d’erreur métier, aucun message d’erreur de calcul ajouté. Les messages et rôles existants sont conservés.

Aucune régression critique fonctionnelle ou SEO détectée dans les contrôles réalisés. Aucun rollback effectué. La comparaison conserve les modifications préexistantes ; aucune commande Git destructive utilisée.

## Reproduire les contrôles

Les protocoles sont des fichiers texte hors application : [capture.mjs.txt](capture.mjs.txt), [components.mjs.txt](components.mjs.txt), [compare.py.txt](compare.py.txt) et [events.cjs.txt](events.cjs.txt). Ils utilisent les modules Puppeteer/Lighthouse et Chrome déjà présents ; leurs chemins sont propres à cette machine.

Construire puis servir avec `EVEXPERT_DATA_SOURCE=local`, port 3102. Copier les protocoles vers les chemins temporaires utilisés, conserver toutes les références avant une nouvelle capture, puis exécuter :

```sh
node /private/tmp/evexpert-ui-lot2.mjs <phase> http://localhost:3102
node /private/tmp/evexpert-ui-lot2.mjs <phase> http://localhost:3102 --components
node /private/tmp/evexpert-ui-lot2.mjs <phase> http://localhost:3102 --lighthouse
python3 /private/tmp/evexpert-ui-lot2-compare.py
```

Le contrôle `--components` dépend du fichier `/private/tmp/evexpert-lot2-components.mjs`. Les phases intermédiaires utilisent `--calculators` pour isoler les vingt jeux et `--components --actions` pour isoler les trois pages d’actions. Exécuter les captures Chrome séquentiellement et la série Lighthouse seule pour limiter les interférences. La comparaison source s’appuie sur la sauvegarde initiale ; ne jamais appliquer le patch à l’aveugle après de nouveaux travaux.

## Préconisations pour un lot 3 à valider

1. Vérifier les composants harmonisés sur Safari/iPhone et Android réels, ainsi qu’avec VoiceOver/NVDA ; couvrir aides, nombres décimaux, focus, désactivation et barre de sélection avec consentement réel dans un environnement autorisé.
2. Proposer un petit lot de présentation des tableaux catalogue/comparateur et fiches techniques : alignement des valeurs/unités, espacement des lignes et lisibilité mobile. Candidats : `ComparisonTable.tsx`, `ModelOverview.tsx` et `vehicles/SpecTable.tsx`. Préserver données, liens, caption/th, provenance et focus du lot 1.
3. Conserver les primitives partagées par l’accueil, le Hero et la publicité hors de ce lot. Toute extension de périmètre devra être explicitement validée, avec nouvelle référence et mêmes contrôles SEO/calculs.

**Arrêt après le lot 2. Aucun commit, push, déploiement ni implémentation du lot 3.**
