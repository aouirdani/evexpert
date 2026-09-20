import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "Accueil", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Fil d'Ariane" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
          {full.map((item, i) => {
            const isLast = i === full.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
                {isLast ? (
                  <span className="font-medium text-slate-700" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-emerald-700">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(full)} />
    </>
  );
}
