# Modèle de données

Schéma PostgreSQL géré par Drizzle (`src/db/schema/`). Les migrations SQL sont dans `drizzle/`.

```
brands ─< models ─< vehicle_versions ─┬─ 1:1 ─ charging_specs
                                      ├─ 1:N ─ vehicle_prices ── market explicite
                                      └─ 1:N ─ data_records (provenance)  >─ sources
```

## Règles fondamentales

1. **Jamais de donnée inventée.** Une donnée inconnue est `NULL` et s'affiche « Non disponible ».
2. **Un prix appartient toujours à un marché** (`FR`, `EU`, `DE`, `NL`, …). L'application n'affiche un « prix France » que pour `market = 'FR'`. Un prix allemand ou néerlandais n'est jamais présenté comme un prix français.
3. **Toute donnée est traçable** : `data_records` relie une ligne (ou un champ) à sa source, à l'URL précise consultée, à sa nature et à sa date de vérification (obligatoire).
4. **Les slugs sont des URLs publiques.** `brands.slug`, `models.slug`, `vehicle_versions.slug` composent `/voitures-electriques/[brand]/[model]/[version]`. Ne jamais les modifier sans redirection 301.

## Tables

### `brands`
`id`, `slug` (unique), `name`, `country` (NULL tant que non sourcé), `logo_url` (nullable), `created_at`, `updated_at`.

### `models`
`id`, `brand_id` → brands, `slug` (unique par marque), `name`, `description` (nullable), timestamps.

### `vehicle_versions`
Une version = finition + motorisation précise. Colonnes :

| Groupe | Colonnes |
| --- | --- |
| Identité | `id`, `model_id`, `slug` (unique par modèle), `name`, `year_from`, `year_to`, `is_active` |
| Classification | `body_type`, `drive` (FWD/RWD/AWD), `battery_chemistry` (LFP/NMC, nullable) |
| Batterie | `battery_gross_kwh`, `battery_usable_kwh` |
| WLTP | `wltp_range_km`, `wltp_consumption_kwh_100km` |
| Performances | `power_kw`, `power_ps`, `torque_nm`, `acceleration_0_100_s`, `top_speed_kmh` |
| Dimensions | `length_mm`, `width_mm`, `height_mm`, `weight_kg`, `trunk_l`, `trunk_max_l`, `seats` |
| Garanties | `vehicle_warranty_years`, `battery_warranty_years`, `battery_warranty_km`, `battery_warranty_text` |

Choix notables :

- **Pas de `vehicle_price_eur`** : le prix ne vit que dans `vehicle_prices` (pas de second « prix courant » à synchroniser).
- **Pas de colonnes AC/DC/temps de charge** : elles sont dans `charging_specs`.
- **Pas d'autonomie / consommation « réelles »** : ce sont des estimations EVExpert calculées à la volée (`src/lib/vehicle-calcs.ts`), pas des données.
- **Années** : `year_from` / `year_to` (une année seule → les deux égales). L'interface reconstitue `"2024-2026"`.
- **Garantie batterie** : `battery_warranty_text` conserve le texte de la source (`"8 ans ou 250 000 km"`, `"8 ans / 100 000 miles"`). Les colonnes numériques n'en extraient que ce qui est sans ambiguïté ; **les miles ne sont pas convertis**.
- **`is_active`** : `false` masque une version sans la supprimer (elle disparaît du site). Une version active mais incomplète est ignorée (avec avertissement) et signalée par `npm run check:data`.

Contraintes `CHECK` : batterie utile ≤ brute et > 0 ; WLTP 30–1500 km ; consommation 5–60 kWh/100 km ; années 2000–2100 et ordonnées ; puissances > 0 ; places 1–9 ; slugs `^[a-z0-9]+(-[a-z0-9]+)*$`.

### `charging_specs` (1 ligne par version)
`ac_max_kw`, `dc_max_kw`, `dc_10_80_min` (durée), `dc_10_80_percent_start` / `_end` (fenêtre, 10 → 80 par défaut), `charging_source_id`. Contraintes : AC 1–50 kW, DC 10–1000 kW, DC ≥ AC, durée 5–240 min, fenêtre cohérente.

### `vehicle_prices`
Historique des prix. `price_eur`, `price_type` (`list` / `promotional` / `estimated`), `market`, `valid_from`, `valid_to` (NULL = en vigueur), `source_id`, `source_url`, `verified_at`.
Contraintes : prix > 0, `valid_to ≥ valid_from`, **au moins une source** (`source_id` ou `source_url`).
Le prix « en vigueur » d'un marché = ligne avec `valid_from ≤ aujourd'hui` et (`valid_to` NULL ou ≥ aujourd'hui).
*État actuel : 0 ligne.* Les prix de la source utilisée sont des prix NL/DE ; ils n'ont volontairement pas été importés.

### `sources`
`id`, `name`, `url` (unique), `source_type` (`manufacturer`, `official`, `public`, `specialized`, `evexpert`, `other`), `created_at`.

### `data_records`
Provenance. `entity_type` (`brand`, `model`, `vehicle_version`, `charging_spec`, `vehicle_price`), `entity_id`, `field` (nom de colonne, ou `*` pour toute la ligne), `source_id`, `source_url`, `data_type`, `verified_at` (**NOT NULL**), `note`. Unique sur (`entity_type`, `entity_id`, `field`, `source_id`).

## Nature des données

| `data_type` (base) | Affichage (interface) | Signification |
| --- | --- | --- |
| `official` | Source officielle | Document constructeur ou autorité publique |
| `third_party` | Source spécialisée | Base tierce reconnue (ex. EV Database), non vérifiée auprès du constructeur |
| `calculated` | Calcul EVExpert | Calculé à partir de données affichées |
| `estimated` | Estimation EVExpert | Estimation reposant sur des hypothèses explicites |

Le `source_type` de la table `sources` (qui publie) est distinct du `data_type` (comment la donnée a été obtenue).

## Identifiants applicatifs

`Vehicle.id = "<brand.slug>-<model.slug>-<version.slug>"` (ex. `renault-5-e-tech-52-kwh-150-ch`). Il est utilisé dans les guides, les comparaisons pré-générées et les outils : le conserver stable.

## Correspondance seed → base

`src/data/vehicles.ts` (jeu initial) → `src/db/import.ts` :

| Seed (`Vehicle`) | Base |
| --- | --- |
| `brand`, `brandSlug` | `brands.name`, `brands.slug` |
| `model`, `modelSlug` | `models.name`, `models.slug` |
| `version`, `versionSlug`, `years` | `vehicle_versions.name`, `.slug`, `year_from`/`year_to` |
| `batteryGross`, `batteryUsable`, `rangeWltp`, `consumptionWltp` | `battery_gross_kwh`, `battery_usable_kwh`, `wltp_range_km`, `wltp_consumption_kwh_100km` |
| `chargingAC`, `chargingDC`, `chargingTime10to80` | `charging_specs.ac_max_kw`, `dc_max_kw`, `dc_10_80_min` |
| `batteryWarranty` | `battery_warranty_text` + `_years` / `_km` |
| `source.{name,url,dataType,lastUpdated}` | `sources` + `data_records` (`specialized` → `third_party`) |
| `price` (toujours `null`) | `vehicle_prices` (aucune ligne) |
