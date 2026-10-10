# EVExpert — Lot 0 : référence avant modification

Référence prise sur le dépôt actuel, incluant les ajouts éditoriaux préexistants. Aucun fichier source ou de configuration modifié pendant le lot 0. Données locales forcées via `EVEXPERT_DATA_SOURCE=local`, sans connexion ni écriture DB. Build de production Next.js 16.2.6, servi sur `http://localhost:3102`.

- 320 empreintes SHA-256 des sources, assets, tests et configurations : toutes identiques à la fin du lot 0.
- 186 pages HTML, dont la recherche dynamique (58 noindex au total), et 4 ressources dans la capture de 190 routes. Les huit redirections et `ads.txt` sont enregistrés séparément.
- Métadonnées complètes, canonicals, robots, JSON-LD, H1/H2/H3, IDs, liens avec ancres, texte HTML sans scripts et empreinte du texte : `before/seo.json`. Les classes et ressources Next hachées ne font pas partie du contrat SEO.
- 45 observations responsive : 9 pages × 320, 390, 768, 1024, 1440 px. Réservations publicitaires enregistrées avec leurs coordonnées et dimensions.
- 16 jeux de saisie : état initial et saisie fixe pour chacun des 8 calculateurs. Valeurs des champs, texte des résultats et tableaux accessibles conservés.
- Filtre Kona, sélection/limite 3 véhicules, vidage, troisième véhicule du comparateur, URL partagée et copie clavier vérifiés. L’API presse-papiers est simulée pour contrôler exactement le texte envoyé.
- Focus Tab vérifié sur 5 largeurs des pages multiversions et sur les vues tableau à 1024/1440. Aucun contour dessiné sur les liens concernés.
- Hero : source vidéo absente à 390 et en mouvement réduit, vidéo jouée à 1440, pause/reprise vérifiées. H1 et ordre des sections enregistrés.
- 19 captures JPEG avant correction (desktop/mobile, détails et focus) disponibles dans `before/`.

## Défauts confirmés

- TCO : document de 453 px à 320 et 390 px. Tableau `figure table.sr-only`, largeur intrinsèque de 417 px, à l’origine du débordement.
- Essence vs électrique : même composant, document de 423 px à 320/390.
- Liens étirés `VehicleRow` et `ModelOverview` : `outline-style: none` sur le lien et son pseudo-élément après Tab.
- Sélection véhicule : 32 × 32 px ; vidage : 28 × 28 px ; bouton de copie : hauteur 20 px.
- Marques et versions tronquées dans les cartes, notamment à 320/390.

## Lighthouse avant

Mesures de laboratoire locales, Chrome 154.0.8037.98, Lighthouse 12.8.2. Profils mobile/desktop par défaut, ralentissement simulé, caches navigateur réinitialisés par Lighthouse, mêmes URL, machine et ordre des passages avant/après. Scripts Google conservés. Les paramètres détaillés sont dans `before/lighthouse.json`. Ces valeurs ne sont ni des mesures terrain CrUX ni des exécutions PageSpeed sur les serveurs Google.

| Passage | Page | Profil | Performance | FCP (ms) | LCP (ms) | CLS | TBT (ms) |
|---:|---|---|---:|---:|---:|---:|---:|
| 1 | / | mobile | 95 | 905.1 | 2932.7 | 0 | 19.0 |
| 2 | / | desktop | 100 | 243.8 | 626.0 | 0 | 0.0 |
| 3 | /voitures-electriques | mobile | 96 | 902.9 | 2854.4 | 0 | 11.5 |
| 4 | /comparer | mobile | 96 | 904.4 | 2706.6 | 0 | 10.0 |
| 5 | /outils/tco-voiture-electrique | mobile | 96 | 905.4 | 2708.2 | 0 | 11.5 |
| 6 | / | mobile | 95 | 906.5 | 2934.7 | 0 | 11.5 |
| 7 | / | desktop | 100 | 244.3 | 626.4 | 0 | 0.0 |
| 8 | /voitures-electriques | mobile | 96 | 903.2 | 2855.1 | 0 | 14.0 |
| 9 | /comparer | mobile | 96 | 904.7 | 2857.1 | 0 | 9.0 |
| 10 | /outils/tco-voiture-electrique | mobile | 96 | 903.9 | 2855.9 | 0 | 9.0 |
| 11 | / | mobile | 96 | 904.6 | 2857.3 | 0 | 11.0 |
| 12 | / | desktop | 100 | 243.1 | 624.7 | 0 | 0.0 |
| 13 | /voitures-electriques | mobile | 96 | 902.9 | 2704.4 | 0 | 11.5 |
| 14 | /comparer | mobile | 96 | 904.4 | 2706.7 | 0 | 9.0 |
| 15 | /outils/tco-voiture-electrique | mobile | 96 | 903.8 | 2855.8 | 0 | 9.0 |

Le score automatisé d’accessibilité est 100 sur ces passages ; cela ne prouve pas une conformité WCAG. Le protocole clavier a détecté des défauts que Lighthouse ne signale pas.

Limites : navigateur Chrome émulé, aucun appareil physique ou Safari ; aucune annonce réelle ni dialogue Funding Choices activé pour valider toutes les configurations de compte. Aucun accès privé à GSC, GA4, Vercel ou Supabase. Le Hero mobile reste dans son comportement existant.
