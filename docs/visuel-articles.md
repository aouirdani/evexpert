# Images, palettes et mise en page des guides et du blog

Chantier `ui/visuel-articles` (octobre 2026). Prototype sur **un guide** (`/guides/temps-recharge-voiture-electrique`) et **la page `/guides`**, avant extension.

## 1. Règles pour les images

Uniquement des sources sous licence compatible avec un usage commercial :

- contenus génériques : Unsplash (licence Unsplash, **hors Unsplash+**, payant), Pexels, Pixabay ;
- modèle précis : Wikimedia Commons (licence vérifiée image par image) ou espace presse du constructeur (conditions d'usage lues) ;
- jamais d'image prise sur Google Images, un média ou un site sans licence explicite.

Chaque image est enregistrée dans `src/data/editorial/licensed.ts` : URL source, auteur (+ URL), licence (+ URL), date de récupération, retouches. Le crédit est affiché sous l'image (`ImageCreditLine`), même quand la licence ne l'impose pas. Fichiers : `public/editorial/licences/` (JPEG 1600 × 900, dérivé Open Graph 1200 × 630), servis en AVIF/WebP par `next/image`. `tests/unit/visuel-articles.test.ts` contrôle dimensions, poids, texte alternatif, provenance et source autorisée.

Wikimedia Commons : une licence CC BY-SA impose le crédit **et** le partage de l'image adaptée (recadrage compris) sous la même licence ; CC0 et domaine public n'imposent rien.

## 2. Palette retenue : « Cobalt & volt » (A), version marquée

Choisie le 03/10/2026 après comparaison de trois variantes en prévisualisation (le sélecteur et les variantes B « Forêt & ambre » et C « Graphite & cyan » sont retirés). Jetons et contrastes : `docs/design-system.md`.

- **Header et footer en cobalt** (`brand`), bandeau supérieur et hero en encre ; le bouton « Comparer » du header est en volt.
- **Fonds de sections teintés** : `paper-deep` plus bleuté, alternance sur l'accueil (sélection, recharge, outils).
- **Volt réservé à la mise en valeur** : boutons principaux (`primary` et `signal`), chiffres clés soulignés (`DataFigure` lg/xl sur fond clair), encadré « L'essentiel » (fond teinté + filet volt). Jamais en couleur de texte sur fond clair.
- Contraste WCAG AA partout, testé automatiquement.

## 3. Inventaire final (35 contenus : 25 guides, 7 articles, 3 connecteurs)

Photos sous licence : **23** (18 Unsplash, 5 Wikimedia Commons). Illustrations IA conservées : **6**. Sans photo, signalés plutôt que forcés : **6**. Chaque photo est utilisée pour un seul contenu. La provenance complète (URL de la page, auteur, licence, date de récupération, retouches) est dans `src/data/editorial/licensed.ts` ; `tests/unit/visuel-articles.test.ts` vérifie qu'aucun contenu n'échappe à l'inventaire.

| Type | Contenu | État | Source | Licence |
|---|---|---|---|---|
| guide | `temps-recharge-voiture-electrique` | photo | Unsplash — Joel Heyd (compte Zaptec) | Licence Unsplash |
| guide | `calculer-autonomie-reelle` | photo | Unsplash — Daniel Tafjord | Licence Unsplash |
| guide | `autonomie-hiver` | photo | Unsplash — Renato Mitra | Licence Unsplash |
| guide | `autonomie-autoroute` | photo | Unsplash — Hyundai Motor Group | Licence Unsplash |
| guide | `combien-coute-recharge-domicile` | photo | Unsplash — dcbel | Licence Unsplash |
| guide | `fonctionnement-borne-de-recharge` | photo | Unsplash — CHUTTERSNAP | Licence Unsplash |
| guide | `recharger-a-80-pourcent` | photo | Unsplash — JUICE | Licence Unsplash |
| guide | `recharge-domicile-ou-borne-publique` | photo | Unsplash — Precious Madubuike | Licence Unsplash |
| guide | `cout-borne-recharge-domicile` | photo | Unsplash — Joel Heyd (compte Zaptec) | Licence Unsplash |
| guide | `kw-kwh-difference-voiture-electrique` | photo | Unsplash — Jon Moore | Licence Unsplash |
| guide | `calculer-tco-voiture-electrique` | photo | Unsplash — StellrWeb | Licence Unsplash |
| guide | `choisir-voiture-electrique-selon-usage` | photo | Unsplash — Mehmet Talha Onuk | Licence Unsplash |
| guide | `choisir-premiere-voiture-electrique` | photo | Unsplash — Vitalii Khodzinskyi | Licence Unsplash |
| guide | `duree-de-vie-batterie-voiture-electrique` | photo | Unsplash — Bernd Dittrich | Licence Unsplash |
| guide | `prix-batterie-voiture-electrique` | photo | Wikimedia Commons — Mariordo (Mario Roberto Duran Ortiz) | CC BY-SA 3.0 |
| blog | `voitures-electriques-les-plus-sobres` | photo | Unsplash — Madeline Liu | Licence Unsplash |
| blog | `recharge-rapide-temps-10-80` | photo | Unsplash — YRKA PICTURED | Licence Unsplash |
| blog | `recharge-ac-puissances-acceptees` | photo | Unsplash — Zaptec | Licence Unsplash |
| blog | `autonomie-wltp-repartition-catalogue` | photo | Unsplash — Dennis Cortés | Licence Unsplash |
| blog | `lfp-ou-nmc-ce-que-montrent-les-donnees` | photo | Wikimedia Commons — RudolfSimon | CC BY-SA 3.0 |
| connecteur | `type-2` | photo | Wikimedia Commons — Paul Sladen | CC0 1.0 |
| connecteur | `ccs` | photo | Wikimedia Commons — Danilo Bargen | CC BY-SA 4.0 |
| connecteur | `chademo` | photo | Wikimedia Commons — Danilo Bargen | CC BY-SA 4.0 |
| guide | `batterie-brute-batterie-utile` | illustration générée par IA (existante, conservée) | — (créée pour EVExpert) | — |
| guide | `puissance-borne-7-11-22-kw` | illustration générée par IA (existante, conservée) | — (créée pour EVExpert) | — |
| guide | `recharge-ac-ou-dc` | illustration générée par IA (existante, conservée) | — (créée pour EVExpert) | — |
| guide | `puissance-recharge-dc` | illustration générée par IA (existante, conservée) | — (créée pour EVExpert) | — |
| guide | `preserver-batterie-voiture-electrique` | illustration générée par IA (existante, conservée) | — (créée pour EVExpert) | — |
| guide | `recharger-sur-prise-domestique` | illustration générée par IA (existante, conservée) | — (créée pour EVExpert) | — |
| guide | `wltp-definition` | **aucune photo** — schéma seul : aucune photo libre n'illustre un cycle d'homologation | — | — |
| guide | `consommation-voiture-electrique-kwh-100-km` | **aucune photo** — aucune photo libre convenable | — | — |
| guide | `cout-100-km-voiture-electrique` | **aucune photo** — aucune photo libre convenable | — | — |
| guide | `voiture-electrique-vs-essence` | **aucune photo** — aucune photo libre convenable | — | — |
| blog | `comment-evexpert-construit-sa-base` | **aucune photo** — contenu méthodologique : aucune photo libre pertinente | — | — |
| blog | `garantie-batterie-ce-que-disent-les-donnees` | **aucune photo** — aucune photo libre convenable | — | — |

Crédit : affiché sous chaque photo (auteur, source, licence, avec leurs liens). Les trois photos Wikimedia sous CC BY-SA (CCS, CHAdeMO ; pack Nissan Leaf ; pack BMW i3 — soit 4 fichiers) imposent le crédit **et** le partage de l'image recadrée sous la même licence : c'est indiqué dans la mention de modification. Les deux photos CC0 (connecteurs Type 2 / CCS côte à côte) et les photos Unsplash n'imposent pas de crédit, mais il est affiché.

Pexels et Pixabay refusent l'accès automatisé depuis l'environnement de travail (HTTP 403) : aucune photo n'en provient.
