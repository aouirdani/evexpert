import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
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
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-lg text-slate-600">{description}</p>
      )}
    </div>
  );
}
