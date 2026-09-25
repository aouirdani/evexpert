import "server-only";

/**
 * Construit le script de Consent Mode v2 (implémentation « basique » — pas la « avancée ») :
 * developers.google.com/tag-platform/security/guides/consent?consentmode=basic.
 *
 * Différence avec l'implémentation avancée (celle par défaut de Google) : en avancée, gtag.js
 * est chargé tout de suite et respecte les signaux de consentement pour décider quoi envoyer.
 * En basique, le SCRIPT gtag.js lui-même n'est inséré dans la page qu'une fois le consentement
 * effectivement accordé — aucune requête réseau vers googletagmanager.com avant ce moment.
 *
 * Le consentement vient du message de Google (googlefc), pas d'un bouton que ce site possède :
 * l'exemple « basique » de Google suppose que c'est votre propre bouton qui appelle
 * `gtag('consent','update',…)` puis charge le script. Ici, on observe à la place chaque entrée
 * poussée dans `dataLayer` — `gtag()` n'est que du sucre pour `dataLayer.push(arguments)`, y
 * compris pour googlefc lui-même une fois « Activer le mode de consentement » coché côté AdSense
 * — et on charge gtag.js dès qu'une entrée `consent/update` avec `analytics_storage: "granted"`
 * apparaît. Ça couvre uniformément les deux cas demandés : la première réponse au message, et un
 * visiteur déjà consentant lors d'une visite précédente — googlefc republie l'état de consentement
 * connu à chaque chargement de page, il n'y a pas besoin d'un stockage local propre au site pour
 * « se souvenir » du choix (cohérent avec l'abandon du bandeau et de son propre stockage).
 *
 * Chaque entrée `dataLayer` pousée via `gtag(){dataLayer.push(arguments)}` est un objet
 * `arguments`, pas un vrai `Array` (`Array.isArray` renvoie `false`) : la vérification utilise
 * `.length`/index, pas `Array.isArray`.
 */
export function buildConsentScript(ga4Id: string): string {
  const consentDefault = `window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});`;

  if (!ga4Id) return consentDefault;

  return `${consentDefault}
(function () {
  var GA4_ID = ${JSON.stringify(ga4Id)};
  var loaded = false;
  function loadGa4() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true, send_page_view: false });
  }
  function isAnalyticsGranted(entry) {
    return entry && entry.length >= 3 && entry[0] === 'consent' && entry[1] === 'update'
      && entry[2] && entry[2].analytics_storage === 'granted';
  }
  for (var i = 0; i < window.dataLayer.length; i++) {
    if (isAnalyticsGranted(window.dataLayer[i])) { loadGa4(); break; }
  }
  var originalPush = window.dataLayer.push.bind(window.dataLayer);
  window.dataLayer.push = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (isAnalyticsGranted(arguments[i])) loadGa4();
    }
    return originalPush.apply(window.dataLayer, arguments);
  };
})();`;
}
