"use client";

import { useMemo, useState } from "react";
import { computeUsageCost } from "@/lib/calculators";
import { ASSUMPTIONS } from "@/data/assumptions";
import { formatEuro, formatNumber } from "@/lib/format";
import { Field, NumberInput, RangeInputControl } from "@/components/calculators/kit";

/**
 * « Combien va me coûter cette voiture ? » (persona conducteur quotidien) : contrairement au
 * tableau à trois tarifs fixes au-dessus (domicile / public AC / rapide DC, non modifiable), ce
 * bloc mélange un tarif domicile et un tarif public selon la part réelle de chaque usage, pour un
 * kilométrage annuel donné — reprend `gridConsumption` (kWh/100 km au réseau, propre au véhicule)
 * calculé côté serveur, aucune nouvelle formule inventée.
 */
export function VehicleCostEstimator({ gridConsumption }: { gridConsumption: number }) {
  const [annualKm, setAnnualKm] = useState<number>(ASSUMPTIONS.annualKm);
  const [homeSharePct, setHomeSharePct] = useState(70);
  const [homePrice, setHomePrice] = useState<number>(ASSUMPTIONS.homePrice);
  const [publicPrice, setPublicPrice] = useState<number>(ASSUMPTIONS.publicAcPrice);

  const r = useMemo(
    () => computeUsageCost({ gridConsumption, annualKm, homeSharePct, homePrice, publicPrice }),
    [gridConsumption, annualKm, homeSharePct, homePrice, publicPrice],
  );

  return (
    <div className="mt-9 border-t-2 border-ink pt-6">
      <p className="label">Votre coût annuel personnalisé</p>
      <div className="mt-4 grid gap-x-10 gap-y-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          <Field label="Kilométrage annuel" htmlFor="vce-km">
            <NumberInput id="vce-km" value={annualKm} onChange={setAnnualKm} min={0} max={60000} step={500} suffix="km" />
          </Field>
          <Field label="Prix domicile (€/kWh)" htmlFor="vce-home-price" hint="Hypothèse EVExpert, pas un tarif universel : remplacez par votre contrat.">
            <NumberInput id="vce-home-price" value={homePrice} onChange={setHomePrice} min={0} max={1} step={0.01} suffix="€/kWh" />
          </Field>
          <div className="col-span-2 sm:col-span-1">
            <Field label="Prix public (€/kWh)" htmlFor="vce-public-price" hint="Hypothèse EVExpert : les prix varient fortement selon l'opérateur et la puissance.">
              <NumberInput id="vce-public-price" value={publicPrice} onChange={setPublicPrice} min={0} max={1} step={0.01} suffix="€/kWh" />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label={`Recharge à domicile : ${homeSharePct} %`} htmlFor="vce-home-share">
              <RangeInputControl id="vce-home-share" value={homeSharePct} onChange={setHomeSharePct} min={0} max={100} step={5} suffix="%" />
            </Field>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-5 sm:grid-cols-4 lg:border-t-0 lg:pt-0">
          <div>
            <dt className="label">Aux 100 km</dt>
            <dd className="num mt-1.5 text-data-md font-bold text-ink">{formatEuro(r.costPer100km, 2)}</dd>
          </div>
          <div>
            <dt className="label">Par mois</dt>
            <dd className="num mt-1.5 text-data-md font-bold text-ink">{formatEuro(r.costPerMonth)}</dd>
          </div>
          <div>
            <dt className="label">Par an</dt>
            <dd className="num mt-1.5 text-data-lg font-bold text-signal-deep">{formatEuro(r.costPerYear)}</dd>
            <dd className="text-caption text-muted">{formatNumber(r.kwhPerYear)}&nbsp;kWh/an</dd>
          </div>
          <div>
            <dt className="label">Sur 3 ans</dt>
            <dd className="num mt-1.5 text-data-md font-bold text-ink">{formatEuro(r.costOver3Years)}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-4 text-caption text-muted">
        Calcul EVExpert : consommation réseau propre à ce modèle ({formatNumber(gridConsumption, 1)}&nbsp;kWh/100&nbsp;km, pertes de charge comprises) × prix moyen pondéré par la
        part domicile/public que vous indiquez. N&apos;inclut ni assurance, ni entretien, ni dépréciation — pour un coût total, utilisez le{" "}
        <a href="/outils/tco-voiture-electrique" className="link-u font-semibold text-signal-deep">calculateur de coût total de possession</a>.
      </p>
    </div>
  );
}
