"use client";

import Script from "next/script";
import { analyticsConfig } from "@/config/site";
import { useConsent } from "./CookieBanner";

/**
 * Charge GA4 / GTM uniquement APRÈS consentement de l'utilisateur.
 * Aucun identifiant n'est codé en dur : ils proviennent des variables
 * d'environnement NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GTM_ID.
 */
export function Analytics() {
  const consented = useConsent() === "accepted";

  if (!consented) return null;

  return (
    <>
      {analyticsConfig.ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsConfig.ga4Id}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
      {analyticsConfig.gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsConfig.gtmId}');`}
        </Script>
      )}
    </>
  );
}
