import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Classes partagées des champs de formulaire. Bordure `control` (≥ 3:1 sur
 * paper et sur blanc) : le champ reste identifiable sans dépendre de la couleur
 * d'accent. Le focus clavier utilise l'outline global du design system.
 */
export const fieldClass =
  "w-full rounded-md border border-control bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted focus-visible:border-signal-deep";

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
    <label htmlFor={htmlFor} className={cn(labelClass, className)}>
      {children}
      {hint && <span className="ml-1 font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  );
}

/** Curseur : la couleur d'accent native suit le token signal-deep. */
export function Range({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return <input type="range" className={cn("w-full accent-signal-deep", className)} {...props} />;
}
