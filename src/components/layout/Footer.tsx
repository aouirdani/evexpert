import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label={`${siteConfig.name} — accueil`}>
              <Logo tone="dark" />
            </Link>
            <p className="mt-3 text-sm font-medium text-white">{siteConfig.tagline}</p>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              Outils de calcul transparents et fiches techniques sourcées pour
              comprendre le coût réel d&apos;une voiture électrique en France.
            </p>
          </div>

          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-semibold text-white">{col.title}</h2>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p className="max-w-2xl">
            © {new Date().getFullYear()} {siteConfig.name}. Contenu informatif : les
            estimations ne remplacent ni les documents constructeur ni un devis.
            Les données techniques proviennent de sources citées sur la page{" "}
            <Link href="/sources" className="underline hover:text-white">
              Sources
            </Link>
            .
          </p>
          <button
            type="button"
            data-cookie-settings
            className="rounded-lg border border-slate-700 px-3 py-2 font-medium text-slate-200 hover:bg-slate-900"
          >
            Gestion des cookies
          </button>
        </div>
      </div>
    </footer>
  );
}
