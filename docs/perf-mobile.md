# Performance mobile — diagnostic PageSpeed Insights (3 octobre 2026)

Mesures faites avec l'interface web PageSpeed Insights (les serveurs de Google chargent le site ; l'API anonyme répondait 429, quota partagé saturé). Mobile, `www.evexpert.fr`, code de `main` (528c1c1). Un passage prend 40 à 60 s ; certains n'ont pas abouti.

## 1. Résultats

| Page | Passages (score) | FCP / LCP simulés |
|---|---|---|
| Accueil | **63**, 99, 99, **65** | passages lents : FCP 4,3 s / LCP 7,3–7,7 s ; rapides : FCP 0,9 s / LCP 1,9 s |
| `/guides/temps-recharge-voiture-electrique` | 96, 98 (3ᵉ passage non terminé) | FCP 0,9 s / LCP 2,3 s |
| Fiche version (Tesla Model 3 Long Range RWD) | 98, **62** | rapide : 0,9 s / 2,3 s ; lent : 4,3 s / 8,1 s |

Les scores PSI sont **bimodaux** : 3 passages sur 8 donnent 62–65, les autres 96–99, pour le même code, à quelques minutes d'intervalle. Le « 63 » n'est donc pas un niveau stable : c'est le mode bas d'une mesure qui oscille. Le mode haut (96–99) correspond à Lighthouse en local (94–96).

Dans les passages lents, le FCP simulé vaut toujours 4,3 s, au dixième près. TBT (10–80 ms), CLS (0) et accessibilité/SEO (100) ne bougent pas : seul le chargement initial change.

## 2. Ce que montrent les passages lents

- **Élément LCP** : le H1 du hero (accueil) ou le premier paragraphe (fiche) : du texte, pas une image.
- **Découpage du LCP observé** : TTFB 0–10 ms (serveur : 5 ms, aucune redirection, compression active), puis **1,3 à 2,3 s de « délai d'affichage de l'élément »** avant le premier rendu du texte. Rien ne se charge pendant ce temps : le navigateur du labo ne peint pas.
- **Ressource bloquant le rendu** : une seule, la feuille CSS (12,3 Kio, 600–660 ms simulés ; 159 ms dans nos mesures locales).
- **Chaîne critique** : courte (4 requêtes, 300 ms au plus). `lcp-discovery` et `network-dependency-tree` sont signalés sans chaîne identifiée.
- **Scripts tiers** (accueil) : Google Ads ~281 Kio (`show_ads_impl` 164 Kio, `adsbygoogle.js` 57 Kio, 168 ms de thread principal), Funding Choices (message de consentement) 104 Kio (51 ms), adtrafficquality 28 Kio : **≈ 413 Kio** et deux tâches longues (70 et 54 ms). GA4 n'apparaît pas (il n'est chargé qu'après consentement).
- **JavaScript propre** : 70 Kio de chunk principal dont 27 Kio inutilisés au chargement (hydratation React), 13,8 Kio de polyfills (`Array.prototype.at/flat/flatMap`, `Object.fromEntries`…) signalés comme « ancien JavaScript ».
- **HTML** : 255 Ko (33 Ko compressé) dont 145 Ko de données RSC en ligne.

## 3. Pourquoi l'écart avec nos mesures locales (≈ 96)

Lighthouse **simule** le ralentissement réseau à partir d'une trace observée. Le FCP simulé est une moyenne entre un scénario optimiste (seulement les requêtes qui bloquent le rendu) et un scénario pessimiste (**toutes** les requêtes lancées avant le premier rendu observé). Si le premier rendu observé arrive tôt, seules le HTML et la CSS comptent : FCP 0,9 s. S'il arrive tard, les scripts, polices, image et scripts tiers lancés entre-temps entrent dans le calcul et se partagent la bande passante simulée (≈ 1,5 Mbit/s) : les ~617 Ko de la page (≈ 3,4 s de transfert) expliquent précisément le saut de 0,9 s à 4,3 s observé dans les passages lents.

Reste la question qui n'est **pas tranchée** : pourquoi le premier rendu *observé* arrive 1,3–2,3 s après le premier octet sur les serveurs de Google, contre ~0,1 s dans nos mesures locales (testé en local : CPU ralenti ×8, saturation de la machine, blocage des domaines Google — rien ne reproduit le mode bas ; le score reste à 94–96). Hypothèses, par ordre de plausibilité :

1. travail du navigateur avant le premier rendu (analyse d'un HTML de 255 Ko avec 66 balises `<script>` en ligne, CSS, polices `display: optional` préchargées) sur des machines de test plus lentes ou chargées de façon variable ;
2. contention sur les ressources lancées dès l'analyse du HTML (4 polices, image du hero, 10 scripts, préchargement d'`adsbygoogle.js`) ;
3. facteur propre à la production (CDN, pare-feu) qu'on ne voit pas en local.

Pour trancher il faut les valeurs **observées** (FCP/LCP avant simulation) et la liste des requêtes d'un passage lent et d'un passage rapide : c'est ce que sort `scripts/psi-runs.mjs`, avec une clé API PageSpeed.

## 4. Corrections testées en local (3 passages, Lighthouse mobile, même simulation)

| Essai | Résultat |
|---|---|
| Référence (build de `main`) | score 96, FCP 0,91 s, LCP 2,75 s, 617 Ko |
| `experimental.inlineCss` (CSS dans le HTML) | **pire** : FCP 1,0 s, LCP 2,9 s ; le HTML passe de 255 à 429 Ko (CSS dupliquée dans les données RSC) → abandonné |
| `browserslist` moderne (Chrome/Edge/Firefox ≥ 111, Safari ≥ 16.4) | **aucun effet** : Turbopack garde les 13 Kio de polyfills → abandonné |
| Blocage des domaines Google (publicité, consentement, tiers) | score inchangé (95–96) ; 617 → 343 Ko ; TBT 11 → 4 ms |
| CPU ×6 et ×8 | score 94–95 ; TBT ×8 : 150 ms |

## 5. Pistes classées par gain attendu (non appliquées : elles touchent AdSense ou ne sont pas mesurées)

1. **(Refusée pour l'instant — à réévaluer après l'approbation AdSense.)** **Charger AdSense et le message de consentement après l'interaction ou en `lazyOnload`**, et supprimer le `<link rel="preload" as="script">` qu'`afterInteractive` ajoute dans le `<head>` : ~413 Kio et deux tâches longues sortent de la fenêtre de chargement. Effet sur le consentement : le mode par défaut « tout refusé » (Consent Mode v2) est posé avant, rien n'est collecté sans accord ; en revanche le message Google s'afficherait plus tard (après l'inactivité ou au premier geste), et les annonces/vérifications d'AdSense aussi. **À valider avant toute modification.**
2. Alléger ce qui précède le premier rendu : réduire à 2 le nombre de polices préchargées (les 3 graisses de Plex Mono pèsent 30 Ko ; effet visuel à la première visite : chiffres un instant en police de repli avec `display: optional`), réduire le HTML (145 Ko de données RSC).
3. Retirer les polyfills (13,8 Kio) par un alias Turbopack de `polyfill-module` : risque (`URL.canParse` est polyfillé pour Chrome < 120), gain limité (≈ 3 % des octets).
4. Clé API PageSpeed + `scripts/psi-runs.mjs` : 10 passages par page, avant/après, pour juger tout changement sur des statistiques et non sur un passage isolé.

## 6. Décisions du 3 octobre 2026

- Piste 1 (AdSense et message de consentement différés) : **refusée tant que l'examen AdSense est en cours** — le robot d'examen pourrait ne pas voir le script s'il n'est chargé qu'après un geste. À réévaluer après l'approbation, avec un chargement **au premier geste de l'utilisateur ou après quelques secondes d'inactivité** (pas seulement `lazyOnload`), en vérifiant que le message de consentement Google s'affiche toujours et que le mode par défaut « tout refusé » reste posé avant.
- Piste 2 (réduire les données RSC, 2 polices préchargées au lieu de 4) : validée, branche `perf/rsc-polices`.
- Piste 3 (retrait des polyfills) : refusée.

## 7. Lot `perf/rsc-polices` — données RSC et polices (3 octobre 2026)

### Données RSC : d'où viennent les 145 Ko de l'accueil

Mesuré sur le build de production (flux RSC en ligne dans le HTML) : l'accueil ne passe **aucune donnée** à un composant client. Les ~125 Ko de flux sont le rendu des composants serveur (la même arborescence que le HTML, sérialisée une seconde fois pour l'hydratation et la navigation) : 106 `<Link>` représentent 36 Ko (classes et enfants répétés), 37 autres éléments clients 10 Ko, le reste est du balisage. Réduire cela suppose de simplifier le balisage (par exemple ne pas rendre en double la sélection « Six modèles » en cartes mobiles et en tableau, ~10 Ko bruts) : non fait, c'est un choix de design.

Les vraies données envoyées aux composants clients sont sur d'autres pages. Avant, ces pages envoyaient les 47 `Vehicle` complets (~0,8 Ko chacun : slugs, années, transmission, objet `source`…) alors que les composants n'en lisent qu'une partie. `src/lib/vehicle-lite.ts` définit maintenant, pour chaque composant, la liste exacte des champs lus (types `Pick`, vérifiés par le compilateur et par `tests/unit/vehicle-lite.test.ts`) :

| Page | Composant client | Données client avant → après | HTML avant → après | Flux RSC avant → après |
|---|---|---|---|---|
| `/voitures-electriques` | `VehicleExplorer` | 38 → 10 Ko | 310 → 279 Ko | 84 → 57 Ko |
| `/voitures-electriques/trouver` | `VehicleFinder` | 38 → 10 Ko | 156 → 125 Ko | 70 → 43 Ko |
| `/comparer` | `ComparisonBuilder` | 35 → 25 Ko | 153 → 141 Ko | 76 → 66 Ko |
| `/outils/*` | calculateurs (`VehiclePreset`) | déjà compacts (~8 Ko) | inchangé | inchangé |

Tailles non compressées. Le comparateur lit presque toute la fiche : on n'y retire que slugs, années, transmission et source. `VehicleCard` et `VehicleRow` exigent maintenant un `href` (plus de repli sur `vehicleHref`, qui demandait les slugs).

Lighthouse local (3 passages, mobile simulé) : scores inchangés (95–96), pas de régression de FCP/LCP sur les 4 pages.

### Polices : 2 préchargements au lieu de 4 — essai abandonné

`next/font` précharge toutes les graisses de IBM Plex Mono (400, 600, 700) en plus de Schibsted Grotesk : 4 préchargements. Essai : auto-héberger Plex Mono (`public/fonts`, `@font-face` avec les sous-ensembles latin et latin-ext) et ne précharger que la graisse 700 (grands chiffres du hero) : 2 préchargements, ~20 Ko de moins en priorité haute.

Résultat (3 passages, accueil et 3 autres pages) : **FCP simulé 0,91 s → 1,21 s**, LCP et score inchangés (96). Les graisses 400 et 600, plus préchargées, ne sont découvertes qu'après l'analyse de la CSS : dans la simulation de Lighthouse, la chaîne CSS → police s'ajoute au chemin critique. Le préchargement « coûte » des octets mais gagne un aller-retour. Essai annulé : on garde les 4 préchargements de `next/font`. Pour vraiment réduire, il faudrait supprimer une graisse (par exemple fusionner 600 et 700), ce qui change le rendu des libellés.

## 8. `/comparer` statique et base de données (3 octobre 2026)

- `/comparer` lisait `searchParams` (`?v=`) : page dynamique, donc 3 requêtes SQL à chaque requête
  sur instance froide, et un 500 intermittent observé une fois. Elle est désormais statique
  (`revalidate = 86400`) ; `?v=` est lu côté client dans un `<Suspense>` (squelette). Les liens
  vers les fiches de la paire par défaut restent dans le HTML serveur.
- `getCatalog` : une nouvelle tentative, journalisation des échecs, dernier catalogue connu servi
  si la base ne répond pas (jamais de repli sur `src/data/vehicles.ts`). `connectionTimeoutMillis` : 4 s.
- `@vercel/functions` (`attachDatabasePool`) : **non adopté**, la base n'étant plus interrogée à
  chaque requête. À reconsidérer si une page dynamique (lecture de `searchParams`, `cookies()`,
  `force-dynamic`) interrogeant la base réapparaît.

## 9. Lot `perf/js-client` — JavaScript côté client (4 octobre 2026)

Mesures locales : Lighthouse mobile, CPU ×4, médiane de 3 passages, `node scripts/js-audit.mjs`
(serveur local uniquement). Détail par script : `--label` + `--out`.

**Diagnostic (avant).**

| Page | Score | TBT | Exécution JS (nos fichiers / Google) | Thread principal | JS transféré (nos fichiers) |
|---|---|---|---|---|---|
| Accueil | 95 | 21 ms | 179 / 114 ms | 704 ms | 438 Ko (187 Ko) |
| Fiche version | 96 | 18 ms | 145 / 117 ms | 692 ms | 438 Ko (187 Ko) |
| Guide | 96 | 18 ms | 132 / 112 ms | 631 ms | 438 Ko (186 Ko) |

- **Notre code applicatif est petit.** Sur ~580 Ko non compressés de « premier chargement » par route,
  ~480 Ko sont le runtime : React DOM (226 Ko), client Next (150 Ko), routeur App Router (≈ 120 Ko).
  Le code EVExpert partagé (barre « Ma sélection », liens de navigation, analytics, icônes) tient dans
  un chunk de 20 Ko ; le code propre à une route fait 12 à 18 Ko (accueil : vidéo du Hero ; fiche :
  estimateur de coût ; guide : 14 Ko). JS inutilisé dans nos fichiers : 27 Ko (React DOM) ; chez
  Google (AdSense) : ≈ 148 Ko.
- **Le gros du travail est l'hydratation de l'arbre serveur**, pas des composants client coûteux :
  le flux RSC embarqué pèse 145 Ko (accueil), 105 Ko (fiche), 76 Ko (guide) — c'est le DOM de la page
  sérialisé une seconde fois, que React doit lire et réconcilier. Convertir un composant client en
  composant serveur ne l'enlève pas de ce flux. Thread principal (accueil) : évaluation de scripts
  348 ms, analyse/compilation 112 ms, style et mise en page 74 ms, divers 124 ms.
- **Les composants client hydratés** sur ces pages : `NavLink` (en-tête), `Analytics`, `GarageBar`,
  `ConsentRevocationButton` (pied de page) sur toutes ; `HeroVideo` (accueil) ; `GarageToggle` et
  `VehicleCostEstimator` (fiche). Aucun n'est lourd ; `Analytics` et le consentement ne sont pas touchés.
- **Écart avec PageSpeed** (1,4 s d'exécution JS, 2,9 s de thread principal) : non reproduit. Dans
  PageSpeed les scripts Google font ≈ 140 ms, soit 1,2× nos 114 ms locaux ; si la machine de test
  était simplement plus lente, notre part (locale : 130–180 ms) ne pourrait pas être 7× plus élevée
  pendant que celle de Google ne l'est que 1,2×. La ventilation par script d'un passage PageSpeed
  (tableau « Réduire le temps d'exécution JavaScript ») ou `scripts/psi-runs.mjs` avec une clé API
  est nécessaire pour trancher.

**Essai abandonné (4 octobre 2026).** Chargement différé de la barre « Ma sélection » et de la vidéo du
Hero (import après `load` + inactivité ; vidéo jamais téléchargée sur mobile) : −2,3 Ko non compressés
(accueil et guide), −0,7 Ko (fiche) ; score (95–96) et TBT (16–21 ms) identiques, écarts d'exécution
(−26 / −4 / 0 ms sur nos fichiers) dans le bruit de mesure (les scripts Google varient de ±30 ms d'une
série à l'autre). Gain non mesurable pour du code en plus : **non retenu**, rien n'a été fusionné.

**Autres pistes écartées.**

- `VehicleCostEstimator` en import différé : le composant est rendu côté serveur (contenu indexé,
  pas de CLS) ; le différer exigerait un hydratant au défilement. Gain ≤ 12 Ko.
- `NavLink` en composant serveur : il sert `aria-current` d'après l'URL ; gain négligeable.

**Piste future (non engagée) : réduire le flux RSC de l'accueil (≈ 145 Ko).** C'est la seule piste à
effet attendu sur l'hydratation, car le flux contient le DOM de la page sérialisé une seconde fois.
Exemple concret : la section « Six modèles pour commencer » est rendue deux fois dans le HTML, en
tableau (`hidden sm:table`, 6 lignes) et en cartes mobiles (`sm:hidden`, 4 cartes) ; chaque variante
est masquée en CSS mais reste dans le HTML et dans le flux. Un rendu unique (par exemple des cartes
qui se présentent en lignes de tableau à partir de `sm`) retirerait l'un des deux jeux de balises.
À mesurer (taille du flux, TBT) avant tout choix, et à valider côté design : l'affichage change.
