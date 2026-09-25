"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Vue de page GA4 sur les navigations App Router. Monté une seule fois dans `layout.tsx` et ne se
 * démonte jamais entre deux pages : `usePathname()` est donc le bon signal pour détecter un
 * changement de route sans rien recharger. `window.gtag` ne devient une fonction réelle qu'une
 * fois GA4 chargé par `lib/consent-script.ts` (consentement accordé) : avant ça, l'effet est un
 * no-op — aucun événement `page_view` n'est perdu, il n'y en a simplement aucun à envoyer avant
 * consentement. La configuration désactive la vue de page automatique de `gtag('config', …)`
 * (`send_page_view: false`) : ce composant est la SEULE source de l'événement `page_view`, y
 * compris pour la première page suivant le chargement de GA4.
 */
function GA4PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}

/**
 * Le chargement de GA4 lui-même (implémentation « basique » du Consent Mode : le script gtag.js
 * n'est inséré qu'après consentement) vit dans `lib/consent-script.ts`, exécuté par le
 * `<Script beforeInteractive>` de `layout.tsx` — pas ici. Ce composant ne fait plus que suivre les
 * changements de route une fois GA4 chargé.
 */
export function Analytics() {
  return <GA4PageviewTracker />;
}
