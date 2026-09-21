# Base de données — architecture et exploitation

## Architecture

```
Pages / Server Components
        │  (await getAllVehicles(), getVehicleBySlug(), …)
        ▼
src/data/catalog            ← couche d'accès (serveur uniquement, `server-only`)
        │
        ├── DATABASE_URL définie ──► src/db (Drizzle + pg) ──► PostgreSQL (Supabase)
        │        échec de la base ⇒ ERREUR (pas de repli silencieux)
        │
        └── DATABASE_URL absente ──► src/data/vehicles.ts (seed local)   [développement / transition]
```

- Les pages ne contiennent **aucune requête SQL** : elles appellent `@/data/catalog`.
- `getCatalog()` charge le catalogue publiable en **une requête** (jointures) et le garde en mémoire 5 minutes par processus ; les sélecteurs (`getModels`, `getBrands`, …) travaillent ensuite en mémoire. Les sélecteurs purs sont dans `src/data/catalog/selectors.ts`.
- Les guides et articles du blog sont **calculés depuis le catalogue** (`src/data/guides/*`, `src/data/articles.ts`) via `getGuides()` / `getArticles()`.
- Les helpers sans données (`vehicleHref`, `vehicleTitle`…) sont dans `src/lib/vehicle-utils.ts` et les métriques de comparaison dans `src/lib/comparison-metrics.ts` : ils sont utilisables côté client sans embarquer la base dans le bundle navigateur.

### Rendu, cache et performance

Les pages restent **statiques** : elles sont générées au build à partir de la base, puis régénérées au plus une fois par jour (`revalidate = 86400`). Une donnée modifiée dans Supabase apparaît donc en moins de 24 h **sans redéploiement**. Si la base est indisponible pendant une régénération, Next.js continue de servir la dernière version générée. Aucune requête n'est faite depuis le navigateur.

### Phase de transition (deux sources)

Aujourd'hui, `src/data/vehicles.ts` sert de **seed** (jeu initial importé dans la base) et de **repli de développement** quand `DATABASE_URL` est absente. La base est la source de vérité dès qu'elle est configurée. `npm run check:data` vérifie que la base est identique au seed (« migration fidelity »). Une fois la base validée en production, le seed pourra être retiré du chemin d'exécution (il ne resterait utile que pour l'initialisation d'une base vide).

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run db:local:up` / `down` / `reset` | Postgres 16 local dans Docker (port 54329) |
| `npm run db:generate` | Génère une migration SQL depuis `src/db/schema/` (sans connexion) |
| `npm run db:migrate` | Applique les migrations (`DATABASE_ADMIN_URL`) |
| `npm run db:import` | Importe le seed dans la base (idempotent, transactionnel) |
| `npm run check:data` | Rapport de qualité des données (seed + base si configurée) |
| `npm test` | Tests (unitaires + intégration sur une base de test isolée) |
| `npm run test:routes` | Smoke test des routes sur un site servi (`npm start`) |
| `npm run snapshot:seo` | Instantané SEO (URLs, metadata, JSON-LD, liens, texte) pour comparer deux versions |

## Développer en local avec une base

```bash
npm run db:local:up
export DATABASE_ADMIN_URL="postgresql://postgres:postgres@127.0.0.1:54329/evexpert_dev"
npm run db:migrate
npm run db:import
# .env.local :
#   DATABASE_URL=postgresql://evexpert_app:<mot-de-passe-local>@127.0.0.1:54329/evexpert_dev
#   (après : ALTER ROLE evexpert_app WITH LOGIN PASSWORD '<mot-de-passe-local>';)
npm run check:data
npm run dev
```

## Migrations

- Le schéma se modifie **uniquement** dans `src/db/schema/`, puis `npm run db:generate -- --name <nom>` produit un fichier `drizzle/NNNN_<nom>.sql` **à committer**.
- Jamais de modification manuelle non tracée en production : toute évolution passe par une migration.
- `drizzle/0000_initial_evexpert.sql` : tables, énumérations, contraintes `CHECK`, activation de la RLS.
- `drizzle/0001_app_read_role.sql` : rôle applicatif lecture seule, grants, policies `SELECT`, révocation des rôles publics Supabase.
- SQL à la main (rôles, policies…) : `npx drizzle-kit generate --custom --name=<nom>`.

## Ajouter un véhicule

Pendant la transition, la voie recommandée est celle qui garde seed et base alignés :

1. Relever la fiche source (URL exacte) et copier les valeurs **telles que publiées** ; `null` si absent.
2. Ajouter une ligne dans `src/data/vehicles.ts` (ordre des colonnes documenté par le type `Row`).
3. `npm run check:data` (validation locale), puis `npm run db:import` (idempotent : seule la nouvelle ligne est créée).
4. Si le modèle n'a qu'une version, sa page version sera `noindex` (canonical vers le modèle) ; à partir de deux versions elle devient indexable.
5. Lancer `npm run build` : les nouvelles pages et le sitemap se génèrent seuls.

Ne jamais modifier un slug existant (URL publique).

## Mettre à jour un prix

Les prix se **versionnent** : on clôture la période en cours puis on insère la nouvelle, sans écraser l'historique. Le marché est obligatoire ; seul `FR` s'affiche comme prix français.

```sql
begin;
update vehicle_prices set valid_to = '2026-10-31', updated_at = now()
 where market = 'FR' and valid_to is null
   and vehicle_version_id = (select v.id from vehicle_versions v join models m on m.id = v.model_id
                             join brands b on b.id = m.brand_id
                             where b.slug = 'renault' and m.slug = '5-e-tech' and v.slug = '52-kwh-150-ch');
insert into vehicle_prices (vehicle_version_id, price_eur, price_type, market, valid_from, source_url, verified_at)
values ((select v.id from vehicle_versions v join models m on m.id = v.model_id join brands b on b.id = m.brand_id
          where b.slug = 'renault' and m.slug = '5-e-tech' and v.slug = '52-kwh-150-ch'),
        29990, 'list', 'FR', '2026-11-01', 'https://<page constructeur exacte>', now());
commit;
```

Exécuter avec la connexion **admin** (`DATABASE_ADMIN_URL`). Une source (`source_id` ou `source_url`) est obligatoire. Un prix hors France (`NL`, `DE`…) peut être enregistré mais ne s'affichera jamais comme prix français.

## Sources et traçabilité

Chaque version a une ligne `data_records` (`field = '*'`) avec la source, l'URL de la fiche, la nature (`third_party`, `official`…) et `verified_at`. Pour sourcer un champ précis (ex. une donnée officielle constructeur), ajouter un `data_record` avec `field = 'wltp_range_km'` et `data_type = 'official'`. `npm run check:data` signale les versions sans source et celles vérifiées depuis plus de 180 jours.

## Qualité des données

`npm run check:data` produit :

```
EVExpert Data Quality Report
Brands: 22 · Models: 45 · Versions: 47 · Prices: 0 (marché FR : 0)
Invalid prices / battery / WLTP: 0 · Duplicate slugs: 0
Missing sources: 0 · Missing verification dates: 0 · Invalid relations: 0
Migration fidelity (base vs seed): 47/47 identical
```

Le script signale, il ne corrige jamais. Code de sortie 1 en cas de problème bloquant.

## Tests

`npm test` recrée une base `evexpert_test` (Docker local requis : `npm run db:local:up`), applique les vraies migrations, importe le seed, puis exécute :

- **unit** : règles de validation, parseurs d'import, sélecteurs, URLs ;
- **db/data-access** : marque, modèle, version, prix (marché explicite), recharge, sources, échec explicite, repli local ;
- **db/integrity** : doublons de slugs, prix / batterie / WLTP invalides, sources et dates manquantes, relations, RLS ;
- **db/import** : idempotence, transaction, refus des prix sans marché ;
- **db/pages** : `generateStaticParams` / `generateMetadata` des pages dynamiques, sitemap (120 URLs).
