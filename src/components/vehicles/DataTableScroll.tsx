import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { catalogueStyles as styles } from "./catalogueStyles";

/** Cadre de présentation natif, sans état ni gestionnaire de défilement. */
export function DataTableScroll({ children, label, hintId, className }: {
  children: ReactNode;
  label: string;
  hintId: string;
  className?: string;
}) {
  return (
    <div className={cx(styles.tableShell, className)}>
      <p id={hintId} data-ui-scroll-hint className={styles.scrollHint}>
        <span aria-hidden>↔</span>
        Si nécessaire, faites défiler horizontalement pour voir toutes les colonnes.
      </p>
      <div data-data-table-scroll role="region" aria-label={label} aria-describedby={hintId} tabIndex={0} className={styles.tableScroll}>
        {children}
      </div>
    </div>
  );
}
