import type { ReactNode } from "react";
import type { DataSource } from "@/types";
import { Kicker } from "@/components/layout/Section";
import { dataTypeLabel } from "@/components/ui/DataBadge";
import { formatDateFr, frTypo } from "@/lib/utils";

/** En-tête d'une page véhicule (modèle ou version) : rubrique, H1, chapô, source et date de relevé. */
export function VehicleHeader({
  eyebrow,
  title,
  dek,
  source,
  aside,
}: {
  eyebrow: string;
  title: string;
  dek?: ReactNode;
  source: DataSource;
  aside?: ReactNode;
}) {
  return (
    <header className="grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-end">
      <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
        <Kicker>{eyebrow}</Kicker>
        <h1 className="balance mt-4 text-h1 font-bold text-ink">{frTypo(title)}</h1>
        {dek && <p className="pretty mt-5 max-w-2xl text-lg text-body">{dek}</p>}
        <p className="mt-5 text-caption text-muted">
          Données relevées le <time dateTime={source.lastUpdated}>{formatDateFr(source.lastUpdated)}</time> · {dataTypeLabel(source.dataType)}
        </p>
      </div>
      {aside && <div className="lg:col-span-5">{aside}</div>}
    </header>
  );
}
