# EVExpert — UI/UX lot 3 : catalogue et tableaux

Le lot 3 modernise la présentation du catalogue et des composants partagés avec les marques et fiches, dans la direction EVExpert Signature. Noms complets, métriques, provenance, sélection, filtres et tableaux sémantiques conservés. La présentation de l’accueil reste celle des lots précédents.

Aucune dépendance installée, configuration modifiée, opération DB, migration, commit, push ou publication. Les travaux préexistants sont conservés. Arrêt après le lot 3.

## Référence et audit initial

Les rapports [lots 0/1](../lot-0-1/README.md), [référence](../lot-0-1/REFERENCE.md) et [lot 2](../lot-2/README.md) ont été consultés avant intervention. [Cartographie ciblée](MAPPING.md).

Les **321 empreintes initiales correspondent exactement à la fin du lot 2**. [Statut initial](start-status.txt), [empreintes](start-source-hashes.json), sauvegarde des fichiers actuels dans `/private/tmp/evexpert-lot-3-originals/`. Le [patch du lot 3](lot-3.patch) compare cette sauvegarde aux fichiers finaux, jamais au HEAD Git contenant les travaux antérieurs.

Référence fraîche avant toute modification des sources : build de production, catalogue local forcé, serveur `http://localhost:3102`, Chrome 154.0.8037.98 et Lighthouse 12.8.2 déjà disponibles. Aucun accès DB requis. 47 versions, 22 marques, 45 modèles dans ce catalogue de test.

Constats vérifiés :

- VehicleCard, VehicleRow et VehicleRowsHead servent aussi à l’accueil : conserver leurs défauts et activer explicitement la nouvelle présentation des cartes ailleurs.
- La carte compacte partage peu de largeur entre identité et métriques sur mobile. Les corrections de noms complets du lot 1 sont déjà présentes ; aucune nouvelle ellipse à introduire.
- Les filtres sont locaux, avec huit états existants et cinq tris. Ils ne modifient pas l’URL. La recherche n’entre pas dans le compteur des quatre filtres ; reset conserve le tri et la vue. Conserver ces règles.
- Les tableaux marques/modèles ont déjà captions, entêtes et cellules HTML, overflow local et légendes de provenance. Leur défilement manque d’indication et de région explicitement nommée/focalisable.
- SpecTable est une **liste dl/dt/dd**, dont les données absentes sont omises selon une règle existante. Conserver cette sémantique et cette règle.
- GarageToggle, RangeBar, Field, DataBadge et les styles d’actions du lot 2 sont réutilisés sans modification de leurs défauts. Comparateur, aide au choix, outils, données, calculs et pages éditoriales hors modification.

## Fichiers du lot

Huit fichiers existants modifiés et trois fichiers de présentation ajoutés :

| Fichier | Changement |
|---|---|
| `src/components/vehicles/VehicleCard.tsx` | Variante optionnelle `presentation="catalogue"`, identité sur toute la largeur, métriques organisées, badge existant Calcul EVExpert pour la consommation calculée. Défaut d’accueil conservé. |
| `src/components/vehicles/VehicleExplorer.tsx` | Surfaces et états actifs, panneau sticky avec défilement natif, toolbar/tri et état vide harmonisés ; cadre de tableau. |
| `src/components/vehicles/BrandOverview.tsx` | Cadre de tableau et style secondaire des valeurs DC/temps absentes. |
| `src/components/vehicles/ModelOverview.tsx` | Même cadre, mêmes valeurs absentes ; cartes similaires en présentation catalogue. |
| `src/components/vehicles/SpecTable.tsx` | Panneau clair, valeurs sous les libellés sur mobile, deux colonnes dès 640 px ; notes, badges et filtrage des absences inchangés. |
| `src/components/vehicles/VehicleDetail.tsx` | Active uniquement la variante des cartes similaires ; tableaux de recharge/usage et estimateur inchangés. |
| `src/app/voitures-electriques/[brand]/page.tsx` | Active uniquement la variante sur les marques utilisant des cartes ; metadata et logique de route inchangées. |
| `src/app/globals.css` | **Un seul import de styles privés préfixés**. Toutes les règles, tokens, polices et valeurs préexistantes restent identiques. Nécessité performance expliquée ci-dessous. |
| `src/components/vehicles/catalogue.css` — ajout | Styles limités aux classes `evx-catalogue-*` ; aucun sélecteur global de remplacement. |
| `src/components/vehicles/catalogueStyles.ts` — ajout | Correspondance statique entre noms de présentation et classes privées ; aucun état/événement. |
| `src/components/vehicles/DataTableScroll.tsx` — ajout | Cadre natif nommé, description de défilement, tabindex et focus ; conserve le véritable tableau enfant. Aucun hook/gestionnaire de défilement. |

313 des 321 fichiers préexistants capturés restent intacts ; trois fichiers sont ajoutés. [Liste exacte](files-changed.json), [comparaison](comparison.json). Les rapports et protocoles ajoutés sont uniquement dans ce dossier. Aucun test ni fichier de configuration modifié dans ce lot.

## Évolutions visuelles et accessibilité

Palette inchangée : papier `#F3F6FC`, encre `#071A3A`, cobalt `#1448C8`, volt `#C8FF2E`. Schibsted Grotesk et IBM Plex Mono conservées.

| Élément | Présentation finale |
|---|---|
| Cartes | Surface blanche, filet line de 1 px, rayon 8 px, padding 20 px. Brand/model/version complets, autonomie cobalt dans un encart papier. Batterie/DC lisibles ; consommation et temps déjà présents sur desktop rendus visibles sur mobile. |
| Provenance | Badge existant Calcul EVExpert uniquement pour `batterie utile ÷ WLTP × 100`. Aucune caractéristique requalifiée en donnée officielle ou estimée. Sources/légendes existantes conservées. |
| Absences | Carte : tiret visuel et texte accessible Non disponible conservés. Tableaux : textes Non disponible conservés, DC/temps absents en typographie secondaire. Aucun remplacement par zéro. |
| Filtres | Panneau blanc, contrôles confortables du lot 2, bordure/fond pour les critères actifs. Accès sticky mobile, même bouton et même aria-expanded/controls. Hauteur maximale `calc(100dvh - var(--header-h) - 7rem)` avec overflow vertical natif ; réserve pour la barre de sélection. |
| Tri / vide | Toolbar sur surface bordée ; retour à la ligne sur petit écran. Message et action de reset existants dans un panneau distinct. |
| Tableaux | Entêtes mono 12 px sur papier, padding 14/16 px, chiffres tabulaires et unités gardées ensemble, lignes à filets, hover/focus-within discrets. Identités en retours à la ligne, colonne initiale au moins 12 rem. |
| Défilement | Région nommée, Tab puis flèches natives, outline cobalt de 2 px à l’intérieur. Indication visible dans les panneaux étroits ; container query la masque dès 64 rem de largeur de panneau. |
| Toucher et focus | Cibles Garage 44 × 44 px, champs/filtres 48 px, curseurs/actions 44 px conservés. Véritables liens et pseudo-focus de lignes du lot 1 gardés. |

Les cartes mobiles sont plus hautes pour afficher les informations supplémentaires déjà disponibles. Cette densité est un choix de présentation à vérifier humainement sur les captures ; aucune donnée n’est raccourcie ni supprimée.

## Captures avant/après

51 JPEG avant et 51 après, mêmes pages/largeurs. [Avant](before/) et [après](after/).

- Catalogue 390 px : [avant](before/catalogue--voitures-electriques-390.jpg), [après](after/catalogue--voitures-electriques-390.jpg).
- Catalogue 1440 px : [avant](before/catalogue--voitures-electriques-1440.jpg), [après](after/catalogue--voitures-electriques-1440.jpg).
- Filtres ouverts 320 px : [avant](before/filters-320.jpg), [après](after/filters-320.jpg).
- Tableau modèle 320 px : [avant](before/catalogue--voitures-electriques-tesla-model-3-320.jpg), [après](after/catalogue--voitures-electriques-tesla-model-3-320.jpg).
- Vue tableau catalogue : [avant](before/catalogue-table-1440.jpg), [après](after/catalogue-table-1440.jpg).
- Fiche à nom long : [avant](before/catalogue--voitures-electriques-citroen-e-c3-aircross-320.jpg), [après](after/catalogue--voitures-electriques-citroen-e-c3-aircross-320.jpg).
- Accueil 1440 px : [avant](before/home-1440.jpg), [après](after/home-1440.jpg).

Inspection visuelle des cartes, du tableau mobile, des filtres et de leurs états : noms complets, chiffres/unités lisibles, focus et défilement visibles. Le cadrage du tableau après inclut son nouveau cadre et l’indication ; les captures vidéo ne sont pas des comparaisons de pixels reproductibles image par image.

## Validation finale

| Contrôle | Résultat |
|---|---|
| Lint / TypeScript | `npm run lint` et `npm run typecheck` OK. |
| Tests unitaires | `npm test -- --config vitest.unit.config.ts` : **160 tests, 15 fichiers**, tous réussis. Configuration préexistante sans globalSetup DB ; aucun test DB destructif lancé. |
| Build | `EVEXPERT_DATA_SOURCE=local npm run build` OK, 192 entrées statiques comme avant, mécanismes SSR/SSG/ISR conservés. |
| Responsive général | 17 pages × 5 largeurs = 85 cas, document = viewport, dont TCO 320/390 px. |
| Catalogue/fiches ciblés | 6 pages × 5 largeurs = 30 cas, aucun débordement global ni nom/métrique de carte tronqué ; sélection ≥44 px. |
| Couverture unique | 19 pages, 95 couples page/largeur uniques dans les 115 observations ; 320, 390, 768, 1024 et 1440 px. |
| Filtres / cinq tris | 13 scénarios, listes ordonnées, valeurs, comptes et URLs strictement identiques avant/après. Recherche Kona, espaces/accents, marque + carrosserie + seuils, état vide, reset conservant le tri. |
| Logique / événements | 13 déclarations état/mémo/filtrage/tri/reset et 12 événements JSX inchangés, contrôlés par AST. |
| Tableaux | Captions, entêtes scope, lignes, cellules et textes exacts ; mêmes 47 versions en vue tableau desktop. 15 cas d’arbre accessible, régions nommées et défilement au clavier. |
| Navigation | Sept liens atteints par Tab avec le même href et focus étiré de 2 px ; Entrée suit le lien HTML. |
| Sélection / comparateur | Limite de trois véhicules, 44 autres désactivés, vidage, lien partagé, copie clavier et cibles ≥44 px préservés aux cinq largeurs. |
| Panneau sur écran court | Six essais après défilement à la 11e carte : 320/390/768 px × 640/900 px, trois véhicules sélectionnés. Ouverture/reset/fermeture visibles ; scroll natif du panneau, aucun chevauchement de la barre. |
| Calculs | Huit outils et deux estimateurs × défaut/fixe = **20 jeux identiques**, entrées/résultats/tableaux/texte préexistant. |
| Erreurs JS / diff | Aucune pageerror finale ; `git diff --check` OK. |
| Axe ciblé | Aucune violation dans le diagnostic final WCAG 2 A/AA et 2.1 AA du catalogue ; ne constitue pas une certification WCAG. |

[33 assertions](comparison.json), [commandes techniques](technical-validation.json), [événements](event-validation.json), [logique filtres](filter-logic-validation.json), [arbre accessible](after/accessibility.json), [écrans courts](after/deep-filters.json), [diagnostic](after/diagnostics.json).

Les cas fixes sont décrits dans les protocoles copiés en `.txt` dans ce dossier ; aucune dépendance ajoutée. La copie utilise une API presse-papiers contrôlée afin de vérifier l’URL exacte ; permission du presse-papiers système non testée.

### Corrections faites pendant la validation

- Une première variante du panneau désactivait sticky à l’ouverture : un test après défilement profond a montré le panneau hors écran. Corrigé en gardant sticky et en permettant son défilement natif ; six cas finaux passent. Diagnostic intermédiaire conservé dans [components/deep-filters.json](components/deep-filters.json).
- La transparence de l’utilitaire unit sur le nouvel encart cobalt donnait un contraste de **3,37:1** pour km et une accessibilité Lighthouse de 96. Couleur remplacée uniquement dans ce nouvel encart par le token muted ; diagnostic final sans violation, Lighthouse final 100.
- Une feuille CSS module séparée entraînait un FCP environ **150 ms** plus lent sur mobile et 39 ms sur desktop. Remplacée par des styles privés préfixés importés dans la feuille existante : une seule requête stylesheet observée, FCP final revenu au niveau de référence. `globals.css` ne diffère que par cet import. [Mesures intermédiaires](performance-modules/lighthouse.json), [diagnostic initial](performance-modules/diagnostics.json).

Les essais intermédiaires dans `components/`, `panels/` et `performance-modules/` ne sont pas les résultats finaux. Les séries finales ont été relancées après les corrections. Les attentes/clics du protocole positionnent le bouton de vue au centre par défilement instantané pour éviter la couverture par le header pendant un scroll animé.

## SEO, accueil et intégrations

Les **190 routes** de référence sont préservées : 186 pages HTML HTTP 200 et quatre ressources dans l’inventaire, 58 noindex. Metadata complètes dont OG/Twitter, canonical, robots et en-têtes, JSON-LD, H1/H2/H3 et IDs, href/ancres/labels des liens : **strictement identiques**. Sitemap, robots.txt, ads.txt, RSS et huit redirections identiques.

Le texte HTML serveur préexistant est exact. Le HTML complet gagne uniquement **329 badges Calcul EVExpert** et **18 indications de défilement**, répartis sur 115 pages utilisant les composants partagés. La comparaison conserve ces ajouts séparément (`uiAdditions` et `rawText`) et retire uniquement leurs marqueurs dédiés pour comparer le texte précédent. Aucun contenu éditorial, chiffre, unité, heading ou lien n’est retiré. Elle ignore les classes CSS et URLs hachées des chunks Next.

L’accueil garde son texte brut exact et les géométries de cartes/actions capturées aux cinq largeurs. Hero, vidéo/poster, texte adjacent et sections/ordre/contenu : intacts ; pause/reprise et comportements existants mobile/mouvement réduit vérifiés. Aucun nouveau masquage de vidéo.

AdSense : mêmes identifiants, coordonnées, dimensions et visibilité des réservations capturées dans les 85 cas. Checker balise/script/ads.txt conforme sur **124 pages**. Sources GSC, AdSense, GA4, Funding Choices et consentement inchangées, aucun consentement forcé. Les annonces réelles/auto ads et consoles privées ne sont pas reproduites ni contrôlées par ce test local.

## Lighthouse — comparaison finale en laboratoire

24 passages avant et 24 après, trois répétitions par chacun des huit couples page/profil, mêmes versions Chrome/Lighthouse, serveur, ordre et paramètres. Profils mobile/desktop par défaut et ralentissement simulé, caches réinitialisés par Lighthouse, scripts Google gardés. Aucun autre test navigateur exécuté pendant ces séries. Paramètres des 24 paires identiques.

Ces mesures locales ne sont pas PageSpeed exécuté par Google ni des données CrUX au 75e percentile. Le TBT ne mesure pas l’INP. Aucun score terrain garanti.

| URL / profil | Score médian avant → après | LCP s | FCP s | TBT ms | CLS |
|---|---:|---:|---:|---:|---:|
| `/` / mobile | 95 → 95 | 2.939 → 2.933 | 0.908 → 0.905 | 19.0 → 10.5 | 0.000 → 0.000 |
| `/` / desktop | 100 → 100 | 0.629 → 0.625 | 0.246 → 0.244 | 0.0 → 0.0 | 0.000 → 0.000 |
| `/voitures-electriques` / mobile | 96 → 96 | 2.708 → 2.854 | 0.905 → 0.903 | 22.0 → 11.0 | 0.000 → 0.000 |
| `/comparer` / mobile | 95 → 96 | 2.860 → 2.855 | 0.906 → 0.903 | 19.5 → 8.0 | 0.000 → 0.000 |
| `/outils/tco-voiture-electrique` / mobile | 95 → 96 | 2.859 → 2.858 | 0.908 → 0.905 | 17.5 → 11.5 | 0.000 → 0.000 |
| `/voitures-electriques` / desktop | 100 → 100 | 0.608 → 0.604 | 0.245 → 0.243 | 0.0 → 0.0 | 0.000 → 0.000 |
| `/voitures-electriques/renault` / mobile | 95 → 96 | 2.861 → 2.857 | 0.908 → 0.904 | 17.5 → 12.0 | 0.000 → 0.000 |
| `/voitures-electriques/tesla/model-3` / mobile | 95 → 96 | 2.860 → 2.857 | 0.907 → 0.905 | 18.5 → 10.5 | 0.000 → 0.000 |

Scores médians conservés ou supérieurs ; accessibilité automatisée 100 sur les 24 passages finaux ; CLS zéro sur les 48 passages. Le FCP additionnel de la version CSS séparée est supprimé dans cette série finale.

**Point de suivi :** LCP mobile catalogue environ **2,708 → 2,854 s**, +146 ms en médiane. Les plages avant/après se chevauchent et le lot 2 mesurait déjà environ 2,854 s ; cela ne permet pas de garantir une absence de régression terrain. Ne pas présenter cette refonte comme un gain de LCP. Les LCP mobiles restent globalement vers 2,85–2,94 s, au-dessus de l’objectif indicatif de 2,5 s déjà non atteint sur ces références.

**Hero desktop :** avant 100, 100, 94 ; le passage à 94 choisit la vidéo comme LCP à environ 1,678 s. Les passages finaux retiennent le poster autour de 0,625 s. Vidéo et sources inchangées ; cette variabilité préexistante interdit d’attribuer le meilleur passage au design.

[48 passages chiffrés](LIGHTHOUSE.md), [médianes/plages](lighthouse-comparison.json), [paramètres et métriques avant](before/lighthouse.json) / [après](after/lighthouse.json), [validation](lighthouse-validation.json).

Poids observé des scripts locaux, médiane des octets transférés par Lighthouse, hors scripts tiers :

| Page / profil | Avant octets | Après octets | Delta |
|---|---:|---:|---:|
| `/` / mobile | 192312 | 193175 | +863 |
| `/` / desktop | 213747 | 214610 | +863 |
| `/voitures-electriques` / mobile | 193039 | 193884 | +845 |
| `/comparer` / mobile | 190027 | 190045 | +18 |
| `/outils/tco-voiture-electrique` / mobile | 188807 | 188807 | +0 |
| `/voitures-electriques` / desktop | 227429 | 228292 | +863 |
| `/voitures-electriques/renault` / mobile | 192146 | 187426 | -4720 |
| `/voitures-electriques/tesla/model-3` / mobile | 192146 | 192991 | +845 |

Le coût n’est pas nul : markup/provenance/classes ajoutés et rendu de présentation dans l’explorateur client existant. Aucun nouvel îlot client, état, effet, événement ou bibliothèque d’animation ; scroll/focus/surfaces en CSS natif. Ces transferts ne remplacent pas une analyse exhaustive du bundle.

## Risques restants et contrôles non effectués

- Appareils physiques, Safari/iOS, zoom à 200 %, VoiceOver/NVDA : non testés. Tests Chrome émulé et arbre accessible uniquement.
- INP/CrUX, conditions réseau de production, données Supabase live et consoles GSC/GA4/AdSense : non mesurés/consultés. Aucun déploiement réalisé.
- Remplissage réel des annonces, placements auto ads et parcours Funding Choices avec consentement réel : non reproduits en local ; code, déclarations et réservations contrôlés inchangés. Contrôle sur environnement autorisé nécessaire avant une publication ultérieure.
- Densité des cartes mobiles plus faible qu’avant, contre davantage d’informations visibles ; captures à valider visuellement.
- Le test de géométrie détecte des dépassements internes de certaines valeurs de l’estimateur à 1024/1440 px, **déjà présents avant** et hors SpecTable. Aucun débordement global introduit ; estimateur inchangé.
- Avertissements Next préexistants : racine Turbopack inférée depuis le lockfile parent et Cache-Control personnalisé des assets. Aucun changement de configuration pour les masquer.

## Préconisation pour le lot 4 — sans implémentation

Petit lot consacré aux tableaux du comparateur et à la lisibilité des résultats d’estimateurs sur fiches : vérifier les libellés de versions et les valeurs/unités qui débordent dans leurs cellules, puis harmoniser uniquement les composants concernés. Fichiers candidats : `ComparisonTable.tsx`, `ComparisonBuilder.tsx`, `VehicleCostEstimator.tsx` et leurs styles dédiés. Garder la sélection, URLs partagées, événements et formules.

Avant tout changement : jeux fixes du lot 3, nouveau cadrage des résultats à cinq largeurs, Tab/Entrée, arbre accessible, empreintes SEO et nouvelle paire Lighthouse. Pas de refonte du header, du Hero, des contenus, des publicités ni d’infrastructure. **Validation explicite requise avant le lot 4 ; aucune action de ce lot engagée.**
