import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const containerWidths = {
  /** 72 rem : largeur historique, valeur par défaut. */
  page: "max-w-page",
  /** 80 rem : pages de données (comparateur, tableaux larges). */
  wide: "max-w-wide",
  /** 44 rem : lecture longue (guides, articles). */
  reading: "max-w-reading",
} as const;

export function Container({
  children,
  className,
  width = "page",
}: {
  children: ReactNode;
  className?: string;
  width?: keyof typeof containerWidths;
}) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", containerWidths[width], className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="eyebrow mb-2 text-signal-deep">{eyebrow}</p>
      )}
      <h1 className="text-h1 font-bold text-ink">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-lg leading-relaxed text-body">{description}</p>
      )}
    </div>
  );
}
