# Lot 2 — cartographie et périmètre avant modification

Références consultées : `docs/ui/lot-0-1/README.md` et `REFERENCE.md`. Les travaux préexistants sont enregistrés dans `start-status.txt` et les 320 empreintes dans `start-hashes.json`. Copie de sauvegarde hors application : `/private/tmp/evexpert-lot-2-originals/`.

## Primitives et usages

| Primitive | Usages | Décision de périmètre |
|---|---|---|
| `ui/primitives.tsx` : Button/ButtonLink/buttonClass, ArrowLink, Card, Badge, Chip | Hero, sections d’accueil, footer, hubs, états | Conserver les variantes actuelles : modifier leur défaut affecterait l’accueil protégé. |
| `ui/Field.tsx` : fieldClass, Label, Input, Select, Range | SearchBar commun, catalogue, comparateur, aide au choix | Conserver fieldClass compact pour la recherche commune. Ajouter une variante de contrôle confortable explicite pour les pages contrôlées. |
| `calculators/kit.tsx` : Field, NumberInput, SelectInput, RangeInputControl | 8 outils et VehicleCostEstimator sur les fiches | Partager les styles de contrôle, séparer spatialement valeur/unité, associer les aides aux inputs. Conserver événements, limites et valeurs. |
| `kit.tsx` : CalcLayout, ResultCard ; panneaux TcoCalculator/EvVsPetrolCalculator | Saisies et résultats des huit outils | Harmoniser uniquement ces panneaux : rayon 8 px déjà commun ; surface blanche/encre, filet, rythme mobile/desktop. Garder valeurs, labels, H2 et aria-live. |
| Actions personnalisées VehicleExplorer, VehicleFinder, ComparisonBuilder | Filtres/tri/bascule d’affichage, choix Oui/Non/carrosserie, réinitialisation, copie | Styles partagés ciblés, cibles ≥44 px, hover/focus/disabled sans nouveaux événements. |
| GarageToggle/GarageBar, VehicleCard/VehicleRow/ModelOverview | Catalogue, accueil, marques/modèles | Corrections du lot 1 à préserver ; aucune modification globale dans le lot 2. |
| DataBadge/DataLegend, DataFigure, Stat, Delta, SourceBadge | Catalogue, fiches, comparateur, outils ET accueil | Conserver les codes sémantiques, IBM Plex Mono pour chiffres/unités, provenances et données. Déjà cohérents ; pas de modification par préférence esthétique. |
| states.tsx : ErrorState/EmptyState/Skeleton | Recherche, erreurs/états vides | Rôles alert/status déjà présents. Pas de nouvelle règle de validation métier ni de nouveau message utilisateur. |
| globals.css | Toutes les pages | Aucun changement global : palette, polices, rayons 4/8 px, focus cobalt/volt et mouvement réduit conservés. |

## Constatations

- Les sélecteurs catalogue/comparateur utilisent des contrôles de 14 px ; le kit utilise 16 px. Les tailles/paddings ne proviennent pas d’une même variante.
- Les unités du NumberInput sont en position absolue au-dessus de la zone éditable sans espace réservé spécifique. Un texte long ou un champ étroit peut recouvrir une valeur.
- Field affiche les aides dans un paragraphe sans identifiant ni aria-describedby sur l’input. Les descriptions existent déjà : ne pas ajouter de texte éditorial.
- Les choix Oui/Non ont 40 px, carrosseries 36 px, bascules catalogue 40 px ; réinitialisations visuellement des liens mais véritables boutons. Leur surface interactive peut être harmonisée à 44 px sans changer la logique.
- Les alias Tailwind rounded-md/lg/xl/2xl ont déjà tous 8 px. Il ne s’agit pas d’un défaut visuel à corriger globalement.
- La légende de provenance appartient à l’accueil ; une modification globale des badges dépasserait la protection demandée.

## Contrat de validation

Capturer avant toute modification : SEO des 190 routes, ressources et huit redirections ; 17 pages × 5 largeurs ; 20 jeux fixes/default de calculs (8 outils et 2 estimateurs véhicules) ; presets, filtres, aide au choix, clavier ; Hero, publicité et intégrations. Trois passages Lighthouse par couple page/profil, sur serveur local de production, Chrome/Lighthouse existants, sans installation.

Tester les champs avant de modifier les actions, puis les actions avant les panneaux. Les seuls ajouts d’accessibilité sont des attributs HTML et des IDs d’aides ; aucun nouvel état, écouteur, effet, provider ou composant client. Pas de connexion DB.
