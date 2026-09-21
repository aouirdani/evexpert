import Link from "next/link";
import { Menu } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { SearchBar } from "./SearchBar";

/**
 * En-tête 100 % Server Component : le menu mobile utilise <details>, donc
 * aucun JavaScript client n'est chargé pour la navigation.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={`${siteConfig.name} — accueil`}
        >
          <Logo />
        </Link>

        <nav
          className="hidden lg:ml-4 lg:flex lg:items-center lg:gap-1"
          aria-label="Navigation principale"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden max-w-xs flex-1 lg:block">
          <SearchBar idSuffix="header" />
        </div>

        <details className="group relative ml-auto lg:hidden">
          <summary
            className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg border border-slate-300 text-slate-700 [&::-webkit-details-marker]:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </summary>
          <div className="fixed inset-x-0 top-[57px] max-h-[calc(100dvh-57px)] overflow-y-auto border-b border-slate-200 bg-white shadow-lg">
            <div className="mx-auto max-w-6xl space-y-3 px-4 py-4 sm:px-6">
              <SearchBar idSuffix="mobile" />
              <nav className="grid gap-1" aria-label="Navigation mobile">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/methodologie"
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-100"
                >
                  Méthodologie
                </Link>
              </nav>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
