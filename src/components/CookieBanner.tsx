"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "evscope-consent";

export type ConsentValue = "accepted" | "rejected" | null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
    const handler = () => setVisible(true);
    document.addEventListener("evscope:open-cookie-settings", handler);
    // Wire footer "Gestion des cookies" button.
    const btn = document.querySelector<HTMLButtonElement>(
      "[data-cookie-settings]",
    );
    const click = () => setVisible(true);
    btn?.addEventListener("click", click);
    return () => {
      document.removeEventListener("evscope:open-cookie-settings", handler);
      btn?.removeEventListener("click", click);
    };
  }, []);

  function choose(value: "accepted" | "rejected") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    window.dispatchEvent(new CustomEvent("evscope:consent", { detail: value }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
          <p className="text-sm text-slate-700">
            Nous utilisons des cookies de mesure d&apos;audience et, à l&apos;avenir,
            des cookies publicitaires. Les cookies non essentiels ne sont pas
            déposés sans votre accord.{" "}
            <Link href="/cookies" className="font-medium text-emerald-700 hover:underline">
              En savoir plus
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
