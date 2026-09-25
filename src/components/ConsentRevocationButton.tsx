"use client";

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: unknown[];
      showRevocationMessage?: () => void;
    };
  }
}

/**
 * Rouvre le message de consentement Google (« Réglementations européennes », publié dans
 * AdSense) — seul dialogue de consentement du site, plus de bandeau interne. `googlefc` est
 * l'API documentée par Google pour ça (`callbackQueue.push(googlefc.showRevocationMessage)`,
 * support.google.com/adsense/answer/10959060) : la file existe même avant que le vrai script
 * Google n'ait chargé (sûr d'y pousser tôt), mais `showRevocationMessage` lui-même peut ne pas
 * encore exister (page pas encore chargée, ou — en local/preview — aucun message publié pour ce
 * domaine, puisque le message ne s'affiche que sur le domaine réel). D'où le garde `?.` : sans
 * message disponible, le clic ne fait simplement rien, jamais d'erreur.
 */
function reopenConsentMessage() {
  if (typeof window === "undefined") return;
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  if (window.googlefc.showRevocationMessage) {
    window.googlefc.callbackQueue.push(window.googlefc.showRevocationMessage);
  }
}

export function ConsentRevocationButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={reopenConsentMessage} className={className}>
      Gérer mes cookies
    </button>
  );
}
