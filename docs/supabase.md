# Supabase et déploiement Vercel

> Ce document décrit les actions à effectuer **dans votre compte Supabase et Vercel**. La migration et l'import ont été validés sur un PostgreSQL 16 local (Docker) ; ils n'ont pas été exécutés sur votre projet Supabase.

## Principe de sécurité

- L'application se connecte à PostgreSQL **côté serveur uniquement**, via Drizzle. **Aucun SDK Supabase, aucune clé `anon` ni `service_role` n'est utilisée** ni exposée au navigateur.
- **Deux rôles** :
  - `evexpert_app` — **lecture seule** ; c'est lui que Vercel utilise (`DATABASE_URL`) ;
  - `postgres` (propriétaire) — migrations et import, **depuis votre poste** (`DATABASE_ADMIN_URL`), jamais dans Vercel.
- La **RLS est activée sur toutes les tables**. Seul `evexpert_app` a une policy `SELECT`. Les rôles `anon` et `authenticated` de l'API publique Supabase n'ont **aucune policy** (et leurs privilèges sont révoqués) : les tables ne sont pas lisibles via l'API REST/GraphQL Supabase.
- Ne mettez **jamais** de mot de passe, de `service_role` ou d'URL de connexion dans Git, dans une variable `NEXT_PUBLIC_*` ou dans un message.

## 1. Créer le projet Supabase

1. supabase.com → **New project** (région proche de vos utilisateurs, ex. Paris `eu-west-3`).
2. Notez le mot de passe de la base (gestionnaire de mots de passe, pas dans Git).
3. **Project Settings → Database → Connection string** (ou bouton **Connect**) : repérez
   - **Direct connection** : `postgresql://postgres:[MOT-DE-PASSE]@db.[REF].supabase.co:5432/postgres` (IPv6 par défaut) ;
   - **Pooler, mode session** : `postgres://postgres.[REF]:[MOT-DE-PASSE]@aws-0-[REGION].pooler.supabase.com:5432/postgres` (IPv4) ;
   - **Pooler, mode transaction** : même hôte, port **6543**.
   Les formats exacts peuvent évoluer : recopiez-les depuis le tableau de bord.

## 2. Appliquer les migrations (depuis votre poste)

Dans un terminal, à la racine du projet (la variable n'est pas écrite dans un fichier suivi par Git) :

```bash
export DATABASE_ADMIN_URL='<connexion directe ou pooler session, rôle postgres>'
npm run db:migrate
```

Cela crée les 7 tables, les contraintes, active la RLS et crée le rôle `evexpert_app` **sans mot de passe ni droit de connexion**. Vérification : Table Editor → 7 tables, chacune avec « RLS enabled ».

## 3. Définir le mot de passe du rôle lecture seule

Dans **SQL Editor** de Supabase (choisissez un mot de passe fort, généré, unique) :

```sql
ALTER ROLE evexpert_app WITH LOGIN PASSWORD '<mot-de-passe-fort>';
```

Ne collez pas ce mot de passe dans le dépôt. Il sert uniquement à construire `DATABASE_URL`.

## 4. Importer les véhicules

```bash
export DATABASE_ADMIN_URL='…'      # comme à l'étape 2
npm run db:import
npm run check:data
```

Résultat attendu :

```
Brands imported: 22 · Models imported: 45 · Vehicle versions imported: 47
Prices imported: 0 · Sources imported: 1
Duplicates: 0 · Invalid records: 0 · Missing required fields: 0
```

et `Migration fidelity (base vs seed): 47/47 identical`. L'import est idempotent : relançable sans doublon.

## 5. Construire `DATABASE_URL` (lecture seule) pour Vercel

Utilisez le **pooler en mode transaction** (port 6543), recommandé pour Vercel :

```
postgresql://evexpert_app.[REF]:[MOT-DE-PASSE-DE-evexpert_app]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Le nom d'utilisateur avec le pooler est `evexpert_app.[REF]` (rôle + référence du projet). Si le mot de passe contient des caractères spéciaux (`@`, `:`, `/`, `#`…), encodez-les en URL.

## 6. Configurer Vercel

Vercel → **Project** (evexpert) → **Settings** → **Environment Variables** → **Add** :

| Nom | Valeur | Environnements |
| --- | --- | --- |
| `DATABASE_URL` | l'URL de l'étape 5 | Production (et Preview si souhaité) |

À conserver : `NEXT_PUBLIC_SITE_URL=https://www.evexpert.fr`, `ADSENSE_ENABLED=false`.
Ne **pas** ajouter `DATABASE_ADMIN_URL` dans Vercel. Cochez « Sensitive » pour `DATABASE_URL`.

Puis **Deployments → Redeploy** (les variables ne s'appliquent qu'aux nouveaux déploiements). Le build lit la base ; si elle est injoignable, **le build échoue** avec une erreur explicite (il ne retombe pas sur des données locales périmées).

## 7. Vérifier le déploiement

- `https://www.evexpert.fr/api/health` → `{"ok":true,"database":"up"}`.
- Les pages véhicules, `/sitemap.xml` (120 URLs) et `/comparer` s'affichent comme avant.
- Modifier une valeur en base (SQL Editor, rôle admin) : la page se met à jour dans les 24 h (régénération quotidienne), ou immédiatement après un redéploiement.

## Dépannage

| Symptôme | Cause probable |
| --- | --- |
| `getaddrinfo ENOTFOUND` / `ENETUNREACH` en connexion directe | La connexion directe Supabase est IPv6 : utilisez le pooler (session, port 5432) pour les migrations depuis un réseau IPv4 |
| `password authentication failed for user "evexpert_app"` | Mot de passe non défini (étape 3) ou nom d'utilisateur sans le suffixe `.[REF]` avec le pooler |
| `permission denied for table …` | Vous utilisez `evexpert_app` pour une écriture : utilisez `DATABASE_ADMIN_URL` |
| `too many connections` / `remaining connection slots` | Utilisez le pooler transaction (6543) et laissez `DATABASE_POOL_MAX` à 3 |
| `La base est joignable mais ne contient aucune version publiable` | Import non exécuté (étape 4) |
| Le build échoue avec `Failed query … ECONNREFUSED/ETIMEDOUT` | `DATABASE_URL` incorrecte ou base en pause (projets gratuits : réveillez-le dans Supabase) |
| `SELF_SIGNED_CERT_IN_CHAIN` | Ne pas ajouter `sslmode=verify-full` : l'application chiffre en TLS sans vérifier la chaîne du pooler (voir `src/db/index.ts`) |

## Rotation du mot de passe

`ALTER ROLE evexpert_app WITH PASSWORD '<nouveau>';` dans le SQL Editor, mettez à jour `DATABASE_URL` dans Vercel, redéployez.
