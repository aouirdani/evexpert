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

1. **Charger AdSense et le message de consentement après l'interaction ou en `lazyOnload`**, et supprimer le `<link rel="preload" as="script">` qu'`afterInteractive` ajoute dans le `<head>` : ~413 Kio et deux tâches longues sortent de la fenêtre de chargement. Effet sur le consentement : le mode par défaut « tout refusé » (Consent Mode v2) est posé avant, rien n'est collecté sans accord ; en revanche le message Google s'afficherait plus tard (après l'inactivité ou au premier geste), et les annonces/vérifications d'AdSense aussi. **À valider avant toute modification.**
2. Alléger ce qui précède le premier rendu : réduire à 2 le nombre de polices préchargées (les 3 graisses de Plex Mono pèsent 30 Ko ; effet visuel à la première visite : chiffres un instant en police de repli avec `display: optional`), réduire le HTML (145 Ko de données RSC).
3. Retirer les polyfills (13,8 Kio) par un alias Turbopack de `polyfill-module` : risque (`URL.canParse` est polyfillé pour Chrome < 120), gain limité (≈ 3 % des octets).
4. Clé API PageSpeed + `scripts/psi-runs.mjs` : 10 passages par page, avant/après, pour juger tout changement sur des statistiques et non sur un passage isolé.
