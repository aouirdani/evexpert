# EVExpert — Cartographie mots-clés → pages

Document de travail pour Claude Code. À placer dans `docs/seo/keyword-mapping.md`.
Établi le 24 septembre 2026 à partir du site en ligne (www.evexpert.fr) et du rapport SEO de septembre 2026.

## 0. Comment utiliser ce document

Ce fichier **remplace les URL proposées** dans les sections 5 à 13 du rapport SEO. Le rapport a été rédigé sans inventaire du site : plusieurs pages qu'il propose de créer existent déjà sous une autre URL. Les règles de fond du rapport (sections 12 et 14 à 26) restent valables.

Avant toute action :

1. Vérifier dans le repository que l'inventaire ci-dessous est à jour (il a été relevé sur le site public, pas dans le code).
2. Pour chaque mot-clé, travailler sur la page cible indiquée. Ne jamais créer une nouvelle page pour une intention déjà couverte.
3. Les points marqués **[À VÉRIFIER]** doivent être contrôlés dans le code avant de décider.

Actions possibles :

- **Optimiser** : ajuster title, meta description, H1, intertitres et maillage pour la requête. Pas de changement d'URL.
- **Enrichir** : ajouter du contenu ou des données à une page existante.
- **Créer** : nouvelle page, uniquement pour un vrai trou.
- **Plus tard** : intention valable mais données ou ressources manquantes.
- **Écarter** : intention que EVExpert ne peut pas satisfaire honnêtement.

## 1. Règles pendant l'indexation

L'indexation Google est en cours. Les modifications de contenu sont sans risque, à condition de respecter ceci :

- **Ne jamais modifier l'URL d'une page existante.** Si c'est inévitable : redirection 301 (`redirects()` dans `next.config`), mise à jour de tous les liens internes et du sitemap.
- Title, meta description, H1, contenu et maillage peuvent être modifiés librement.
- Ne pas passer de pages en `noindex` en masse sans validation explicite.
- Garder les canonicals stables.
- Mettre à jour `lastModified` dans le sitemap pour les pages modifiées.
- Livrer par petits lots, avec build + lint + vérification des métadonnées à chaque lot.

## 2. Inventaire existant (relevé sur le site public)

### Outils (`/outils`)

| URL | Sujet |
|---|---|
| `/outils/cout-recharge-voiture-electrique` | Coût d'une recharge |
| `/outils/autonomie-voiture-electrique` | Autonomie réelle (vitesse, température, conduite) |
| `/outils/cout-100-km` | Coût aux 100 km, électrique vs essence/diesel/hybride |
| `/outils/essence-vs-electrique` | Coût annuel et pluriannuel électrique vs essence |
| `/outils/tco-voiture-electrique` | Coût total de possession, deux véhicules |
| `/outils/temps-recharge` | Temps de recharge selon puissance et état de charge |
| `/outils/trajet-longue-distance` | Arrêts de recharge et durée d'un long trajet |
| `/outils/puissance-borne-recharge` | Temps de recharge par puissance de borne (limites AC/DC) |

### Guides (`/guides`)

La page `/guides` annonce 23 guides mais en liste 22. **[À VÉRIFIER]** guide manquant ou compteur erroné.

- Autonomie : `calculer-autonomie-reelle`, `autonomie-hiver`, `autonomie-autoroute`, `wltp-definition`, `consommation-voiture-electrique-kwh-100-km`
- Recharge : `puissance-borne-7-11-22-kw`, `recharge-ac-ou-dc`, `temps-recharge-voiture-electrique`, `fonctionnement-borne-de-recharge`, `puissance-recharge-dc`, `recharge-domicile-ou-borne-publique`, `recharger-sur-prise-domestique`
- Batterie : `batterie-brute-batterie-utile`, `recharger-a-80-pourcent`, `preserver-batterie-voiture-electrique`
- Coûts : `combien-coute-recharge-domicile`, `cout-borne-recharge-domicile`, `cout-100-km-voiture-electrique`, `voiture-electrique-vs-essence`, `calculer-tco-voiture-electrique`
- Achat : `choisir-voiture-electrique-selon-usage`, `choisir-premiere-voiture-electrique`

### Blog (`/blog`) — articles vus sur l'accueil

- `voitures-electriques-les-plus-sobres`
- `recharge-rapide-temps-10-80`
- `autonomie-wltp-repartition-catalogue`

**[À VÉRIFIER]** liste complète des articles.

### Autres

- Catalogue : `/voitures-electriques`, `/voitures-electriques/trouver`, 22 pages marques, pages modèles et versions
- Comparateur : `/comparer` et pages de duels `/comparer/[a]-vs-[b]`
- Hubs : `/recharge`, `/outils`, `/guides`
- Confiance : `/methodologie`, `/sources`, `/a-propos`, `/contact`, pages légales

Attention : le rapport utilise `/comparateur/...`. Le site utilise `/comparer`, réservé aux comparaisons de véhicules. Ne pas créer d'arborescence `/comparateur`.

## 3. Cartographie par cluster

Volumes et « Comp. » issus d'OpenSEO (France). Rappel : « Comp. » est très probablement l'indice de concurrence publicitaire, pas la difficulté organique.

### 3.1 Consommation

| Mots-clés | Vol. | Page cible | Action |
|---|---:|---|---|
| consommation voiture électrique ; kwh km ; kwh/km ; 100 km | 1 600 + 170 + 170 + 110 | `/guides/consommation-voiture-electrique-kwh-100-km` | Optimiser : title et H1 doivent commencer par « Consommation d'une voiture électrique ». Ajouter une section kWh/km (conversion). |
| consommation autoroute ; 130 km/h ; en fonction de la vitesse | 70 + 30 + 30 | même guide, section dédiée | Enrichir : section courte avec lien fort vers `/guides/autonomie-autoroute`. Pas de page séparée. |
| tableau consommation ; comparatif consommation kwh/km | 260 + 50 | même guide (il contient déjà les valeurs des 47 versions) | Enrichir : rendre le tableau triable et filtrable, ajouter « tableau » dans le title ou un H2. |
| calcul consommation | 70 | même guide, section « calculer sa consommation » | Enrichir. Pas de nouvel outil : `/outils/cout-100-km` couvre le calcul utile. |

Risque de cannibalisation : l'article de blog `voitures-electriques-les-plus-sobres` vise la même intention que « tableau consommation ». Le guide porte la requête ; l'article garde un angle analyse et renvoie vers le guide.

### 3.2 Autonomie

| Mots-clés | Vol. | Page cible | Action |
|---|---:|---|---|
| simulateur autonomie voiture électrique | 480 | `/outils/autonomie-voiture-electrique` | Optimiser : title et H1 avec « Simulateur d'autonomie ». |
| autonomie à 130 km/h ; autoroute ; meilleure autonomie autoroute | 140 + 110 + 70 | `/guides/autonomie-autoroute` | Enrichir : passer de 3 modèles à l'ensemble du catalogue (estimations EVExpert à 110 et 130 km/h, clairement étiquetées). |
| tableau autonomie ; autonomie classement | 260 + 70 | `/voitures-electriques` (catalogue) | **[À VÉRIFIER]** si le catalogue propose déjà un tri par autonomie. Si oui : optimiser. Sinon : ajouter une vue tableau triable au catalogue plutôt qu'une nouvelle page. |
| autonomie voiture électrique | 6 600 | `/outils/autonomie-voiture-electrique` + guides autonomie | Plus tard : requête très concurrentielle, se gagnera par l'autorité du cluster. |

Risque de cannibalisation : l'article `autonomie-wltp-repartition-catalogue` et la cible « tableau autonomie ». Même règle que ci-dessus.

### 3.3 Recharge — coût

| Mots-clés | Vol. | Page cible | Action |
|---|---:|---|---|
| coût recharge voiture électrique ; simulateur coût recharge ; recharge prix | 1 600 + 390 + 320 | `/outils/cout-recharge-voiture-electrique` | Optimiser : title du type « Coût de recharge d'une voiture électrique : simulateur ». |
| coût recharge à la maison ; simulateur coût recharge maison | 720 + 210 | `/guides/combien-coute-recharge-domicile` | Optimiser : H1 avec « à la maison » ; lien vers l'outil avec paramètres domicile pré-remplis si possible. |
| prix recharge borne publique ; prix sur borne ; coût borne publique | 390 + 140 + 70 | **à créer** : `/guides/prix-recharge-borne-publique` | Créer (lot 5). Nécessite des tarifs d'opérateurs sourcés et datés. |
| tarif recharge autoroute (deux variantes) | 720 + 480 | même nouvelle page, section autoroute dédiée | Créer avec la page ci-dessus. Page séparée seulement si la SERP OpenSEO montre des résultats très différents. |

### 3.4 Recharge — temps et puissance

| Mots-clés | Vol. | Page cible | Action |
|---|---:|---|---|
| tableau temps de recharge | 590 | `/guides/temps-recharge-voiture-electrique` | Enrichir : tableau triable des 47 versions (10-80 % DC, temps AC 7,4/11/22 kW calculés). Ajouter « tableau » dans le title. |
| simulateur temps de recharge | 210 | `/outils/temps-recharge` | Optimiser : title et H1 avec « Simulateur de temps de recharge ». Ne pas renommer l'URL. |
| temps de recharge 22 kW | 140 | `/outils/puissance-borne-recharge` | Optimiser : mentionner explicitement 22 kW dans le title ou un H2. |
| recharge sur prise domestique ; temps sur prise domestique | 720 + 170 | `/guides/recharger-sur-prise-domestique` | Enrichir : étendre de 4 modèles au catalogue. |
| comment recharger à la maison | 320 | `/guides/recharge-domicile-ou-borne-publique` | Optimiser. |
| comment fonctionnent les bornes publiques | 210 | `/guides/fonctionnement-borne-de-recharge` | Optimiser. |
| recharge voiture électrique | 9 900 | `/recharge` (hub) | Optimiser : title et H1 « Recharge d'une voiture électrique ». Objectif long terme. |

Risque de cannibalisation : l'article `recharge-rapide-temps-10-80` et la cible « tableau temps de recharge ».

### 3.5 Recharge — bornes à domicile et cartes

| Mots-clés | Vol. | Page cible | Action |
|---|---:|---|---|
| prix borne maison ; installation 7 kW prix ; borne maison prix | 480 + 390 + 170 | `/guides/cout-borne-recharge-domicile` | Optimiser. |
| borne maison 11 kW | 170 | `/guides/puissance-borne-7-11-22-kw` | Optimiser. |
| borne recharge voiture électrique maison | 1 000 | `/guides/cout-borne-recharge-domicile` | Optimiser, objectif moyen terme. |
| meilleure borne de recharge domicile | 1 000 | — | Écarter : intention de test produit, EVExpert ne teste pas de bornes. |
| cartes de recharge : tableau comparatif, sans abonnement, meilleure carte, comparateur tarif | 390 + 320 + 320 + 260 | **à créer** : `/recharge/cartes-de-recharge` | Créer (lot 6). Tarifs sourcés et datés, maintenance régulière à prévoir. |
| carte des bornes de recharge gratuites | 140 | — | Écarter : intention de carte interactive. |

### 3.6 Coût d'usage

| Mots-clés | Vol. | Page cible | Action |
|---|---:|---|---|
| coût au km ; calcul prix km ; coût 100 km | 210 + 40 + 70 | `/outils/cout-100-km` | Optimiser : title avec « au km et aux 100 km » ; afficher le coût au km dans les résultats si absent. |
| coût vs essence ; rentabilité vs essence ; calcul économie ; simulateur rentabilité | 110 + 40 + 140 + 50 | `/outils/essence-vs-electrique` | Optimiser. |
| coût vs diesel | 40 | `/outils/cout-100-km` | **[À VÉRIFIER]** si `/outils/essence-vs-electrique` gère aussi le diesel. |
| tableau comparatif électrique et thermique ; entretien vs essence | 140 + 70 | `/guides/voiture-electrique-vs-essence` | Enrichir : tableau comparatif poste par poste. |
| coût par mois | 170 | `/outils/tco-voiture-electrique` | **[À VÉRIFIER]** si le résultat mensuel est affiché ; sinon l'ajouter. |
| coût voiture électrique | 590 | `/outils/tco-voiture-electrique` | Plus tard : concurrence forte. |
| tableau décote | 110 | — | Plus tard : aucune donnée de décote sourcée. |
| calcul rentabilité excel | 50 | — | Écarter pour l'instant. |

### 3.7 Batterie — le vrai trou

Aucun guide existant ne couvre la durée de vie ni le prix. C'est le plus gros gisement à faible concurrence publicitaire.

| Mots-clés | Vol. | Page cible | Action |
|---|---:|---|---|
| durée de vie batterie (deux variantes) ; en km | 1 300 + 1 000 + 110 | **à créer** : `/guides/duree-de-vie-batterie-voiture-electrique` | Créer (lot 3). Dégradation, garanties, facteurs, LFP vs NMC, liens vers les 3 guides batterie existants. |
| durée de vie batterie Tesla ; Zoé ; Peugeot 208 | 390 + 70 + 70 | même guide, section « cas par modèle » | Sections, pas de pages. **[À VÉRIFIER]** la Zoé n'est peut-être pas au catalogue. |
| prix batterie ; combien coûte une batterie ; prix remplacement (deux variantes) | 1 900 + 480 + 260 + 210 | **à créer** : `/guides/prix-batterie-voiture-electrique` | Créer (lot 3). Prix au kWh, remplacement complet vs réparation de modules, garanties. |

Écart assumé avec le rapport : il propose une seule page pilier batterie. Durée de vie et prix sont deux questions distinctes, chacune avec un volume important. Avant de trancher, comparer les SERP des deux requêtes dans OpenSEO : si le top 10 se recoupe fortement, fusionner en une page ; sinon, deux guides liés entre eux.

Toutes les valeurs (prix, dégradation, garanties) doivent être sourcées et datées. Sinon : « Non disponible » ou « Estimation EVExpert ».

## 4. Pages marques

Constat : une page marque = H1, une phrase de synthèse, des cartes versions. Six marques n'ont qu'une version (Audi, CUPRA, Dacia, Nissan, Porsche, smart).

Enrichissement proposé, avec uniquement des données du catalogue :

- introduction éditoriale propre à la marque (gamme électrique, positionnement), sans reformuler le site constructeur ;
- tableau des versions : autonomie WLTP, batterie utile, DC max, 10-80 %, consommation calculée ;
- ce qui distingue les versions entre elles (écarts chiffrés) ;
- liens vers les outils avec le véhicule présélectionné, si les outils le permettent **[À VÉRIFIER]** ;
- liens vers les duels du comparateur impliquant la marque ;
- FAQ courte basée sur les données.

Pour les marques à une seule version : décision à prendre par le propriétaire du site entre enrichir quand même ou `noindex, follow` temporaire. Ne pas appliquer sans validation.

## 5. Ordre des lots

1. **Optimisations sans création** (sections 3.1 à 3.6, actions « Optimiser ») : titles, meta, H1, intertitres, maillage. Rapide, sans risque.
2. **Pages marques** (section 4).
3. **Guides batterie** (section 3.7), après comparaison des SERP.
4. **Tableaux triables** dans les guides consommation, temps de recharge et autonomie autoroute, avec un composant de tableau partagé. Clarifier le rôle des articles de blog concurrents.
5. **Prix de la recharge publique et sur autoroute** (nécessite une source de tarifs).
6. **Cartes de recharge** (nécessite une source de tarifs et un plan de mise à jour).

Proposer un plan avant chaque lot, puis valider build, lint, responsive, métadonnées et sitemap à la fin du lot.
