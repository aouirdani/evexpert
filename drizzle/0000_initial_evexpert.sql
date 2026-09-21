CREATE TYPE "public"."battery_chemistry" AS ENUM('LFP', 'NMC');--> statement-breakpoint
CREATE TYPE "public"."body_type" AS ENUM('citadine', 'compacte', 'berline', 'SUV', 'break', 'monospace', 'utilitaire', 'coupé');--> statement-breakpoint
CREATE TYPE "public"."data_type" AS ENUM('official', 'third_party', 'calculated', 'estimated');--> statement-breakpoint
CREATE TYPE "public"."drive_type" AS ENUM('FWD', 'RWD', 'AWD');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('brand', 'model', 'vehicle_version', 'charging_spec', 'vehicle_price');--> statement-breakpoint
CREATE TYPE "public"."market" AS ENUM('FR', 'EU', 'DE', 'NL', 'BE', 'ES', 'IT', 'UK');--> statement-breakpoint
CREATE TYPE "public"."price_type" AS ENUM('list', 'promotional', 'estimated');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('manufacturer', 'official', 'public', 'specialized', 'evexpert', 'other');--> statement-breakpoint
CREATE TABLE "data_records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "data_records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"entity_type" "entity_type" NOT NULL,
	"entity_id" integer NOT NULL,
	"field" text DEFAULT '*' NOT NULL,
	"source_id" integer NOT NULL,
	"source_url" text NOT NULL,
	"data_type" "data_type" NOT NULL,
	"verified_at" timestamp with time zone NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "data_records_entity_field_source_unique" UNIQUE("entity_type","entity_id","field","source_id")
);
--> statement-breakpoint
ALTER TABLE "data_records" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"url" text NOT NULL,
	"source_type" "source_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sources_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "sources" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brands" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "brands_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"country" text,
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "brands_slug_unique" UNIQUE("slug"),
	CONSTRAINT "brands_slug_format" CHECK ("brands"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
ALTER TABLE "brands" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "charging_specs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "charging_specs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vehicle_version_id" integer NOT NULL,
	"ac_max_kw" numeric(5, 1),
	"dc_max_kw" numeric(5, 1),
	"dc_10_80_min" smallint,
	"dc_10_80_percent_start" smallint DEFAULT 10 NOT NULL,
	"dc_10_80_percent_end" smallint DEFAULT 80 NOT NULL,
	"charging_source_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "charging_specs_version_unique" UNIQUE("vehicle_version_id"),
	CONSTRAINT "charging_specs_ac_range" CHECK ("charging_specs"."ac_max_kw" IS NULL OR "charging_specs"."ac_max_kw" BETWEEN 1 AND 50),
	CONSTRAINT "charging_specs_dc_range" CHECK ("charging_specs"."dc_max_kw" IS NULL OR "charging_specs"."dc_max_kw" BETWEEN 10 AND 1000),
	CONSTRAINT "charging_specs_dc_ge_ac" CHECK ("charging_specs"."dc_max_kw" IS NULL OR "charging_specs"."ac_max_kw" IS NULL OR "charging_specs"."dc_max_kw" >= "charging_specs"."ac_max_kw"),
	CONSTRAINT "charging_specs_time_range" CHECK ("charging_specs"."dc_10_80_min" IS NULL OR "charging_specs"."dc_10_80_min" BETWEEN 5 AND 240),
	CONSTRAINT "charging_specs_percent_window" CHECK ("charging_specs"."dc_10_80_percent_start" >= 0 AND "charging_specs"."dc_10_80_percent_end" <= 100 AND "charging_specs"."dc_10_80_percent_start" < "charging_specs"."dc_10_80_percent_end")
);
--> statement-breakpoint
ALTER TABLE "charging_specs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "models" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "models_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"brand_id" integer NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "models_brand_slug_unique" UNIQUE("brand_id","slug"),
	CONSTRAINT "models_slug_format" CHECK ("models"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
ALTER TABLE "models" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "vehicle_versions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vehicle_versions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"model_id" integer NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"year_from" smallint,
	"year_to" smallint,
	"is_active" boolean DEFAULT true NOT NULL,
	"body_type" "body_type" NOT NULL,
	"drive" "drive_type" NOT NULL,
	"battery_chemistry" "battery_chemistry",
	"battery_gross_kwh" numeric(6, 1),
	"battery_usable_kwh" numeric(6, 1),
	"wltp_range_km" integer,
	"wltp_consumption_kwh_100km" numeric(5, 1),
	"power_kw" integer,
	"power_ps" integer,
	"torque_nm" integer,
	"acceleration_0_100_s" numeric(4, 1),
	"top_speed_kmh" integer,
	"length_mm" integer,
	"width_mm" integer,
	"height_mm" integer,
	"weight_kg" integer,
	"trunk_l" integer,
	"trunk_max_l" integer,
	"seats" smallint,
	"vehicle_warranty_years" smallint,
	"battery_warranty_years" smallint,
	"battery_warranty_km" integer,
	"battery_warranty_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_versions_model_slug_unique" UNIQUE("model_id","slug"),
	CONSTRAINT "vehicle_versions_slug_format" CHECK ("vehicle_versions"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	CONSTRAINT "vehicle_versions_battery_usable_le_gross" CHECK ("vehicle_versions"."battery_usable_kwh" IS NULL OR "vehicle_versions"."battery_gross_kwh" IS NULL OR "vehicle_versions"."battery_usable_kwh" <= "vehicle_versions"."battery_gross_kwh"),
	CONSTRAINT "vehicle_versions_battery_positive" CHECK (("vehicle_versions"."battery_gross_kwh" IS NULL OR "vehicle_versions"."battery_gross_kwh" > 0) AND ("vehicle_versions"."battery_usable_kwh" IS NULL OR "vehicle_versions"."battery_usable_kwh" > 0)),
	CONSTRAINT "vehicle_versions_wltp_range_range" CHECK ("vehicle_versions"."wltp_range_km" IS NULL OR "vehicle_versions"."wltp_range_km" BETWEEN 30 AND 1500),
	CONSTRAINT "vehicle_versions_wltp_consumption_range" CHECK ("vehicle_versions"."wltp_consumption_kwh_100km" IS NULL OR "vehicle_versions"."wltp_consumption_kwh_100km" BETWEEN 5 AND 60),
	CONSTRAINT "vehicle_versions_years_order" CHECK ("vehicle_versions"."year_from" IS NULL OR "vehicle_versions"."year_to" IS NULL OR "vehicle_versions"."year_from" <= "vehicle_versions"."year_to"),
	CONSTRAINT "vehicle_versions_years_range" CHECK (("vehicle_versions"."year_from" IS NULL OR "vehicle_versions"."year_from" BETWEEN 2000 AND 2100) AND ("vehicle_versions"."year_to" IS NULL OR "vehicle_versions"."year_to" BETWEEN 2000 AND 2100)),
	CONSTRAINT "vehicle_versions_power_positive" CHECK (("vehicle_versions"."power_kw" IS NULL OR "vehicle_versions"."power_kw" > 0) AND ("vehicle_versions"."power_ps" IS NULL OR "vehicle_versions"."power_ps" > 0)),
	CONSTRAINT "vehicle_versions_seats_range" CHECK ("vehicle_versions"."seats" IS NULL OR "vehicle_versions"."seats" BETWEEN 1 AND 9)
);
--> statement-breakpoint
ALTER TABLE "vehicle_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "vehicle_prices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vehicle_prices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vehicle_version_id" integer NOT NULL,
	"price_eur" numeric(10, 2) NOT NULL,
	"price_type" "price_type" DEFAULT 'list' NOT NULL,
	"market" "market" NOT NULL,
	"valid_from" date NOT NULL,
	"valid_to" date,
	"source_id" integer,
	"source_url" text,
	"verified_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_prices_price_range" CHECK ("vehicle_prices"."price_eur" > 0 AND "vehicle_prices"."price_eur" < 5000000),
	CONSTRAINT "vehicle_prices_period_order" CHECK ("vehicle_prices"."valid_to" IS NULL OR "vehicle_prices"."valid_to" >= "vehicle_prices"."valid_from"),
	CONSTRAINT "vehicle_prices_has_source" CHECK ("vehicle_prices"."source_id" IS NOT NULL OR "vehicle_prices"."source_url" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "vehicle_prices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "data_records" ADD CONSTRAINT "data_records_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charging_specs" ADD CONSTRAINT "charging_specs_vehicle_version_id_vehicle_versions_id_fk" FOREIGN KEY ("vehicle_version_id") REFERENCES "public"."vehicle_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charging_specs" ADD CONSTRAINT "charging_specs_charging_source_id_sources_id_fk" FOREIGN KEY ("charging_source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_versions" ADD CONSTRAINT "vehicle_versions_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_prices" ADD CONSTRAINT "vehicle_prices_vehicle_version_id_vehicle_versions_id_fk" FOREIGN KEY ("vehicle_version_id") REFERENCES "public"."vehicle_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_prices" ADD CONSTRAINT "vehicle_prices_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "data_records_entity_idx" ON "data_records" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "data_records_source_idx" ON "data_records" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "models_brand_idx" ON "models" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "vehicle_versions_model_idx" ON "vehicle_versions" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "vehicle_prices_lookup_idx" ON "vehicle_prices" USING btree ("vehicle_version_id","market","valid_from");