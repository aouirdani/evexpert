import type { ReactNode } from "react";
import type { DataSource } from "@/types";
import { Kicker } from "@/components/layout/Section";
import { dataTypeLabel } from "@/components/ui/DataBadge";
import { formatDateFr, frTypo } from "@/lib/format";
import { GarageToggle } from "@/components/garage/GarageToggle";

/**
 * En-tête d'une page véhicule (modèle ou version) : rubrique, H1, chapô, source et date de relevé.
 * `vehicleId` : ajoute le bouton « Comparer » du véhicule que la page décrit elle-même — sans lui,
 * seuls les véhicules cités en « Véhicules similaires » étaient ajoutables depuis une fiche.
 */
export function VehicleHeader({
  eyebrow,
  title,
  dek,
  source,
  aside,
  vehicleId,
}: {
  eyebrow: string;
  title: string;
  dek?: ReactNode;
  source: DataSource;
  aside?: ReactNode;
  vehicleId?: string;
}) {
  return (
    <header className="grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-end">
      <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
        <div className="flex items-start justify-between gap-4">
          <Kicker>{eyebrow}</Kicker>
          {vehicleId && <GarageToggle id={vehicleId} className="relative shrink-0" showLabel />}
        </div>
        <h1 className={`balance mt-5 font-bold text-ink ${aside ? "text-h1-compact" : "text-h1"}`}>{frTypo(title)}</h1>
        {dek && <p className="pretty mt-6 max-w-2xl text-lg text-body">{dek}</p>}
        <p className="mt-6 text-caption text-muted">
          Données relevées le <time dateTime={source.lastUpdated}>{formatDateFr(source.lastUpdated)}</time> · {dataTypeLabel(source.dataType)}
        </p>
      </div>
      {aside && <div className="lg:col-span-5">{aside}</div>}
    </header>
  );
}
