import { defineConfig } from "drizzle-kit";

// Les migrations utilisent DATABASE_ADMIN_URL (rôle propriétaire du schéma,
// connexion directe Supabase) ; à défaut DATABASE_URL. Aucune valeur en dur.
// `drizzle-kit generate` ne se connecte pas à la base.
const url = process.env.DATABASE_ADMIN_URL || process.env.DATABASE_URL || "";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
