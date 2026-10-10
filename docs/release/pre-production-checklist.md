# EVExpert — préparation sécurisée de la publication

Audit du 10 octobre 2026. Référence : [audit final UI/UX, SEO et performance](../ui/final-release-audit/README.md). Cette intervention prépare une Preview ; elle ne constitue aucune autorisation de commit ou de déploiement.

## 1. Décision

**GO technique local confirmé. NO-GO pour déclencher la Preview en l’état.** Les contrôles du code passent, mais l’association du déploiement au domaine actif et les paramètres privés de l’environnement Preview restent non vérifiés. Une autorisation de déploiement ne remplace pas ces vérifications.

Trois conditions préalables :

1. Confirmer dans Vercel le déploiement marqué **Production / Current**, son SHA complet, ses domaines et son éligibilité comme point de retour.
2. Lire les paramètres Preview existants : projet, commandes de build, variables et leurs portées, protection, domaine et isolation des données. Aucun changement automatique de variable ou de configuration.
3. Valider explicitement le périmètre du commit, puis autoriser séparément la création d’une Preview exclusivement.

Aucun fichier source ou de configuration modifié par cette préparation. Aucun staging, commit, push, déploiement, migration, changement Supabase ou modification Google. Seuls ce rapport, les listes proposées et les preuves sous `docs/release/` sont ajoutés. Les scripts de contrôle et une copie de travail isolée sont placés dans `/private/tmp`, sans suppression des travaux antérieurs.

## 2. État Git initial et travaux conservés

| Élément | Constat |
|---|---|
| Branche source | `feat/auteur-fiches`, sans upstream configuré. |
| HEAD | `30de20396cb748f94c0c9bbce868add8c05d3d9a`. |
| Référence locale main / origin/main | `32652680bf3b5dd6f1418fa00dd10f236cc8f143`. |
| Écart d’ascendance | Deux commits supplémentaires sur la branche ; aucun commit propre à main absent de HEAD. Aucun fetch ou push effectué. |
| Modifications suivies non commitées | 33 fichiers ; 238 lignes ajoutées, 173 retirées. |
| Index Git | Vide à l’entrée ; resté vide. |
| Fichiers suivis supprimés | Aucun. |
| Écart cumulé avec main | 49 fichiers suivis distincts ; trois fichiers suivis ajoutés dans les commits antérieurs. Cette comparaison est avec une référence de code, pas une certification du domaine actif. |
| Ajouts préexistants non suivis | 1 588 fichiers, 422 120 147 octets : 1 577 documents/preuves, neuf sources, un test et une configuration unitaire. |

Les deux commits déjà présents sont conservés :

- `b18fdf91ab1d300b0c87da358a926e8c6db914d7` : page auteur, signatures liées, Person JSON-LD et premiers enrichissements de fiches.
- `30de20396cb748f94c0c9bbce868add8c05d3d9a` : enrichissement de 45 fiches modèle et corrections de dix marques.

Les travaux non commités comprennent les lots UI 1 à 5, le guide occasion, l’analyse BYD/MG, leurs sources et tests, ainsi que l’ancre de méthodologie restaurée. Les helpers CSS/TypeScript non suivis sont indispensables : ils doivent accompagner le commit. Le Hero, ses médias et son texte ne font pas partie des changements.

Inventaire exhaustif capturé avant création des documents de cette mission : [Git initial](verification/git-initial.json). Inventaire cumulé détaillé : [audit final](../ui/final-release-audit/README.md#2-inventaire-git-et-références). Les fichiers ajoutés dans `docs/release/` ne doivent pas être attribués aux lots antérieurs.

## 3. Production et point de retour : preuve et limite

Les registres publics du dépôt GitHub contiennent un statut **Vercel / success**, et un enregistrement **Production / success**, pour :

| Champ | Information observée |
|---|---|
| SHA du dernier déploiement Production réussi enregistré | `32652680bf3b5dd6f1418fa00dd10f236cc8f143`. |
| Date du statut | 5 octobre 2026, 11:31:52 UTC, soit 13:31:52 à Paris. |
| URL du déploiement | `https://evexpert-iwvrhdypl-aymane-s-projects-167e5574.vercel.app`. |
| Page du déploiement fournie par Vercel à GitHub | [AMv1eZS5BPoYSPJ5PwNiSukgcobF](https://vercel.com/aymane-s-projects-167e5574/evexpert/AMv1eZS5BPoYSPJ5PwNiSukgcobF). |
| Identifiant GitHub Deployment | `6857863941` — ce n’est pas un identifiant Vercel `dpl_`. |
| Domaine public | `https://www.evexpert.fr/` répond 200 et indique Vercel ; aucun en-tête noindex observé sur l’accueil public. |
| Déploiement actuellement associé au domaine | **Non certifié** : lecture de l’alias Vercel refusée en HTTP 403. |
| SHA exact du déploiement actuellement actif | **Non certifié**, même si les registres et le contenu public sont cohérents avec le SHA ci-dessus. |
| Branche source de ce déploiement | Non certifiée par les informations privées ; le SHA correspond au main distant public actuel. |

Sources réelles : [déploiements GitHub](https://api.github.com/repos/aouirdani/evexpert/deployments?per_page=10), [statuts publiés par Vercel](https://api.github.com/repos/aouirdani/evexpert/commits/32652680bf3b5dd6f1418fa00dd10f236cc8f143/status), [capture normalisée](verification/remote-readonly.json). Il serait incorrect de transformer « dernier déploiement réussi enregistré » en « déploiement Current certifié » : rollback, promotion ou modification d’alias hors Git peuvent changer l’état actif.

Le client Vercel n’est pas disponible dans le PATH, mais deux versions sont déjà en cache, dont 59.1.4. Aucune installation. Le projet n’est pas lié localement (`.vercel/` absent). La configuration CLI indique l’équipe `team_7HTGnCdUO5fCEc403EcLibbY`, mais aucun identifiant exploitable n’a été trouvé par lecture du stockage existant, y compris le trousseau en mode de lecture sans migration. Les API Vercel Alias et Deployment répondent 403. GitHub est consultable publiquement sans token, et son authentification CLI est valide après vérification hors sandbox. Le premier signalement de token invalide résultait de la restriction réseau ; aucun login ni changement d’authentification n’était nécessaire. Aucun login, rafraîchissement de token, création de projet ou changement de protection tenté.

### Procédure de rollback, après une future publication autorisée seulement

1. Avant toute publication, capturer dans Vercel la tuile **Production / Current** : URL immuable, ID Vercel complet, SHA, état Ready, domaines `www.evexpert.fr` et `evexpert.fr`, date et droits de l’opérateur. Comparer avec le candidat ci-dessus ; conserver le déploiement, ne pas le supprimer.
2. Vérifier que ce déploiement sera éligible au retour arrière après la publication. Sur Hobby, Vercel limite Instant Rollback au déploiement immédiatement précédent ; Pro/Enterprise autorisent les déploiements éligibles antérieurs. Le plan et les droits du compte ne sont pas vérifiés ici.
3. Si une future publication cause une anomalie critique : **Project → Production Deployment → Instant Rollback**, sélectionner le point de retour certifié, vérifier domaines et déploiement, puis confirmer uniquement avec l’autorisation appropriée. Aucune opération exécutée ici.
4. Vérifier après retour : accueil/Hero, catalogue, un modèle, comparateur, TCO, robots, sitemap, ads.txt, canonicals, scripts Google et consentement. Contrôler les domaines réels, pas uniquement l’URL vercel.app.
5. Consigner l’incident. Un rollback rétablit le déploiement et ses variables historiques ; il ne restaure pas une base de données ou un service externe. Il peut aussi désactiver l’assignation automatique des domaines aux nouveaux déploiements : aucune réactivation automatique.

Pour une Preview défaillante, la production doit rester inchangée : ne pas promouvoir cette Preview. Corriger dans une mission ultérieure autorisée ou abandonner le candidat en conservant les sources et preuves. Aucun reset Git, force push, suppression de branche ou reconstruction précipitée du déploiement historique.

Référence : [Instant Rollback Vercel](https://vercel.com/docs/instant-rollback).

## 4. Vérifications prépublication exécutées

| Contrôle | Résultat frais de cette mission |
|---|---|
| `npm run lint` | OK, code 0. |
| `npm run typecheck` | OK, code 0. |
| `npm test -- --config vitest.unit.config.ts` | 160 tests réussis, 15 fichiers, aucun setup DB. |
| `EVEXPERT_DATA_SOURCE=local npm run build` | OK, 192 entrées statiques générées ; capture initiale `_mYDTLxDDBitfk3irQ1kL`, build de clôture `DYUP4oILtqoaxFhId_6al`. |
| `git diff --check` et contrôle de l’index | OK ; aucun changement stagé. |
| Routes attendues | 190/190 HTTP 200, dont 186 pages HTML et quatre ressources. |
| SEO contre l’audit final validé | Zéro différence sur status, robots HTTP, titles, toutes les metas dont Open Graph, canonicals, H1/H2/H3, JSON-LD, liens et texte indexable. |
| Structure HTML sémantique | 186/186 empreintes identiques à l’audit final. |
| Liens et ancres | 201 destinations internes accessibles ; 1 237 occurrences de fragments, aucun fragment manquant. |
| Sitemap, robots.txt, ads.txt, RSS et huit redirects | Identiques à l’audit final validé. Sitemap 124 URL ; stratégie noindex existante conservée. |
| Calculateurs | 20 jeux relancés ; saisies, résultats métier et tableaux identiques à la référence locale et à la production archivée lors de l’audit final. |
| AdSense statique | Balise unique, script et ads.txt conformes sur les 124 pages du sitemap. |
| Intégrations Google et réservations | Aucun changement de balisage Google, de consentement par défaut ou d’attributs des réservations publicitaires sur les 186 pages HTML. |
| Sources/assets/tests/configurations | Aucune différence avec les empreintes de l’audit final, ni avec l’entrée de cette mission. |
| Ressources du build | 50/50 ressources statiques identiques à celles des mesures finales, après normalisation du Build ID. CSS : 74 531 octets, empreinte inchangée. |

Les tests DB et `npm run verify` ne sont pas exécutés : leur setup recrée une base et applique des migrations. Le script smoke standard n’est pas lancé tel quel, car il inclut `/api/health`, susceptible d’interroger la base. Le parcours de contrôle dédié couvre les routes publiques sans cette requête. `DATABASE_URL` et `DATABASE_ADMIN_URL` locales ne sont pas utilisées par les contrôles de catalogue : le mode local est imposé uniquement à l’exécution du build et du serveur, sans modifier un fichier d’environnement.

Le premier build sous sandbox a échoué au téléchargement de la police IBM Plex Mono. Le second, avec accès réseau autorisé, réussit ; aucune police ou configuration modifiée. Avertissements existants : racine Turbopack déduite d’un lockfile parent et Cache-Control personnalisé. Ils ne constituent pas une nouvelle régression.

Preuves : [commandes](verification/checks.json), [HTML/SEO/liens](verification/html-validation.json), [calculs](verification/calculators.json), [ressources](verification/build-assets.json), [résumé build](verification/build-approved.log), [résumé AdSense](verification/adsense-approved.log). Les comparaisons avec production sont des réponses publiques et des résultats archivés, pas une interrogation de la base ou du compte Google.

### Différences attendues avec le site publié

Les 183 pages HTML communes ont conservé leurs métadonnées SEO dans l’audit final. Trois ajouts sont légitimes : `/auteur`, `/guides/acheter-voiture-electrique-occasion` et `/blog/voitures-electriques-chinoises-byd-mg`. Le sitemap passe de 121 à 124 URL, sans suppression. Les enrichissements des fiches, signatures Person, maillage et listes éditoriales sont attendus. L’absence locale de l’email Organization vient d’une variable optionnelle non renseignée ; elle ne justifie aucun changement d’environnement pendant cette mission.

Les annonces remplies, choix CMP réels, réception GA4 et comptes Search Console restent non vérifiés. Le contrôle statique Google ne vaut pas recette complète de ces services.

## 5. Sécurité et périmètre du commit proposé

La recherche heuristique a analysé 1 006 fichiers texte suivis ou candidats non suivis : clés privées, URL PostgreSQL avec mot de passe, tokens GitHub/Vercel, clés AWS, JWT et affectations de secrets. Aucun secret réel détecté. Deux résultats dans `tests/db/data-access.test.ts` sont des connexions fictives volontairement invalides à `127.0.0.1:59999`, mot de passe de test `x`, déjà présentes dans main. Aucun fichier sensible suivi ; `.env.example` contient des exemples. Cette recherche ne garantit pas la détection de toutes les formes de secrets.

`.env.local`, `.next/`, `node_modules/` et `.vercel/` sont ignorés par les règles Git existantes. Le fichier local contient notamment une connexion administrateur : il ne doit **jamais** être copié dans un payload de déploiement. Les identifiants publics AdSense/GA4 sont des paramètres d’intégration, pas des mots de passe ; ils restent inchangés. Les réponses Vercel privées et valeurs de variables ne sont pas exportées.

Preuve : [scan et revue des deux faux positifs](verification/secret-scan.json).

### Fichiers inclus, avant tout staging ou commit

**Proposition de commit : 249 fichiers, dont 44 sources/tests/configuration et 205 documents/preuves sélectionnés, environ 53,9 Mo avant ajout final du rapport.** La liste exacte est [commit-files.txt](commit-files.txt), avec classement et exclusions dans [commit-scope.json](commit-scope.json). Un `git add .` serait inadapté : environ 368,5 Mo de preuves supplémentaires préexistantes sont exclus de cette proposition, sans suppression.

| Famille | Contenu proposé |
|---|---|
| Éditorial non commité, six fichiers | `src/data/articles.ts`, `src/data/guides/index.ts`, `src/data/guides/usage.ts`, `src/data/guides/occasion.ts`, `src/data/editorial/chinese-vehicles.ts`, `src/data/editorial/expansion-sources.ts`. |
| Présentation UI, 33 fichiers | Les 27 fichiers suivis de présentation et leurs six helpers/styles nouveaux listés ci-dessous ; le lien éditorial de la page marque est aussi conservé. |
| Tests, quatre fichiers | `tests/db/pages.test.ts`, `tests/unit/editorial.test.ts`, `tests/unit/visuel-articles.test.ts`, `tests/unit/content-expansion.test.ts`. Le test DB est inclus sans être exécuté. |
| Configuration de tests, un fichier | `vitest.unit.config.ts`, déjà préexistant, pour vérifier les unités sans toucher la base. |
| Documentation et preuves | Rapports des lots 0 à 5 et audit final, mapping, synthèses comparatives, captures directement référencées et captures SEO, rapport éditorial, ce rapport et listes de périmètre. |

Les 33 fichiers UI proposés :

- `src/app/globals.css` ; `src/app/voitures-electriques/[brand]/page.tsx`.
- `src/components/calculators/ChargingCostCalculator.tsx`, `EvVsPetrolCalculator.tsx`, `StationPowerCalculator.tsx`, `TcoCalculator.tsx`, `TripPlanner.tsx`, `kit.tsx`.
- `src/components/charts/GroupedBars.tsx` ; `src/components/comparison/ComparisonBuilder.tsx` ; `src/components/finder/VehicleFinder.tsx`.
- `src/components/garage/GarageBar.tsx`, `GarageToggle.tsx` ; `src/components/guides/GuideCardVisual.tsx`.
- `src/components/home/sections.tsx`, `refinements.css` ; `src/components/layout/Footer.tsx`, `Header.tsx`, `refinements.css`.
- `src/components/ui/Field.tsx`, `Prose.tsx`, `componentStyles.ts`.
- `src/components/vehicles/BrandOverview.tsx`, `ModelOverview.tsx`, `SpecTable.tsx`, `VehicleCard.tsx`, `VehicleCostEstimator.tsx`, `VehicleDetail.tsx`, `VehicleExplorer.tsx`, `VehicleRow.tsx`, `DataTableScroll.tsx`, `catalogue.css`, `catalogueStyles.ts`.

Les deux commits auteur/fiches ne sont pas réécrits. Un nouveau commit sur `feat/auteur-fiches` conserverait leur ascendance et les ajouts déjà commités à `src/app/sitemap.ts`, aux routes auteur/fiches et aux helpers SEO. Ils doivent également se retrouver dans le futur export, même s’ils ne sont plus dans le diff à commiter.

Exclusions : fichiers d’environnement et authentification, dépendances, builds, logs transitoires, patches de contrôle, protocoles temporaires, rapports Lighthouse complets et captures non sélectionnées, nouvelles captures techniques détaillées de cette préparation. Aucun fichier exclu n’est effacé. Les rapports historiques et ce rapport conservent certains liens vers des preuves consultables seulement dans le workspace ; le commit proposé n’est pas une archive exhaustive des audits. La liste des références exclues est explicite dans le périmètre. Un partage de toutes les preuves nécessiterait un archivage distinct ou une extension du périmètre documentaire avant validation.

Message proposé : `feat(ui): harmoniser EVExpert Signature et intégrer les contenus validés`. Rien n’est stagé et aucun commit n’est créé. Avant le commit autorisé, relire son diff, son inventaire et les exclusions ; si le workspace a changé, refaire la comparaison avec l’inventaire initial plutôt que d’écraser les nouveaux travaux.

### Export local de sécurité

Une copie isolée des 347 fichiers déjà suivis et des fichiers proposés a été préparée dans `/private/tmp/evexpert-preview-candidate-l2wmwjum`, sans `.git`, `.env.local`, secret ou configuration Vercel. Les sources copiées ont les mêmes empreintes. Les dépendances existantes sont copiées localement par clone APFS uniquement pour tester le build : aucune installation. Cette copie n’est pas une Preview et ne doit pas être envoyée telle quelle avec ses dépendances ou son build.

Le build de cet export réussit, ainsi que celui du workspace après ajout du rapport : [export](verification/candidate-export.json), [builds de garde](verification/build-closure.json). Pour conserver les conditions locales, le paramètre GA4 existant est transmis en mémoire aux builds, sans recopier le fichier d’environnement ; les deux variables de connexion PostgreSQL sont explicitement absentes de l’environnement du build exporté. Aucune modification des valeurs ou portées Vercel.

**Un effet documentaire mesuré : le CSS de l’export est de 73 916 octets, contre 74 531 dans le workspace audité, soit 615 octets de moins.** Les preuves exclues avaient fait générer 16 utilitaires supplémentaires par la détection automatique Tailwind. Aucune règle commune n’est modifiée. Aucun de ces 16 sélecteurs ne correspond à un élément des 186 pages HTML SSR, ni dans 50 observations après hydratation sur dix pages aux cinq largeurs, y compris menus ouverts. Zéro débordement global. Les deux noms de classes générées pour la même police locale changent avec le chemin du build et sont correctement associés au HTML ; aucune nouvelle police.

L’export conserve les 190 routes et leur HTML SEO, sans différence avec l’audit final : [validation de l’export](verification/export-validation.json). La différence CSS n’est donc pas une régression visuelle identifiée ; elle explique pourquoi une égalité binaire du CSS n’est pas exigible lorsque le dossier de build et les preuves incluses diffèrent. Les mesures Lighthouse de la vraie Preview restent nécessaires : ce contrôle n’en préjuge pas les scores.

Le futur payload devra être réexporté depuis le **SHA du commit approuvé**, avec un inventaire de fichiers vérifié. Il ne faut pas déployer directement le workspace chargé de preuves locales.

## 6. Conditions de sécurité Preview

| Point | État / exigence avant déclenchement |
|---|---|
| Projet et équipe | Projet `evexpert` et équipe indiquée par les statuts Vercel ; ID projet et liaison exacte à certifier en lecture seule. Ne pas créer un nouveau projet. |
| Paramètres de build | Aucun `vercel.json` ou dossier `.vercel` local ; Next config et package/lock inchangés. Framework, Node, rootDirectory, commandes install/build et éventuels hooks du dashboard non vérifiés. Vérifier qu’aucun hook ne migre ou importe la base. |
| Variables Preview | Portées, overrides de branche et présence réelle non accessibles. Aucun `vercel env pull`, ajout ou modification de variable exécuté. |
| Catalogue / données | Avec `DATABASE_URL`, le code lit PostgreSQL ; sans elle, ou avec un mode local déjà configuré, il lit le catalogue local. Le pool est créé au premier usage uniquement. |
| Effets sur la base | Les loaders applicatifs examinés font des SELECT ; le rôle lecture seule est la stratégie du dépôt, pas une preuve des privilèges actuels sur Supabase. Ne pas connecter la Preview à une base de production non vérifiée. Privilégier un environnement Preview déjà isolé/local, ou une base de recette existante et lecture seule. |
| Variables interdites en Preview | `DATABASE_ADMIN_URL`, clés d’administration ou `service_role`. Si présentes, arrêter et demander une décision séparée ; ne pas les corriger automatiquement. |
| Canonical | `NEXT_PUBLIC_SITE_URL` doit déjà résoudre vers `https://www.evexpert.fr`, ou être absent et utiliser le défaut existant. Une valeur vercel.app serait acceptée par le helper actuel : ne pas la supposer impossible. Contrôler canonical, OG et sitemap après build. |
| Domaine Preview | URL générée `*.vercel.app` uniquement ; aucun domaine personnalisé, alias ou promotion vers les domaines de production. |
| Noindex | Vercel ajoute normalement `X-Robots-Tag: noindex` aux Preview sur ses URL générées. Ce n’est pas une règle noindex locale dans Next. Un domaine personnalisé de branche peut faire perdre cet en-tête. |
| Protection observée | L’ancienne Preview `evexpert-1yd4s4uya-aymane-s-projects-167e5574.vercel.app` répond 302 vers l’authentification Vercel **avec `X-Robots-Tag: noindex`**. Cela valide cette réponse anonyme, pas le HTML applicatif authentifié ni une future Preview. |
| Google | Conserver scripts, IDs, réservations et consentement. Une Preview peut charger Google et, après consentement, émettre des événements GA4 si ses variables l’activent ; noindex ne désactive ni analytics ni publicité. Vérifier les portées et conditions existantes sans modifier les comptes. |

Les variables à inventorier, sans recopier leurs valeurs : `DATABASE_URL`, `EVEXPERT_DATA_SOURCE`, `DATABASE_POOL_MAX`, `DATABASE_SSL`, `NEXT_PUBLIC_SITE_URL`, paramètres publics de contact/éditeur, `GA_ID`, `ADSENSE_ENABLED`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`. Comparer Production et Preview et les overrides de branche. Aucun nouveau secret n’est requis par les changements source. Les indications de `.env.example` et `docs/supabase.md` sont des exemples historiques, notamment pour AdSense ; elles ne prouvent pas les valeurs Vercel actuelles.

**Si aucune isolation sûre n’est déjà configurée, conserver NO-GO.** Un éventuel override pour utiliser les données locales ou une autre base nécessiterait une autorisation séparée de changement d’environnement ; il n’est ni appliqué ni inclus implicitement dans l’autorisation Preview. `/api/health` n’est pas appelé dans cette préparation.

Sources : [indexation des Preview Vercel](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines), [configuration des déploiements Git](https://vercel.com/docs/project-configuration/git-configuration), [exclusion des fichiers des déploiements](https://vercel.com/docs/deployments/vercel-ignore). La protection d’accès ne vaut pas contrôle des canonicals ni recette du contenu servi après authentification.

## 7. Procédure Preview proposée, non exécutée

1. Lever les conditions non vérifiées ci-dessus au moyen d’un accès Vercel en lecture seule ou d’informations certifiées du dashboard, sans partager de secrets dans le rapport.
2. Faire approuver le fichier de périmètre, puis seulement ajouter explicitement ses entrées à l’index, relire `git diff --cached --check`, les fichiers sensibles et le diff. Créer le commit autorisé et noter son SHA. Aucun push requis pour une Preview CLI.
3. Exporter dans un nouveau dossier temporaire les fichiers de ce SHA avec `git archive`, sans copier `.env.local`, `.git`, preuves non commitées, dépendances ou `.next`. Vérifier que les helpers nouveaux et les deux commits antérieurs sont présents. Conserver l’export testé et les empreintes.
4. Après autorisation correspondante, lier **localement le dossier d’export** au projet Vercel existant confirmé. Ne créer aucun projet et ne modifier aucun paramètre distant. La CLI 59.1.4 déjà en cache peut être utilisée, sans installation. Arrêter si elle demande une création de projet ou un changement d’environnement.
5. Après accord explicite pour la Preview, lancer une seule création **`--target=preview`**, depuis cet export, avec les paramètres Preview existants vérifiés. Exemple de commande future uniquement :

   ```bash
   node "/Users/aymaneouirdani/.npm/_npx/67eb4586ca667318/node_modules/vercel/dist/vc.js" deploy \
     --cwd "$EVEXPERT_RELEASE_DIR" \
     --scope "aymane-s-projects-167e5574" \
     --target=preview \
     --meta "releaseCandidateCommit=$EVEXPERT_RELEASE_SHA"
   ```

   Les deux variables de shell représentent un dossier et un SHA validés ; ce ne sont pas des modifications des variables du projet. La liaison au bon ID projet est une précondition, pas une valeur implicite de cette commande. Pas de `--prod`, `promote`, changement d’alias, `--build-env`, `--env` ou `--yes` acceptant des paramètres par défaut. Ne pas utiliser le build local comme un déploiement `--prebuilt` : il n’a pas été produit par la chaîne Vercel et ne valide pas ses variables.

6. Archiver URL immuable, ID, état Ready, cible Preview, provenance CLI, SHA associé par metadata et empreintes du payload. Une création CLI n’est pas une publication Git native ; vérifier explicitement la traçabilité. Lire immédiatement les en-têtes anonymes **et** applicatifs après authentification sur accueil, catalogue, article et sitemap. Exiger noindex ; préserver la protection d’accès existante. Ne pas confondre une page de login 200 avec l’application 200.
7. Effectuer la recette suivante. Si une condition échoue, ne pas promouvoir ; documenter le point et revenir avec une proposition ciblée. La production conserve son déploiement, ses domaines, variables et paramètres Google.

Référence CLI : [vercel deploy](https://vercel.com/docs/cli/deploy). Les commandes de liaison, commit et déploiement restent à autoriser et ne sont pas exécutées ici.

## 8. Recette Preview à remplir après création autorisée

| Parcours | Contrôles attendus | Référence / preuve à conserver |
|---|---|---|
| 1. Accueil desktop/mobile | Cinq largeurs 320/390/768/1024/1440 ; ordre des sept sections, textes, CTA, compteurs et liens inchangés, aucun débordement. | Captures homologues aux lots 5/final, HTML et empreintes. |
| 2. Hero | Vidéo et poster actuels, H1/paragraphe adjacents complets, stratégie de source différée, preload/autoplay/responsive/reduced motion inchangés. | Requêtes réseau et vidéo ; aucune nouvelle ressource. |
| 3. Catalogue/filtres | Recherche Kona, filtres/tri, reset, paramètres URL, nombre et identité des résultats, états vides, tableau/cartes, focus et sélection tactile. | Jeux et résultats du lot 3 et audit final. |
| 4. Marques/modèles | Renault, Tesla Model 3 multiversions, version unique noindex et version Tesla indexable ; données/provenance et liens. | Routes, canonicals, tableaux et indexation. |
| 5. Comparateur | Deux/trois véhicules, limite de sélection, copie de l’URL, restitution après navigation, clavier et mobile. | Valeurs de sélection et URL ; presse-papiers réel si disponible, sinon contrôle simulé identifié. |
| 6. Calculateurs | Les huit outils et deux estimateurs de fiche, états par défaut et jeux fixes : 20 cas. | Comparer champs, résultats numériques et tableaux accessibles, zéro différence métier. Aucune correction AC dans cette mission. |
| 7. Guides/articles | Pages anciennes et deux nouveaux contenus, illustrations existantes, sommaires, filtres, sources et tableaux. | Texte intégral et metadata ; captures mobile/desktop. |
| 8. Navigation/recherche | Menus natifs details, exclusivité, liens desktop/mobile, recherche GET, états sans résultat et erreur. | Clavier, focus visible et destinations identiques. |
| 9. Légal/méthodologie | Tous les liens du footer, auteur et sources ; `/methodologie#autonomie` atteint la section existante. | Ancres, contenu, consentement accessible depuis le footer. |
| 10. SEO | 190 routes attendues, 124 URL sitemap, 58 noindex existants, canonicals et OG sur www, JSON-LD, redirects/404, HTML indexable, liens/ancres. | Comparer aux captures locales ; **en-tête noindex global Preview est une différence attendue**, pas une régression des metas. Robots/sitemap de production inchangés. Aucun envoi de sitemap Preview à GSC. |
| 11. Google | Scripts uniques, ads.txt, emplacements et réservations aux cinq largeurs ; CMP réel accepter/refuser/révoquer si servi ; chargement GA4 et absence de collision des annonces. | Distinguer observation du script, choix réels et événements reçus. Une annonce non remplie ne valide pas la collision d’une annonce remplie. Aucun clic sur une publicité. |
| 12. Performance | Accueil, catalogue, comparateur, TCO M/D ; marque, modèle, guide et article représentatifs. Trois passages par page/appareil stratégique, puis davantage si variation. | Médianes LCP/FCP/CLS/TBT et score ; mêmes Chrome/Lighthouse, throttling, machine, consentement, caches et ordre. Garder CSS/JS transférés, élément LCP et chargement Hero. |

Ne pas retirer la protection Vercel pour Lighthouse/PageSpeed : utiliser un accès autorisé sans modifier les paramètres distants, et noter le surcoût de l’authentification ou l’impossibilité de mesurer. Une mesure du formulaire Vercel n’est pas une mesure d’EVExpert. Les contrôles des appareils physiques, Safari/Firefox et lecteurs d’écran sont à consigner uniquement s’ils sont réellement effectués.

### Références de performance

Les 98 mesures de l’audit final sont conservées, sans prétendre avoir réalisé 98 nouvelles mesures ici. Les 50 ressources statiques du build prépublication sont identiques au build mesuré. Aucun nouveau passage Lighthouse demandé à ce stade de préparation ; les mesures de la vraie Preview restent à faire après autorisation.

| Comparaison contrôlée entre builds locaux, mobile | Main de référence | Version finale | CLS finale | TBT final |
|---|---:|---:|---:|---:|
| Accueil | LCP 2,933 s, score 95 | LCP 2,934 s, score 95 | 0 | 10,5 ms |
| Catalogue | LCP 2,855 s, score 96 | LCP 2,854 s, score 96 | 0 | 7 ms |
| Comparateur | LCP 2,858 s, score 96 | LCP 2,856 s, score 96 | 0 | 11 ms |
| TCO | LCP 2,858 s, score 96 | LCP 2,858 s, score 96 | 0 | 10,5 ms |

Référence Chrome 154.0.8037.98, Lighthouse 12.8.2 ; mobile 412 × 823, DPR 1,75, CPU ×4, simulation réseau 1 638,4 kbit/s et RTT 150 ms ; desktop 1 350 × 940, DPR 1, CPU ×1, 10 240 kbit/s et RTT 40 ms. Les largeurs de recette responsive sont distinctes du profil Lighthouse.

Données de laboratoire ; TBT ne mesure pas l’INP terrain. CDN/compression HTTPS, protection Preview, scripts tiers, cache et conditions de consentement peuvent différer du serveur local : ne pas conclure à une régression causale sur un passage isolé ni garantir un score PageSpeed. Si une variation importante se reproduit, identifier l’élément LCP et les ressources avant toute correction.

## 9. Risques et actions avant décision

| Niveau | Risque / limite | Action |
|---|---|---|
| Bloquant pour création sécurisée de la Preview | Déploiement Current, domaine/alias et point de retour non certifiés ; API Vercel 403. | Obtenir une lecture authentifiée ou les informations exactes du dashboard, puis vérifier le tuple SHA/ID/domaines/Ready. Ne pas supposer main = production. |
| Bloquant pour création sécurisée de la Preview | Variables Preview, rôle réel et isolation des données inconnus. Le build peut lire la base dès que DATABASE_URL est présente. | Vérifier les scopes et hooks existants. Si isolation absente, décision séparée ; aucune modification automatique. |
| Bloquant administratif | Aucun accord pour commit ou déploiement Preview. | Approbation du périmètre et autorisations explicites après vérifications. Un accord Production resterait distinct. |
| Important | Déploiement depuis le workspace pourrait embarquer preuves massives ou fichiers d’environnement locaux ; CSS Tailwind détecte aussi des candidats dans les documents. | Export explicite du SHA approuvé, scan final du payload et comparaison du build exporté. Ne pas considérer .gitignore comme une preuve universelle des exclusions Vercel. |
| Important, préexistant | Simulateur de recharge AC : avertissement de limite embarquée présent, mais puissance choisie non plafonnée dans le calcul. | Conserver l’anomalie connue et son risque de résultat trop optimiste ; mission métier séparée avec tests. **Aucune correction dans cette mission.** |
| Non vérifié | CMP réel, annonces remplies/auto ads et réception GA4, GSC, privilèges Supabase actuels, paramètres Vercel, plan/droits de rollback. | Recette externe explicite ; aucune validation complète affirmée ici. |
| Non vérifié | INP terrain et effets après publication, appareils physiques et autres moteurs de navigateur. | Mesures appropriées après Preview puis éventuelle publication autorisée. |
| Mineur | Cas 404 invalides sans H1 et warnings de build déjà existants ; signalement axe des tableaux non reproduit comme blocage Chrome dans l’audit final. | Garder la réserve documentée, traiter séparément sans élargir cette préparation. |
| Mineur documentaire | Certaines preuves historiques détaillées restent locales et les rapports retenus les référencent encore. | Conserver le workspace/archives ; prévoir l’archivage externe avant partage si nécessaire, sans effacer les fichiers. |

## 10. Clôture et informations à obtenir

Pour lever le NO-GO Preview : déploiement **Production Current** et SHA complets, ID projet, domaines/alias, commandes de build/install, variables Preview **noms/portées seulement**, confirmation de source de données isolée et absence de credentials administrateur, protection et permissions/plan de rollback. Ne transmettre aucun token ni mot de passe dans un message.

L’autorisation ultérieure devra désigner le périmètre du commit et une **Preview exclusivement**. Aucun push ou déploiement Production n’est inclus. La mise en production restera une décision distincte, prise après une recette Preview documentée.

Clôture locale : les deux builds de garde réussissent ; l’export conserve les 190 réponses et le HTML SEO, ses 50 observations responsive ne débordent pas. Les 338 empreintes sources/assets/tests/configuration de l’entrée de cette mission restent identiques, HEAD inchangé, index vide, aucun fichier préexistant supprimé. Tous les nouveaux fichiers du workspace sont sous `docs/release/`. Les serveurs locaux de contrôle sont arrêtés en fin de mission. Aucun contrôle Vercel privé supplémentaire n’est déclaré validé.
