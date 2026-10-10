# EVExpert — lot 5 : accueil, présentation premium conservatrice

Le lot final harmonise les sections de l’accueil avec EVExpert Signature. **Le Hero reste intégralement identique à la référence**, dans sa source, sa géométrie, ses contenus et ses comportements. Les retouches facultatives du Hero essayées pendant le lot ont été retirées avant validation finale. Les comparaisons finales n’identifient pas de régression reproductible de performance, de fonctionnalité ou de SEO imputable aux changements conservés.

Périmètre final : **deux fichiers existants modifiés, une feuille CSS ajoutée**. Aucune nouvelle route, donnée, dépendance, police, image, vidéo ou logique cliente. Aucune modification de configuration, de base de données, d’intégration Google, aucun commit, push ou déploiement. Les travaux des lots précédents et les contenus éditoriaux non déployés sont préservés. Arrêt après le lot 5.

## 1. Audit de l’accueil et référence

Les rapports [lots 0/1](../lot-0-1/README.md), [référence](../lot-0-1/REFERENCE.md), [lot 2](../lot-2/README.md), [lot 3](../lot-3/README.md) et [lot 4](../lot-4/README.md) ont été consultés. Les 327 empreintes source/assets/tests/configuration initiales correspondent exactement au résultat du lot 4. La référence est donc le dépôt local validé, y compris les contenus préexistants non publiés ; elle ne prétend pas être un export du déploiement ou de la base de production.

Accueil : `src/app/page.tsx`, Server Component, données du catalogue via les helpers existants, `revalidate = 86400`. Hero, sections, graphique SVG, fiches et lignes de tableau sont déjà organisés en composants. `HeroVideo` et la sélection Garage restent les îlots clients préexistants. Les classes privées ajoutées ne sont utilisées que par l’accueil ; les primitives et composants partagés des lots 2/3/4 restent intacts.

| Bloc, dans l’ordre conservé | Constat | Décision finale |
|---|---|---|
| Hero | H1, texte adjacent, CTA, compteurs et date déjà clairement hiérarchisés ; forte identité, performances élevées mais LCP desktop variable entre poster et vidéo. | Aucun changement conservé. |
| Autonomie | Répartition réelle en SVG et fourchettes utiles ; graphique sans surface dédiée, filets encore en encre. | Surface claire bordée, points cobalt, mêmes valeurs, axes, légende et liens. |
| Sélection | Six lignes desktop et quatre cartes mobiles selon le mécanisme existant ; unités, liens étirés, focus et sélection déjà satisfaisants. Liens de marques hauts d’environ 21 px. | Cadres harmonisés et liens de marques de 44 px ; aucune modification du nombre de cartes/lignes ou des données. |
| Comparaison | Véritable tableau sémantique avec cinq critères, unités et écarts ; présentation très ouverte. | Surface de tableau, en-têtes et séparations plus lisibles ; mêmes cellules et colonnes responsives. |
| Recharge | Hiérarchie et illustration existantes satisfaisantes. | Rayon de l’image, filets et états des liens seulement ; mêmes fichiers, légendes et chargement. |
| Guides et analyses | Contenus complets et navigation fonctionnelle ; carte principale moins cohérente avec les cartes du lot 4. | Cadre du guide principal et listes harmonisées ; aucun texte, visuel ou titre raccourci. |
| Outils | Numérotation, descriptions et accès directs utiles. | Panneaux clairs cohérents, espacements et retours à la ligne adaptés. |
| Sources/méthode puis FAQ | Blocs supplémentaires réellement présents après les outils, avec liens et FAQ JSON-LD. | Intégralement conservés. |

[Statut Git initial](initial-git-status.txt), [empreintes initiales](before/source-hashes.json), [comparaisons](comparison.json), [comparaison du Hero et des données](home-comparison.json). Les sources initiales sont sauvegardées dans `/private/tmp/evexpert-lot-5-originals/`. Le build initial a été copié dans `/private/tmp/evexpert-lot5-before-build/` pour les diagnostics, avec les dépendances déjà présentes. Un alias `pg` a été réancré uniquement dans cette copie temporaire ; aucune installation ou configuration du dépôt modifiée.

## 2. Fichiers modifiés

| Fichier | Modification finale |
|---|---|
| `src/components/home/sections.tsx` | Classes privées sur les éléments existants : sections, graphique, tableaux, navigation des marques, listes, guide principal et outils. |
| `src/components/home/refinements.css` — ajout | Règles limitées aux préfixes `evx-home-*`, utilisant les tokens existants. Aucun sélecteur du Hero, header, footer, consentement ou annonces. |
| `src/app/globals.css` | Un import dans la feuille déjà utilisée ; pas de requête CSS supplémentaire. Toutes les règles et variables précédentes sont conservées. |

**325 des 327 fichiers préexistants sont identiques**, deux modifiés, un ajouté, aucun supprimé. `Hero.tsx`, `HeroVideo.tsx`, `RangeDistribution.tsx`, la page serveur, les composants partagés, toutes les données, formules, assets, intégrations et configurations capturés sont intacts. `.env.local` est identique à sa référence, sans enregistrer ses valeurs.

La comparaison TypeScript de `sections.tsx` est identique hors attributs `className`. Imports, expressions, textes, URLs, tri, calculs, conditions et événements sont inchangés. [Fichiers](files-changed.json), [vérification des composants](source-semantics.json), [patch](/private/tmp/evexpert-lot-5.patch). Ce patch compare le début du lot au résultat, sans utiliser le HEAD Git comme référence pour les travaux antérieurs.

## 3. Captures avant/après

**95 JPEG avant et 95 après** : première vue, page complète aux cinq largeurs, neuf blocs, focus et pages de contrôle. Les captures ont été inspectées pour les tableaux, cartes, graphique, listes et Hero. Une vidéo en lecture ne produit pas des pixels identiques d’une capture à l’autre ; ses dimensions et comportements sont vérifiés séparément.

| Cas | Avant | Après |
|---|---|---|
| Accueil complet, 390 px | [capture](before/home-full-390.jpg) | [capture](after/home-full-390.jpg) |
| Accueil complet, 1440 px | [capture](before/home-full-1440.jpg) | [capture](after/home-full-1440.jpg) |
| Hero, 1440 px | [capture](before/home-1440.jpg) | [capture](after/home-1440.jpg) |
| Autonomie, 1440 px | [capture](before/home-autonomie-1440.jpg) | [capture](after/home-autonomie-1440.jpg) |
| Sélection, 320 px | [capture](before/home-selection-320.jpg) | [capture](after/home-selection-320.jpg) |
| Tableau, 768 px | [capture](before/home-selection-768.jpg) | [capture](after/home-selection-768.jpg) |
| Comparaison, 320 px | [capture](before/home-compare-320.jpg) | [capture](after/home-compare-320.jpg) |
| Lecture, 320 px | [capture](before/home-lire-320.jpg) | [capture](after/home-lire-320.jpg) |
| Outils, 320 px | [capture](before/home-outils-320.jpg) | [capture](after/home-outils-320.jpg) |

Les captures de la variante intermédiaire abandonnée sont conservées dans [candidate-after](candidate-after/) et ne décrivent pas le résultat final.

## 4. Présentation finale et protection du Hero

Palette et polices conservées : papier `#F3F6FC`, encre `#071A3A`, cobalt `#1448C8`, volt `#C8FF2E`, Schibsted Grotesk et IBM Plex Mono. Les titres, corps, chiffres et unités gardent leur typographie existante.

- Filets des cinq en-têtes de section : cobalt, épaisseur existante inchangée.
- Graphique : surface blanche, bordure `1px` dans le token `line`, rayon `8px`, padding `16px`. Les 47 points, les fourchettes, leurs calculs et le texte accessible sont conservés ; seul le remplissage des points passe au cobalt.
- Cartes mobiles : bordure `1px`, filet supérieur cobalt `2px`, rayon `8px`, mêmes champs et boutons. Les tableaux restent des `<table>` avec caption, `thead`, `tbody`, `th`, `td` et `scope`. Bordures de cellules de `1px`, en-têtes sur papier clair, padding horizontal de `8px` sur petit écran et `16px` à partir du breakpoint existant.
- Marques : liens HTML conservés, surface claire et bordure discrète, rayon `4px`, padding `8px 12px`, hauteur minimum `44px`, retour à la ligne possible. Pas de logique de filtre ajoutée.
- Guide principal : cadre cohérent avec le lot 4, padding `16px`, même image et même lien étiré. Les listes de lecture/recharge gagnent des états de survol/focus discrets et `12px` de padding horizontal.
- Outils : mêmes huit liens et descriptions dans la même liste, panneaux bordés de rayon `8px`, gap `12px 24px`, padding des liens `20px 16px`. Pas d’animation, d’ombre ou de JavaScript ajouté.

**Hero final inchangé octet pour octet.** Vidéo `/brand/video.mp4` : **663 447 octets** ; poster source `/brand/evexpert-hero.jpeg` : **781 661 octets**, toujours optimisé par Next Image. Mêmes sources, dimensions, `sizes`, priorité du poster, masques et styles vidéo préexistants. La vidéo reste muette, en boucle, inline, `preload="none"`, démarrée par la logique existante **300 ms après `window.load`**, sur desktop sans préférence de mouvement réduit. Les modes mobile et mouvement réduit gardent le repli statique préexistant. Pause/reprise vérifiées ; aucun changement d’autoplay, de poster, de lazy loading ou de chargement.

Le lien secondaire du Hero reste haut de 25 px, comme avant : son agrandissement facultatif et les séparateurs de compteurs de la variante intermédiaire ont été retirés. La géométrie du Hero, du H1, du paragraphe, du média, des compteurs et des CTA est exactement identique aux cinq largeurs. Toutes les dates et données restent présentes.

## 5. Validation responsive, clavier et fonctionnelle

| Contrôle | Résultat final |
|---|---|
| Lint | `npm run lint` : OK. |
| TypeScript | `npm run typecheck` : OK. |
| Tests unitaires | `npm test -- --config vitest.unit.config.ts` : **160 tests, 15 fichiers**, tous réussis. Configuration préexistante désactivant le setup DB ; aucun test de recréation ou migration de base exécuté. |
| Build | `EVEXPERT_DATA_SOURCE=local npm run build` : OK, 192 entrées générées comme la référence. |
| Responsive général | **17 pages × 5 largeurs = 85 cas**, document sans débordement. Les 80 cas hors accueil gardent les géométries capturées identiques. |
| Accueil détaillé | 320, 390, 768, 1024 et 1440 px ; aucun débordement global ou élément de contenu hors viewport. Même ordre des neuf blocs, mêmes données des tableaux et attributs des images. |
| Cibles marques | Hauteur minimale mesurée **21 → 44 px** aux cinq largeurs, noms complets et destinations conservés. |
| Clavier accueil | **35 contrôles** de focus visible : CTA, fiches/tableaux, sélection, guide principal, outils et FAQ. Entrée ouvre les deux CTA et la fiche attendus aux cinq largeurs. |
| Sélection accueil | Trois véhicules, URL de comparaison et remise à zéro identiques aux cinq largeurs ; FAQ ouverte/fermée au clavier. |
| Calculateurs | **20 cas par défaut/fixes**, huit outils et deux estimateurs de fiches : champs, valeurs et résultats exactement identiques. Tables accessibles conservées. |
| Catalogue/comparateur | Recherche Kona, sélection, limite de trois véhicules, reset, URL partagée, copie contrôlée et focus des liens de tableaux inchangés. |
| Hero | Géométrie identique, source et attributs intacts, lecture/pause/reprise desktop, modes mobile et mouvement réduit identiques. |
| Erreurs navigateur | Zéro erreur JavaScript dans les parcours finaux. |
| Accessibilité automatisée | Axe sur le contenu principal à 390/1440 px : zéro violation retournée. Des contrôles de contraste restent incomplets (45/48 nœuds) ; une revue humaine reste nécessaire. Lighthouse accessibilité : 100 sur tous les passages finaux. |

[Commandes](validation.json), [responsive](after/geometry.json), [accueil](after/home-geometry.json), [clavier](after/home-keyboard.json), [interactions accueil](after/home-interactions.json), [calculateurs](after/calculators.json), [interactions](after/interactions.json), [accessibilité](after/home-accessibility.json).

Les protocoles passent par une page vide avant chaque changement de viewport. Les ancres attendent la fin du défilement natif ; une observation trop courte a donné un point intermédiaire, corrigé par une durée minimale d’observation de 1,5 s, sans modifier le site. Les positions stabilisées du sommaire témoin sont identiques à la référence : 159,97 px mobile et 168,09 px desktop. Le contrôle footer conserve focus, destinations, liens et dimensions ; une variation maximale de 2 px des coordonnées viewport, pendant le scroll déclenché par le focus, est enregistrée.

## 6. Comparaison SEO, données et intégrations

Les **190 routes de référence** sont conservées : 186 pages HTML et quatre ressources, toutes HTTP 200 ; **58 pages noindex**, comme avant. Titles, descriptions et autres metadata dont Open Graph/Twitter/vérifications, H1/H2/H3 et IDs, canonicals, robots, JSON-LD, contenu texte brut serveur, liens/hrefs/ancres/labels et ajouts UI précédents sont exactement identiques.

La structure sémantique de header/main/footer est identique sur les 190 routes après exclusion des seuls attributs de présentation `class`/`style`. Images, attributs de chargement, tableaux, légendes, scopes et éléments sémantiques sont conservés. Les manifestes de routes, app-paths et prerender sont identiques : **191 entrées prerender**, mêmes ISR et paramètres de rendu. Aucun changement SSR/SSG/ISR.

Sitemap, robots.txt, ads.txt, RSS et les huit redirections contrôlées sont identiques. **198 URLs internes uniques** : zéro HTTP en erreur, **1 237 occurrences d’ancres** contrôlées. Les **90 occurrences préexistantes de `/methodologie#autonomie`** pointent toujours vers une ancre absente sur une page HTTP 200. Problème documenté pour une correction séparée, **aucune intervention dans ce lot**.

AdSense : balise, script et ads.txt conformes sur les **124 pages du sitemap**. Positions, affichage et dimensions des réservations sont identiques dans les 85 cas généraux et les cinq captures détaillées de l’accueil. Le nœud d’annonce observé sur l’accueil local est masqué et de taille nulle, comme avant ; cela ne valide pas une annonce effectivement remplie en production. Aucun sélecteur nouveau ne cible une annonce ou un widget Google.

Search Console, AdSense, GA4, Funding Choices, consentement, Vercel/Supabase et variables d’environnement : sources/configurations intacts. La vraie CMP Google, un remplissage publicitaire et leurs comportements sur le domaine de production n’ont pas été testés ou modifiés.

[SEO avant](before/seo.json), [SEO après](after/seo.json), [structure](after/semantic-structure.json), [manifestes](rendering-comparison.json), [liens/ancres](after/internal-links-check.json), [réservations](after/geometry.json), [AdSense](adsense-approved.log).

## 7. Lighthouse avant/après

Mesures **de laboratoire**, serveur Next de production local, données locales forcées, même port 3102, Chrome **154.0.8037.98**, Lighthouse **12.8.2**, cache navigateur réinitialisé par Lighthouse, scripts Google laissés actifs. Aucune mesure concurrente avec un build ou un autre navigateur de test.

Profils identiques vérifiés : mobile 412 × 823, DPR 1,75, CPU ×4 et réseau simulé 1 638,4 kbit/s / RTT 150 ms ; desktop 1350 × 940, DPR 1, CPU ×1 et réseau simulé 10 240 kbit/s / RTT 40 ms. Les cinq largeurs responsive et les profils Lighthouse constituent deux protocoles distincts.

Comparaison finale : **36 passages**, six répétitions par appareil sur l’accueil et trois par appareil sur le catalogue témoin. Tableau de **médianes**, durées en ms ; valeurs avant → après.

| Page/profil | Passages avant/après | Performance | LCP ms | FCP ms | TBT ms | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Accueil mobile | 6 / 6 | 95 → 95 | 2941.27 → 2931.55 | 910.69 → 905.17 | 22.00 → 12.50 | 0 → 0 |
| Accueil desktop | 6 / 6 | 100 → 100 | 630.16 → 627.70 | 245.89 → 243.96 | 0.00 → 0.00 | 0 → 0 |
| Catalogue mobile | 3 / 3 | 96 → 96 | 2857.09 → 2854.76 | 904.73 → 903.13 | 20.50 → 10.00 | 0 → 0 |
| Catalogue desktop | 3 / 3 | 100 → 100 | 607.40 → 604.37 | 244.90 → 242.90 | 0.00 → 0.00 | 0 → 0 |

Éléments LCP : H1 de l’accueil sur mobile ; poster ou vidéo Hero sur desktop. Catalogue témoin : paragraphe d’introduction mobile, H1 desktop. Les petites différences finales sont dans la variabilité observée ; aucun CLS supplémentaire, aucune dégradation LCP reproductible démontrée dans le lot conservé. Le LCP mobile reste proche de 2,93 s en simulation et au-dessus de la cible indicative 2,5 s : cette cible terrain n’est pas déclarée atteinte.

Sur les six passages desktop avant comme après : **quatre LCP poster et deux LCP vidéo**. Médianes poster **628,87 → 625,84 ms** ; vidéo **1 721,32 → 1 661,73 ms**, avec seulement deux cas vidéo par série. La référence élargie avait déjà des cas vidéo autour de 1,66 s ; l’écart n’est pas revendiqué comme un gain de performance. Les scores desktop individuels sont 93–100 avant et 94–100 après. Un score 100 uniforme n’est pas garanti.

### Diagnostic de la variante retirée

**56 passages supplémentaires**, en plus des 36 de référence/final, sont conservés : 28 sur la variante intermédiaire, dix passages supplémentaires du build initial et 18 sur le build avant nettoyage des artefacts de documentation. Total du lot : **92 Lighthouse**. Une série de douze passages desktop par build, puis quatre paires alternées, a montré une distribution poster/vidéo différente et un score global médian de 100 → 94 sur la variante, malgré des temps proches à élément LCP identique. Il n’était pas possible d’en attribuer précisément la cause aux styles. Les retouches optionnelles du Hero ont donc été retirées par prudence, puis la version finale a été reconstruite et entièrement revalidée. Les mesures intermédiaires ne sont pas mélangées aux médianes finales. Le nettoyage des documents a retiré deux utilitaires CSS inutilisés issus du scan automatique ; une dernière série complète de 18 passages a mesuré la feuille finale. La série précédente est conservée dans [before-document-cleanup](before-document-cleanup/lighthouse.json). Le diff lisible est conservé dans `/private/tmp` et la feuille intermédiaire sous une extension CSS, pour éviter cette interférence sans changer la configuration Tailwind.

[Référence](before/lighthouse.json), [final](after/lighthouse.json), [comparaison finale](performance-comparison.json), [variante](candidate-after/lighthouse.json), [répétitions référence](before-desktop-repeat/lighthouse.json), [répétitions variante](candidate-after-desktop-repeat/lighthouse.json), [paires référence](before-paired/lighthouse.json), [paires variante](candidate-after-paired/lighthouse.json). Chaque dossier contient aussi les rapports LHR individuels.

### Ressources de la version finale

| Ressource locale | Avant → après | Constat |
|---|---:|---|
| CSS transféré, requête unique | **14 705 → 15 115 octets** | +410 octets, environ 0,40 Kio ; pas de nouvelle requête. |
| CSS décompressé | 71 725 → 74 531 octets | +2 806 octets de styles ciblés. |
| JS accueil mobile | **193 175 → 193 175 octets** | Bundle application inchangé. |
| JS accueil desktop | **214 708 → 214 708 octets** | Inchangé. |
| JS catalogue mobile | 193 884 → 193 884 octets | Inchangé. |
| Polices demandées | Quatre, **68 312 octets transférés** avant/après | Mêmes assets ; aucune police ajoutée. |
| Images et vidéo | Mêmes fichiers, attributs et mécanismes | Aucun asset décoratif ajouté. |

Les budgets concernent les ressources locales ; les réponses des services Google peuvent varier indépendamment. [Empreintes des assets](measured-assets.json), détails réseau dans les rapports Lighthouse. Le contrôle du build après rédaction et scan Tailwind des documents est consigné dans [final-build-validation.json](final-build-validation.json).

## 8. Risques restants et limites

- Mesures locales, données de catalogue locales et Chrome émulé : pas de données CrUX/INP terrain, mesure Vercel/CDN, appareil physique, Safari ou lecteur d’écran. Le TBT de laboratoire ne mesure pas l’INP terrain.
- Le Hero vidéo produit déjà deux régimes LCP sur desktop. Des passages isolés restent insuffisants pour décider d’une correction ; sa stratégie d’origine est conservée.
- Les styles de l’accueil restent dans le CSS partagé : faible coût mesuré de +410 octets transférés, même sur le catalogue témoin. Le build final doit conserver les assets mesurés.
- Pas de validation d’annonces réellement remplies, de la CMP Google sur le domaine publié ou des événements GA4 en production ; aucun changement de leurs sources/intégrations.
- Les images et textes peuvent changer les hauteurs avec les données de production ; les cinq largeurs ont été contrôlées sur la référence locale figée. Les noms et valeurs gardent leurs retours à la ligne et aucune ellipse n’est ajoutée.
- Ancre `/methodologie#autonomie` absente : antérieure au lot, laissée intacte pour une correction séparée.
- Avertissements Next préexistants sur la racine déduite de plusieurs lockfiles et les en-têtes Cache-Control personnalisés ; aucune configuration corrigée dans ce lot. Le premier build a échoué faute d’accès sandbox à Google Fonts puis a réussi avec autorisation, sans modification de code ou de police.

## 9. Revue globale recommandée avant publication

1. Valider humainement les captures finales et parcourir l’accueil avec le catalogue, les fiches, le comparateur, les outils et un guide à sidebar. Inspecter les longs noms, les retours à la ligne, le focus et la lecture vidéo sur appareils réels, dont Safari mobile.
2. Reprendre les garde-fous cumulés des lots 0–5 : inventaire des 190 routes, contenus éditoriaux non déployés, metadata, JSON-LD, canonicals/noindex, liens, sitemap, robots, résultats fixes et réservations publicitaires. Traiter l’ancre de méthodologie uniquement dans une tâche séparée validée.
3. Contrôler consentement, annonces et analytics dans l’environnement de revue autorisé, puis comparer plusieurs Lighthouse avec les mêmes profils et les éléments LCP. Prévoir un suivi terrain après une publication explicitement autorisée.

Aucune autre modification, commit, push ou publication n’est réalisé dans cette mission. Le lot 5 s’arrête à ce rapport et à ses contrôles.
