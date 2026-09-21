import Link from "next/link";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { mainNav, secondaryNav, siteConfig, type NavItem } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { NavLink } from "./NavLink";
import { SearchBar } from "./SearchBar";

/**
 * En-tête 100 % Server Component. Seul <NavLink> (îlot client minuscule) lit le
 * chemin courant pour l'état actif. Le menu mobile et la recherche mobile sont des
 * <details> natifs : aucun JavaScript n'est chargé pour ouvrir ou fermer quoi que ce soit.
 *
 * Hauteur : `--header-h` (globals.css) est la source unique. Les panneaux mobiles
 * s'ancrent sur le bas du header (`top-full`), donc rien n'est codé en pixels.
 */

// --- Classes partagées (les liens de navigation sont dans NavLink) ------------
const iconButton =
  "flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md text-ink transition-colors hover:bg-paper-deep group-open:bg-paper-deep [&::-webkit-details-marker]:hidden";

const panel =
  "absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto overscroll-contain border-b border-line bg-paper shadow-md";

function SignalDot() {
  return <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />;
}

function DesktopNavItem({ item }: { item: NavItem }) {
  if (item.emphasis) {
    return (
      <li className="flex items-center pl-2">
        <NavLink href={item.href} variant="compare">
          <SignalDot />
          {item.label}
        </NavLink>
      </li>
    );
  }
  return (
    <li className="flex">
      <NavLink href={item.href} variant="nav">
        {item.label}
      </NavLink>
    </li>
  );
}

function MobileNavItem({ item }: { item: NavItem }) {
  if (item.emphasis) {
    return (
      <li className="py-1">
        <NavLink href={item.href} variant="row-compare">
          <span className="inline-flex items-center gap-2.5">
            <SignalDot />
            {item.label}
          </span>
          <ArrowRight className="h-4 w-4" aria-hidden />
        </NavLink>
      </li>
    );
  }
  return (
    <li>
      <NavLink href={item.href} variant="row">
        {item.label}
      </NavLink>
    </li>
  );
}

export function Header() {
  return (
    <>
      {/* Bandeau desktop : baseline + navigation secondaire (Méthodologie, Outils…). */}
      <div className="on-ink hidden bg-ink lg:block">
        <div className="mx-auto flex h-9 w-full max-w-page items-center justify-between px-6">
          <p className="eyebrow text-[0.6875rem]! text-ink-muted">{siteConfig.tagline}</p>
          <nav aria-label="Navigation secondaire">
            <ul className="flex items-center gap-1">
              {secondaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} variant="utility">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-paper">
        <div className="mx-auto flex h-(--header-h) w-full max-w-page items-center gap-2 px-4 sm:px-6 lg:gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-md"
            aria-label={`${siteConfig.name} — accueil`}
          >
            <Logo />
          </Link>

          {/* Desktop */}
          <nav className="hidden self-stretch lg:block" aria-label="Navigation principale">
            <ul className="flex h-full items-stretch gap-0.5">
              {mainNav.map((item) => (
                <DesktopNavItem key={item.href} item={item} />
              ))}
            </ul>
          </nav>
          <div className="ml-auto hidden w-44 lg:block xl:w-60">
            <SearchBar idSuffix="header" placeholder="Rechercher" size="sm" />
          </div>

          {/* Mobile : recherche et menu, deux <details> exclusifs (attribut name). */}
          <div className="ml-auto flex items-center lg:hidden">
            <details name="site-panel" className="group">
              <summary className={iconButton} aria-label="Rechercher">
                <Search className="h-5 w-5" aria-hidden />
              </summary>
              <div className={panel}>
                <div className="mx-auto max-w-page px-4 py-4 sm:px-6">
                  <SearchBar idSuffix="mobile-quick" placeholder="Rechercher une voiture, un guide…" size="lg" />
                </div>
              </div>
            </details>

            <details name="site-panel" className="group">
              <summary className={iconButton} aria-label="Menu">
                <Menu className="h-6 w-6 group-open:hidden" aria-hidden />
                <X className="hidden h-6 w-6 group-open:block" aria-hidden />
              </summary>
              <div className={panel}>
                <div className="mx-auto max-w-page px-4 pb-6 pt-4 sm:px-6">
                  <SearchBar idSuffix="mobile" placeholder="Rechercher une voiture, un guide…" />
                  <nav className="mt-3" aria-label="Navigation mobile">
                    <ul className="flex flex-col gap-0.5">
                      {mainNav.map((item) => (
                        <MobileNavItem key={item.href} item={item} />
                      ))}
                    </ul>
                  </nav>
                  <nav className="mt-3 border-t border-line pt-3" aria-label="Navigation secondaire mobile">
                    <ul className="grid grid-cols-2 gap-x-3">
                      {secondaryNav.map((item) => (
                        <li key={item.href}>
                          <NavLink href={item.href} variant="sub">
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
