import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools } from "@/data/tools";
import { guides } from "@/data/guides";
import { getVehicleById, vehicleHref, vehicleTitle } from "@/data/vehicles";

function LinkList({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  if (!items.length) return null;
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="inline-flex items-start gap-1.5 text-sm font-medium text-emerald-800 hover:underline"
            >
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedTools({ hrefs, title = "Outils utiles" }: { hrefs: string[]; title?: string }) {
  const items = tools
    .filter((t) => hrefs.includes(t.href) || hrefs.includes(t.slug))
    .map((t) => ({ href: t.href, label: t.title }));
  return <LinkList title={title} items={items} />;
}

export function RelatedGuides({ slugs, title = "Guides associés" }: { slugs: string[]; title?: string }) {
  const items = slugs
    .map((s) => guides.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({ href: `/guides/${g.slug}`, label: g.title }));
  return <LinkList title={title} items={items} />;
}

export function RelatedVehicles({ ids, title = "Voitures associées" }: { ids: string[]; title?: string }) {
  const items = ids
    .map(getVehicleById)
    .filter((v): v is NonNullable<typeof v> => Boolean(v))
    .map((v) => ({ href: vehicleHref(v), label: `${vehicleTitle(v)} : fiche technique` }));
  return <LinkList title={title} items={items} />;
}
