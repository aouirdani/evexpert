"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "./CookieBanner";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Vue de page GA4 sur les navigations App Router. `Analytics` est monté une seule fois dans
 * `layout.tsx` et ne se démonte jamais entre deux pages : `usePathname()` est donc le bon signal
 * pour détecter un changement de route sans rien recharger. La configuration ci-dessous désactive
 * la vue de page automatique de `gtag('config', …)` (`send_page_view: false`) : ce composant est
 * la SEULE source de l'événement `page_view`, y compris pour la première page — un chargement
 * initial et une navigation suivent donc exactement le même chemin, sans doublon ni oubli.
 * N'utilise pas `useSearchParams` (forcerait un rendu dynamique) : la chaîne de requête n'est pas
 * suivie pour l'instant, cohérent avec « une base GA4 fiable » plutôt que du suivi fin.
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
 * Charge Google Analytics 4 (gtag.js) uniquement APRÈS consentement accepté.
 *
 * `ga4Id` est transmis en prop par `app/layout.tsx` (Server Component), qui seul lit la variable
 * serveur `GA_ID` (`config/analytics.ts`, sans préfixe `NEXT_PUBLIC_`). Ce composant ne lit lui-même
 * aucune variable d'environnement : un identifiant serveur sans préfixe `NEXT_PUBLIC_` vaudrait
 * `undefined` s'il était lu ici, puisque Next.js ne l'inline pas dans le bundle client.
 *
 * Pas de Google Tag Manager : une seule intégration analytics, chargée une seule fois, jamais
 * avant consentement.
 */
export function Analytics({ ga4Id }: { ga4Id: string }) {
  const consented = useConsent() === "accepted";

  if (!consented || !ga4Id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', '${ga4Id}', { anonymize_ip: true, send_page_view: false });`}
      </Script>
      <GA4PageviewTracker />
    </>
  );
}
