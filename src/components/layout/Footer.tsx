import Link from "next/link";
import { Zap } from "lucide-react";
import { footerNav, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white">
                <Zap className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-600">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-xs text-xs text-slate-500">
              {siteConfig.name} est un nom de projet temporaire. Les données
              véhicules affichées sont des données d&apos;exemple.
            </p>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-slate-900">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-600 hover:text-emerald-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Contenu à vocation
            informative.
          </p>
          <button
            type="button"
            data-cookie-settings
            className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-white"
          >
            Gestion des cookies
          </button>
        </div>
      </div>
    </footer>
  );
}
