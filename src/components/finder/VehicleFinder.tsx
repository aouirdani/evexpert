"use client";

import { useMemo, useState } from "react";
import { Check, Minus, X } from "lucide-react";
import type { BodyType, Vehicle } from "@/types";
import { defaultFinderAnswers, matchVehicles, type FinderAnswers } from "@/lib/vehicle-finder";
import { bodyTypeLabels } from "@/lib/vehicle-format";

import { formatNumber } from "@/lib/format";
import { fieldClass, labelClass } from "@/components/ui/Field";
import { cx } from "@/lib/cx";
import { GarageToggle } from "@/components/garage/GarageToggle";
import Link from "next/link";

const allBodyTypes = Object.keys(bodyTypeLabels) as BodyType[];
const seatOptions = [0, 2, 4, 5, 7];
const trunkOptions = [0, 300, 400, 500];

function ToggleYesNo({ id, label, value, onChange }: { id: string; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div id={id} role="group" aria-label={label} className="grid grid-cols-2 gap-2">
        {[
          { v: true, t: "Oui" },
          { v: false, t: "Non" },
        ].map((o) => (
          <button
            key={String(o.v)}
            type="button"
            aria-pressed={value === o.v}
            onClick={() => onChange(o.v)}
            className={cx(
              "h-10 rounded-md border text-sm font-semibold transition-colors duration-150",
              value === o.v ? "border-ink bg-ink text-paper" : "border-control text-ink hover:border-ink",
            )}
          >
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * « Quelle voiture me correspond ? » (persona première voiture électrique). Chaque véhicule
 * affiche le détail des critères remplis — jamais un score global opaque ni un classement
 * subjectif (« la meilleure voiture »). Aucun critère de budget : le prix en France n'est pas
 * encore collecté (voir /methodologie et /sources). Le calcul (`matchVehicle`) tourne entièrement
 * côté client sur les données déjà envoyées à la page (même volume que le catalogue/comparateur).
 */
export function VehicleFinder({ vehicles }: { vehicles: (Vehicle & { href: string })[] }) {
  const [answers, setAnswers] = useState<FinderAnswers>(defaultFinderAnswers);
  const set = <K extends keyof FinderAnswers>(key: K, value: FinderAnswers[K]) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const matches = useMemo(() => matchVehicles(vehicles, answers), [vehicles, answers]);
  const top = matches.slice(0, 12);

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <form onSubmit={(e) => e.preventDefault()} aria-label="Vos critères" className="space-y-6 border-t-2 border-ink pt-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:h-fit">
        <div>
          <label htmlFor="vf-daily" className={labelClass}>
            Trajet quotidien (aller simple) : <span className="num font-bold">{answers.dailyKm}&nbsp;km</span>
          </label>
          <input
            id="vf-daily"
            type="range"
            min={0}
            max={150}
            step={5}
            value={answers.dailyKm}
            onChange={(e) => set("dailyKm", Number(e.target.value))}
            className="w-full accent-signal-deep"
          />
        </div>

        <ToggleYesNo id="vf-highway" label="Trajets autoroute fréquents" value={answers.highwayUser} onChange={(v) => set("highwayUser", v)} />
        <ToggleYesNo id="vf-home" label="Recharge possible à domicile ou au travail" value={answers.homeCharging} onChange={(v) => set("homeCharging", v)} />

        <div>
          <label htmlFor="vf-seats" className={labelClass}>Places minimum</label>
          <select id="vf-seats" value={answers.minSeats} onChange={(e) => set("minSeats", Number(e.target.value))} className={fieldClass}>
            {seatOptions.map((n) => (
              <option key={n} value={n}>{n === 0 ? "Indifférent" : `${n} places`}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vf-trunk" className={labelClass}>Coffre minimum</label>
          <select id="vf-trunk" value={answers.minTrunk} onChange={(e) => set("minTrunk", Number(e.target.value))} className={fieldClass}>
            {trunkOptions.map((n) => (
              <option key={n} value={n}>{n === 0 ? "Indifférent" : `${n} L`}</option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className={labelClass}>Carrosserie (facultatif)</legend>
          <div className="flex flex-wrap gap-2">
            {allBodyTypes.map((bt) => {
              const active = answers.bodyTypes.includes(bt);
              return (
                <button
                  key={bt}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    set("bodyTypes", active ? answers.bodyTypes.filter((x) => x !== bt) : [...answers.bodyTypes, bt])
                  }
                  className={cx(
                    "h-9 rounded-sm border px-2.5 text-sm font-medium transition-colors duration-150",
                    active ? "border-ink bg-ink text-paper" : "border-control text-ink hover:border-ink",
                  )}
                >
                  {bodyTypeLabels[bt]}
                </button>
              );
            })}
          </div>
        </fieldset>

        {answers.bodyTypes.length > 0 && (
          <button type="button" onClick={() => set("bodyTypes", [])} className="link-u text-sm font-semibold text-signal-deep">
            Réinitialiser la carrosserie
          </button>
        )}
      </form>

      <div className="min-w-0">
        <p className="border-b border-line pb-3 text-sm text-muted" role="status" aria-live="polite">
          {(() => {
            const full = matches.filter((m) => m.applicable > 0 && m.matched === m.applicable).length;
            return full === 0 ? (
              "Aucune version ne remplit tous les critères applicables : assouplissez-en un."
            ) : (
              <>
                <span className="num text-data-md font-bold text-ink">{full}</span>{" "}
                version{full > 1 ? "s remplissent" : " remplit"} tous les critères applicables, sur {vehicles.length}.
              </>
            );
          })()}
          {" "}Les 12 versions qui remplissent le plus de critères sont affichées ci-dessous, chacune avec le détail —
          ce n&apos;est pas un classement : à nombre de critères égal, aucun véhicule n&apos;est présenté comme meilleur qu&apos;un autre.
        </p>
        <ul className="border-t-2 border-ink">
          {top.map((m) => (
            <li key={m.vehicle.id} className="border-b border-line py-5">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <div className="min-w-0">
                  <span className="eyebrow block text-signal-deep">{m.vehicle.brand}</span>
                  <Link href={m.vehicle.href} className="link-h text-lg font-bold text-ink">
                    {m.vehicle.model} <span className="font-normal text-muted">{m.vehicle.version}</span>
                  </Link>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <p className="num text-sm font-semibold text-ink">
                    {m.matched} / {m.applicable} <span className="font-normal text-muted">critères</span>
                  </p>
                  <GarageToggle id={m.vehicle.id} className="relative" />
                </div>
              </div>

              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                {m.criteria.map((c) => (
                  <li key={c.key} className="flex items-center gap-1.5 text-sm">
                    {c.met === null ? (
                      <Minus className="h-3.5 w-3.5 shrink-0 text-control" aria-hidden />
                    ) : c.met ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-signal-deep" aria-hidden />
                    ) : (
                      <X className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                    )}
                    <span className={c.met === null ? "text-muted" : c.met ? "text-body" : "text-muted line-through decoration-control"}>
                      {c.label}
                      {c.met === null && " (donnée non disponible)"}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="num mt-3 text-sm text-muted">
                {formatNumber(m.vehicle.rangeWltp)}&nbsp;km WLTP · {formatNumber(m.vehicle.batteryUsable, 1)}&nbsp;kWh utiles
                {m.vehicle.chargingDC !== null && <> · DC {formatNumber(m.vehicle.chargingDC)}&nbsp;kW</>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
