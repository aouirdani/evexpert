import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/primitives";
import { ConsentRevocationButton } from "@/components/ConsentRevocationButton";
import { footerNav, siteConfig } from "@/config/site";

/** Règle graduée (écho de l'image de partage) : SVG statique, purement décoratif. */
function Ruler() {
  return (
    <svg aria-hidden focusable="false" className="block h-2.5 w-full text-line-ink" preserveAspectRatio="none">
      <defs>
        <pattern id="footer-ruler" width="80" height="10" patternUnits="userSpaceOnUse">
          <path d="M.5 0v10M16.5 0v5M32.5 0v5M48.5 0v5M64.5 0v5" stroke="currentColor" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="10" fill="url(#footer-ruler)" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="on-ink mt-section bg-ink text-ink-muted">
      <Ruler />
      <div className="mx-auto w-full max-w-page px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
        {/* Bandeau éditorial : promesse + accès direct aux deux usages centraux. */}
        <div className="flex flex-col gap-10 border-b border-line-ink pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Link
              href="/"
              className="inline-flex rounded-md"
              aria-label={`${siteConfig.name} — accueil`}
            >
              <Logo tone="dark" />
            </Link>
            <p className="mt-6 text-h2 font-bold text-paper">{siteConfig.tagline}</p>
            <p className="mt-3 text-base leading-relaxed">
              Fiches techniques sourcées et calculs transparents pour comprendre
              l&apos;autonomie, la recharge et le coût réel d&apos;une voiture électrique en France.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <ButtonLink href="/comparer" variant="signal" size="lg">
              Comparer des voitures
            </ButtonLink>
            <ButtonLink
              href="/voitures-electriques"
              variant="outline"
              size="lg"
              className="border-line-ink text-paper hover:border-paper hover:bg-transparent"
            >
              Explorer les voitures
            </ButtonLink>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-4">
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow text-paper">{col.title}</h2>
              <ul className="mt-4 space-y-1">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-8 items-center rounded-sm text-sm transition-colors hover:text-paper"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-line-ink pt-6 text-xs sm:flex-row sm:items-center">
          <p className="max-w-2xl leading-relaxed">
            © {new Date().getFullYear()} {siteConfig.name}. Contenu informatif : les
            estimations ne remplacent ni les documents constructeur ni un devis.
            Les données techniques proviennent de sources citées sur la page{" "}
            <Link href="/sources" className="rounded-sm underline underline-offset-2 hover:text-paper">
              Sources
            </Link>
            .
          </p>
          <ConsentRevocationButton className="min-h-10 shrink-0 rounded-md border border-line-ink px-3 text-sm font-medium text-paper transition-colors hover:bg-ink-raised" />
        </div>
      </div>
    </footer>
  );
}
