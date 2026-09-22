import Link from "next/link";
import type { FaqItem, Vehicle } from "@/types";
import { ASSUMPTIONS } from "@/data/assumptions";
import { vehicleHref, vehicleTitle } from "@/lib/vehicle-utils";
import {
  RANGE_SCENARIOS,
  acChargeMinutes,
  batteryConsumption100,
  chargeCost,
  costPer100km,
  estimateRange,
} from "@/lib/vehicle-calcs";
import { fmt, fmtText } from "@/lib/vehicle-format";
import { formatEuro, formatNumber, minutesToHuman } from "@/lib/format";
import type { ReactNode } from "react";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { DataBadge } from "@/components/ui/DataBadge";
import { SourceLine } from "@/components/ui/SourceBadge";
import { RelatedGuides, RelatedTools } from "@/components/related";
import { faqJsonLd } from "@/lib/seo";
import { DataFigure } from "@/components/ui/DataFigure";
import { SectionNav } from "@/components/layout/SectionNav";
import { SpecTable } from "./SpecTable";
import { VehicleCard } from "./VehicleCard";
import { VehicleHeader } from "./VehicleHeader";
import { BodyDimensions } from "./BodyDimensions";
import { RangeBar } from "./RangeBar";
import { RANGE_SCALE_MAX } from "@/lib/vehicle-format";
import { VehicleCostEstimator } from "./VehicleCostEstimator";
import { gridConsumption100 } from "@/lib/vehicle-calcs";

const driveLabel = { FWD: "Traction (avant)", RWD: "Propulsion (arrière)", AWD: "4 roues motrices" } as const;

export function vehicleFaq(v: Vehicle): FaqItem[] {
  const home = costPer100km(v, ASSUMPTIONS.homePrice);
  const items: FaqItem[] = [
    {
      question: `Quelle est l'autonomie WLTP de la ${vehicleTitle(v)} ?`,
      answer: `La source indique ${formatNumber(v.rangeWltp)} km en cycle WLTP mixte pour une batterie de ${formatNumber(v.batteryUsable, 1)} kWh utiles. L'autonomie réelle dépend de la vitesse, de la température et du type de trajet : les estimations EVExpert par scénario figurent plus haut sur cette page.`,
    },
    {
      question: `Quelle puissance de recharge accepte la ${vehicleTitle(v)} ?`,
      answer:
        v.chargingDC !== null
          ? `Elle accepte jusqu'à ${formatNumber(v.chargingAC, 1)} kW en courant alternatif (AC) et jusqu'à ${formatNumber(v.chargingDC)} kW en courant continu (DC)${v.chargingTime10to80 ? `, avec un temps de charge de 10 à 80 % de ${formatNumber(v.chargingTime10to80)} minutes selon la source` : ""}.`
          : `Elle accepte jusqu'à ${formatNumber(v.chargingAC, 1)} kW en courant alternatif (AC). La puissance DC maximale n'est pas disponible dans notre source.`,
    },
    {
      question: `Combien coûte 100 km en ${v.brand} ${v.model} ?`,
      answer: `Avec une hypothèse de ${formatNumber(ASSUMPTIONS.homePrice, 2)} €/kWh à domicile et un rendement de charge de ${ASSUMPTIONS.chargingEfficiency} %, le calcul EVExpert donne environ ${formatEuro(home, 2)} aux 100 km dans les conditions WLTP. Ce montant change avec votre tarif et votre conduite : utilisez le calculateur de coût aux 100 km.`,
    },
    {
      question: `Peut-on recharger la ${v.brand} ${v.model} à la maison ?`,
      answer: `Oui, en courant alternatif jusqu'à ${formatNumber(v.chargingAC, 1)} kW selon son chargeur embarqué. La puissance réellement utilisée est celle de votre installation, dans la limite de ce que le véhicule accepte.`,
    },
  ];
  return items;
}

/* Aides de mise en page ------------------------------------------------ */

const th = "label whitespace-nowrap pb-2.5 pr-4 text-left font-semibold";
const tdRow = "py-3 pr-4 text-left align-top font-semibold text-ink";
const tdNum = "num py-3 pr-4 align-top";

/** Section « fiche » : titre et chapeau dans la marge, contenu sur 9 colonnes. */
function Block({
  id,
  numeral,
  title,
  intro,
  children,
}: {
  id: string;
  numeral: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titre`}
      className="mt-section grid scroll-mt-[calc(var(--header-h)+4.5rem)] gap-x-12 gap-y-6 lg:grid-cols-12"
    >
      <div className="lg:col-span-3">
        <p className="label mb-3 flex gap-3">
          <span className="num text-signal-deep">{numeral}</span>
        </p>
        <h2 id={`${id}-titre`} className="balance text-2xl font-bold text-ink">
          {title}
        </h2>
        {intro && <div className="pretty mt-3 text-sm text-muted">{intro}</div>}
      </div>
      <div className="min-w-0 lg:col-span-9">{children}</div>
    </section>
  );
}

/** Fiche technique complète d'une version. Server Component, aucun JS client. */
export function VehicleDetail({
  vehicle: v,
  similar,
  eyebrow,
  title,
}: {
  vehicle: Vehicle;
  similar: Vehicle[];
  eyebrow: string;
  title: string;
}) {
  const src = v.source.dataType;
  const battCons = batteryConsumption100(v);
  const scenarios = RANGE_SCENARIOS.map((s) => ({ s, km: estimateRange(v, s) }));
  const tariffs = [
    { label: "Domicile", price: ASSUMPTIONS.homePrice },
    { label: "Borne publique AC", price: ASSUMPTIONS.publicAcPrice },
    { label: "Recharge rapide DC", price: ASSUMPTIONS.fastDcPrice },
  ];
  const faq = vehicleFaq(v);
  const acStations = [3.7, 7.4, 11, 22];

  return (
    <div>
      <VehicleHeader
        eyebrow={eyebrow}
        title={title}
        source={v.source}
        vehicleId={v.id}
        dek={
          <>
            {vehicleTitle(v)} ({v.years}) : {v.bodyType} électrique {v.seats} places, {driveLabel[v.drive].toLowerCase()}, batterie de{" "}
            {fmt(v.batteryUsable, "kWh", 1)} utiles pour {fmt(v.rangeWltp, "km")} d&apos;autonomie WLTP selon la source, recharge AC jusqu&apos;à{" "}
            {fmt(v.chargingAC, "kW", 1)}
            {v.chargingDC ? ` et DC jusqu'à ${fmt(v.chargingDC, "kW")}` : ""}.
          </>
        }
        aside={<BodyDimensions vehicle={v} />}
      />

      <div className="mt-12 grid gap-x-10 gap-y-8 border-t-2 border-ink pt-6 lg:grid-cols-12">
        <dl className="lg:col-span-5">
          <dt className="label">Autonomie WLTP</dt>
          <dd className="num mt-3 text-data-xl font-bold text-ink">
            {formatNumber(v.rangeWltp)}
            <span className="unit">km</span>
          </dd>
          <dd className="mt-4">
            <RangeBar value={v.rangeWltp} decorative className="max-w-sm" />
            <span className="mt-1.5 flex max-w-sm justify-between text-caption text-muted">
              <span className="num">0</span>
              <span className="num">{formatNumber(RANGE_SCALE_MAX)} km</span>
            </span>
          </dd>
        </dl>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 lg:col-span-7 lg:grid-cols-3 lg:border-l lg:border-line lg:pl-10">
          <DataFigure
            label="Batterie utile"
            value={formatNumber(v.batteryUsable, 1)}
            unit="kWh"
            note={v.batteryGross ? `${fmt(v.batteryGross, "kWh", 1)} brute` : undefined}
          />
          <DataFigure
            label="Charge DC max"
            value={v.chargingDC === null ? null : formatNumber(v.chargingDC)}
            unit="kW"
            note={v.chargingTime10to80 ? `10 → 80 % en ${v.chargingTime10to80}\u00a0min` : undefined}
          />
          <DataFigure
            className="col-span-2 lg:col-span-1"
            label="Coût aux 100 km"
            value={formatNumber(costPer100km(v, ASSUMPTIONS.homePrice), 2)}
            unit="€"
            note={`Calcul EVExpert, ${formatNumber(ASSUMPTIONS.homePrice, 2)}\u00a0€/kWh à domicile`}
          />
        </dl>
      </div>

      <SectionNav
        items={[
          { id: "autonomie", label: "Autonomie réelle" },
          { id: "recharge", label: "Recharge" },
          { id: "cout", label: "Coût" },
          { id: "fiche", label: "Fiche technique" },
          { id: "sources", label: "Source" },
        ]}
      />

      <Block
        id="autonomie"
        numeral="01"
        title="Autonomie réelle estimée"
        intro={
          <>
            Estimation EVExpert : la consommation de référence ({formatNumber(battCons, 1)}&nbsp;kWh/100&nbsp;km, côté batterie) est multipliée par des
            facteurs de vitesse, de température et de type de trajet, décrits sur la page{" "}
            <Link href="/methodologie#autonomie" className="link-u font-semibold text-signal-deep">Méthodologie</Link>.
          </>
        }
      >
        <div className="mb-3 flex items-baseline justify-between">
          <span className="label">Scénario</span>
          <span className="label">Part de l&apos;autonomie WLTP</span>
        </div>
        <ul className="border-t-2 border-ink">
          {scenarios.map(({ s, km }) => {
            const pct = (km / v.rangeWltp) * 100;
            return (
              <li key={s.id} className="grid items-center gap-x-6 gap-y-2 border-b border-line py-4 sm:grid-cols-[13rem_minmax(0,1fr)_8rem]">
                <span className="text-sm font-semibold text-ink">{s.label}</span>
                <span aria-hidden className="relative order-last block h-[3px] bg-line sm:order-none">
                  <span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${Math.min(100, pct)}%` }} />
                </span>
                <span className="num flex items-baseline justify-between gap-3 sm:justify-end">
                  <span className="text-data-md font-bold text-ink">≈&nbsp;{formatNumber(Math.round(km / 5) * 5)}<span className="unit">km</span></span>
                  <span className="text-sm text-muted">{formatNumber(pct)}&nbsp;%</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-caption text-muted">Longueur des barres : part de l&apos;autonomie WLTP ({formatNumber(v.rangeWltp)}&nbsp;km).</p>
      </Block>

      <Block
        id="recharge"
        numeral="02"
        title="Temps de recharge"
        intro="En AC, temps théorique de 10 à 80 % : la puissance de la borne est plafonnée par le chargeur du véhicule. En DC, temps publié par la source : la puissance baisse pendant la charge."
      >
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Temps de recharge de 10 à 80 % selon la puissance de la borne</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Borne</th>
                <th scope="col" className={th}>Puissance</th>
                <th scope="col" className={`${th} pr-0`}>Durée 10 → 80 %</th>
              </tr>
            </thead>
            <tbody className="border-t-2 border-ink">
              {acStations.map((kw) => {
                const r = acChargeMinutes(v, kw);
                return (
                  <tr key={kw} className="border-t border-line first:border-t-0">
                    <th scope="row" className={tdRow}>{formatNumber(kw, 1)}&nbsp;kW AC</th>
                    <td className={`${tdNum} text-body`}>
                      {formatNumber(r.effectiveKw, 1)}&nbsp;kW {r.effectiveKw < kw && <span className="text-caption text-warn">(limité par le véhicule)</span>}
                    </td>
                    <td className={`${tdNum} pr-0 text-data-md font-bold text-ink`}>{minutesToHuman(r.minutes)}</td>
                  </tr>
                );
              })}
              <tr className="border-t border-line">
                <th scope="row" className={tdRow}>Borne DC rapide</th>
                <td className={`${tdNum} text-body`}>jusqu&apos;à {fmt(v.chargingDC, "kW")}</td>
                <td className={`${tdNum} pr-0 text-data-md font-bold text-ink`}>{v.chargingTime10to80 ? `${v.chargingTime10to80}\u00a0min` : "Non disponible"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-caption text-muted">
          <DataBadge type="calculated" /> durées AC · <DataBadge type={src} /> durée DC
        </p>
      </Block>

      <Block
        id="cout"
        numeral="03"
        title="Coût de recharge"
        intro={
          <>
            Calcul EVExpert sur les conditions WLTP, avec un rendement de charge de {ASSUMPTIONS.chargingEfficiency}&nbsp;% et trois tarifs d&apos;hypothèse.
            Remplacez-les par vos prix dans le{" "}
            <Link href="/outils/cout-recharge-voiture-electrique" className="link-u font-semibold text-signal-deep">calculateur de coût de recharge</Link>.
          </>
        }
      >
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Coût de recharge selon le tarif</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>Tarif</th>
                <th scope="col" className={th}>Aux 100 km</th>
                <th scope="col" className={th}>10 → 80 %</th>
                <th scope="col" className={`${th} hidden pr-0 sm:table-cell`}>0 → 100 %</th>
              </tr>
            </thead>
            <tbody className="border-t-2 border-ink">
              {tariffs.map((t) => {
                const partial = chargeCost(v, t.price, 10, 80);
                return (
                  <tr key={t.label} className="border-t border-line first:border-t-0">
                    <th scope="row" className={tdRow}>
                      {t.label}
                      <span className="block text-caption font-normal text-muted">{formatNumber(t.price, 2)}&nbsp;€/kWh</span>
                    </th>
                    <td className={`${tdNum} text-data-md font-bold text-ink`}>{formatEuro(costPer100km(v, t.price), 2)}</td>
                    <td className={`${tdNum} text-body`}>
                      <span className="font-semibold text-ink">{formatEuro(partial.cost, 2)}</span>
                      <span className="block text-caption text-muted">+{formatNumber(Math.round(partial.rangeAdded / 5) * 5)}&nbsp;km</span>
                    </td>
                    <td className={`${tdNum} hidden pr-0 text-body sm:table-cell`}>{formatEuro(chargeCost(v, t.price, 0, 100).cost, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <VehicleCostEstimator gridConsumption={gridConsumption100(v)} />
      </Block>

      <Block
        id="fiche"
        numeral="04"
        title="Fiche technique"
        intro="Une donnée absente est indiquée « Non disponible » : elle n'est jamais estimée. Le prix en France n'est pas encore collecté : consultez le configurateur du constructeur."
      >
        <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
          <SpecTable
            title="Batterie et autonomie"
            id="spec-batterie"
            type={src}
            rows={[
              { label: "Batterie brute", value: fmt(v.batteryGross, "kWh", 1) },
              { label: "Batterie utile", value: fmt(v.batteryUsable, "kWh", 1) },
              { label: "Technologie", value: v.chemistry ?? "Non disponible" },
              { label: "Autonomie WLTP (mixte)", value: fmt(v.rangeWltp, "km") },
              { label: "Consommation WLTP", value: fmt(v.consumptionWltp, "kWh/100 km", 1), note: v.consumptionWltp === null ? "Non publiée ou incohérente dans la source ; voir la consommation calculée ci-dessous." : undefined },
              { label: "Consommation calculée (côté batterie)", value: fmt(battCons, "kWh/100 km", 1), type: "calculated", note: "Capacité utile ÷ autonomie WLTP × 100." },
            ]}
          />
          <SpecTable
            title="Recharge"
            id="spec-recharge"
            type={src}
            rows={[
              { label: "Puissance AC maximale", value: fmt(v.chargingAC, "kW", 1) },
              { label: "Puissance DC maximale", value: fmt(v.chargingDC, "kW") },
              { label: "Charge DC 10-80 %", value: fmt(v.chargingTime10to80, "min") },
            ]}
          />
          <SpecTable
            title="Performances"
            id="spec-performances"
            type={src}
            rows={[
              { label: "Puissance", value: `${fmt(v.powerKw, "kW")} (${fmt(v.powerPs, "ch")})` },
              { label: "Couple", value: fmt(v.torque, "Nm") },
              { label: "0 à 100 km/h", value: fmt(v.acceleration0to100, "s", 1) },
              { label: "Vitesse maximale", value: fmt(v.topSpeed, "km/h") },
              { label: "Transmission", value: driveLabel[v.drive] },
            ]}
          />
          <SpecTable
            title="Dimensions, poids et coffre"
            id="spec-dimensions"
            type={src}
            rows={[
              { label: "Longueur × largeur × hauteur", value: `${formatNumber(v.dimensions.length)} × ${formatNumber(v.dimensions.width)} × ${formatNumber(v.dimensions.height)}\u00a0mm` },
              { label: "Poids à vide", value: fmt(v.weight, "kg") },
              { label: "Coffre", value: fmt(v.trunkVolume, "L") },
              { label: "Coffre, banquette rabattue", value: fmt(v.trunkVolumeMax, "L") },
              { label: "Places", value: String(v.seats) },
            ]}
          />
          <SpecTable
            title="Garanties"
            id="spec-garanties"
            type={src}
            rows={[
              { label: "Garantie véhicule", value: fmtText(v.warranty) },
              { label: "Garantie batterie", value: fmtText(v.batteryWarranty), note: "Telle que publiée par la source ; les conditions françaises peuvent différer." },
            ]}
          />
        </div>
      </Block>

      <Block id="sources" numeral="05" title="Source des données">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <SourceLine source={v.source} />
          <p className="pretty mt-4 max-w-xl text-sm text-body">
            Ces données ne sont pas issues d&apos;un document constructeur : vérifiez les points importants (version exacte, année, options) auprès du constructeur avant tout achat.{" "}
            <Link href="/sources" className="link-u font-semibold text-signal-deep">Politique de sources</Link>.
          </p>
        </div>
      </Block>

      <div className="mt-section">
        <Faq items={faq} title={`Questions sur la ${v.brand} ${v.model}`} layout="split" />
        <JsonLd data={faqJsonLd(faq)} />
      </div>

      {similar.length > 0 && (
        <section className="mt-section" aria-labelledby="similaires">
          <div className="mb-8 border-t-2 border-ink pt-4">
            <h2 id="similaires" className="text-h2 font-bold text-ink">Véhicules similaires</h2>
            <p className="mt-2 text-muted">Même type de carrosserie, capacité de batterie et autonomie proches.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <VehicleCard key={s.id} vehicle={s} href={vehicleHref(s)} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-4 grid gap-x-12 md:grid-cols-2">
        <RelatedTools
          hrefs={[
            "/outils/autonomie-voiture-electrique",
            "/outils/trajet-longue-distance",
            "/outils/cout-recharge-voiture-electrique",
            "/outils/cout-100-km",
            "/outils/temps-recharge",
          ]}
        />
        <RelatedGuides slugs={["calculer-autonomie-reelle", "recharge-ac-ou-dc", "batterie-brute-batterie-utile", "choisir-voiture-electrique-selon-usage"]} />
      </div>
    </div>
  );
}
