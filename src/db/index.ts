import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema";

/**
 * Accès PostgreSQL (Supabase en production). La base est OPTIONNELLE au build :
 * le pool n'est créé qu'au premier usage, jamais à l'import du module.
 *
 * - DATABASE_URL       : connexion applicative (rôle lecture seule, pooler Supabase).
 * - DATABASE_POOL_MAX  : taille du pool par processus (défaut 3 ; le pooler
 *                        transactionnel de Supabase multiplexe les connexions).
 * - DATABASE_SSL       : "disable" pour forcer sans SSL ; par défaut SSL sauf en local.
 */

export type Db = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as typeof globalThis & {
  __evexpertPool?: Pool;
};

let cachedDb: Db | undefined;

export function readDatabaseUrl(): string | undefined {
  const value = process.env.DATABASE_URL?.trim();
  return value ? value : undefined;
}

export function isDatabaseConfigured(): boolean {
  return readDatabaseUrl() !== undefined;
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "host.docker.internal";
}

/**
 * Construit la configuration du pool. Le paramètre `sslmode` de l'URL est retiré
 * car `pg` le traduirait en vérification stricte du certificat, que le pooler
 * Supabase (autorité propre) ne passe pas avec le magasin de certificats par défaut :
 * le chiffrement TLS est conservé, la chaîne de certificats n'est pas vérifiée.
 */
export function buildPoolConfig(connectionString: string, env: NodeJS.ProcessEnv = process.env): PoolConfig {
  const url = new URL(connectionString);
  url.searchParams.delete("sslmode");
  const useSsl = env.DATABASE_SSL !== "disable" && !isLocalHost(url.hostname);
  const max = Number.parseInt(env.DATABASE_POOL_MAX ?? "", 10);
  return {
    connectionString: url.toString(),
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    max: Number.isFinite(max) && max > 0 ? max : 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    application_name: "evexpert-web",
  };
}

export function getPool(connectionString: string | undefined = readDatabaseUrl()): Pool {
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to use the database");
  }
  const existing = globalForDb.__evexpertPool;
  if (existing) return existing;
  const pool = new Pool(buildPoolConfig(connectionString));
  globalForDb.__evexpertPool = pool;
  return pool;
}

export function getDb(): Db {
  cachedDb ??= drizzle(getPool(), { schema });
  return cachedDb;
}

/** Ferme le pool (scripts, tests). */
export async function closeDb(): Promise<void> {
  const pool = globalForDb.__evexpertPool;
  globalForDb.__evexpertPool = undefined;
  cachedDb = undefined;
  if (pool) await pool.end();
}

export { schema };
