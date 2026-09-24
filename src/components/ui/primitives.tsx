import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Encadré : réservé à ce qui est un objet (résultat de calcul, outil, formulaire, mise en
 * évidence). Pour structurer du contenu courant, préférer `Sheet` ou un filet.
 */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-surface", className)}>
      {children}
    </div>
  );
}

/** Bloc à filet fort en tête : structure éditoriale sans boîte. */
export function Sheet({
  children,
  className,
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "ink";
}) {
  return (
    <div className={cn("border-t-2 pt-4", tone === "ink" ? "border-paper" : "border-ink", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  numeral,
  title,
  description,
  action,
  tone = "paper",
  id,
}: {
  eyebrow?: string;
  /** Folio de section (« 01 »). */
  numeral?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /** `ink` : sur fond sombre. */
  tone?: "paper" | "ink";
  id?: string;
}) {
  const onInk = tone === "ink";
  return (
    <div
      className={cn(
        "mb-10 grid gap-x-10 gap-y-3 border-t-2 pt-5 md:mb-14 md:grid-cols-12 md:gap-y-4",
        onInk ? "border-paper" : "border-ink",
      )}
    >
      {(eyebrow || numeral) && (
        <p className={cn("label flex items-center gap-3 md:col-span-7", onInk ? "text-ink-muted" : "text-muted")}>
          {numeral && <span className={cn("num", onInk ? "text-signal" : "text-signal-deep")}>{numeral}</span>}
          {eyebrow}
        </p>
      )}
      {action && <div className="md:col-span-5 md:col-start-8 md:row-start-1 md:justify-self-end">{action}</div>}
      <h2
        id={id}
        className={cn(
          "balance text-h2 font-bold md:self-end",
          description ? "md:col-span-7" : "md:col-span-12",
          onInk ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("pretty text-base md:col-span-5 md:self-end", onInk ? "text-ink-muted" : "text-muted")}>
          {description}
        </p>
      )}
    </div>
  );
}

/** Lien fléché discret (« Voir toutes les voitures → »). */
export function ArrowLink({
  href,
  children,
  tone = "paper",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "paper" | "ink";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold",
        tone === "ink" ? "text-signal" : "text-signal-deep",
        className,
      )}
    >
      <span className="link-u">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
    </Link>
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
  signal: "bg-signal text-ink hover:bg-[#c8f65c]",
  // Alias historique de primary, conservé pour les pages existantes.
  secondary: "bg-ink text-paper hover:bg-ink-raised",
  outline: "border border-ink/30 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-paper-deep",
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-6 py-3 text-sm",
  lg: "min-h-12 px-8 py-5 text-base",
};

/** Classes d'un bouton : réutilisables pour <Link>, <button> ou <summary>. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
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
        "group/chip inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors duration-150 hover:border-ink hover:bg-ink hover:text-paper",
        className,
      )}
    >
      {children}
      {count !== undefined && <span className="tabular text-muted group-hover/chip:text-ink-muted">({count})</span>}
    </Link>
  );
}
