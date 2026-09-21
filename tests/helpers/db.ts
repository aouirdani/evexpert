import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../src/db/schema";
import { TEST_ADMIN_URL, TEST_APP_URL } from "./env";

/** Connexion ADMIN (écriture) à la base de test. */
export function adminPool() {
  const pool = new Pool({ connectionString: TEST_ADMIN_URL, max: 2 });
  return { pool, db: drizzle(pool, { schema }) };
}

/** Connexion applicative en LECTURE SEULE (rôle evexpert_app, soumis à la RLS). */
export function appPool() {
  return new Pool({ connectionString: TEST_APP_URL, max: 2 });
}

/** Exécute une requête censée échouer et retourne le message d'erreur PostgreSQL. */
export async function expectSqlError(pool: Pool, sql: string, params: unknown[] = []): Promise<string> {
  try {
    await pool.query(sql, params);
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
  throw new Error(`La requête aurait dû échouer : ${sql}`);
}
