import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-xs",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2 text-signal-deep">{eyebrow}</p>}
        <h2 className="text-h2 font-bold text-ink">{title}</h2>
        {description && (
          <p className="mt-2 text-base text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Boutons                                                             */
/* ------------------------------------------------------------------ */

export type ButtonVariant = "primary" | "signal" | "secondary" | "outline" | "ghost";
export type ButtonSize = "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  // Action principale sur fond clair.
  primary: "bg-ink text-paper hover:bg-ink-raised",
  // Action principale sur fond sombre (ou mise en avant forte) : lime + encre.
  signal: "bg-signal text-ink hover:brightness-95",
  // Alias historique de primary, conservé pour les pages existantes.
  secondary: "bg-ink text-paper hover:bg-ink-raised",
  outline: "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-surface",
  ghost: "text-ink hover:bg-paper-deep",
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

/** Classes d'un bouton : réutilisables pour <Link>, <button> ou <summary>. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

/* ------------------------------------------------------------------ */
/* Badges et puces                                                     */
/* ------------------------------------------------------------------ */

export type BadgeTone = "neutral" | "emerald" | "amber" | "blue";

// Les noms de tons historiques (emerald, amber, blue) sont conservés pour ne pas
// toucher aux pages existantes ; ils pointent désormais sur les tokens EVExpert.
const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-paper-deep text-body",
  emerald: "bg-signal-tint text-signal-deep",
  amber: "bg-warn-bg text-warn",
  blue: "bg-info-bg text-info",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold",
        badgeTones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Lien-puce (marques, catégories) : cible tactile ≥ 40 px de haut. */
export function Chip({
  href,
  children,
  count,
  className,
}: {
  href: string;
  children: ReactNode;
  count?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:border-ink",
        className,
      )}
    >
      {children}
      {count !== undefined && <span className="tabular text-muted">({count})</span>}
    </Link>
  );
}
