import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "../../src/db/schema";
import { importCatalog } from "../../src/db/import";
import { vehicles } from "../../src/data/vehicles";
import { TEST_ADMIN_SERVER_URL, TEST_ADMIN_URL, TEST_APP_PASSWORD, TEST_APP_ROLE, TEST_DB_NAME } from "./env";

/**
 * Recrée une base de test vierge, applique les MIGRATIONS versionnées (drizzle/)
 * puis importe le catalogue : les tests valident ainsi migrations + import réels.
 */
export default async function setup() {
  const server = new Pool({ connectionString: TEST_ADMIN_SERVER_URL, max: 1, connectionTimeoutMillis: 4000 });
  try {
    await server.query("select 1");
  } catch {
    await server.end().catch(() => undefined);
    throw new Error(
      "Postgres de test injoignable. Lancez `npm run db:local:up` (Docker) ou définissez TEST_DATABASE_ADMIN_URL.",
    );
  }
  await server.query(`drop database if exists ${TEST_DB_NAME} with (force)`);
  await server.query(`create database ${TEST_DB_NAME}`);
  await server.end();

  const pool = new Pool({ connectionString: TEST_ADMIN_URL, max: 2 });
  const db = drizzle(pool, { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  await pool.query(`do $$ begin if not exists (select 1 from pg_roles where rolname = '${TEST_APP_ROLE}') then create role ${TEST_APP_ROLE} login in role evexpert_app; end if; end $$`);
  await pool.query(`alter role ${TEST_APP_ROLE} with password '${TEST_APP_PASSWORD}'`);
  await importCatalog(db, vehicles);
  await pool.end();
}
