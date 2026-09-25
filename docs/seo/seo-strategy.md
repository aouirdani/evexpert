# EVExpert.fr — Rapport stratégique SEO & Roadmap de développement

**Document de référence pour Claude Code**

Date : septembre 2026
Projet : EVExpert.fr
Objectif : développer un site français spécialisé dans les voitures électriques, combinant données véhicules, outils interactifs, comparateurs et contenus SEO utiles.

---

# 1. Objectif du document

Ce document définit la stratégie SEO et produit à suivre pour EVExpert.fr avant de développer de nouvelles pages.

L'objectif n'est pas de produire massivement des pages SEO génériques.

L'objectif est de construire progressivement un site :

* utile pour les utilisateurs français ;
* basé sur des données structurées ;
* capable de répondre à des intentions de recherche précises ;
* différencié par des outils et comparateurs ;
* techniquement performant ;
* cohérent avec Google AdSense ;
* capable de générer du trafic organique sur des requêtes longue traîne et des requêtes à concurrence raisonnable.

**Principe fondamental :**

> Une intention de recherche forte = une page réellement utile, et non plusieurs pages artificiellement créées pour chaque variante de mot-clé.

Les synonymes et variantes proches doivent généralement être regroupés sur une même page afin d'éviter la cannibalisation.

---

# 2. État actuel du projet

EVExpert.fr est développé avec :

* Next.js 16
* React 19
* Tailwind CSS v4
* déploiement Vercel
* données véhicules actuellement centralisées dans `src/data/vehicles.ts`

Données actuellement disponibles :

* environ 47 versions ;
* 45 modèles ;
* 22 marques.

Les données véhicules constituent une ressource stratégique du projet.

Il faut les exploiter pour produire des pages réellement data-driven plutôt que du contenu générique.

Exemples de données exploitables :

* marque ;
* modèle ;
* version ;
* batterie ;
* capacité ;
* autonomie ;
* puissance ;
* recharge AC ;
* recharge DC ;
* dimensions ;
* prix lorsque disponible ;
* autres caractéristiques disponibles dans la source.

**Ne jamais inventer une donnée véhicule absente de la source.**

---

# 3. État SEO actuel

Plusieurs pages marques existent mais sont actuellement trop légères.

Pages identifiées :

* `/voitures-electriques/bmw`
* `/voitures-electriques/citroen`
* `/voitures-electriques/fiat`
* `/voitures-electriques/ford`
* `/voitures-electriques/kia`
* `/voitures-electriques/mercedes-benz`
* `/voitures-electriques/mg`
* `/voitures-electriques/opel`
* `/voitures-electriques/skoda`
* `/voitures-electriques/volkswagen`
* `/voitures-electriques/volvo`

Ces pages contiennent actuellement environ 138–147 mots chacune.

Elles doivent progressivement devenir de vraies pages utiles avec :

* présentation de la marque ;
* modèles disponibles ;
* caractéristiques ;
* prix lorsque disponible ;
* autonomie ;
* batterie ;
* recharge ;
* liens vers les fiches modèles ;
* liens vers les outils pertinents ;
* contenu éditorial unique.

Une page marque ne doit pas devenir simplement une répétition automatique de données.

---

# 4. Problème SEO identifié

Plusieurs gros mots-clés ont un volume important mais une concurrence très forte.

Exemples :

`borne recharge voiture électrique`

Volume : 22 200
Comp : 0.99

`autonomie voiture électrique`

Volume : 6 600
Comp : 0.83

`coût voiture électrique`

Volume : 590
Comp : 1.00

Il ne faut donc pas construire la stratégie autour de ces mots-clés seuls.

La stratégie doit plutôt exploiter :

1. les sous-intentions ;
2. les requêtes longue traîne ;
3. les requêtes à faible concurrence ;
4. les outils ;
5. les comparateurs ;
6. les données propriétaires/structurées d'EVExpert.

---

# 5. Keyword Research — Recharge

Seed :

`recharge voiture électrique`

Volume : 9 900
CPC : $1.25
Comp : 0.49
Intent : Transactionnel

Opportunités identifiées :

| Keyword                                                       | Volume | Comp. | Intent         |
| ------------------------------------------------------------- | -----: | ----: | -------------- |
| coût recharge voiture électrique                              |  1 600 |  0.26 | Commercial     |
| coût recharge voiture électrique à la maison                  |    720 |  0.25 | Informationnel |
| recharge voiture électrique sur prise domestique              |    720 |  1.00 | Transactionnel |
| tableau temps de recharge voiture électrique                  |    590 |  0.19 | Informationnel |
| prix recharge voiture électrique borne publique               |    390 |  0.35 | Commercial     |
| simulateur coût recharge voiture électrique                   |    390 |  0.12 | Commercial     |
| recharge voiture électrique prix                              |    320 |  0.50 | Informationnel |
| comment recharger une voiture électrique à la maison          |    320 |  0.99 | Informationnel |
| comparateur tarif recharge voiture électrique                 |    260 |  0.46 | Commercial     |
| simulateur coût recharge voiture électrique maison            |    210 |  0.21 | Commercial     |
| simulateur temps de recharge voiture électrique               |    210 |  0.06 | Informationnel |
| comment fonctionne les bornes de recharge électrique publique |    210 |  0.32 | Informationnel |
| temps de recharge voiture électrique sur prise domestique     |    170 |  0.31 | Informationnel |
| carte des bornes de recharge gratuite                         |    140 |  0.19 | Informationnel |
| temps de recharge voiture électrique 22 kw                    |    140 |  0.18 | Informationnel |

### Opportunités produit

Créer à terme :

`/outils/calculateur-cout-recharge-voiture-electrique`

`/outils/temps-recharge-voiture-electrique`

`/comparateur/cartes-recharge-voiture-electrique`

---

# 6. Keyword Research — Autonomie

Seed :

`autonomie voiture électrique`

Volume : 6 600
CPC : $1.02
Comp : 0.83
Intent : Informationnel

Opportunités :

| Keyword                                                   | Volume | Comp. |
| --------------------------------------------------------- | -----: | ----: |
| tableau autonomie voiture électrique                      |    260 |  0.18 |
| tableau consommation voiture électrique                   |    260 |  0.05 |
| autonomie voiture électrique à 130 km/h                   |    140 |  0.27 |
| autonomie voiture électrique autoroute                    |    110 |  0.14 |
| consommation voiture électrique 100 km                    |    110 |  0.10 |
| autonomie voiture électrique classement                   |     70 |  0.13 |
| meilleure autonomie voiture électrique sur autoroute      |     70 |  0.50 |
| calcul consommation voiture électrique                    |     70 |  0.06 |
| consommation voiture électrique sur autoroute             |     70 |  0.06 |
| comparatif consommation voiture électrique kwh/km         |     50 |  0.07 |
| consommation voiture électrique en fonction de la vitesse |     30 |  0.00 |

### Opportunités produit

`/comparateur/autonomie-voiture-electrique`

`/outils/simulateur-autonomie-voiture-electrique`

Potentiellement un outil spécifique :

`/outils/autonomie-voiture-electrique-autoroute`

avec :

* modèle ;
* batterie ;
* vitesse ;
* température ;
* consommation ;
* autonomie estimée ;
* coût aux 100 km ;
* nombre de recharges pour un trajet.

Les résultats doivent être clairement présentés comme des **estimations** lorsque les données ne sont pas mesurées directement.

---

# 7. Keyword Research — Consommation

Seed :

`consommation voiture électrique`

Volume : 1 600
CPC : $1.42
Comp : 0.10
Intent : Informationnel

Opportunités :

| Keyword                                                   | Volume | Comp. |
| --------------------------------------------------------- | -----: | ----: |
| consommation voiture électrique                           |  1 600 |  0.10 |
| simulateur autonomie voiture électrique                   |    480 |  0.04 |
| tableau consommation voiture électrique                   |    260 |  0.05 |
| tableau autonomie voiture électrique                      |    260 |  0.18 |
| coût voiture électrique au km                             |    210 |  0.16 |
| consommation voiture électrique kwh km                    |    170 |  0.07 |
| consommation voiture électrique kwh/km                    |    170 |  0.07 |
| coût voiture électrique par mois                          |    170 |  0.35 |
| consommation voiture électrique 100 km                    |    110 |  0.10 |
| calcul consommation voiture électrique                    |     70 |  0.06 |
| consommation voiture électrique sur autoroute             |     70 |  0.06 |
| comparatif consommation voiture électrique kwh/km         |     50 |  0.07 |
| consommation voiture électrique 130 km/h                  |     30 |  0.02 |
| consommation voiture électrique en fonction de la vitesse |     30 |  0.00 |

### Architecture recommandée

Guide :

`/guides/consommation-voiture-electrique`

Outil :

`/outils/calculateur-consommation-voiture-electrique`

Comparateur :

`/comparateur/consommation-voiture-electrique`

Les variantes suivantes doivent normalement être couvertes par le même guide :

* consommation EV ;
* kWh/km ;
* kWh/100 km ;
* consommation à 100 km ;
* autoroute ;
* 130 km/h ;
* calcul de consommation ;
* consommation selon la vitesse.

Ne pas créer une page pour chaque variante.

---

# 8. Keyword Research — Coût

Seed :

`coût voiture électrique`

Volume : 590
CPC : $1.04
Comp : 1.00
Intent : Commercial

Opportunités plus intéressantes :

| Keyword                                            | Volume | Comp. |
| -------------------------------------------------- | -----: | ----: |
| durée vie batterie voiture électrique              |  1 000 |  0.03 |
| coût voiture électrique au km                      |    210 |  0.16 |
| coût voiture électrique par mois                   |    170 |  0.35 |
| calcul économie voiture électrique                 |    140 |  0.10 |
| tableau comparatif voiture électrique et thermique |    140 |  0.06 |
| coût voiture électrique vs essence                 |    110 |  0.07 |
| tableau décote voiture électrique                  |    110 |  0.07 |
| durée de vie batterie voiture électrique en km     |    110 |  0.02 |
| coût voiture électrique 100 km                     |     70 |  0.82 |
| coût entretien voiture électrique vs essence       |     70 |  0.02 |
| calcul rentabilité voiture électrique excel        |     50 |  0.03 |
| simulateur rentabilité voiture électrique          |     50 |  0.07 |
| coût voiture électrique vs diesel                  |     40 |  0.07 |
| calcul prix km voiture électrique                  |     40 |  0.00 |
| rentabilité voiture électrique vs essence          |     40 |  0.03 |

### Produit recommandé

Créer un outil central :

`/outils/cout-voiture-electrique`

Fonctionnalités possibles :

* coût/km ;
* coût/100 km ;
* coût mensuel ;
* coût annuel ;
* coût d'un trajet ;
* comparaison essence ;
* comparaison diesel ;
* économie annuelle ;
* TCO simplifié.

Le calculateur doit utiliser des paramètres clairement visibles :

* consommation ;
* prix du kWh ;
* kilométrage annuel ;
* prix carburant ;
* consommation thermique ;
* coûts d'entretien si disponibles.

Les hypothèses doivent être modifiables par l'utilisateur.

---

# 9. Keyword Research — Bornes de recharge

Seed :

`borne recharge voiture électrique`

Volume : 22 200
CPC : $1.30
Comp : 0.99

Le mot-clé principal est trop concurrentiel pour être une priorité initiale.

Sous-clusters intéressants :

### Recharge à domicile

* borne recharge voiture électrique maison — 1 000
* meilleure borne de recharge domicile — 1 000
* prix borne électrique maison — 480
* prix installation borne de recharge 7kw — 390
* borne recharge voiture électrique maison 11kw — 170
* borne recharge voiture électrique maison prix — 170

### Prix / recharge publique

* tarif recharge voiture électrique sur autoroute — 720
* prix recharge voiture électrique borne publique — 390
* tarif recharge voiture électrique autoroute — 480
* prix recharge voiture électrique sur borne — 140
* coût recharge voiture électrique borne publique — 70

### Cartes de recharge

* tableau comparatif carte recharge voiture électrique — 390 / Comp 0.12
* carte recharge voiture électrique sans abonnement — 320
* quelle est la meilleure carte de recharge pour voiture électrique — 320
* comparateur tarif recharge voiture électrique — 260
* carte des bornes de recharge gratuite — 140

### Temps de recharge

* tableau temps de recharge voiture électrique — 590 / Comp 0.19
* simulateur temps de recharge voiture électrique — 210 / Comp 0.06
* temps de recharge voiture électrique 22 kw — 140 / Comp 0.18

### Produit

Priorité à :

`/outils/temps-recharge-voiture-electrique`

`/outils/cout-recharge-voiture-electrique`

`/comparateur/cartes-recharge-voiture-electrique`

---

# 10. SERP Analysis — Batterie

Keyword analysé :

`durée vie batterie voiture électrique`

OpenSEO :

Volume : 1 000
CPC : $1.12
Comp : 0.03
Intent : Informationnel

Variante :

`durée de vie batterie voiture électrique`

Volume : 1 300
CPC : $0.45
Comp : 0.04

La SERP contient notamment :

1. economie.gouv.fr
2. Hyundai
3. Hess Automobile
4. EDF
5. Renault
6. Ulys
7. Caradisiac
8. Mary Automobiles
9. Volkswagen
10. Midas

### Interprétation

La SERP est dominée par :

* institution ;
* constructeurs ;
* acteurs automobiles ;
* médias spécialisés ;
* réseaux automobiles.

La faible concurrence OpenSEO ne signifie donc pas que la SERP est trivialement facile.

Cependant, l'intention est claire et la SERP accepte plusieurs formats :

* guides ;
* FAQ ;
* articles ;
* contenus constructeurs.

EVExpert doit se différencier par :

1. contenu approfondi ;
2. données structurées ;
3. tableaux ;
4. calculs ;
5. comparaisons ;
6. liens vers les fiches véhicules ;
7. méthodologie transparente.

---

# 11. Cluster batterie identifié

La recherche révèle un cluster important.

Principaux mots-clés :

| Keyword                                          | Volume | Comp. |
| ------------------------------------------------ | -----: | ----: |
| prix batterie voiture électrique                 |  1 900 |  0.01 |
| durée de vie batterie voiture électrique         |  1 300 |  0.04 |
| durée vie batterie voiture électrique            |  1 000 |  0.03 |
| combien coûte une batterie de voiture électrique |    480 |  0.01 |
| durée de vie batterie Tesla                      |    390 |  0.01 |
| prix remplacement batterie voiture électrique    |    260 |  0.01 |
| remplacement batterie voiture électrique prix    |    210 |  0.02 |
| durée de vie batterie voiture électrique en km   |    110 |  0.02 |
| durée de vie batterie voiture électrique Zoé     |     70 |  0.02 |
| durée de vie batterie Peugeot 208 électrique     |     70 |  0.03 |

Cela suggère un cluster autour de :

* durée de vie ;
* kilométrage ;
* dégradation ;
* prix ;
* remplacement ;
* modèles spécifiques.

### Architecture initiale recommandée

Page pilier :

`/guides/batterie-voiture-electrique`

Titre possible :

**Batterie de voiture électrique : durée de vie, dégradation et prix**

Sections :

1. durée de vie moyenne ;
2. durée en kilomètres ;
3. dégradation de capacité ;
4. facteurs de vieillissement ;
5. bonnes pratiques ;
6. recharge rapide ;
7. recharge à 100 % ;
8. température ;
9. LFP vs NMC ;
10. coût d'une batterie ;
11. coût du remplacement ;
12. garanties ;
13. cas particuliers par modèle.

Ne pas transformer automatiquement chaque modèle en page SEO.

---

# 12. Principe de différenciation EVExpert

Le contenu doit exploiter les ressources propres au site.

Exemple :

Un article générique dit :

> Une voiture électrique consomme X kWh/100 km.

EVExpert doit plutôt proposer :

**Tableau interactif**

| Modèle | Batterie | WLTP | Consommation | Recharge |
| ------ | -------: | ---: | -----------: | -------: |

avec filtres :

* marque ;
* modèle ;
* prix ;
* batterie ;
* autonomie ;
* puissance ;
* recharge.

Même principe pour :

* autonomie ;
* consommation ;
* temps de recharge ;
* coût ;
* comparaison thermique/électrique.

---

# 13. Architecture de contenu proposée

## PILIER 1 — Consommation

Guide :

`/guides/consommation-voiture-electrique`

Outil :

`/outils/calculateur-consommation-voiture-electrique`

Comparateur :

`/comparateur/consommation-voiture-electrique`

---

## PILIER 2 — Autonomie

Guide :

`/guides/autonomie-voiture-electrique`

Outil :

`/outils/simulateur-autonomie-voiture-electrique`

Comparateur :

`/comparateur/autonomie-voiture-electrique`

---

## PILIER 3 — Recharge

Guide :

`/guides/recharge-voiture-electrique`

Outil :

`/outils/temps-recharge-voiture-electrique`

Outil :

`/outils/cout-recharge-voiture-electrique`

Comparateur :

`/comparateur/cartes-recharge-voiture-electrique`

---

## PILIER 4 — Coût

Outil :

`/outils/cout-voiture-electrique`

Possibles guides complémentaires :

* coût/km ;
* coût annuel ;
* coût vs essence ;
* coût vs diesel ;
* TCO.

---

## PILIER 5 — Batterie

Guide :

`/guides/batterie-voiture-electrique`

Possibles outils futurs :

* estimation de coût batterie ;
* calcul économique ;
* analyse de dégradation si données fiables disponibles.

---

# 14. Maillage interne

Les pages doivent former un réseau logique.

Exemple :

**Guide consommation**

→ calculateur consommation

→ comparateur consommation

→ simulateur autonomie

→ guide autonomie

→ fiches véhicules.

**Guide recharge**

→ calculateur temps recharge

→ calculateur coût recharge

→ comparateur cartes

→ fiches véhicules.

**Guide batterie**

→ fiches véhicules

→ données capacité batterie

→ guide recharge

→ guide autonomie.

Chaque nouvel outil doit recevoir des liens depuis les guides pertinents.

Les pages marques doivent également pointer vers :

* modèles ;
* outils ;
* guides pertinents.

---

# 15. Règle anti-cannibalisation

Ne pas créer :

`/guides/consommation-voiture-electrique`

`/guides/consommation-voiture-electrique-100km`

`/guides/consommation-voiture-electrique-autoroute`

`/guides/consommation-voiture-electrique-130kmh`

si ces pages répondent essentiellement à la même intention.

Préférer :

### Une page principale

`/guides/consommation-voiture-electrique`

avec des sections dédiées :

* consommation moyenne ;
* kWh/100 km ;
* consommation sur autoroute ;
* consommation à 130 km/h ;
* consommation selon vitesse ;
* calcul de consommation.

Créer une page séparée uniquement lorsque l'intention utilisateur et le produit sont réellement différents.

---

# 16. Règle concernant les données

Claude Code ne doit jamais inventer :

* autonomie ;
* capacité batterie ;
* puissance ;
* consommation ;
* prix ;
* temps de recharge ;
* coût de remplacement ;
* dégradation.

Si une valeur n'est pas disponible :

* utiliser une valeur provenant d'une source identifiable ;
* ou afficher "non disponible" ;
* ou afficher une estimation clairement identifiée.

Une estimation doit toujours être distinguée d'une donnée constructeur ou mesurée.

---

# 17. Règle concernant les outils

Les calculateurs doivent être transparents.

Chaque résultat doit afficher :

* les données utilisées ;
* les hypothèses ;
* la formule ou logique générale ;
* les limites de l'estimation.

Exemple :

**Coût recharge**

`coût = énergie consommée × prix du kWh`

avec prise en compte éventuelle du rendement.

Pour le temps de recharge, ne pas présenter une simple division comme une durée exacte lorsque la courbe de charge réelle n'est pas linéaire.

---

# 18. Performance et UX

Le site dispose déjà d'une bonne base technique.

Les nouvelles fonctionnalités doivent préserver :

* performances mobile ;
* Core Web Vitals ;
* accessibilité ;
* responsive design ;
* absence de layout shift ;
* absence de scroll horizontal ;
* faible JavaScript inutile.

Les outils doivent fonctionner rapidement côté client lorsque cela est possible.

Éviter les dépendances lourdes uniquement pour réaliser des calculateurs simples.

---

# 19. SEO technique

Chaque page doit avoir :

* title unique ;
* meta description unique ;
* H1 unique ;
* structure H2/H3 cohérente ;
* canonical ;
* données structurées lorsque pertinentes ;
* breadcrumbs lorsque pertinents ;
* liens internes ;
* contenu réellement utile.

Les pages doivent être indexables uniquement lorsqu'elles ont suffisamment de valeur.

Éviter de générer des milliers de combinaisons de filtres indexables.

Les paramètres/filtres doivent être contrôlés pour éviter la génération massive d'URLs SEO inutiles.

---

# 20. Images

Les images doivent servir le contenu.

Pour les guides :

* image principale pertinente ;
* illustrations/tableaux lorsque nécessaire ;
* alt text descriptif ;
* formats optimisés.

Éviter les images génériques uniquement destinées à remplir la page.

Pour les outils, privilégier les visualisations réellement utiles :

* graphique ;
* tableau ;
* schéma ;
* indicateur.

---

# 21. AdSense / qualité éditoriale

L'objectif n'est pas uniquement de maximiser le nombre de pages.

Le site doit progressivement montrer :

* expertise ;
* utilité ;
* données ;
* méthodologie ;
* transparence ;
* navigation claire.

Éviter les pages de 300–500 mots générées uniquement pour cibler une keyword.

Une page peut être plus courte si l'outil apporte réellement la réponse.

À l'inverse, les guides importants doivent être suffisamment complets pour couvrir l'intention.

---

# 22. Roadmap initiale proposée

Ne pas développer les 11 éléments simultanément.

Ordre logique :

### Phase 1 — Fondations

1. Guide batterie
2. Guide consommation
3. Guide autonomie
4. Guide recharge

### Phase 2 — Outils à forte valeur

5. Calculateur consommation
6. Simulateur autonomie
7. Calculateur temps de recharge
8. Calculateur coût recharge
9. Calculateur coût EV vs thermique

### Phase 3 — Comparateurs

10. Comparateur consommation
11. Comparateur autonomie
12. Comparateur cartes de recharge

### Phase 4 — Enrichissement des pages existantes

13. Pages marques
14. Pages modèles
15. Maillage interne
16. données structurées
17. tableaux interactifs

---

# 23. Processus obligatoire avant chaque nouvelle page

Avant de développer une page :

### Étape 1

Identifier les keywords avec OpenSEO.

### Étape 2

Regrouper les synonymes et variantes.

### Étape 3

Analyser la SERP réelle.

### Étape 4

Identifier le type de contenu dominant :

* article ;
* guide ;
* tableau ;
* outil ;
* comparateur ;
* page commerciale.

### Étape 5

Identifier ce qui manque aux résultats existants.

### Étape 6

Définir l'avantage spécifique d'EVExpert.

### Étape 7

Définir URL + title + H1 + structure.

### Étape 8

Développer.

### Étape 9

Ajouter le maillage interne.

### Étape 10

Tester :

* build ;
* lint ;
* responsive ;
* accessibility ;
* performance ;
* SEO metadata ;
* sitemap.

---

# 24. Ce qu'il ne faut PAS faire

Ne pas :

* créer 50 articles SEO génériques ;
* créer une page pour chaque variante de keyword ;
* copier/reformuler les constructeurs ;
* inventer des caractéristiques ;
* inventer des prix ;
* afficher des estimations comme des données officielles ;
* indexer toutes les combinaisons de filtres ;
* cibler uniquement les gros volumes ;
* considérer OpenSEO Comp comme une mesure absolue de difficulté ;
* développer un outil sans vérifier son intention de recherche ;
* développer plusieurs outils qui répondent exactement au même besoin.

---

# 25. Prochaine étape de recherche

Les prochaines SERP à analyser dans OpenSEO sont :

1. `simulateur autonomie voiture électrique`
2. `tableau consommation voiture électrique`
3. `simulateur temps de recharge voiture électrique`
4. `coût voiture électrique au km`

Pour chacune :

* conserver France ;
* Related keywords ;
* 300 résultats ;
* Clickstream-refined volumes ;
* récupérer les principaux keywords ;
* récupérer la SERP Analysis.

Ces données seront ajoutées à ce rapport avant de lancer les développements correspondants.

---

# 26. Instruction finale pour Claude Code

Ce document doit être considéré comme une **stratégie de référence**, et non comme une demande de tout développer immédiatement.

Avant toute implémentation :

1. vérifier l'état actuel du repository ;
2. vérifier les routes existantes ;
3. réutiliser les composants existants ;
4. réutiliser `src/data/vehicles.ts` comme source de vérité actuelle ;
5. éviter les duplications ;
6. préserver les performances ;
7. ne pas modifier inutilement l'architecture ;
8. proposer un plan avant une modification importante ;
9. implémenter par petits lots vérifiables ;
10. effectuer les tests après chaque lot.

**Priorité absolue : qualité et utilité des pages plutôt que quantité.**

EVExpert doit devenir progressivement un site combinant :

> **Données véhicules + outils pratiques + comparateurs + guides spécialisés**

et non un simple blog automobile généré automatiquement.

---

# 27. SEO à l'ère des moteurs de réponse IA

Section ajoutée en septembre 2026. Elle complète les sections 12 à 26 et ne les remplace pas. En cas de conflit, les principes du site (données sourcées, aucun classement, rien d'inventé) prévalent.

### 27.1 Constat

Les résumés IA de Google (AI Overviews) et les assistants (ChatGPT, Perplexity) répondent directement aux questions purement informatives. Des études sectorielles de 2025 indiquent une forte baisse des clics sur le premier résultat quand un résumé IA s'affiche, des sources citées très différentes d'un assistant à l'autre, et une corrélation marquée entre les mentions d'une marque sur le web et sa visibilité dans ces résumés. Ce sont des tendances et des corrélations, à prendre comme ordres de grandeur, pas comme des règles.

Conséquence pour EVExpert : la stratégie « données + outils + comparateurs + guides » est la bonne. Un calculateur, un simulateur ou un tableau filtrable ne peut pas être entièrement remplacé par un résumé IA ; une définition peut l'être.

### 27.2 Filtre « action ou information » avant toute nouvelle page

À ajouter à l'étape 4 du processus (section 23) : pour chaque intention, se demander si une IA peut satisfaire entièrement l'utilisateur seule.

- **Oui** (définition, question simple) : ne créer une page que si EVExpert apporte quelque chose d'impossible à résumer : données du catalogue, calcul, tableau, exemple chiffré. Sinon, traiter la question comme une section d'un guide existant.
- **Non** (calculer, comparer, simuler, choisir selon sa situation) : priorité haute. Construire autour de l'outil ou du tableau, le texte venant en appui.

Pour le tri des mots-clés dans OpenSEO, prioriser les requêtes contenant « calculateur », « simulateur », « calcul », « tableau », « comparatif », « vs », « coût », « temps de », et les requêtes transactionnelles ou commerciales.

### 27.3 Règles de rédaction

- **Réponse directe d'abord.** Sous chaque H2 et H3, commencer par 2 ou 3 phrases qui répondent à la question du titre, avec le chiffre clé s'il existe, avant de développer.
- **Intertitres formulés comme de vraies questions** d'utilisateurs, quand c'est naturel (« Combien de temps pour recharger à 11 kW ? »).
- **Tableaux** dès qu'il y a une comparaison de caractéristiques ou de coûts, avec la nature de chaque donnée.
- **Entités explicites** : noms exacts des modèles et versions, des standards (Type 2, CCS, WLTP), des sources. Pas de formulations vagues (« certains modèles », « de nombreux experts »).
- **Chaque chiffre reste sourcé et daté**, avec son badge de nature, comme partout ailleurs sur le site.

### 27.4 Comparaisons « vs »

Les pages de duels du comparateur sont le format « vs » d'EVExpert. Pour en ajouter aux duels pré-calculés existants :

- la comparaison doit avoir une demande de recherche vérifiée dans OpenSEO ;
- les deux versions doivent être au catalogue, avec des données complètes ;
- la page doit apporter un contenu propre (écarts chiffrés, orientation par usage), pas seulement le tableau générique ;
- aucune génération automatique de toutes les combinaisons possibles (rappel de la section 19). Les duels non retenus restent accessibles dans le comparateur, sans URL indexable dédiée.

### 27.5 Orientation par usage plutôt que « meilleur »

Les requêtes du type « meilleure voiture électrique pour… » se traitent avec des sections « Pour quel usage ? », comme sur les pages marques : une orientation par usage justifiée par les chiffres du catalogue, jamais un classement.

### 27.6 Interdits

- Intertitres ou titres « meilleur », « top », « classement » qui désignent un gagnant.
- « Avis », « test », « essai » : EVExpert ne teste pas les véhicules. Ces termes ne s'utilisent que pour un essai réellement réalisé par EVExpert.
- Preuve sociale non vérifiable : aucune citation de discussions Reddit, de vidéos YouTube ou d'« avis d'experts » sans source identifiable et lien.
- Génération d'articles en série. Chaque nouvel article doit s'appuyer sur les données d'EVExpert, apporter un angle propre et être relu avant publication. Google sanctionne le contenu produit en masse pour capter des requêtes.
- Blocs répétés à l'identique sur de nombreuses pages (FAQ gabarit, introductions à trous).

### 27.7 Mentions de marque (hors site)

Ce levier se joue surtout en dehors du site, par le propriétaire du site : faire connaître les analyses de données auprès de médias spécialisés, de forums et de communautés de conducteurs, et participer sincèrement aux discussions, sans spam.

Ce que le site peut faire pour faciliter ces mentions :

- chaque analyse de blog met en avant un chiffre clé citable, un graphique et un lien vers la méthodologie, avec la date des données ;
- un bloc « Citer cette analyse » en fin d'article, avec une formule de citation prête à copier (titre, EVExpert, date, URL).

### 27.8 Lots futurs proposés (après le lot consentement)

1. **Réponses directes dans les 23 guides** : ajouter ou reformuler le premier paragraphe de chaque section selon la règle 27.3, sans changer titles, H1 ni URL.
2. **Bloc « Citer cette analyse »** sur les articles de blog.
3. **Duels supplémentaires** : liste des comparaisons recherchées (OpenSEO), puis création des seules pages qui respectent la section 27.4.

Chaque lot suit le protocole habituel : plan validé d'abord, contrôles automatiques, preview, validation avant merge.

---

# 28. Expérience, autorité et durée

Section ajoutée en septembre 2026. Elle complète les sections 12 à 27. En cas de conflit, les principes du site (données sourcées, aucun classement, rien d'inventé) prévalent.

### 28.1 Constat

Le site est solide sur l'expertise et la fiabilité (sources, méthodologie, dates, nature de chaque donnée). Son point faible est l'expérience directe : EVExpert ne teste pas les véhicules. Cette section définit comment la renforcer honnêtement, comment gagner de l'autorité hors du site, et comment conserver les positions dans le temps.

### 28.2 Auteur identifié

- Chaque guide et chaque analyse de blog affiche un auteur réel : nom, photo, courte biographie liée au sujet, date de publication et date de mise à jour.
- L'auteur dispose d'une page (ou d'une section de /a-propos) qui présente son parcours et sa démarche.
- Données structurées : l'auteur est déclaré dans le JSON-LD des articles (type Person, lien vers sa page).
- Les nom, photo et biographie sont fournis par le propriétaire du site. **Jamais d'auteur fictif ni de persona inventée.** S'il n'y a pas d'auteur nommé, l'auteur reste « La rédaction EVExpert », lié à /a-propos et /methodologie.

### 28.3 Retours de propriétaires

Objectif : apporter de l'expérience réelle là où EVExpert ne peut pas tester lui-même.

- Uniquement des retours recueillis auprès de vraies personnes, avec leur accord écrit pour la publication (prénom ou anonymat au choix de la personne).
- Chaque retour précise : véhicule et version, durée de possession, contexte d'usage (trajets, recharge à domicile ou non, région), date du recueil.
- Les chiffres donnés par un propriétaire (consommation réelle, temps de recharge constaté) sont présentés comme des **données déclaratives**, visuellement distinctes des données sourcées du catalogue. Décision à prendre avant le premier retour publié : créer une cinquième nature de donnée (« Retour de propriétaire ») ou un bloc séparé. Ne jamais les mélanger aux données officielles.
- Pas de liste de « pour / contre » ni de note qui laisserait croire à un essai EVExpert.
- **Jamais de témoignage inventé, reformulé au point d'en changer le sens, ou généré.**

Le recueil des retours est fait par le propriétaire du site. Claude Code prépare seulement le format d'affichage et son intégration.

### 28.4 Pages « alternatives à… »

Requêtes visées : « alternative à [modèle] », « voiture électrique comme [modèle] ».

Conditions pour créer une page :

- demande de recherche vérifiée dans OpenSEO pour ce modèle précis ;
- modèle présent au catalogue avec des données complètes ;
- critères de sélection des alternatives explicites et identiques pour toutes les pages (carrosserie, dimensions, fourchette d'autonomie, puissance de recharge), documentés sur /methodologie ;
- pour chaque alternative, les écarts chiffrés avec le modèle de départ, présentés de façon neutre ;
- une introduction et une orientation par usage rédigées pour chaque page, pas un gabarit à trous ;
- aucune formulation « meilleure alternative » ni classement.

Aucune génération pour tous les modèles : seulement ceux qui remplissent les conditions. L'arborescence d'URL est à proposer dans le plan du lot et à valider avant création.

### 28.5 Liens externes et maillage vers les pages stratégiques

- Les liens externes s'obtiennent plus facilement vers des analyses originales que vers des outils. Chaque analyse de blog renvoie donc clairement vers les outils, tableaux et guides correspondants, pour que la valeur de ces liens profite aux pages stratégiques.
- L'obtention de liens et de mentions se fait hors du site, par le propriétaire : médias spécialisés, forums, communautés, partenaires, en proposant des analyses et des chiffres citables (voir 27.7).
- Interdits : achat de liens, échanges de liens organisés, réseaux de sites, commentaires ou messages de forum promotionnels. Google les sanctionne.

### 28.6 Rafraîchissement du contenu

- **Catalogue** : revue régulière (au minimum chaque trimestre) des nouvelles versions, des versions retirées et des changements de caractéristiques, à partir de la source actuelle. Chaque mise à jour garde sa date de relevé.
- **Guides et analyses** : revue au moins annuelle. Priorité aux pages dont les impressions ou la position baissent dans Search Console.
- La date « mis à jour » ne change que pour un vrai changement de contenu visible (règle déjà appliquée).

### 28.7 Lots futurs proposés

À programmer après les lots de la section 27.8, dans cet ordre :

1. **Auteur identifié** : état des lieux de ce qui existe (auteur, dates, JSON-LD), puis affichage et données structurées. Nécessite les informations réelles du propriétaire.
2. **Enrichissement du catalogue** : ajout des modèles manquants identifiés au lot SEO 2, en priorité pour les 6 marques en noindex, puis mise en place de la revue trimestrielle.
3. **Pages « alternatives »** : liste des modèles avec une demande vérifiée dans OpenSEO, critères de sélection, arborescence d'URL, puis création des seules pages qui remplissent les conditions de 28.4.
4. **Format des retours de propriétaires** : décision sur la nature de donnée, composant d'affichage. La publication dépend des retours réellement recueillis.

Chaque lot suit le protocole habituel : plan validé d'abord, contrôles automatiques, preview, validation avant merge, aucun test lourd sur le domaine de production.
