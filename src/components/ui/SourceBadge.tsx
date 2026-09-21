import { FileText } from "lucide-react";
import Link from "next/link";
import type { DataSource } from "@/types";
import { formatDateFr } from "@/lib/utils";
import { DataBadge } from "./DataBadge";

export function LastUpdated({ date, label = "Dernière mise à jour" }: { date: string; label?: string }) {
  return (
    <p className="text-caption text-muted">
      {label}&nbsp;: <time dateTime={date}>{formatDateFr(date)}</time>
    </p>
  );
}

/** Ligne de source : nom (lien), nature de la donnée, date de relevé. */
export function SourceLine({ source }: { source: DataSource }) {
  const external = source.url.startsWith("http");
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
      <FileText className="h-4 w-4" aria-hidden />
      <span>Source&nbsp;:</span>
      {external ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="link-u font-semibold text-signal-deep"
        >
          {source.name}
        </a>
      ) : (
        <Link href={source.url} className="link-u font-semibold text-signal-deep">
          {source.name}
        </Link>
      )}
      <DataBadge type={source.dataType} />
      <span>
        relevé le <time dateTime={source.lastUpdated}>{formatDateFr(source.lastUpdated)}</time>
      </span>
    </div>
  );
}
