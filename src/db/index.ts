import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// The database is optional: public pages run on static/demo data. The pool is
// created lazily, only when a route actually calls getDb()/getPool(), so
// importing this module (or building without DATABASE_URL) never throws.

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

let cachedDb: NodePgDatabase | undefined;

function readDatabaseUrl(): string | undefined {
  const value = process.env.DATABASE_URL?.trim();
  return value ? value : undefined;
}

export function isDatabaseConfigured(): boolean {
  return readDatabaseUrl() !== undefined;
}

export function getPool(): Pool {
  const databaseUrl = readDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to use the database");
  }

  const existing = globalForDb.__arenaNextJsPostgresqlPool;
  if (existing) return existing;

  const pool = new Pool({ connectionString: databaseUrl });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }
  return pool;
}

export function getDb(): NodePgDatabase {
  cachedDb ??= drizzle(getPool());
  return cachedDb;
}
