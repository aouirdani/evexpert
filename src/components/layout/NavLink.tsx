"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Seul îlot client de la navigation : il lit le chemin courant pour poser `aria-current`
 * et la classe d'état actif. Le contenu (`children`) reste rendu côté serveur.
 *
 * Les classes vivent ici, désignées par une `variant` : passer des chaînes de classes en
 * props les répéterait dans la charge utile RSC de chaque instance (~20 par page).
 * Pas de `cn()` : tailwind-merge alourdirait le JS de toutes les pages.
 *
 * Actif = page exacte ou page de la même section (/guides/x est dans « Guides »).
 */
const variants = {
  // Desktop, entrées courantes : filet inférieur signal-deep quand actif.
  nav: {
    base: "inline-flex h-full items-center border-b-2 border-transparent px-3 text-sm font-medium text-body transition-colors hover:text-ink",
    active: "border-signal-deep! text-ink!",
  },
  // Desktop, Comparer : seule entrée pleine. Actif = liseré lime intérieur (≠ anneau de focus).
  compare: {
    base: "inline-flex items-center gap-2 rounded-md bg-ink px-3.5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink-raised",
    active: "shadow-[inset_0_-3px_0_0_var(--color-signal)]",
  },
  // Bandeau secondaire desktop (fond encre).
  utility: {
    base: "inline-flex h-9 items-center rounded-sm px-2.5 text-xs font-medium text-ink-muted transition-colors hover:text-paper",
    active: "text-paper!",
  },
  // Menu mobile, entrées courantes.
  row: {
    base: "flex min-h-12 items-center justify-between rounded-md px-3 text-base font-semibold text-ink transition-colors hover:bg-paper-deep",
    active: "bg-paper-deep shadow-[inset_3px_0_0_var(--color-signal-deep)]",
  },
  // Menu mobile, Comparer.
  "row-compare": {
    base: "flex min-h-12 items-center justify-between rounded-md bg-ink px-3 text-base font-semibold text-paper transition-colors hover:bg-ink-raised",
    active: "shadow-[inset_0_-3px_0_0_var(--color-signal)]",
  },
  // Menu mobile, navigation secondaire.
  sub: {
    base: "flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-body transition-colors hover:bg-paper-deep hover:text-ink",
    active: "text-ink! bg-paper-deep!",
  },
} as const;

export type NavLinkVariant = keyof typeof variants;

export function NavLink({
  href,
  variant,
  children,
}: {
  href: string;
  variant: NavLinkVariant;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const exact = pathname === href;
  const active = exact || pathname.startsWith(`${href}/`);
  const v = variants[variant];
  return (
    <Link
      href={href}
      className={active ? `${v.base} ${v.active}` : v.base}
      aria-current={exact ? "page" : active ? "true" : undefined}
    >
      {children}
    </Link>
  );
}
