import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools } from "@/data/tools";
import { getVehicleById, vehicleTitle } from "@/data/vehicles";
import { formatEuro } from "@/lib/utils";

export function RelatedTools({ hrefs }: { hrefs: string[] }) {
  const items = tools.filter((t) => hrefs.includes(t.href) || hrefs.includes(t.slug));
  if (!items.length) return null;
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-bold text-slate-900">Outils utiles</h2>
      <ul className="mt-3 space-y-2">
        {items.map((t) => (
          <li key={t.slug}>
            <Link
              href={t.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedVehicles({ ids }: { ids: string[] }) {
  const items = ids.map(getVehicleById).filter((v): v is NonNullable<typeof v> => Boolean(v));
  if (!items.length) return null;
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-bold text-slate-900">Voitures associées</h2>
      <ul className="mt-3 space-y-2">
        {items.map((v) => (
          <li key={v.id}>
            <Link
              href={`/voitures-electriques/${v.brandSlug}/${v.modelSlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
              {vehicleTitle(v)} — {formatEuro(v.price)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
