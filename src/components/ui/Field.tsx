import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

/**
 * Classes partagées des champs de formulaire. Bordure `control` (≥ 3:1 sur
 * paper et sur blanc) : le champ reste identifiable sans dépendre de la couleur
 * d'accent. Le focus clavier utilise l'outline global du design system.
 */
export const fieldClass =
  "w-full rounded-md border border-control bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted focus-visible:border-signal-deep";

/** Variante explicite pour les outils : ne change pas la recherche compacte commune. */
export const comfortableFieldClass =
  "min-h-12 min-w-0 w-full rounded-md border border-control bg-surface px-3 py-2.5 text-base text-ink placeholder:text-muted transition-colors duration-150 enabled:hover:border-ink focus-visible:border-signal-deep disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger";

/** La valeur et son unité occupent des colonnes distinctes, même dans un champ étroit. */
export const numberFieldFrameClass =
  "grid min-h-12 min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center rounded-md border border-control bg-surface transition-colors duration-150 hover:border-ink has-[input:focus-visible]:border-signal-deep has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-signal-deep";

export const numberFieldClass =
  "num min-h-[2.875rem] min-w-0 w-full rounded-md bg-transparent px-3 py-2.5 text-base text-ink focus-visible:outline-none";

export const rangeFieldClass = "min-h-11 w-full accent-signal-deep";

export const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export function Label({
  htmlFor,
  children,
  hint,
  className,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cx(labelClass, className)}>
      {children}
      {hint && <span className="ml-1 font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(fieldClass, className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(fieldClass, className)} {...props}>
      {children}
    </select>
  );
}

/** Curseur : la couleur d'accent native suit le token signal-deep. */
export function Range({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return <input type="range" className={cx("w-full accent-signal-deep", className)} {...props} />;
}
