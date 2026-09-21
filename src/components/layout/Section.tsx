import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

const tones = {
  paper: "bg-paper text-ink",
  deep: "bg-paper-deep text-ink",
  ink: "on-ink bg-ink text-paper",
} as const;

/**
 * Section de page : fond, rythme vertical et conteneur en un seul endroit, pour ne plus répéter
 * `mx-auto max-w-page px-6 py-…` à chaque bloc. Server Component.
 *  - `spacing="section"` : grand rythme (défaut) ; `"block"` : bloc secondaire ; `"none"` : aucun.
 *  - `bleed` : le fond va jusqu'aux bords, le contenu reste sur la grille.
 */
export function Section({
  children,
  tone = "paper",
  width = "page",
  spacing = "section",
  id,
  labelledBy,
  className,
  innerClassName,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  width?: "page" | "wide" | "reading";
  spacing?: "section" | "block" | "none";
  id?: string;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        tones[tone],
        spacing === "section" && "py-section",
        spacing === "block" && "py-block",
        className,
      )}
    >
      <Container width={width} className={innerClassName}>
        {children}
      </Container>
    </section>
  );
}

/** Rubrique d'un contenu éditorial : petites capitales, séparateur, complément (date, folio). */
export function Kicker({
  children,
  aside,
  tone = "paper",
  className,
}: {
  children: ReactNode;
  aside?: ReactNode;
  tone?: "paper" | "ink";
  className?: string;
}) {
  return (
    <p className={cn("eyebrow flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      <span className={tone === "ink" ? "text-signal" : "text-signal-deep"}>{children}</span>
      {aside && (
        <>
          <span aria-hidden className={cn("h-3 w-px", tone === "ink" ? "bg-line-ink" : "bg-line")} />
          <span className={cn("font-medium", tone === "ink" ? "text-ink-muted" : "text-muted")}>{aside}</span>
        </>
      )}
    </p>
  );
}
