/** URLs de la base de TEST (Postgres local Docker : `npm run db:local:up`). */
const admin = process.env.TEST_DATABASE_ADMIN_URL ?? "postgresql://postgres:postgres@127.0.0.1:54329/postgres";
const u = new URL(admin);

export const TEST_DB_NAME = "evexpert_test";
export const TEST_ADMIN_SERVER_URL = admin;
export const TEST_ADMIN_URL = (() => { const x = new URL(admin); x.pathname = `/${TEST_DB_NAME}`; return x.toString(); })();
/**
 * Rôle de test membre de `evexpert_app` (créé par la migration 0001) : il hérite de la lecture seule
 * et des policies RLS, sans modifier le mot de passe du rôle applicatif (les rôles sont globaux au serveur).
 */
export const TEST_APP_ROLE = "evexpert_app_test";
export const TEST_APP_PASSWORD = "app_test_only";
export const TEST_APP_URL = (() => { const x = new URL(TEST_ADMIN_URL); x.username = TEST_APP_ROLE; x.password = TEST_APP_PASSWORD; return x.toString(); })();
export const TEST_HOST = u.hostname;
