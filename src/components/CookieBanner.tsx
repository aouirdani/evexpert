"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "evscope-consent";
const CONSENT_EVENT = "evscope:consent";

export type ConsentValue = "accepted" | "rejected" | null;

// Fallback when localStorage is unavailable (private mode, blocked site data).
let memoryConsent: ConsentValue = null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "accepted" || v === "rejected") return v;
  } catch {
    return memoryConsent;
  }
  return null;
}

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Current consent choice; `null` on the server and until the user decides. */
export function useConsent(): ConsentValue {
  return useSyncExternalStore(subscribeConsent, getConsent, () => null);
}

const noopSubscribe = () => () => {};

export function CookieBanner() {
  const consent = useConsent();
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const handler = () => setReopened(true);
    document.addEventListener("evscope:open-cookie-settings", handler);
    // Wire footer "Gestion des cookies" button.
    const btn = document.querySelector<HTMLButtonElement>(
      "[data-cookie-settings]",
    );
    btn?.addEventListener("click", handler);
    return () => {
      document.removeEventListener("evscope:open-cookie-settings", handler);
      btn?.removeEventListener("click", handler);
    };
  }, []);

  const visible = hydrated && (consent === null || reopened);

  function choose(value: "accepted" | "rejected") {
    memoryConsent = value;
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignored: the in-memory fallback keeps the choice for this page view.
    }
    setReopened(false);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-surface p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-signal-deep" aria-hidden />
          <p className="text-sm text-body">
            Nous utilisons des cookies de mesure d&apos;audience et, à l&apos;avenir,
            des cookies publicitaires. Les cookies non essentiels ne sont pas
            déposés sans votre accord.{" "}
            <Link href="/cookies" className="font-medium text-signal-deep hover:underline">
              En savoir plus
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded-lg border border-control px-4 py-2 text-sm font-semibold text-body hover:bg-paper-deep"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-lg border border-control px-4 py-2 text-sm font-semibold text-body hover:bg-paper-deep"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
