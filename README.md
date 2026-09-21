# EVExpert

Plateforme française pour **comprendre, comparer et calculer le coût réel d'une voiture électrique** : 7 calculateurs, catalogue de fiches techniques sourcées, comparateur, dossier recharge, 20 guides et analyses chiffrées.

Site : https://evexpert.fr

## Démarrage

```bash
npm install
cp .env.example .env.local   # optionnel
npm run dev
```

Scripts : `npm run build`, `npm run lint`, `npm run typecheck`, `npm run check:data` (contrôle de cohérence du catalogue).

## Architecture

| Dossier | Rôle |
| --- | --- |
| `src/data/vehicles.ts` | Catalogue véhicules (lignes positionnelles + source par fiche). Toute donnée inconnue = `null`. |
| `src/data/guides/`, `articles.ts`, `charging.ts`, `toolContent.ts` | Contenus éditoriaux. Les tableaux chiffrés sont calculés depuis le catalogue. |
| `src/data/assumptions.ts` | Hypothèses par défaut (prix du kWh, rendement…), modifiables. |
| `src/data/sources.ts` | Sources externes citées (URLs vérifiées). |
| `src/lib/calculators`, `vehicle-calcs.ts`, `comparison.ts` | Calculs purs et comparaisons objectives. |
| `src/db` | Drizzle/PostgreSQL, **optionnel** : pool créé à la demande, jamais à l'import. |

Les données sont structurées pour migrer plus tard vers PostgreSQL/Supabase (véhicules, articles, guides, sources) sans changer les composants.

## Politique de données

- Aucune donnée inventée : une valeur absente s'affiche « Non disponible ».
- Chaque fiche cite sa source, son URL et sa date de relevé ; nature des données : source officielle / spécialisée / calcul EVExpert / estimation EVExpert.
- Le prix France n'est pas collecté (les prix de la source concernent d'autres marchés).
- Ajouter un véhicule : ajouter une ligne dans `vehicles.ts`, vérifier la fiche source, lancer `npm run check:data`.

## Variables d'environnement

Voir `.env.example`. Minimum en production : `NEXT_PUBLIC_SITE_URL=https://evexpert.fr` et `ADSENSE_ENABLED=false`.
Avant une demande AdSense : renseigner `NEXT_PUBLIC_CONTACT_EMAIL` et les champs éditeur (`NEXT_PUBLIC_PUBLISHER_*`).
`DATABASE_URL` n'est pas nécessaire.
