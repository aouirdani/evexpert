# EVExpert — expansion éditoriale du 8 octobre 2026

## Audit avant création

État initial : 184 routes de pages dans le dépôt (183 prérendues et la recherche), 25 guides, 7 analyses, 8 outils, 22 marques, 45 modèles et 47 versions. Le sitemap du dépôt contient 122 URL. Cet inventaire ne constitue pas un relevé des pages effectivement indexées par Google.

Les métadonnées passent par `src/lib/seo/index.ts`. Le domaine canonique reste `https://www.evexpert.fr`. Les guides et analyses utilisent leurs routes `[slug]`, leur rendu serveur, `ArticleView`, une ISR de 86400 secondes et le mécanisme de sitemap qui consomme `getGuides()` et `getArticles()`.

Invariants : conserver les URL, slugs, titles, descriptions, H1, canonicals et robots existants ; conserver les 43 versions uniques en noindex/canonical modèle, les quatre versions Tesla indexables, les huit duels noindex et les six marques à un modèle noindex. Aucun changement des redirects, robots.txt, sitemap.ts, catalogue, schéma DB, environnement, Vercel, Supabase, analytics ou consentement.

Le catalogue audité n'a pas de prix France renseigné et son maximum WLTP est de 792 km. Les tarifs de recharge par opérateur et les offres de leasing ne sont pas disponibles. La base de production n'a pas été interrogée. Les tableaux des nouveaux contenus utilisent les données fournies par la couche catalogue, sans modifier les véhicules.

Les signaux GSC concernent des requêtes, pas des URL : Renault autonomie (43 + 14 impressions, positions 40,5 et 36,1), Renault générique (17, 50,3), simulation Kona (13, 20,7), simulation de charge (13, 83,9), TCO (48, 86,2), Renault prix (9, 47,2). Ils soutiennent d'abord les pages existantes.

## Carte des opportunités

Les volumes ci-dessous sont ceux fournis dans le contexte. Ils ne sont pas additionnés. « n/d » ne signifie pas zéro. Les volumes des requêtes larges ne sont pas attribués aux nouvelles longues traînes.

| Opportunité | URL proposée | Page existante ? | Intent distinct ? | Volume | GSC signal | Cannibalisation | Valeur utilisateur | Priorité |
| --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| Tableau / autonomie générale | /voitures-electriques/autonomie | Catalogue, outil et guide | Non | 260 / 905 / 226 | Non fourni | Forte | Tableau déjà présent ; enrichir le catalogue | REJECT |
| Autonomie 500 km | /voitures-electriques/autonomie/500-km | Catalogue avec filtre | Non démontré | 865 | Non fourni | Forte | 26 versions dans le jeu initial ; même référence WLTP | REJECT |
| Autonomie 600 km | /voitures-electriques/autonomie/600-km | Catalogue avec filtre | Non démontré | 380 | Non fourni | Forte | 12 versions ; même méthode et mêmes fiches | REJECT |
| Autonomie 800 / 1000 km | /voitures-electriques/autonomie/800-km ; /1000-km | Catalogue | Non démontré | 477 / 1294 | Non fourni | Forte | Aucune version du jeu initial à ces seuils | REJECT |
| Autonomie autoroute | /voitures-electriques/autonomie/autoroute | /guides/autonomie-autoroute | Non | 110 / 70 à 130 km/h | Non fourni | Forte | Étendre le guide existant | REJECT |
| Simulateur et tableau de durée | /voitures-electriques/recharge/temps-recharge | Outil temps et guide temps | Non | 210 / 295 / 170 | 13 Kona + 13 générique | Forte | Pages déjà exactes ; incohérence AC hors de ce lot | REJECT |
| Coût de recharge | /voitures-electriques/recharge/cout | Outil coût, guide maison et domicile/public | Non | 380 / 303 | Non fourni | Forte | Calcul et explication déjà disponibles | REJECT |
| Recharge à domicile | /voitures-electriques/recharge/domicile | Guide domicile/public, prise et coût maison | Non | 720 coût maison / 320 procédure | Non fourni | Forte | Enrichir la procédure existante | REJECT |
| Recharge autoroute / tarifs | /voitures-electriques/recharge/autoroute | Guide autoroute, outil trajet, guide domicile/public | Partiel | 718 tarif | Non fourni | Moyenne à forte | Pas de relevé maintenu des tarifs ; étude ultérieure | REJECT |
| Comment recharger | /voitures-electriques/recharge/comment-recharger | Guide fonctionnement et hub recharge | Non | 260 borne / 320 domicile | Non fourni | Forte | Ajouter des étapes au guide existant | REJECT |
| Prix / moins chères | /voitures-electriques/prix ; /moins-cheres | Catalogue | Non démontré | 1910 / 590 / 720 petite | Renault prix : 9 | Forte | Prix FR absents ; ne pas substituer un coût d'énergie | REJECT |
| Meilleures / qualité-prix | /voitures-electriques/meilleures ; /qualite-prix | Guide usage, questionnaire, comparateur | Non démontré | 320 / 1586 | Non fourni | Forte | Pas de prix comparables ni d'essais qualité | REJECT |
| Coût réel éditorial | Nouvelle page TCO | /guides/calculer-tco-voiture-electrique et /guides/voiture-electrique-vs-essence | Non | n/d | Calcul TCO : 48 | Forte | Les postes, hypothèses et limites sont déjà couverts | REJECT |
| Carte de bornes | Aucune URL retenue | Liens externes sur /recharge | Oui, produit distinct | 480 | Non fourni | Faible | Données géographiques et disponibilité à intégrer ; hors lot éditorial | P2 |
| Leasing 100 € | Aucune URL retenue | Non | Oui | 995 | Non fourni | Faible | Offres actuelles et conditions non établies | REJECT |
| Prix des voitures chinoises | Aucune URL retenue | Marques BYD et MG | Prix non couvert | 480 | Non fourni | Forte | Prix FR absents | REJECT |
| Vérifications avant achat d'une électrique d'occasion | /guides/acheter-voiture-electrique-occasion | Une courte section dans le guide première voiture | Oui : examiner un exemplaire précis avant achat | n/d (6419 concerne la requête large occasion) | Non fourni | Faible à moyenne | Dossier de preuves, état batterie, essai, recharge et scénarios calculés | P1 |
| Analyse transversale BYD et MG | /blog/voitures-electriques-chinoises-byd-mg | Deux marques, aucune analyse croisée de ce groupe | Oui : différences entre marques et versions, origine et limites | n/d (480 concerne une requête prix) | Non fourni | Faible à moyenne | Comparaison calculée, compromis et limites du périmètre | P1 |

Classement : les données et la distinction de l'intention priment sur le volume. Aucun P0 de création n'est établi. Les deux P1 sont retenus après lecture de leurs voisins et vérification des sources officielles ; le contenu vise une question précise, pas la conquête automatique des requêtes larges.

## Brief : occasion

- Search intent : vérifier l'exemplaire d'occasion envisagé avant de signer, en distinguant documents, rapport batterie et essai.
- Mot-clé principal : acheter voiture électrique occasion.
- Secondaires : vérifier batterie occasion, SOH, essai recharge, garantie restante.
- Questions : quelle version ? Que prouve le SOH ? Quels documents ? Comment essayer la recharge ? Quelle marge d'énergie reste utilisable ?
- Pages proches : première voiture (orientation générale), préserver/durée de vie (vieillissement), garantie batterie (analyse du catalogue). Le nouveau guide porte la démarche d'achat d'un exemplaire, sans reproduire leurs analyses.
- Contribution EVExpert : grille « preuve / ce qu'elle établit / ce qu'elle ne prouve pas », scénarios à capacité retenue hypothétique de 90 %, fenêtres de charge et consommation explicitement choisies, données de trois fiches actuelles.
- Entrants : guide première voiture, guide préservation, article garantie ; hub guides automatiquement.
- Sortants : fiches d'exemple, outils autonomie/TCO/puissance, guides hiver et garantie, méthodologie, hub.
- Limites : aucun SOH réel, historique individuel, prix d'occasion, diagnostic ni garantie transférable déduits du catalogue ; ne pas appliquer une fiche récente à une ancienne génération.

## Brief : BYD et MG

- Search intent : comprendre quelles différences mesurables séparent les BYD et MG présentes dans EVExpert et quoi vérifier avant de les comparer.
- Mot-clé principal : voitures électriques chinoises BYD MG.
- Secondaires : BYD ou MG, autonomie BYD MG, recharge BYD MG.
- Questions : origine de la marque ou lieu de fabrication ? Quelles carrosseries ? Batterie plus grande ou recharge plus courte ? Quelles limites sur prix, qualité et fiabilité ?
- Pages proches : marques BYD/MG (gammes séparées), comparateur (sélection interactive), blog chimies et recharge (analyses de caractéristiques). Nouvelle analyse croisée, sans classement général.
- Contribution EVExpert : tableaux tirés du sous-ensemble BYD/MG, énergie ajoutée 10–80 %, puissance moyenne calculée, exemples AC adaptés au plafond du véhicule ; absence de données explicitée.
- Entrants : analyse LFP/NMC, analyse recharge AC, guide choix par usage ; hub blog automatiquement.
- Sortants : marques, modèles, comparateur, outil puissance, analyses et guides associés.
- Limites : pas de liste exhaustive du marché chinois, pas de prix ni de note qualité/fiabilité, aucune usine affectée à un véhicule sans preuve.

## Validation des lots

Pour chaque nouvelle page, compter l'introduction, les paragraphes et les listes après retrait des liens. Exclure tableaux, FAQ, titres, sources et navigation du seuil de 1500 mots. Vérifier doublons, sources, calculs, liens entrants/sortants, metadata, H1, canonical, robots, sitemap et JSON-LD.

Les tests Vitest par défaut déclenchent une recréation et des migrations de base de test. Utiliser la configuration unitaire sans `globalSetup` pour cette tâche. Ne lancer ni le setup DB ni les tests DB. Build avec `EVEXPERT_DATA_SOURCE=local`, sans changement de .env ni accès à la base.

Comparer le build final au build initial pour toutes les URL existantes : aucune disparition et aucune modification de title, description, H1, canonical ou robots. Les changements attendus sont deux nouvelles pages, les liens d'entrée ciblés et les listes générées des hubs/sitemap/RSS.

## Résultat des deux lots

| Page | Priorité | Mots de prose | Sources | Contribution spécifique |
| --- | --- | ---: | ---: | --- |
| /guides/acheter-voiture-electrique-occasion | P1 | 1908 | 5 | Dossier de preuves, distinction SOC/SOH, vérification d'un exemplaire, trois scénarios d'énergie fondés sur des capacités du catalogue |
| /blog/voitures-electriques-chinoises-byd-mg | P1 | 2011 | 7 | Cinq versions comparées, distinction groupe/usine, formats et chimies, énergie DC et moyenne équivalente, durées AC plafonnées |

Les comptes excluent titres, tableaux, FAQ, sources, cartes associées et navigation. Aucune FAQ n'a été ajoutée. Les calculs ne sont pas présentés comme des mesures, essais routiers ou diagnostics. Les dates de provenance du catalogue restent celles des fiches (21 septembre 2026 pour les exemples locaux), distinctes de la publication et de la consultation des sources officielles le 8 octobre.

### Métadonnées

| URL | Title avant suffixe EVExpert | Description |
| --- | --- | --- |
| /guides/acheter-voiture-electrique-occasion | Voiture électrique d'occasion : points à vérifier | Documents, rapport de santé batterie, recharge et essai : une méthode pour examiner une électrique d'occasion, avec des scénarios chiffrés et leurs limites. |
| /blog/voitures-electriques-chinoises-byd-mg | Voitures électriques chinoises : comparer BYD et MG | BYD et MG comparées avec les données EVExpert : formats, batteries, autonomie et recharge. Méthode, sources et limites, sans classement qualité-prix. |

Canonicals autoréférentes sur `https://www.evexpert.fr`, robots `index, follow`, Open Graph article et Twitter `summary_large_image`. Image de partage commune existante `/brand/og-image.png`. Une seule H1 par page. Données structurées `Article` pour le guide, `BlogPosting` pour l'analyse et `BreadcrumbList` pour les deux, via les composants existants. Pas de Product, d'avis ou de notation ajoutés.

### Maillage entrant vérifié

- Occasion : `/guides/choisir-premiere-voiture-electrique`, `/guides/preserver-batterie-voiture-electrique`, `/blog/garantie-batterie-ce-que-disent-les-donnees`.
- BYD/MG : `/guides/choisir-voiture-electrique-selon-usage`, `/blog/lfp-ou-nmc-ce-que-montrent-les-donnees`, `/blog/recharge-ac-puissances-acceptees`.
- Les hubs guides/blog et le RSS reprennent les contenus avec leur mécanisme existant. Les sortants renvoient aux fiches, outils, guides et méthode pertinents ; aucun lien interne inconnu n'a été trouvé dans le build.

### Vérifications terminées

- Lot 1 : lint, TypeScript, 155 tests unitaires et build local réussis.
- Lot 2 : lint, TypeScript, 160 tests unitaires dans 15 fichiers et build local réussis.
- Comparaison des 183 pages prérendues initiales : aucune disparition ; title, description, H1, canonical, robots, types JSON-LD et appartenance au sitemap identiques.
- 186 pages contrôlées en HTTP local : toutes en 200, y compris la recherche et les deux ajouts. Aucune consultation de `/api/health` qui pourrait ouvrir une connexion DB.
- Huit redirections existantes contrôlées : 308 et destinations conservées. Deux slugs éditoriaux inconnus : 404. Recherche avec paramètre : noindex conservé.
- Sitemap : 124 URL de pages uniques (122 initiales + 2), sans modification de `src/app/sitemap.ts`. Les 37 entrées image ne sont pas comptées comme des pages.
- Robots.txt, RSS, image de partage, JSON-LD et ancres de sommaire contrôlés. `git diff --check` réussi.
- Tests DB non exécutés : leur setup recrée une base et lance des migrations. Les attentes de comptage existantes ont été mises à jour ; elles n'ont pas été validées sur une base.

Le build a demandé un accès réseau pour la police Google Fonts déjà utilisée. Ses avertissements préexistants sur les lockfiles et le Cache-Control des assets Next restent présents ; aucune configuration n'a été changée. Aucun fichier d'environnement, dépendance, schéma, véhicule, redirect ou règle d'indexation existante n'a été modifié. Aucun commit, push ou déploiement réalisé.

Pendant les deux essais de slugs inconnus, le serveur Next a journalisé `NoFallbackError` sur les routes à `dynamicParams = false` ; les réponses sont bien des 404. Les 186 routes réelles n'ont pas produit d'échec HTTP. Ce comportement n'a pas été corrigé dans ce lot éditorial.

### Points à revoir après publication

Les impressions GSC fournies n'établissent pas encore la demande pour ces deux longues traînes. Ne pas promettre de classement, et suivre les URL et requêtes séparément. Surveiller les impressions du guide première voiture et des marques BYD/MG pour détecter un chevauchement réel. Les sections dépendant des données se recalculent avec le catalogue et son ISR ; réexaminer l'analyse éditoriale lorsque les versions ou leurs caractéristiques changent. Le guide occasion ne représente ni un inventaire d'annonces ni l'état de véhicules individuels.

Les prochaines optimisations des pages existantes (Renault, Kona/recharge et TCO) relèvent de lots distincts, à valider séparément. Leurs métadonnées et calculs n'ont pas été corrigés dans cette expansion.
