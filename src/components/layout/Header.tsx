"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${siteConfig.name} — accueil`}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white">
            <Zap className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-1" aria-label="Navigation principale">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden max-w-xs flex-1 lg:block">
          <SearchBar />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-slate-300 text-slate-700 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-6xl space-y-3 px-4 py-4 sm:px-6">
            <SearchBar />
            <nav className="grid gap-1" aria-label="Navigation mobile">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
