import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools } from "@/data/tools";
import { getGuides } from "@/data/guides";
import { getVehiclesForComparison } from "@/data/catalog";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";

function LinkList({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  if (!items.length) return null;
  return (
    <section className="mt-10">
      <h2 className="label mb-2">{title}</h2>
      <ul className="border-t-2 border-ink">
        {items.map((it) => (
          <li key={it.href} className="border-b border-line">
            <Link href={it.href} className="group flex items-start justify-between gap-3 py-3 text-sm font-semibold text-ink">
              <span className="link-h group-hover:[background-size:100%_2px]">{it.label}</span>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
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

export async function RelatedGuides({ slugs, title = "Guides associés" }: { slugs: string[]; title?: string }) {
  const guides = await getGuides();
  const items = slugs
    .map((s) => guides.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({ href: `/guides/${g.slug}`, label: g.title }));
  return <LinkList title={title} items={items} />;
}

export async function RelatedVehicles({ ids, title = "Voitures associées" }: { ids: string[]; title?: string }) {
  const items = (await getVehiclesForComparison(ids))
    .map((v) => ({ href: vehicleHref(v), label: `${vehicleTitle(v)} : fiche technique` }));
  return <LinkList title={title} items={items} />;
}
