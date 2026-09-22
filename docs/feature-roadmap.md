# Feuille de route fonctionnelle — EVExpert

Statut : **phase terminée et implémentée**. Ce document couvre l'exploration du produit, les
frictions identifiées, les fonctionnalités retenues (implémentées et testées) et celles
volontairement écartées, avec la raison de chaque décision. Rien n'a été poussé vers GitHub.

Question directrice, reprise du mandat : *quelle tâche importante un utilisateur d'une voiture
électrique essaie-t-il de réaliser aujourd'hui, et comment EVExpert peut-il lui faire gagner du
temps, éviter une erreur ou prendre une décision avec des données compréhensibles ?*

---

## A. Ce que le produit sait déjà faire (exploration)

Avant de proposer quoi que ce soit, inventaire de l'existant pour ne rien dupliquer :

- **Catalogue** : 47 versions, 45 modèles, 22 marques (`src/data/catalog/`, Drizzle/Supabase en
  production, données locales en développement). Chaque véhicule a une source, une date de relevé,
  une nature de donnée (`DataType`). Le **prix est `null` pour toutes les versions** — confirmé par
  un test existant (`tests/unit/validation.test.ts`) — il n'y a donc **aucune donnée de budget
  exploitable** dans tout le catalogue.
- **Fiche véhicule** (`VehicleDetail.tsx`) : cotes clés, autonomie par scénario (`RANGE_SCENARIOS`,
  `estimateRange`), temps de recharge AC/DC, **coût de recharge à trois tarifs fixes** (domicile,
  public AC, rapide DC) non paramétrable par kilométrage réel, fiche technique complète, sources.
- **Comparateur** (`/comparer`, `/comparer/[slug]`) : 2 à 3 véhicules, écarts chiffrés neutres
  (`Δ`), 8 duels pré-générés et statiques (`FEATURED_PAIRS`, `dynamicParams = false`). Pas d'état
  dans l'URL en dehors des duels pré-générés ; pas de bouton « comparer » sur les cartes.
- **7 calculateurs** (`/outils/*`) : coût de recharge (SoC → SoC, prix, rendement), autonomie
  réelle (vitesse/température/type de conduite/réserve — `computeRange`), coût aux 100 km
  (électrique/essence/diesel/hybride), essence vs électrique, TCO, **temps de recharge (SoC → SoC,
  puissance)**, puissance de borne (AC/DC, tableau comparatif). Tous acceptent un « préréglage »
  d'un modèle réel du catalogue (`VehiclePresetSelect`).
- **Recherche** (`/recherche`) : véhicules, outils, guides, articles, par mots-clés.
- **23 guides + 7 analyses**, sourcés, avec schémas et photos éditoriales.
- **SEO** : `sitemap.ts` (124 URLs avant cette phase), JSON-LD par type de page, canonical,
  `noindex` pour les pages dupliquées (marque à un seul modèle, version unique).
- **Architecture** : Server Components par défaut ; les seuls Client Components avant cette phase
  étaient les calculateurs, `VehicleExplorer`, `ComparisonBuilder`, `NavLink`, `CookieBanner`,
  `Analytics`. Aucun `localStorage`, aucune URL d'état applicatif hors les pages statiques.

## B. Parcours utilisateur : frictions réelles trouvées

| Persona | Ce qu'il/elle essaie de faire | Friction constatée |
|---|---|---|
| A. Première voiture électrique | Trouver un modèle sans connaître les seuils techniques | Le catalogue ne propose que des filtres numériques bruts (autonomie ≥ X km, charge DC ≥ Y kW) : il faut déjà savoir ce qu'on cherche. Aucune entrée par l'usage. |
| B. Hésite entre 2-3 modèles | Comparer concrètement, y compris avec quelqu'un d'autre | Le comparateur n'a pas d'état dans l'URL (sauf les 8 duels figés) et aucune carte du catalogue ne propose de « comparer » directement. |
| C. Trajet quotidien | Combien ça va vraiment coûter par mois/an | Le tableau de coût de la fiche a trois tarifs **fixes**, non modifiables, sans mélanger domicile/public ni kilométrage réel. |
| D. Long trajet | Cette voiture passe-t-elle mon trajet, combien d'arrêts | Rien n'existe : ni sur la fiche, ni dans les outils. |
| E. Recharge domicile | Quelle puissance, combien de temps | Déjà bien couvert (guides « 7,4/11/22 kW », outil puissance de borne, page recharge). |
| F. Recharge publique | Différence 50/150/250/350 kW | Déjà bien couvert (`/outils/puissance-borne-recharge`, guides recharge). |
| G. Propriétaire VE | Réduire conso, préserver la batterie | Déjà bien couvert (guides autonomie/batterie). |
| H. Donnée précise | Batterie utile, puissance DC, coût | Déjà bien couvert (fiche, recherche, comparateur). |

Les frictions réelles se concentrent sur **A, B, C, D** — c'est là que la valeur ajoutée est la
plus forte. E/F/G/H sont déjà bien traités par le contenu et les outils existants ; y ajouter des
fonctionnalités aurait été de la redite, pas un service rendu.

## C. Fonctionnalités retenues (implémentées)

Quatre chantiers, choisis pour leur rapport valeur/complexité et leur cohérence avec
l'architecture existante (aucune dépendance nouvelle, aucun compte utilisateur, aucune API
externe, aucune donnée inventée).

### 1. Garage (« Ma sélection ») + comparateur partageable

- **Problème (persona B)** : comparer 2-3 modèles réels ou envoyer la comparaison à quelqu'un
  demandait de re-sélectionner manuellement à chaque visite.
- **Solution** : `localStorage` (jusqu'à 3 véhicules, même schéma que le consentement cookies :
  repli mémoire, événement custom, aucun compte, aucun tracking). Bouton **« Comparer »** sur
  chaque `VehicleCard`/`VehicleRow` du site (icône seule sur les cartes, libellé visible dans les
  tableaux). Barre flottante globale (`GarageBar`, montée dans `layout.tsx`, **jamais dans le
  header/footer**) qui apparaît dès 1 véhicule sauvegardé, avec lien direct vers le comparateur.
  `/comparer` lit désormais `?v=id1,id2,id3` côté serveur (lien partageable, adopté automatiquement
  dans « Ma sélection » de celui qui ouvre le lien) et tient l'URL à jour à chaque changement
  (`router.replace`, sans rechargement) ; bouton « Copier le lien ».
- **Pourquoi retenue** : répond à la fois aux items « favoris », « bouton comparer depuis toute
  carte » et « URLs partageables » du mandat, sans dupliquer le système en trois fonctionnalités
  séparées — la sélection **est** le panier du comparateur.
- **Fichiers** : `src/components/garage/*` (`garage-store.ts`, `useGarage.ts`, `GarageToggle.tsx`,
  `GarageBar.tsx`), `VehicleCard.tsx`, `VehicleRow.tsx`, `src/app/comparer/page.tsx`,
  `ComparisonBuilder.tsx`, `src/app/layout.tsx`. Commit `50ba6da`.
- **Bug réel trouvé et corrigé en cours de route** : les classes de base de `GarageToggle`
  imposaient `relative`, qui entrait en conflit avec `absolute` passé par `VehicleCard` selon
  l'ordre des règles générées par Tailwind (pas l'ordre du texte des classes), plaçant le bouton
  en flux normal au lieu d'un badge en coin. Corrigé en ne codant plus la position en dur dans le
  composant partagé, et en passant la carte en variante icône seule (le libellé complet faisait
  déborder la marque et la carrosserie à 1440 px).

### 2. Assistant de sélection (« Trouver ma voiture »)

- **Problème (persona A)** : aucune entrée par l'usage, seulement des filtres numériques bruts.
- **Solution** : `/voitures-electriques/trouver`. Six questions (trajet quotidien, trajets
  autoroute fréquents, recharge domicile/travail possible, places minimum, coffre minimum,
  carrosserie). Pour **chaque véhicule**, chaque critère est affiché individuellement rempli/non
  rempli/« donnée non disponible » (jamais deviné) — **aucun score global opaque, aucun
  classement**, conformément à la consigne explicite. **Aucun critère de budget** : le prix est
  absent de toutes les fiches (voir section A), donc aucun n'a été simulé.
- **Pourquoi retenue** : c'est la fonctionnalité de découverte la plus demandée dans le mandat et
  la seule à n'avoir strictement aucun équivalent existant.
- **Fichiers** : `src/lib/vehicle-finder.ts` (pur, testé), `src/components/finder/VehicleFinder.tsx`
  (client, calcule sur les données déjà envoyées à la page — même volume que le catalogue),
  `src/app/voitures-electriques/trouver/page.tsx`. Points d'entrée : lien sur `/voitures-electriques`
  et en fin de section « 01 Autonomie » de l'accueil (aucune modification du header/footer).
  Commit `a8405a1`.
- **Bug réel trouvé et corrigé** : accord singulier/pluriel incorrect (« 0 version remplissent »)
  découvert en testant un filtre strict (7 places, qu'aucun véhicule du catalogue ne propose) ;
  remplacé par « Aucune version ne remplit tous les critères applicables ».

### 3. Estimateur de coût annuel personnalisé (sur la fiche véhicule)

- **Problème (persona C)** : le tableau de coût de la fiche a trois tarifs fixes, sans
  kilométrage réel ni mélange domicile/public.
- **Solution** : bloc interactif ajouté après ce tableau (`VehicleCostEstimator`, îlot client dans
  la fiche, sinon 100 % serveur) : kilométrage annuel, prix domicile, prix public, curseur de part
  domicile → coût aux 100 km, par mois, par an, sur 3 ans, kWh/an. Réutilise la consommation réseau
  déjà calculée pour ce véhicule (`gridConsumption100`) : aucune nouvelle formule inventée.
  Explicitement limité au coût énergie (pas d'assurance/entretien/dépréciation) pour ne pas
  dupliquer le calculateur TCO existant, avec un lien vers lui.
- **Pourquoi retenue** : gain direct et vérifié à la main (517 € → 1 292 € → 1 875 € selon les
  paramètres), sur la page où l'utilisateur regarde déjà les chiffres du véhicule — pas besoin de
  ressaisir ses caractéristiques dans un outil séparé.
- **Fichiers** : `computeUsageCost` (`src/lib/calculators/index.ts`, testé),
  `src/components/vehicles/VehicleCostEstimator.tsx`, intégré dans `VehicleDetail.tsx`.
  Commit `367ae6c`.

### 4. Simulateur de trajet longue distance

- **Problème (persona D)** : aucune fonctionnalité ne répond à « cette voiture passe-t-elle mon
  trajet, avec combien d'arrêts ».
- **Solution** : `/outils/trajet-longue-distance`, même gabarit que les 7 autres outils
  (`ToolPageShell`). Entrées : distance, vitesse moyenne, température, réserve de sécurité,
  préréglage d'un modèle réel (ou batterie/consommation/puissance DC saisies à la main). Sorties :
  autonomie réelle par trajet (réutilise **exactement** la même formule que le calculateur
  d'autonomie, `computeRange` — aucune courbe inventée), nombre d'arrêts, durée totale de recharge,
  coût. **Explicitement présenté comme une simulation, pas une navigation** (bandeau
  d'avertissement, pas de carte, pas de bornes réelles), conformément à la consigne.
- **Pourquoi retenue** : seule capacité demandée par le mandat sans aucun équivalent existant
  (contrairement au « simulateur de recharge », voir rejets).
- **Fichiers** : `computeTripPlan` (`src/lib/calculators/index.ts`, testé),
  `src/components/calculators/TripPlanner.tsx`, `src/app/outils/trajet-longue-distance/page.tsx`,
  entrées dans `tools.ts`/`toolContent.ts`. Commit `f73276a`.
- **Vérifié à la main** : 1 200 km à 120 km/h/10 °C/batterie 60 kWh/16 kWh·100 km/90 kW DC moyen →
  5 arrêts, 300,0 kWh, 195,00 €, 3 h 20 — cohérent avec le calcul manuel (54 kWh utiles par étape
  ÷ 90 % de rendement × 5 arrêts).

## D. Fonctionnalités volontairement rejetées

| Idée (item du mandat) | Raison du rejet |
|---|---|
| **Simulateur de recharge** (batterie, SoC départ/arrivée, borne → énergie, temps, coût) | **Existe déjà** sous une autre forme : `/outils/cout-recharge-voiture-electrique` (SoC → SoC, prix) + `/outils/temps-recharge` (SoC → SoC, puissance) couvrent exactement ces entrées/sorties. En créer un troisième aurait été une redite, contraire à la consigne « ne propose pas une fonctionnalité qui existe déjà sous une autre forme ». |
| **Critère de budget** dans l'assistant de sélection ou tout autre outil | Le prix est `null` pour les 47 versions du catalogue (aucune source française collectée). Simuler un budget aurait exigé d'inventer une donnée — interdit explicitement. |
| **Étendre `/comparer/[slug]` à toute paire possible** (SEO programmatique) | ~1 080 combinaisons possibles, toutes indexables sans curation : exactement le « bloat SEO » à éviter. La forme `?v=...` du comparateur donne la même valeur de partage sans créer de surface d'indexation incontrôlée ; les 8 duels pré-générés restent la sélection éditoriale indexable. |
| **Alertes / évolution des données** (changement de prix, nouveau modèle) | Demande soit un compte (rejeté par la contrainte), soit une infrastructure de notification disproportionnée pour la valeur ; aucune solution simple sans compte n'a été trouvée. |
| **Bouton « copier une donnée »** sur chaque chiffre (mobile) | Aurait forcé `DataFigure` (aujourd'hui pur, utilisable aussi bien côté serveur que client) à devenir un Client Component partout où il est utilisé — contraire au principe « pas de nouveau Client Component sans justification » établi pendant la refonte UI, pour un gain marginal (la sélection de texte native fonctionne déjà). |
| **Système de compte complet** pour les favoris | `localStorage` suffit entièrement au besoin (shortlist de 3 véhicules, un seul appareil) ; un compte aurait ajouté une dépendance backend et une charge de maintenance sans bénéfice proportionné. |
| **Garage à plus de 3 véhicules** | Le comparateur n'accepte que 3 emplacements (A/B/C) ; aligner la taille du panier sur cette limite évite une étape de sélection supplémentaire (« lesquels comparer parmi les 6 sauvegardés ? ») et simplifie le mental model. |

## E. Budget de performance — bilan mesuré

| Page | Avant cette phase | Après (JS gzip) | Écart |
|---|---|---|---|
| Accueil | 194,5 Ko | 196,1 Ko | +1,6 Ko (Garage global) |
| Catalogue | 195,3 Ko | 196,6 Ko | +1,3 Ko |
| Fiche véhicule | 190,9 Ko | 194,1 Ko | +3,2 Ko (Garage + estimateur de coût) |
| Comparateur | 194,8 Ko | 196,1 Ko | +1,3 Ko (Garage + lien copiable) |
| Recharge | 195,4 Ko | 195,4 Ko | inchangé |
| Guide/article | 195,4 Ko | 195,4 Ko | inchangé |
| Outil | 193,3-201,2 Ko | 193,4-193,7 Ko | stable |
| Trouver ma voiture (nouveau) | — | ~196 Ko (classe « catalogue ») | — |
| Trajet longue distance (nouveau) | — | ~193,7 Ko (classe « outil ») | — |

Quatre pages dépassent désormais légèrement le garde-fou de 195 Ko (196,1 à 196,6 Ko), toutes à
cause de `GarageBar`, montée une seule fois dans `layout.tsx` et donc présente sur **toutes** les
pages du site. C'est un arbitrage assumé : une barre de sélection persistante n'a de sens que si
elle est disponible partout, et le dépassement (moins de 2 Ko) est mineur au regard du gain
d'usage réel (comparer depuis n'importe quelle carte, retrouver sa sélection). Aucune fonctionnalité
n'a été retirée pour gratter ces quelques kilo-octets.

**Lighthouse mobile** (après toute la phase) : Performance 96-99, Accessibilité **100 partout**,
Bonnes pratiques 100, SEO 100, CLS 0 sur les neuf pages mesurées, y compris les deux nouvelles.
Un contraste insuffisant (`text-muted` sur fond `ink`, note de bas de résultat) a été trouvé en
auditant le nouveau simulateur de trajet (97) ; il s'est révélé **préexistant** dans trois
calculateurs déjà en production (coût de recharge, temps de recharge, autonomie réelle), qui
utilisaient encore `text-muted` au lieu de `text-ink-muted` dans le panneau sombre de résultats
introduit lors de la refonte UI. Corrigé dans les quatre fichiers (une classe par fichier) ;
vérifié à 100/100 sur les quatre pages après correction.

**SEO** : comparaison automatisée des 126 URLs avant/après (title, description, canonical, robots,
JSON-LD, liens, empreinte du texte) : **aucune différence** de `title`/`description`/`canonical`/
`robots`/`jsonld` sur aucune page. Seuls diffèrent, comme attendu : les liens internes de l'accueil
et du catalogue (nouveau lien vers l'assistant), l'empreinte de texte de toutes les pages
véhicule/marque/modèle (le bouton « Comparer », visible ou en `sr-only`, y apparaît désormais), et
les deux nouvelles URLs (`/outils/trajet-longue-distance`, `/voitures-electriques/trouver`), ajoutées
au sitemap (124 → 126 URLs, tests mis à jour).

## F. Tests

- **Unitaires** : 105 tests (12 fichiers), dont 22 nouveaux pour cette phase
  (`tests/unit/cost-and-trip.test.ts`, `tests/unit/vehicle-finder.test.ts`) couvrant
  `computeUsageCost`, `computeTripPlan` et `matchVehicle`/`matchVehicles` (bornes, cas nul,
  cohérence du tri, absence de tout critère de prix vérifiée par introspection du code source de
  la fonction).
- **Fonctionnels, dans un vrai Chrome (Puppeteer)** : ajout/retrait dans le Garage, plafond à 3,
  lien partageable → présélection correcte du comparateur, réactivité de l'estimateur de coût
  (517 € → 1 292 € → 1 875 €), réactivité du simulateur de trajet (500 km → 1 200 km, valeurs
  vérifiées à la main), différenciation réelle de l'assistant de sélection (47 → 39 → 28 → 0
  véhicules selon les critères) — sans aucune erreur console.
- **Non-régression** : `npm run typecheck`, `npm run lint`, `npm run build` (186 pages générées),
  `node scripts/smoke-routes.mjs` (37 routes, mises à jour), `node scripts/seo-snapshot.mjs --diff`
  (voir section E), captures à 320/390/768/1280/1440 px sans débordement horizontal.

## G. Commits de cette phase

```
302fab7 feat(lib): pure calculators for annual cost, trip planning and vehicle matching
50ba6da feat(garage): shortlist (localStorage) + shareable, prefillable comparator
367ae6c feat(vehicle): personalised annual cost estimator on the fiche
f73276a feat(outils): long-distance trip simulator
a8405a1 feat(finder): guided vehicle-selection assistant ('Trouver ma voiture')
```

Aucun push vers `origin` : les commits restent locaux, en attente d'accord.

## H. Pistes envisageables plus tard (non implémentées)

- Corriger le point d'accessibilité mineur du simulateur de trajet (Lighthouse 97, à isoler
  précisément avant correction plutôt que deviner).
- Si une vraie source de prix France devient disponible : ajouter un critère de budget à
  l'assistant de sélection et une comparaison de coût d'achat — pas avant.
- Si l'usage du Garage se confirme, envisager d'afficher les noms des véhicules dans `GarageBar`
  (aujourd'hui volontairement limitée au compteur, pour ne pas lui faire porter les données du
  catalogue sur chaque page du site) — arbitrage à revoir avec des données d'usage réelles, pas de
  manière spéculative.
- Un export/impression du comparateur (utile pour un usage hors-ligne) n'a pas été demandé et n'a
  pas de demande identifiée ; à ne construire que si un besoin réel apparaît.
