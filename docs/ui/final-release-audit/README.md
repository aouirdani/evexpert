# EVExpert — audit final avant publication

Audit du 10 octobre 2026. Périmètre : version publique [EVExpert.fr](https://www.evexpert.fr/), dépôt local après les lots 0 à 5 et travaux éditoriaux préexistants. **Aucun déploiement effectué.**

## 1. Résumé exécutif

**GO technique avec réserves de validation externe.** Aucun blocage fonctionnel, SEO ou régression de performance reproductible n’est identifié dans les contrôles réalisés. Cette recommandation ne vaut pas autorisation de publication : le déploiement nécessite toujours l’accord explicite du propriétaire.

- **190 routes de référence locales en HTTP 200 : 186 pages HTML et quatre ressources.** Trois pages supplémentaires par rapport au site publié sont attendues ; aucune page publique attendue ne disparaît.
- Les **183 pages HTML communes** conservent leurs titles, descriptions, H1, canonicals, robots, Open Graph et Twitter. Les enrichissements éditoriaux, signatures d’auteur et ajouts de maillage antérieurs sont préservés.
- **58 pages noindex**, **124 URL dans le sitemap**, huit redirections historiques inchangées ; robots.txt et ads.txt identiques au site publié.
- **201 destinations internes**, 1237 occurrences d’ancres : aucun échec HTTP ni fragment manquant dans la version finale.
- **20 jeux de calcul production/local** : saisies, résultats métier et tableaux accessibles identiques.
- **225 observations responsive** avec recouvrements entre protocoles ; aucune ne présente de débordement global aux cinq largeurs.
- **98 passages Lighthouse nouveaux** : 64 production/local, 30 entre deux builds locaux et quatre répétitions supplémentaires de l’article illustré. Aucun CLS mesuré. La comparaison contrôlée confirme des médianes LCP mobiles pratiquement identiques.
- Une seule correction source : ajout de `id="autonomie"` à la section existante « Estimation de l’autonomie réelle ». Aucun texte, lien, titre, configuration ou mécanisme Google modifié par cet audit.

Réserves : annonces réellement remplies, dialogues et choix de consentement réels, comptes GSC/GA4, environnement et base Vercel/Supabase, appareils physiques et autres navigateurs non validés intégralement. Les signalements axe sur certains tableaux éditoriaux ne reproduisent pas de blocage au clavier dans Chrome 154 ; leur compatibilité avec les autres moteurs reste à vérifier.

Synthèse calculée : [audit-summary.json](audit-summary.json).

## 2. Inventaire Git et références

Branche actuelle : `feat/auteur-fiches`, HEAD `30de20396cb748f94c0c9bbce868add8c05d3d9a`. Référence Git locale `main` / `origin/main` : `32652680bf3b5dd6f1418fa00dd10f236cc8f143`. **Le SHA exact du déploiement Vercel n’a pas été obtenu** ; `main` est une référence de code cohérente avec les caractéristiques du site publié, pas un SHA de déploiement certifié. La comparaison SEO principale utilise les réponses réelles de production.

À l’entrée de l’audit : 33 fichiers suivis modifiés par rapport au HEAD, 22 fichiers concernés par les deux commits antérieurs depuis main, soit **49 fichiers suivis distincts** concernés cumulativement. Onze fichiers source/test/configuration non suivis sont également préexistants, ainsi que les rapports et preuves des lots. Le relevé exhaustif inclut les premiers artefacts de cet audit déjà créés au moment de sa capture ; il ne faut pas attribuer tous les fichiers non suivis au travail produit ici.

Les **328 empreintes initiales source/assets/tests/configurations correspondent exactement à la fin du lot 5**. Aucun changement imprévu entre ces références. Les dossiers .git, dépendances, environnements et contenus préexistants ne sont pas nettoyés. Aucun commit, push, reset, checkout, migration ou suppression de fichier préexistant.

| Famille | Changements cumulés attendus |
|---|---|
| Auteur et fiches enrichies, commits antérieurs | `/auteur`, configuration auteur, signatures et Person JSON-LD, textes des 45 modèles, corrections de dix marques, liens vers l’auteur, ajout de l’auteur au sitemap. |
| Expansion éditoriale non publiée | Guide occasion et analyse BYD/MG, sources officielles, six maillages entrants ciblés, mises à jour des hubs/sitemap/RSS par les mécanismes existants. |
| UI lots 1/2 | Débordement du tableau masqué TCO corrigé, vrais tableaux conservés, focus visible, actions tactiles, champs et aides accessibles, styles explicites partagés. |
| UI lot 3 | Présentation catalogue optionnelle, filtres natifs, tableaux et fiches techniques ; nouveaux helpers de présentation et région de défilement. |
| UI lots 4/5 | Styles privés navigation/footer/cartes éditoriales/sommaires et sections d’accueil. Hero inchangé. |
| Audit final | Une ligne JSX pour l’ancre et les documents/preuves de ce dossier. |

Inventaires complets : [Git initial](git-status.txt), [historique](git-history.txt), [inventaire JSON](git-inventory.json), [diff cumulé avec main](diff-main-stat.txt), [empreintes au démarrage](start-source-hashes.json), [fichiers protégés](protected-files.json).

<details>
<summary>Les 49 fichiers suivis concernés cumulativement depuis main</summary>

- `scripts/smoke-routes.mjs`.
- `src/app/auteur/page.tsx`.
- `src/app/comparer/[slug]/page.tsx`.
- `src/app/globals.css`.
- `src/app/page.tsx`.
- `src/app/politique-editoriale/page.tsx`.
- `src/app/sitemap.ts`.
- `src/app/voitures-electriques/[brand]/[model]/[version]/page.tsx`.
- `src/app/voitures-electriques/[brand]/[model]/page.tsx`.
- `src/app/voitures-electriques/[brand]/page.tsx`.
- `src/components/calculators/ChargingCostCalculator.tsx`.
- `src/components/calculators/EvVsPetrolCalculator.tsx`.
- `src/components/calculators/StationPowerCalculator.tsx`.
- `src/components/calculators/TcoCalculator.tsx`.
- `src/components/calculators/ToolPageShell.tsx`.
- `src/components/calculators/TripPlanner.tsx`.
- `src/components/calculators/kit.tsx`.
- `src/components/charts/GroupedBars.tsx`.
- `src/components/comparison/ComparisonBuilder.tsx`.
- `src/components/content/ArticleView.tsx`.
- `src/components/content/Colophon.tsx`.
- `src/components/finder/VehicleFinder.tsx`.
- `src/components/garage/GarageBar.tsx`.
- `src/components/garage/GarageToggle.tsx`.
- `src/components/guides/GuideCardVisual.tsx`.
- `src/components/home/sections.tsx`.
- `src/components/layout/Footer.tsx`.
- `src/components/layout/Header.tsx`.
- `src/components/ui/Field.tsx`.
- `src/components/ui/Prose.tsx`.
- `src/components/vehicles/BrandOverview.tsx`.
- `src/components/vehicles/ModelOverview.tsx`.
- `src/components/vehicles/SpecTable.tsx`.
- `src/components/vehicles/VehicleCard.tsx`.
- `src/components/vehicles/VehicleCostEstimator.tsx`.
- `src/components/vehicles/VehicleDetail.tsx`.
- `src/components/vehicles/VehicleExplorer.tsx`.
- `src/components/vehicles/VehicleRow.tsx`.
- `src/config/author.ts`.
- `src/config/site.ts`.
- `src/data/articles.ts`.
- `src/data/catalog/brand-content.ts`.
- `src/data/catalog/model-content.ts`.
- `src/data/guides/index.ts`.
- `src/data/guides/usage.ts`.
- `src/lib/seo/index.ts`.
- `tests/db/pages.test.ts`.
- `tests/unit/editorial.test.ts`.
- `tests/unit/visuel-articles.test.ts`.

</details>

<details>
<summary>Les onze ajouts source/test/configuration préexistants non suivis</summary>

- `src/components/home/refinements.css`.
- `src/components/layout/refinements.css`.
- `src/components/ui/componentStyles.ts`.
- `src/components/vehicles/DataTableScroll.tsx`.
- `src/components/vehicles/catalogue.css`.
- `src/components/vehicles/catalogueStyles.ts`.
- `src/data/editorial/chinese-vehicles.ts`.
- `src/data/editorial/expansion-sources.ts`.
- `src/data/guides/occasion.ts`.
- `tests/unit/content-expansion.test.ts`.
- `vitest.unit.config.ts`.

</details>

`vitest.unit.config.ts` est un ajout antérieur à cet audit, qui évite le setup DB destructif du script de test par défaut. Les modifications antérieures des fichiers de tests restent intactes. La modification déjà commitée de `src/app/sitemap.ts` ajoute `/auteur` ; elle n’est pas une régression ni une modification faite pendant les lots UI.

## 3. Comparaison production / local

Production interrogée en lecture seule sur le domaine canonique. Version locale : build Next optimisé, `EVEXPERT_DATA_SOURCE=local`, sans accès DB, port 3102. Référence de départ : build lot 5 `WajQJKka_tMABCgXqOdhZ`. Build audité après correction : `mbQ0qhSCv0kei6iYyUxeo` ; le build de clôture est `jBBZbOH88RbawNVaS9Dh0`, consigné dans la validation technique.

| Élément | Production | Local | Interprétation |
|---|---|---|---|
| Pages HTML communes contrôlées | 183, 200 | 183, 200 | Pas de disparition. |
| `/auteur` | 404 | 200 | Ajout antérieur attendu, avec signature liée et Person JSON-LD. |
| `/guides/acheter-voiture-electrique-occasion` | 404 | 200 | Nouvelle page éditoriale légitime, 1 908 mots de prose selon le rapport éditorial. |
| `/blog/voitures-electriques-chinoises-byd-mg` | 404 | 200 | Nouvelle analyse légitime, 2 011 mots de prose selon le rapport éditorial. |
| Sitemap | 121 URL | 124 URL | Uniquement les trois ajouts ci-dessus ; aucune URL retirée. |
| Guides / analyses | 25 / 7 | 26 / 8 | Compteurs, listes et RSS évoluent naturellement avec les ajouts. |
| Catalogue contrôlé | 47 versions | 47 versions | Données rendues et résultats métier cohérents ; pas d’export de la base. |
| Organization JSON-LD / contact | Email public renseigné | Email absent du rendu local | Différence d’environnement existante : source inchangée, variable locale optionnelle non renseignée. Aucun changement de variable effectué. |

Les textes des fiches, l’auteur, les six liens éditoriaux entrants, les compteurs et les listes de hubs ne sont pas traités comme des régressions. Les différences de ressources hachées, classes, balisage de présentation et cache sont attendues avec un nouveau build.

Preuves : [SEO production](production/seo.json), [SEO final local](final/seo.json), [ressources et redirections publiques](production/assets-redirects.json), [ressources et redirections locales](final/assets-redirects.json), [sondes publiques](final/production-probes.json).

## 4. Résultats SEO

Les 190 captures de début et de fin sont identiques pour leurs champs SEO, texte sans scripts, H1/H2/H3, JSON-LD et liens. Le contrôle complémentaire du DOM sémantique couvre les 186 pages HTML : **seule la méthodologie change, par l’identifiant de section autorisé**. La capture SEO des titres ne détecte pas cette différence d’ID de section ; le contrôle DOM séparé la détecte correctement.

| Contrôle | Résultat |
|---|---|
| Titles, descriptions, canonicals, robots, Open Graph, Twitter | Identiques pour toutes les pages HTML communes avec la production. |
| H1 | Une H1 par page locale ; H1 existantes inchangées. Les nouvelles H3 des hubs correspondent aux cartes des deux nouveaux contenus. |
| Indexation | 58 noindex conservés : 43 versions uniques, huit duels, six marques à un modèle, recherche. Quatre versions Tesla restent indexables ; canonicals modèle des versions uniques conservés. |
| Sitemap | 124 URL valides, incluant les trois ajouts ; aucune URL du sitemap publié perdue. Pas de réécriture du mécanisme. |
| Robots | Même contenu servi et même URL de sitemap ; recherche et API toujours exclus de l’exploration. |
| JSON-LD | Syntaxe JSON parsée ; invariants locaux conservés. Écarts avec production expliqués par les signatures Person et enrichissements antérieurs, ainsi que l’email optionnel d’environnement. Aucun avis, prix ou rating artificiel ajouté par l’audit. |
| Nouvelles pages | Canonicals autoréférents HTTPS, index/follow, Article ou BlogPosting et BreadcrumbList, contenus et sources présents dans le HTML serveur. |
| Liens | 201 URL internes contrôlées ; aucun HTTP en échec. Ancres existantes, y compris les renvois autonomie et sommaires, valides. |
| Redirections | Huit règles historiques : mêmes 308 et destinations. Apex HTTPS vers www en 308, HTTP vers HTTPS conservés. |
| 404 | Sept URL inconnues par environnement : HTTP 404 et noindex. Les URL inconnues de marques/modèles/versions rendent une réponse sans H1 dans les deux environnements ; comportement préexistant, à revoir séparément pour l’UX. |
| Rendu | HTML serveur et structure sémantique vérifiés ; recherche SSR, pages catalogue/contenus en SSG/ISR selon les manifestes existants. Pas de conversion en contenu dépendant uniquement du client. |

Aucun accès au compte GSC, aucune preuve de propriété DNS interrogée, aucun test Rich Results Google, aucune confirmation d’indexation effective ou de classement. L’absence de balise HTML de vérification spécifique ne permet pas de conclure à une perte de propriété : les mécanismes du compte n’ont pas été modifiés.

Preuves : [DOM sémantique final](final/semantic-structure.json), [contrôle des liens](final/internal-links.json), [404 locales](final/404.json), [détails HTML et scripts](final/seo-detail.json).

## 5. Résultats fonctionnels et validation technique

| Parcours | Contrôles réalisés |
|---|---|
| Recherche | Formulaire GET au clavier aux cinq largeurs, requête Kona, liens résultats ; recherche sans correspondance aux cinq largeurs. |
| Catalogue | Recherche Kona → une version sur 47 ; filtres fixes, tri, reset, vue tableau ; URL conservée selon le mécanisme de filtres locaux existant. |
| Marques / modèles / versions | Rendu et liens HTTP de toutes les fiches ; cartes Renault/Model 3/versions ; Tab et Entrée sur les liens des tableaux, focus visible sur sept cas. |
| Sélection | Ajout réel par clic/tap et clavier aux cinq largeurs, trois véhicules sélectionnés, 44 autres boutons désactivés, vidage fonctionnel. |
| Comparateur | Trois sélecteurs, URL partagée, navigation vers fiches ; copie du texte exact avec API presse-papiers contrôlée. Le fonctionnement d’un presse-papiers natif sur appareil réel n’est pas certifié. |
| Calculateurs | Huit outils et deux estimateurs véhicules × état initial/saisies fixes : 20 jeux comparés à production. Résultats et tableaux accessibles identiques ; les badges de provenance des cartes similaires sont exclus de la comparaison numérique. |
| Préremplissages / aide au choix | Six presets véhicules, critères et reset du questionnaire, scénarios catalogue fixes et reset : dix scénarios supplémentaires. |
| Guides / blog | Treize filtres éditoriaux au clavier, liens de cartes suivis, sommaires et sidebar contrôlés ; nouveau guide et nouvelle analyse servis intégralement. |
| Menus / footer | `<details>` natifs, ouverture/fermeture, exclusivité menu/recherche, liens et recherche aux cinq largeurs ; footer et bouton cookies conservés. |
| États vides / erreurs | Recherche sans résultat, filtre sans résultat et remises à zéro, sept familles de 404. Les erreurs réseau/Supabase et erreurs serveur forcées ne sont pas injectées. |

Résultats métier : [comparaison détaillée](calculator-comparison.json). Exemple de saisies : TCO A 45 000 €, revente 17 000 €, huit ans et 20 000 km/an ; autonomie 72 kWh, 18 kWh/100 km, 130 km/h et 0 °C ; estimateurs véhicules 20 000 km, domicile 0,25 €/kWh et 60 %. Les hypothèses sont des entrées de test, pas des données de marché. Les vingt jeux et leurs résultats complets sont enregistrés, sans changement des formules.

**Point métier préexistant relevé dans le code :** `ChargingTimeCalculator` préremplit la batterie et affiche `acLimit`, mais transmet seulement `power` au calcul. Choisir une borne AC 22 kW après un modèle limité à 11 kW ne plafonne donc pas la puissance dans cette formule, alors que l’avertissement rappelle cette limite et que `StationPowerCalculator` applique bien `Math.min`. Le calcul affiché reste annoncé comme théorique ; cette incohérence peut néanmoins sous-estimer la durée AC dans ce scénario. Source identique à main, aucun changement des lots UI. Il s’agit d’un constat de code, pas d’un scénario supplémentaire exécuté pendant cet audit. Correction à autoriser séparément, avec test de l’invariant 11/22 kW pour un chargeur AC limité à 11 kW et distinction AC/DC. L’égalité production/local des jeux fixes ne certifie pas l’absence de défauts métier préexistants.

Validation technique : `npm run lint`, `npm run typecheck`, `npm test -- --config vitest.unit.config.ts`, `EVEXPERT_DATA_SOURCE=local npm run build`, `git diff --check`. **Clôture : lint OK, TypeScript OK, 160 tests / 15 fichiers OK, build OK (192 entrées générées), git diff --check OK.** Les détails sont dans [technical-validation.json](technical-validation.json).

Tests : **160 tests unitaires, 15 fichiers**, couvrant calculateurs/coûts/trajet, choix véhicule, données légères et cartes, sélecteurs/indexation, URL de comparaison, éditorial, sources/expansion, configuration analytics, garde-fous AdSense, validation/import. **Tests DB et `/api/health` non exécutés** : le setup DB par défaut recrée/migre la base, et le health endpoint peut déclencher `select 1`.

Le build a d’abord échoué dans le bac à sable lors de la récupération Google Fonts ; il réussit avec l’accès réseau autorisé. Le build isolé de référence a initialement refusé un lien symbolique node_modules hors racine Turbopack ; une copie identique des dépendances existantes a permis sa construction, sans installation ni changement de configuration. Ces deux incidents de protocole ne sont pas des échecs du build final.

Les avertissements déjà connus sur la racine déduite de Next et les en-têtes Cache-Control personnalisés sont conservés ; aucune configuration n’a été changée pour les faire disparaître.

## 6. AdSense, consentement et intégrations Google

**Validation de code et de réservations ; validation complète des annonces et choix de consentement non obtenue.**

- Script, balise propriétaire et ads.txt conformes sur les **124 pages du sitemap local**, via le script existant. Dix pages publiques représentatives contrôlées aussi : aucune duplication détectée.
- Les sources layout, Analytics, configuration analytics, consent-script, AdSlot, robots, dépendances et next.config sont identiques à main. `.env.local` correspond à sa sauvegarde du lot 5 ; valeurs non recopiées dans ce rapport.
- Réservations, attributs et dimensions capturés dans les protocoles responsive ; références de début identiques à la fin du lot 5. Aucun emplacement ni règle publicitaire déplacé ou modifié par l’audit. Les différences de hauteur dues aux contenus éditoriaux non publiés sont attendues.
- En production, les scripts Funding Choices sont chargés, `googlefc` et `__tcfapi` sont présents. Le consentement par défaut observé refuse ad_storage, ad_user_data, ad_personalization et analytics_storage.
- Après activation du bouton « Gérer mes cookies », **aucun dialogue exploitable n’est apparu** dans le profil testé. Les tests d’API contrôlée prouvent seulement que le callback de révocation est transmis ; ils ne prouvent pas l’exécution de vrais choix Google.
- Les nœuds d’annonces observés sont de taille nulle ou non remplis. Absence de collision dans cet état ; **une annonce effectivement remplie, les auto-ads, acceptation/refus/révocation réels et les événements GA4 reçus dans le compte restent non vérifiés**.

Preuves : [observation consentement](final/consent-observation.json), [activation du contrôle cookies et vérifications visuelles](final/visual-verification.json), [API contrôlée](final/consent-control.json), [fichiers protégés](protected-files.json). Captures : [production cookies](final/production-cookie-control-390.jpg), [local cookies](final/local-cookie-control-390.jpg).

## 7. Lighthouse et performances

Mesures **de laboratoire** exécutées sur cette machine, Chrome **154.0.8037.98**, Lighthouse **12.8.2** déjà installés. Aucun npm install/update. Cache navigateur réinitialisé par Lighthouse ; scripts Google actifs ; passages successifs et origines alternées, sans build ni autres tests navigateur pendant les mesures.

Profils identiques : mobile 412 × 823, DPR 1,75, ralentissement CPU ×4, réseau simulé 1 638,4 kbit/s et RTT 150 ms ; desktop 1 350 × 940, DPR 1, CPU ×1, 10 240 kbit/s et RTT 40 ms. **TBT est une mesure de laboratoire ; ce n’est pas INP.** Pas de données terrain CrUX, de mesures INP ni d’exécution PageSpeed sur les serveurs Google.

### Comparaison réelle production → build final local

Médianes pour les groupes répétés. « n = 1 » signifie un passage exploratoire, pas une médiane robuste. Article mobile : trois passages par origine après deux répétitions complémentaires.

| Page | Profil | n prod / local | Score | LCP (s) | FCP (s) | CLS | TBT (ms) |
|---|---|---:|---:|---:|---:|---:|---:|
| Accueil | mobile | 3 / 3 | 98 → 95 | 2.342 → 2.932 | 0.956 → 0.905 | 0.000 → 0.000 | 56.0 → 13.0 |
| Accueil | desktop | 3 / 3 | 98 → 94 | 1.194 → 1.655 | 0.271 → 0.244 | 0.000 → 0.000 | 0.0 → 0.0 |
| Catalogue | mobile | 3 / 3 | 98 → 96 | 2.267 → 2.855 | 0.959 → 0.903 | 0.000 → 0.000 | 59.0 → 11.5 |
| Catalogue | desktop | 3 / 3 | 100 → 100 | 0.457 → 0.605 | 0.258 → 0.244 | 0.000 → 0.000 | 0.0 → 0.0 |
| Comparateur | mobile | 3 / 3 | 99 → 96 | 2.120 → 2.857 | 0.946 → 0.905 | 0.000 → 0.000 | 63.5 → 9.5 |
| Comparateur | desktop | 3 / 3 | 100 → 100 | 0.657 → 0.607 | 0.565 → 0.244 | 0.000 → 0.000 | 0.0 → 0.0 |
| TCO | mobile | 3 / 3 | 99 → 96 | 2.117 → 2.858 | 0.950 → 0.905 | 0.000 → 0.000 | 57.5 → 11.0 |
| TCO | desktop | 3 / 3 | 100 → 100 | 0.458 → 0.606 | 0.269 → 0.244 | 0.000 → 0.000 | 0.0 → 0.0 |
| Renault | mobile | 1 / 1 | 99 → 96 | 2.116 → 2.858 | 0.947 → 0.905 | 0.000 → 0.000 | 54.5 → 10.0 |
| Renault | desktop | 1 / 1 | 100 → 100 | 0.458 → 0.606 | 0.268 → 0.244 | 0.000 → 0.000 | 0.0 → 0.0 |
| Model 3 | mobile | 1 / 1 | 99 → 96 | 2.116 → 2.858 | 0.946 → 0.905 | 0.000 → 0.000 | 66.5 → 12.5 |
| Model 3 | desktop | 1 / 1 | 100 → 100 | 0.456 → 0.607 | 0.268 → 0.244 | 0.000 → 0.000 | 0.0 → 0.0 |
| Guide temps de recharge | mobile | 1 / 1 | 99 → 95 | 1.968 → 2.932 | 0.949 → 0.905 | 0.000 → 0.000 | 55.5 → 9.0 |
| Guide temps de recharge | desktop | 1 / 1 | 100 → 100 | 0.457 → 0.625 | 0.266 → 0.244 | 0.000 → 0.000 | 0.0 → 0.0 |
| Article LFP/NMC | mobile | 3 / 3 | 99 → 95 | 2.117 → 2.934 | 0.944 → 0.906 | 0.000 → 0.000 | 52.0 → 11.0 |
| Article LFP/NMC | desktop | 1 / 1 | 100 → 100 | 0.457 → 0.626 | 0.268 → 0.244 | 0.000 → 0.000 | 0.0 → 0.0 |

Les origines diffèrent : HTTP/1.1 local / HTTP/2 Vercel, compression, caches serveur/images/CDN, scripts et réponses tiers, environnement public et taille HTML liée aux travaux éditoriaux. Les transferts locaux ne doivent pas être lus comme la taille exacte future sur Vercel. Exemple du premier accueil mobile : LCP observé sans simulation de 60 ms local et 168 ms public, mais LCP simulé 2,935 s local et 2,264 s public ; cela illustre la limite d’une attribution directe à l’UI.

### Comparaison contrôlée : main et version finale, tous deux en local

Référence `32652680bf3b5dd6f1418fa00dd10f236cc8f143` exportée en lecture seule dans un dossier temporaire. Même Next/Turbopack, mêmes dépendances copiées, mêmes variables locales, catalogue local, profils et machine ; serveurs 3103 et 3102. Trois passages par page/profil ci-dessous, ordres alternés. Le SHA déployé reste non certifié. Le premier serveur de référence avait un cache d’image nouvellement créé ; la variation du premier passage est conservée dans les résultats, pas supprimée.

| Page | Profil | Score main → final | LCP (ms) | Écart LCP (ms) | FCP (ms) | CLS | TBT (ms) |
|---|---|---:|---:|---:|---:|---:|---:|
| Accueil | mobile | 95 → 95 | 2932.66 → 2934.10 | +1.44 | 905.61 → 906.06 | 0 → 0 | 12.0 → 10.5 |
| Accueil | desktop | 100 → 100 | 700.51 → 625.09 | -75.42 | 244.40 → 243.34 | 0 → 0 | 0.0 → 0.0 |
| Catalogue | mobile | 96 → 96 | 2854.90 → 2854.21 | -0.69 | 904.00 → 902.76 | 0 → 0 | 8.5 → 7.0 |
| Comparateur | mobile | 96 → 96 | 2857.63 → 2856.38 | -1.25 | 905.06 → 904.25 | 0 → 0 | 6.5 → 11.0 |
| TCO | mobile | 96 → 96 | 2858.05 → 2857.63 | -0.42 | 905.34 → 905.08 | 0 → 0 | 9.0 → 10.5 |

**Conclusion : aucune dégradation LCP reproductible imputable aux lots UI n’est démontrée.** Les médianes mobiles sont quasi identiques, scores identiques et CLS nul. Les médianes desktop du Hero dépendent du mélange poster/vidéo ; les cohortes sont séparées dans [performance-summary.json](performance-summary.json). Aucun gain garanti n’est revendiqué.

Éléments LCP : H1 accueil mobile ; poster ou vidéo accueil desktop ; paragraphe d’introduction catalogue/comparateur/TCO mobile et H1 desktop ; pages marque/modèle principalement leurs blocs d’en-tête ; illustration de l’article LFP/NMC mobile. Le premier article mobile public à 87 / 4,057 s a été répété : les deux suivants sont à 99 / 1,977 s et 99 / 2,117 s ; médiane publique 99 / 2,117 s, contre 95 / 2,934 s en local. Aucun gain ni régression causale n’est déduit de ces origines différentes.

### Ressources transférées, médianes mobile, production → local

CSS et JS applicatifs de première origine séparés des scripts Google. Valeurs en KiB ; les différences de compression/en-têtes sont comprises dans le transfert.

| Page | CSS | JS applicatif | Polices |
|---|---:|---:|---:|
| Accueil | 12.13 → 14.76 | 187.91 → 188.65 | 65.88 → 66.71 |
| Catalogue | 12.13 → 14.76 | 188.41 → 189.34 | 65.85 → 66.71 |
| Comparateur | 12.27 → 14.76 | 185.29 → 185.59 | 65.83 → 66.71 |
| TCO | 12.15 → 14.76 | 184.51 → 184.38 | 65.81 → 66.71 |
| Renault | 12.13 → 14.76 | 187.12 → 183.03 | 65.97 → 66.71 |
| Model 3 | 12.14 → 14.76 | 187.29 → 188.47 | 65.82 → 66.71 |
| Guide temps de recharge | 12.14 → 14.76 | 187.29 → 186.44 | 65.82 → 66.71 |
| Article LFP/NMC | 12.13 → 14.76 | 187.01 → 186.36 | 65.87 → 66.71 |

CSS brut : main isolé **59 563 octets**, final **74 531 octets**, soit +14 968 octets cumulés depuis main. La référence du lot 5 et le build audité ont exactement la même CSS, SHA-256 `0b79b6c5293d1390b77ff0ae3dce0d284f0d850ea3646b7987d2f9713de94675`. Pas de CSS supplémentaire due à l’ancre. Les **16 fichiers woff2** sont identiques entre les builds contrôlés. Aucun nouveau hook, bibliothèque, script externe ou asset Hero ajouté par cet audit.

Hero : sources Hero/HeroVideo identiques à main, vidéo **663 447 octets**, image d’attente **781 661 octets**, image OG **23 110 octets** ; mêmes SHA-256 public/local. `preload=none`, lecture déclenchée 300 ms après load à partir de 1 024 px sans mouvement réduit ; source absente sur mobile/mouvement réduit selon le mécanisme existant ; pause/reprise testées. Aucun changement conservé du Hero pendant le lot 5 ou cet audit.

Le LCP simulé local mobile reste autour de 2,85–2,93 s, au-dessus de l’objectif indicatif 2,5 s. Cela constitue un objectif de suivi terrain, pas une régression attribuée aux retouches. Aucun score 90+ ni seuil de Core Web Vitals terrain n’est garanti.

Données brutes : [64 passages publics/locaux](performance/runs.json), [30 passages contrôlés](controlled-performance/runs.json), [quatre répétitions article](article-repeat/runs.json). Chaque passage conserve son rapport Lighthouse complet. Comparaisons historiques des lots : [lot 3](../lot-3/README.md), [lot 4](../lot-4/README.md), [lot 5](../lot-5/README.md).

## 8. Responsive, clavier, accessibilité et captures

Largeurs **320, 390, 768, 1 024 et 1 440 px**, Chrome émulé ; **aucun appareil physique testé**. Protocoles : 85 cas généraux sur 17 pages, 65 cas composants/formulaires sur 13 pages, 40 cas navigation/éditorial sur huit pages et 35 cas complémentaires sur sept pages. Les familles se recouvrent ; les 225 observations ne représentent pas 225 pages différentes.

Aucun débordement global. Document TCO de largeur exactement égale au viewport à 320/390, vrais tableaux conservés dans l’arbre d’accessibilité. Pas de troncature de marque/version constatée dans les contrôles des cartes ; à 320/390 les unités doublées dans le DOM pour les variantes responsive ont une seule représentation visible, confirmé par les styles calculés.

Focus visible : liens catalogue/multiversions, menus, filtres, champs, choix, copie, cartes éditoriales. Les contrôles tactiles fréquents conservent les dimensions améliorées des lots précédents. Les aides de champs sont reliées par aria-describedby ; descriptions retrouvées dans l’arbre d’accessibilité.

Axe : aucun signal sur catalogue, comparateur, TCO aux deux largeurs contrôlées ni sur le hub Guides. **Règle scrollable-region-focusable signalée** sur le premier tableau occasion à 390/1 440 et trois tableaux BYD/MG à 390. Vérification indépendante par vrai clavier : les cinq cas sont atteints par Tab, ont un contour de 2 px et défilent avec ArrowRight, respectivement de 240, 240, 96, 107 et 239 px. La capacité native de Chrome 154 contredit donc le blocage supposé par ce signal automatisé dans cet environnement. **Safari/Firefox, lecteurs d’écran et cette compatibilité native restent non vérifiés.** Aucun signal n’a été masqué ou exclu ; aucune conformité WCAG complète revendiquée. Les contrôles de contraste incomplets d’axe restent documentés dans les résultats bruts.

Les captures d’accueil/catalogue, TCO, nouvelles pages et menus ont été examinées, avec comparaison des géométries et données. Les captures pleine page longues complètent les vérifications de viewport ; elles ne prouvent pas seules une lecture confortable ni une annonce réellement remplie. Captures vidéo non comparables pixel par pixel.

| Vue | Production / référence | Local final |
|---|---|---|
| Accueil 390 | [public](final/production-home-390.jpg) | [local](final/local-home-390.jpg) |
| Accueil 1440 | [public](final/production-home-1440.jpg) | [local](final/local-home-1440.jpg) |
| Catalogue 390 | [public](final/production-catalogue-390.jpg) | [local](final/local-catalogue-390.jpg) |
| Catalogue 1440 | [public](final/production-catalogue-1440.jpg) | [local](final/local-catalogue-1440.jpg) |
| Catalogue 320 | [référence lot 5](../lot-5/after/voitures-electriques-320.jpg) | [contrôle actuel](initial/voitures-electriques-320.jpg) |
| TCO 390 | [référence lot 5](../lot-5/after/tco-voiture-electrique-390.jpg) | [contrôle actuel](initial/tco-voiture-electrique-390.jpg) |
| Nouveau guide 390 | Nouvelle page non publiée | [capture](final/_guides_acheter-voiture-electrique-occasion-390.jpg) |
| Nouvelle analyse 1440 | Nouvelle page non publiée | [capture](final/_blog_voitures-electriques-chinoises-byd-mg-1440.jpg) |

Preuves : [géométries générales](initial/geometry.json), [composants et scénarios](final/components.json), [navigation](final/navigation-geometry.json), [cas complémentaires](final/additional-responsive.json), [axe](final/accessibility.json), [Tab/flèches des tableaux](final/keyboard-tables.json), [focus et interactions](initial/interactions.json).

## 9. Correction effectuée et intégrité des travaux

**Une seule ligne de source modifiée pendant cet audit : `src/components/ui/Prose.tsx`.** La section correspondant exactement à « Estimation de l’autonomie réelle » reçoit l’identifiant HTML `autonomie`. Cette chaîne de heading ne se trouve que dans la méthodologie dans les données du dépôt. Son ancien ID de H2 et les liens du sommaire sont conservés.

Le test de navigation directe `/methodologie#autonomie` retrouve SECTION et son H2 à 390 et 1 440, aux positions hautes 71,92 et 80,25 px. Le crawl final ne trouve plus les 90 références manquantes historiques. Le hash du DOM de toutes les autres pages reste identique à la référence du lot 5.

Aucun changement éditorial, de données/formules, URL, metadata, canonical, JSON-LD, robots, sitemap, configuration, intégration Google, source Hero ou ordre des sections. Les sauvegardes et artefacts temporaires ne remplacent aucun travail préexistant. Vérification de clôture : [source-integrity.json](source-integrity.json), [empreintes initiales](start-source-hashes.json), [build et ressources](build-integrity.json).

## 10. Risques restants

| Classe | Risque / limite | Évidence et suite adaptée |
|---|---|---|
| Bloquant | Aucun blocage confirmé dans le périmètre testé. | Pas de route attendue perdue, metadata critiques conservées, résultats métier égaux, tests/build réussis, performance contrôlée stable. |
| Important | Puissance AC du simulateur temps de recharge après préremplissage véhicule. | Constat source préexistant : limite rappelée mais non appliquée dans le calcul à 22 kW. Les outils de comparaison de bornes plafonnent correctement. Traiter dans un lot métier distinct, sans modification de formule ici. |
| Important | Objectif LCP mobile terrain et variabilité du Hero desktop. | Scores locaux élevés mais LCP simulé mobile ~2,9 s ; vidéo/poster alternent. Conserver la stratégie actuelle et vérifier le déploiement autorisé dans les mêmes profils, puis les données terrain disponibles. |
| Non vérifié | Tables éditoriales sur moteurs autres que Chrome 154. | Signal axe conservé, Tab/flèches/focus réellement fonctionnels sous Chrome. Test Safari/Firefox et lecteur d’écran recommandé ; harmonisation future à examiner si nécessaire, sans modification dans cet audit. |
| Non vérifié | Annonces remplies et CMP réelle : accepter/refuser/révoquer. | Scripts et API présents en production mais pas de dialogue exploitable ; annonces vides. Revue humaine sur domaine public nécessaire pour une validation complète, sans changer les réglages. |
| Non vérifié | Comptes GSC/GA4, indexation effective, SHA et environnement exacts Vercel, base Supabase. | Aucun accès authentifié, aucune requête DB. Les sorties publiques et sources protégées passent ; conserver les variables existantes de production. |
| Non vérifié | Appareils physiques, Safari/Firefox, lecteur d’écran, CrUX/INP. | Émulation Chrome et tests de laboratoire seulement ; le score automatisé n’est pas une certification. |
| Mineur | Corps des 404 inconnues catalogue et journaux NoFallbackError. | Même comportement public/local, 404 et noindex corrects. Amélioration de la présentation d’erreur à traiter séparément. |
| Mineur | CSS partagée cumulée plus volumineuse. | +14 968 octets bruts depuis main ; hausse de transfert observée ~2,6 KiB public/local. Médianes contrôlées stables ; ne pas ajouter de styles/dependances pour ce release. |
| Mineur | Avertissements Next sur racine et Cache-Control. | Préexistants ; build final réussi. Aucun changement de configuration dans l’audit. |

## 11. Recommandation GO / NO-GO

**GO technique avec les réserves ci-dessus explicitement conservées.** Les contrôles ne justifient ni une nouvelle refonte, ni un retour arrière des lots UI ou des travaux éditoriaux. La différence LCP publique/locale n’établit pas de régression : la comparaison des deux builds locaux conserve les médianes et les scores.

Avant autorisation de publication, faire la revue humaine des captures et des réserves, notamment les vrais messages Funding Choices/annonces, les tableaux sur les navigateurs visés et le défaut métier préexistant du simulateur AC. Si un défaut critique réel apparaît lors de cette revue, **NO-GO** jusqu’à un correctif séparément autorisé et validé. Le signal axe seul n’est pas assimilé à un blocage reproduit sous Chrome.

Lors d’un futur déploiement explicitement autorisé : préserver l’environnement Vercel existant, publier l’ensemble validé incluant les trois ajouts légitimes, puis contrôler immédiatement ces URL, les canonicals/noindex, sitemap/robots, la CMP/annonces et les huit redirections. Répéter les pages stratégiques Lighthouse dans les mêmes conditions, et suivre GSC/CrUX dès que des données suffisantes sont disponibles. Ces étapes sont recommandées, **pas réalisées** par cet audit.

Arrêt après remise du rapport. Aucun commit, push ou déploiement.
