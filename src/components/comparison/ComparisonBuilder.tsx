"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Link2 } from "lucide-react";
import type { Vehicle } from "@/types";
import { fieldClass } from "@/components/ui/Field";
import { ComparisonTable } from "./ComparisonTable";

const letters = ["A", "B", "C"];

/**
 * Copie l'URL affichée (déjà tenue à jour par le sélecteur ci-dessus) dans le presse-papiers.
 * Bascule sur `document.execCommand` si l'API Clipboard est indisponible (contexte non sécurisé,
 * ancien navigateur) ; en dernier recours, ne fait rien plutôt que d'échouer bruyamment.
 */
function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function copy() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      try {
        const el = document.createElement("textarea");
        el.value = url;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      } catch {
        return;
      }
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-signal-deep"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
      {copied ? "Lien copié" : "Copier le lien de cette comparaison"}
    </button>
  );
}

export function ComparisonBuilder({
  vehicles,
  defaultIds,
}: {
  vehicles: Vehicle[];
  /** 1 à 3 identifiants ; reflète l'URL `?v=...` au chargement (lien partagé ou « Ma sélection »). */
  defaultIds: string[];
}) {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>([defaultIds[0] ?? "", defaultIds[1] ?? "", defaultIds[2] ?? ""]);
  const selected = ids
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => Boolean(v));

  // Le sélecteur est la source de vérité de l'URL : toute sélection tient l'adresse à jour,
  // pour qu'elle reste copiable et partageable à tout moment (pas seulement au clic sur « Copier »).
  useEffect(() => {
    const present = ids.filter(Boolean);
    const query = present.length ? `?v=${present.join(",")}` : "";
    router.replace(`/comparer${query}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return (
    <div>
      <div className="grid gap-x-8 gap-y-5 border-t-2 border-ink pt-5 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <label htmlFor={`cmp-${i}`} className="mb-2 flex items-baseline gap-3">
              <span aria-hidden className="num text-data-lg font-bold text-ink">{letters[i]}</span>
              <span className="label">
                Véhicule {letters[i]}
                {i === 2 && " (facultatif)"}
              </span>
            </label>
            <select
              id={`cmp-${i}`}
              value={ids[i]}
              onChange={(e) => setIds((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
              className={fieldClass}
            >
              {/* Emplacement facultatif (C) : option vide toujours proposée. A/B : seulement si vide au
                  chargement (ex. lien partagé avec un seul véhicule) — sinon un <select> sans option
                  correspondant à sa valeur afficherait un choix arbitraire, jamais une case vide. */}
              {(i === 2 || ids[i] === "") && <option value="">{i === 2 ? "Aucun" : "Choisir un véhicule"}</option>}
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} {v.version}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-6" aria-live="polite">
        {selected.length >= 2 ? (
          <>
            <ComparisonTable vehicles={selected} />
            <div className="mt-6 border-t border-line pt-5">
              <CopyLinkButton />
            </div>
          </>
        ) : (
          <p className="border-t border-line pt-5 text-body">Sélectionnez au moins deux véhicules différents.</p>
        )}
      </div>
    </div>
  );
}
