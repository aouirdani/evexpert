import { FileText } from "lucide-react";
import Link from "next/link";
import type { DataSource } from "@/types";
import { formatDateFr } from "@/lib/utils";
import { DataBadge } from "./DataBadge";

export function LastUpdated({ date, label = "Dernière mise à jour" }: { date: string; label?: string }) {
  return (
    <p className="text-xs text-slate-600">
      {label}&nbsp;: <time dateTime={date}>{formatDateFr(date)}</time>
    </p>
  );
}

/** Ligne de source : nom (lien), nature de la donnée, date de relevé. */
export function SourceLine({ source }: { source: DataSource }) {
  const external = source.url.startsWith("http");
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
      <FileText className="h-3.5 w-3.5" aria-hidden />
      <span>Source&nbsp;:</span>
      {external ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-medium text-emerald-800 underline underline-offset-2"
        >
          {source.name}
        </a>
      ) : (
        <Link href={source.url} className="font-medium text-emerald-800 underline underline-offset-2">
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
