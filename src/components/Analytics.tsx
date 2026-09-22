"use client";

import Script from "next/script";
import { analyticsConfig } from "@/config/site";
import { useConsent } from "./CookieBanner";

/**
 * Charge GA4 / GTM uniquement APRÈS consentement de l'utilisateur.
 * Aucun identifiant n'est codé en dur : ils proviennent des variables
 * d'environnement NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GTM_ID.
 *
 * Architecture retenue : EVExpert → consentement → GTM (`GTM-KTTS9ZLJ`) → balise Google
 * (GA4, `G-1HZPD8J76K`) CONFIGURÉE DANS GTM, pas chargée ici. `NEXT_PUBLIC_GA_ID` doit donc
 * rester VIDE : le bloc ci-dessous charge gtag.js en direct et ne sert qu'à un déploiement sans
 * GTM. Le définir en même temps qu'une balise GA4 dans le conteneur GTM double l'initialisation
 * de GA4 (deux appels `gtag('config', ...)` indépendants) et duplique les pages vues.
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
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsConfig.gtmId}');`}
          </Script>
          {/*
            Filet GTM pour les navigateurs sans JavaScript. Volontairement soumis au même
            consentement que le script ci-dessus (ce composant entier ne rend rien avant
            "accepted") : sans JS, la bannière de consentement ne peut ni s'afficher ni être
            actionnée, donc rien n'est envoyé — cohérent avec « pas de dépôt avant consentement »,
            même si cela diffère de l'exemple Google (qui place ce tag hors de toute condition).
            `dangerouslySetInnerHTML` évite l'avertissement d'hydratation React : le navigateur
            ne parse jamais le contenu d'un <noscript> quand JS est actif, donc React ne doit pas
            tenter de réconcilier un <iframe> enfant.
          */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        </>
      )}
    </>
  );
}
