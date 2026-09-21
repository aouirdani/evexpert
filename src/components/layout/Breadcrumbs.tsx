import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href: string;
}

/** Fil d'Ariane sur une seule ligne (le dernier élément se tronque) ; JSON-LD BreadcrumbList inchangé. */
export function Breadcrumbs({ items, tone = "paper", className }: { items: Crumb[]; tone?: "paper" | "ink"; className?: string }) {
  const full: Crumb[] = [{ name: "Accueil", href: "/" }, ...items];
  const onInk = tone === "ink";
  return (
    <>
      <nav aria-label="Fil d'Ariane" className={cn("mb-8", className)}>
        <ol className={cn("flex items-center gap-2 overflow-hidden whitespace-nowrap text-caption", onInk ? "text-ink-muted" : "text-muted")}>
          {full.map((item, i) => {
            const isLast = i === full.length - 1;
            return (
              <li key={item.href} className={cn("flex items-center gap-2", isLast ? "min-w-0" : "shrink-0")}>
                {i > 0 && <span aria-hidden className={onInk ? "text-line-ink" : "text-control"}>/</span>}
                {isLast ? (
                  <span className={cn("truncate font-medium", onInk ? "text-paper" : "text-ink")} aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="link-u">
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
