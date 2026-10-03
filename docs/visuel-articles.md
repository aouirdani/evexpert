# Images, palettes et mise en page des guides et du blog

Chantier `ui/visuel-articles` (octobre 2026). Prototype sur **un guide** (`/guides/temps-recharge-voiture-electrique`) et **la page `/guides`**, avant extension.

## 1. Règles pour les images

Uniquement des sources sous licence compatible avec un usage commercial :

- contenus génériques : Unsplash (licence Unsplash, **hors Unsplash+**, payant), Pexels, Pixabay ;
- modèle précis : Wikimedia Commons (licence vérifiée image par image) ou espace presse du constructeur (conditions d'usage lues) ;
- jamais d'image prise sur Google Images, un média ou un site sans licence explicite.

Chaque image est enregistrée dans `src/data/editorial/licensed.ts` : URL source, auteur (+ URL), licence (+ URL), date de récupération, retouches. Le crédit est affiché sous l'image (`ImageCreditLine`), même quand la licence ne l'impose pas. Fichiers : `public/editorial/licences/` (JPEG 1600 × 900, dérivé Open Graph 1200 × 630), servis en AVIF/WebP par `next/image`. `tests/unit/visuel-articles.test.ts` contrôle dimensions, poids, texte alternatif, provenance et source autorisée.

Wikimedia Commons : une licence CC BY-SA impose le crédit **et** le partage de l'image adaptée (recadrage compris) sous la même licence ; CC0 et domaine public n'imposent rien.

## 2. Palettes d'aperçu

Activées **uniquement** sur les déploiements de prévisualisation Vercel (`VERCEL_ENV=preview`) ou en local avec `PALETTE_PREVIEW=1`. Ajouter `?palette=a|b|c` à une URL (`?palette=0` pour revenir à l'actuelle) ; le choix est mémorisé pour la session et un petit sélecteur s'affiche en bas à gauche. En production, `PalettePreview` ne rend rien (ni style, ni script). Seuls les jetons de couleur de `globals.css` changent.

| Palette | Idée | Paper | Ink | Accent (signal) | Lien / chiffre (signal-deep) |
|---|---|---|---|---|---|
| Actuelle | Revue technique | #F6F5F1 | #0B1626 | #B8F13C lime | #0F6B4F vert |
| A · Cobalt & volt | Encre bleu nuit, liens cobalt | #F3F6FC | #071A3A | #C8FF2E | #1448C8 |
| B · Forêt & ambre | Vert forêt, accent ambre | #F6F3EA | #0C2A21 | #FFB21E | #0A6B45 |
| C · Graphite & cyan | Graphite, accent cyan | #F2F4F4 | #10161C | #2EE6D2 | #00695F |

Contrastes WCAG (calculés, testés dans `visuel-articles.test.ts`) : texte principal sur fond ≥ 13,8:1, texte secondaire (`muted`) ≥ 5,5:1 sur fond et sur `paper-deep`, `signal-deep` ≥ 5,5:1 sur fond et sur la teinte d'accent, encre sur accent ≥ 8,5:1, accent sur encre ≥ 8,5:1, contrôles ≥ 3:1. Toutes passent AA.

## 3. Inventaire (35 contenus)

25 guides, 7 articles de blog, 3 pages connecteurs (`/recharge/type-2`, `ccs`, `chademo`).

État actuel : 6 guides ont une illustration **générée par IA** (légende « générée par IA »), 16 ont un schéma SVG, **aucun** n'a de photo sous licence avant ce chantier. Le prototype (`temps-recharge-voiture-electrique`) est la première.

Candidats = résultats de recherche Unsplash (photo non Unsplash+). Seule l'image du prototype est **vérifiée** (page ouverte, licence lue, fichier téléchargé) ; les autres sont à ouvrir et à contrôler (licence, absence de marque lisible, cadrage 16:9) avant tout téléchargement. Pexels et Pixabay refusent l'accès automatisé depuis cet environnement (HTTP 403) : à consulter à la main.

| Thème | Contenus concernés | Candidats (unsplash.com/photos/…) |
|---|---|---|
| Branchement / charge | temps-recharge (**prototype**), fonctionnement-borne, recharger-a-80, kw-kwh, recharge-ac-ou-dc*, blog recharge-ac-puissances | `2jRNVr0ac7s` Zaptec ✔ vérifiée ; `xJLsHl0hIik`, `xfaYAsMV1p8` CHUTTERSNAP ; `JkTjKEVcckg` JUICE ; `oz7enr450Kw` Haberdoedas |
| Recharge rapide | puissance-recharge-dc*, blog recharge-rapide-temps-10-80 | `5hbzWe6ens4` Stephen Mease (logo Tesla bien visible : à éviter en générique) ; `N2Td7KpIvYc` Precious Madubuike (rue) |
| Wallbox / domicile | combien-coute-recharge-domicile, cout-borne, recharger-sur-prise*, puissance-borne*, recharge-domicile-ou-borne | `LP9D8zD4Xmw` dcbel ; `2n7ugRl1YsQ`, `9QzxkWxMUik`, `AbjcC_stuXs` Zaptec ; `9RZlFXzrANI` Evnex Ltd |
| Route / autoroute | autonomie-autoroute, blog sobres, blog autonomie-wltp | `J06f5D8i5d0` Hyundai Motor Group ; `3GbF9_BU5l8` Madeline Liu ; `KHtUMbpyHdg` Jose Losada (Tesla identifiable) |
| Hiver | autonomie-hiver | `FpF3kSekM20` Yannik Zimmermann ; `Og1UPq-1cZw`, `X3QxnbU5-HE` Renato Mitra |
| Batterie | durée de vie, prix, preserver*, batterie-brute*, blog lfp-nmc, blog garantie-batterie | `lGrYPbLF4p4` Bernd Dittrich ; `CH7kRmyBQ4I` Vanya Smythe ; `E4Oz0TZUDe8` Wesley Tingey |
| Tableau de bord / consommation | calculer-autonomie-reelle, wltp, consommation | `MbiSXN8u8q4` Dennis Eusebio ; `d0VoImxkPQg` Daniel Tafjord ; `RQjqjGggt6M` Šimom Caban |
| Achat | choisir-selon-usage, choisir-premiere | `3sF03nuyIS8` Mehmet Talha Onuk (salle d'exposition) ; `WnDC9k1aiZ8` I'M ZION |
| Coûts, TCO, comparaisons | cout-100-km, voiture-electrique-vs-essence, tco | **à rechercher** (aucun candidat pertinent encore trouvé) |
| Méthode / données | blog comment-evexpert-construit-sa-base | **à rechercher** |
| Connecteurs (modèle précis) | Type 2, CCS Combo 2, CHAdeMO | Wikimedia Commons : `File:Iec-type2-ccs-combo2-and-iec-type2-charging-connectors-side-by-side…` (Paul Sladen, **CC0**) ; `File:CCS (Type2 Combo) Charging Plug.jpg` et `File:CHAdeMO Charging Plug.jpg` (Danilo Bargen, **CC BY-SA 4.0**) |

\* = a déjà une illustration générée par IA : la remplacer par une photo licenciée est une décision à prendre.

Aucune image libre convenable n'a été trouvée pour « coûts / TCO / comparaisons » et « méthode » : à signaler plutôt qu'à forcer (un schéma ou aucune photo).
