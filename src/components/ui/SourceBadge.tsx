import { FileText, Info } from "lucide-react";
import Link from "next/link";
import { formatDateFr } from "@/lib/utils";

export function LastUpdated({ date }: { date: string }) {
  return (
    <p className="text-xs text-slate-500">
      Dernière mise à jour&nbsp;: {formatDateFr(date)}
    </p>
  );
}

export function SourceBadge({
  source,
  sourceUrl,
  isDemo,
}: {
  source: string;
  sourceUrl: string;
  isDemo?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
      <FileText className="h-3.5 w-3.5" aria-hidden />
      <span>Source&nbsp;:</span>
      {sourceUrl.startsWith("/") ? (
        <Link href={sourceUrl} className="font-medium text-emerald-700 hover:underline">
          {source}
        </Link>
      ) : (
        <a
          href={sourceUrl}
          rel="nofollow noopener"
          target="_blank"
          className="font-medium text-emerald-700 hover:underline"
        >
          {source}
        </a>
      )}
      {isDemo && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
          <Info className="h-3 w-3" aria-hidden />
          Donnée d&apos;exemple
        </span>
      )}
    </div>
  );
}

export function DemoNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <p>
        <strong>Données d&apos;exemple.</strong> Les caractéristiques présentées
        sont des données de démonstration destinées à illustrer le
        fonctionnement du site. Elles ne constituent pas des spécifications
        officielles et ne doivent pas servir de base à une décision d&apos;achat.
      </p>
    </div>
  );
}
