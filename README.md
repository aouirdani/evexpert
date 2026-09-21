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

```
Next.js (Server Components, pages statiques + régénération quotidienne)
        ↓  @/data/catalog  (couche d'accès, serveur uniquement)
Drizzle ORM
        ↓
Supabase PostgreSQL   ← source de vérité des données véhicules
```

| Dossier | Rôle |
| --- | --- |
| `src/db/schema/` | Schéma Drizzle (marques, modèles, versions, recharge, prix, sources, provenance) |
| `drizzle/` | Migrations SQL versionnées |
| `src/data/catalog/` | Couche d'accès aux données (`getBrands`, `getModels`, `getVehicleBySlug`, `getVehiclePrice`, …) |
| `src/data/vehicles.ts` | Jeu initial (seed) importé en base + repli de développement sans `DATABASE_URL` |
| `src/data/guides/`, `articles.ts`, `charging.ts`, `toolContent.ts` | Contenus éditoriaux (tableaux chiffrés calculés depuis le catalogue) |
| `src/data/assumptions.ts`, `sources.ts` | Hypothèses de calcul, sources externes citées |
| `src/lib/` | Calculs purs (calculateurs, coûts, comparaison) et helpers |
| `scripts/` | Import, contrôle qualité, snapshot SEO, smoke test, Postgres local |
| `tests/` | Vitest : unitaires + intégration sur base de test isolée |
| `docs/` | `database.md`, `supabase.md`, `data-model.md` |

Documentation détaillée : [`docs/database.md`](docs/database.md) (exploitation), [`docs/data-model.md`](docs/data-model.md) (schéma), [`docs/supabase.md`](docs/supabase.md) (Supabase + Vercel).

## Scripts

`dev`, `build`, `lint`, `typecheck` · `test` · `check:data` · `db:generate`, `db:migrate`, `db:import` · `db:local:up|down|reset` · `test:routes` · `snapshot:seo`

## Politique de données

- Aucune donnée inventée : une valeur absente est `NULL` en base et s'affiche « Non disponible ».
- Chaque fiche cite sa source, son URL et sa date de relevé ; nature des données : source officielle / spécialisée / calcul EVExpert / estimation EVExpert.
- **Un prix appartient toujours à un marché** : seul un prix `FR` s'affiche comme prix français. Aucun prix n'est collecté à ce jour (les prix de la source utilisée sont néerlandais ou allemands).
- Ajouter un véhicule, mettre à jour un prix : voir [`docs/database.md`](docs/database.md).

## Variables d'environnement

Voir `.env.example`.

- Production Vercel : `NEXT_PUBLIC_SITE_URL=https://evexpert.fr`, `ADSENSE_ENABLED=false`, `DATABASE_URL` (rôle **lecture seule**, pooler Supabase — voir [`docs/supabase.md`](docs/supabase.md)).
- Sans `DATABASE_URL`, le site lit `src/data/vehicles.ts` (développement / transition). Avec `DATABASE_URL`, une base injoignable **fait échouer le build** (pas de repli silencieux).
- `DATABASE_ADMIN_URL` (migrations et import) : **local uniquement**, jamais dans Vercel.
- Avant une demande AdSense : `NEXT_PUBLIC_CONTACT_EMAIL` et `NEXT_PUBLIC_PUBLISHER_*`.
