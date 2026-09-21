-- Sécurité : rôle applicatif en LECTURE SEULE + verrouillage de l'API publique Supabase.
--
-- 1. `evexpert_app` : rôle utilisé par Vercel (DATABASE_URL). Il ne peut que lire.
--    Il est créé SANS connexion et SANS mot de passe : le mot de passe est défini
--    manuellement, jamais dans Git (voir docs/supabase.md) :
--      ALTER ROLE evexpert_app WITH LOGIN PASSWORD '<mot-de-passe-fort>';
-- 2. RLS est activé sur toutes les tables (migration 0000) : sans policy, un rôle
--    non-propriétaire ne voit rien. On ajoute donc une policy SELECT pour
--    `evexpert_app` uniquement. Les rôles Supabase `anon` et `authenticated`
--    (API REST/GraphQL publique) n'ont AUCUNE policy : ils n'accèdent à rien.
-- 3. On révoque en plus leurs privilèges par défense en profondeur.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'evexpert_app') THEN
    CREATE ROLE evexpert_app NOLOGIN;
  END IF;
END
$$;
--> statement-breakpoint

GRANT USAGE ON SCHEMA public TO evexpert_app;
--> statement-breakpoint
GRANT SELECT ON
  public.brands,
  public.models,
  public.vehicle_versions,
  public.charging_specs,
  public.vehicle_prices,
  public.sources,
  public.data_records
TO evexpert_app;
--> statement-breakpoint

CREATE POLICY evexpert_app_read ON public.brands FOR SELECT TO evexpert_app USING (true);
--> statement-breakpoint
CREATE POLICY evexpert_app_read ON public.models FOR SELECT TO evexpert_app USING (true);
--> statement-breakpoint
CREATE POLICY evexpert_app_read ON public.vehicle_versions FOR SELECT TO evexpert_app USING (true);
--> statement-breakpoint
CREATE POLICY evexpert_app_read ON public.charging_specs FOR SELECT TO evexpert_app USING (true);
--> statement-breakpoint
CREATE POLICY evexpert_app_read ON public.vehicle_prices FOR SELECT TO evexpert_app USING (true);
--> statement-breakpoint
CREATE POLICY evexpert_app_read ON public.sources FOR SELECT TO evexpert_app USING (true);
--> statement-breakpoint
CREATE POLICY evexpert_app_read ON public.data_records FOR SELECT TO evexpert_app USING (true);
--> statement-breakpoint

-- Rôles Supabase (absents d'un Postgres standard) : révocation seulement s'ils existent.
DO $$
DECLARE
  r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated']
  LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('REVOKE ALL ON public.brands, public.models, public.vehicle_versions, public.charging_specs, public.vehicle_prices, public.sources, public.data_records FROM %I', r);
    END IF;
  END LOOP;
END
$$;
