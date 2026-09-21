/**
 * Importe le catalogue local (src/data/vehicles.ts) dans PostgreSQL / Supabase.
 * Idempotent : relançable sans doublon. Transactionnel : tout ou rien.
 *
 *   npm run db:import
 *
 * Utilise DATABASE_ADMIN_URL (rôle propriétaire, écriture) ; à défaut DATABASE_URL.
 * Le rôle applicatif en lecture seule ne peut PAS écrire.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { buildPoolConfig } from "@/db";
import { formatImportReport, importCatalog } from "@/db/import";
import * as schema from "@/db/schema";
import { vehicles } from "@/data/vehicles";

async function main() {
  const url = process.env.DATABASE_ADMIN_URL?.trim() || process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_ADMIN_URL (ou DATABASE_URL) est requise pour importer.");
    process.exit(1);
  }
  const pool = new Pool(buildPoolConfig(url));
  const db = drizzle(pool, { schema });
  try {
    const report = await importCatalog(db, vehicles);
    console.log(formatImportReport(report));
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
