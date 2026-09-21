import Link from "next/link";
import type { FaqItem, Vehicle } from "@/types";
import { ASSUMPTIONS } from "@/data/assumptions";
import { getSimilarVehicles, vehicleHref, vehicleTitle } from "@/data/vehicles";
import {
  RANGE_SCENARIOS,
  acChargeMinutes,
  batteryConsumption100,
  chargeCost,
  costPer100km,
  estimateRange,
} from "@/lib/vehicle-calcs";
import { fmt, fmtText } from "@/lib/vehicle-format";
import { formatEuro, formatNumber, minutesToHuman } from "@/lib/utils";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { DataBadge } from "@/components/ui/DataBadge";
import { SourceLine } from "@/components/ui/SourceBadge";
import { RelatedGuides, RelatedTools } from "@/components/related";
import { faqJsonLd } from "@/lib/seo";
import { SpecTable } from "./SpecTable";
import { VehicleCard } from "./VehicleCard";

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

function KeyStat({ label, value, sub, type }: { label: string; value: string; sub?: string; type: Vehicle["source"]["dataType"] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">{label}</p>
      <p className="tabular mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-600">{sub}</p>}
      <div className="mt-2">
        <DataBadge type={type} />
      </div>
    </div>
  );
}

/** Fiche technique complète d'une version. Server Component, aucun JS client. */
export function VehicleDetail({ vehicle: v }: { vehicle: Vehicle }) {
  const src = v.source.dataType;
  const battCons = batteryConsumption100(v);
  const scenarios = RANGE_SCENARIOS.map((s) => ({ s, km: estimateRange(v, s) }));
  const tariffs = [
    { label: "Domicile", price: ASSUMPTIONS.homePrice },
    { label: "Borne publique AC", price: ASSUMPTIONS.publicAcPrice },
    { label: "Recharge rapide DC", price: ASSUMPTIONS.fastDcPrice },
  ];
  const faq = vehicleFaq(v);
  const similar = getSimilarVehicles(v, 3);
  const acStations = [3.7, 7.4, 11, 22];

  return (
    <div>
      <p className="max-w-3xl text-slate-700">
        {vehicleTitle(v)} ({v.years}) : {v.bodyType === "SUV" ? "SUV" : v.bodyType} électrique {v.seats} places, {driveLabel[v.drive].toLowerCase()},
        batterie de {fmt(v.batteryUsable, "kWh", 1)} utiles pour {fmt(v.rangeWltp, "km")} d&apos;autonomie WLTP selon la source,
        recharge AC jusqu&apos;à {fmt(v.chargingAC, "kW", 1)}
        {v.chargingDC ? ` et DC jusqu'à ${fmt(v.chargingDC, "kW")}` : ""}.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KeyStat label="Autonomie WLTP" value={fmt(v.rangeWltp, "km")} type={src} />
        <KeyStat label="Batterie utile" value={fmt(v.batteryUsable, "kWh", 1)} sub={v.batteryGross ? `${fmt(v.batteryGross, "kWh", 1)} brute` : undefined} type={src} />
        <KeyStat label="Charge DC max" value={fmt(v.chargingDC, "kW")} sub={v.chargingTime10to80 ? `10-80 % en ${v.chargingTime10to80} min` : undefined} type={src} />
        <KeyStat label="Coût aux 100 km" value={formatEuro(costPer100km(v, ASSUMPTIONS.homePrice), 2)} sub={`à ${formatNumber(ASSUMPTIONS.homePrice, 2)} €/kWh, domicile`} type="calculated" />
      </div>

      <h2 className="mt-12 text-2xl font-bold text-slate-900">Caractéristiques techniques</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Les valeurs proviennent de la source citée en bas de page. Une donnée absente est indiquée « Non disponible » : elle n&apos;est jamais estimée.
        Le prix en France n&apos;est pas encore collecté : consultez le configurateur du constructeur.
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
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
            { label: "Longueur × largeur × hauteur", value: `${formatNumber(v.dimensions.length)} × ${formatNumber(v.dimensions.width)} × ${formatNumber(v.dimensions.height)} mm` },
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

      <h2 className="mt-12 text-2xl font-bold text-slate-900">Autonomie réelle estimée</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Estimation EVExpert : la consommation de référence ({formatNumber(battCons, 1)} kWh/100 km, côté batterie) est multipliée par des facteurs de vitesse,
        de température et de type de trajet décrits sur la page{" "}
        <Link href="/methodologie#autonomie" className="font-medium text-emerald-800 underline">Méthodologie</Link>.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[420px] text-left text-sm">
          <caption className="sr-only">Autonomie estimée selon le scénario</caption>
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-2.5 font-semibold">Scénario</th>
              <th scope="col" className="px-5 py-2.5 font-semibold">Autonomie estimée</th>
              <th scope="col" className="px-5 py-2.5 font-semibold">Part du WLTP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scenarios.map(({ s, km }) => (
              <tr key={s.id}>
                <th scope="row" className="px-5 py-2.5 font-medium text-slate-900">{s.label}</th>
                <td className="tabular px-5 py-2.5 font-semibold text-slate-900">≈ {formatNumber(Math.round(km / 5) * 5)} km</td>
                <td className="tabular px-5 py-2.5 text-slate-700">{formatNumber((km / v.rangeWltp) * 100)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-slate-900">Coût de recharge</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Calcul EVExpert sur les conditions WLTP, avec un rendement de charge de {ASSUMPTIONS.chargingEfficiency} % et trois tarifs d&apos;hypothèse.
        Remplacez-les par vos prix réels dans le{" "}
        <Link href="/outils/cout-recharge-voiture-electrique" className="font-medium text-emerald-800 underline">calculateur de coût de recharge</Link>.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="sr-only">Coût de recharge selon le tarif</caption>
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-2.5 font-semibold">Tarif (hypothèse)</th>
              <th scope="col" className="px-5 py-2.5 font-semibold">Aux 100 km</th>
              <th scope="col" className="px-5 py-2.5 font-semibold">Recharge 10 → 80 %</th>
              <th scope="col" className="px-5 py-2.5 font-semibold">Plein 0 → 100 %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tariffs.map((t) => (
              <tr key={t.label}>
                <th scope="row" className="px-5 py-2.5 font-medium text-slate-900">
                  {t.label} <span className="font-normal text-slate-600">({formatNumber(t.price, 2)} €/kWh)</span>
                </th>
                <td className="tabular px-5 py-2.5 font-semibold text-slate-900">{formatEuro(costPer100km(v, t.price), 2)}</td>
                <td className="tabular px-5 py-2.5 text-slate-700">
                  {formatEuro(chargeCost(v, t.price, 10, 80).cost, 2)}{" "}
                  <span className="text-xs text-slate-600">(+{formatNumber(Math.round(chargeCost(v, t.price, 10, 80).rangeAdded / 5) * 5)} km)</span>
                </td>
                <td className="tabular px-5 py-2.5 text-slate-700">{formatEuro(chargeCost(v, t.price, 0, 100).cost, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-slate-900">Temps de recharge</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        En AC, temps théorique de 10 à 80 % (puissance de la borne plafonnée par le chargeur du véhicule, rendement {ASSUMPTIONS.chargingEfficiency} %).
        En DC, temps publié par la source : la puissance baisse pendant la charge.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[420px] text-left text-sm">
          <caption className="sr-only">Temps de recharge de 10 à 80 % selon la puissance de la borne</caption>
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-2.5 font-semibold">Borne</th>
              <th scope="col" className="px-5 py-2.5 font-semibold">Puissance utilisée</th>
              <th scope="col" className="px-5 py-2.5 font-semibold">Durée 10 → 80 %</th>
              <th scope="col" className="px-5 py-2.5 font-semibold">Nature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {acStations.map((kw) => {
              const r = acChargeMinutes(v, kw);
              return (
                <tr key={kw}>
                  <th scope="row" className="px-5 py-2.5 font-medium text-slate-900">{formatNumber(kw, 1)} kW AC</th>
                  <td className="tabular px-5 py-2.5 text-slate-700">
                    {formatNumber(r.effectiveKw, 1)} kW {r.effectiveKw < kw && <span className="text-xs text-amber-800">(limité par le véhicule)</span>}
                  </td>
                  <td className="tabular px-5 py-2.5 font-semibold text-slate-900">{minutesToHuman(r.minutes)}</td>
                  <td className="px-5 py-2.5"><DataBadge type="calculated" /></td>
                </tr>
              );
            })}
            <tr>
              <th scope="row" className="px-5 py-2.5 font-medium text-slate-900">Borne DC rapide</th>
              <td className="tabular px-5 py-2.5 text-slate-700">jusqu&apos;à {fmt(v.chargingDC, "kW")}</td>
              <td className="tabular px-5 py-2.5 font-semibold text-slate-900">{v.chargingTime10to80 ? `${v.chargingTime10to80} min` : "Non disponible"}</td>
              <td className="px-5 py-2.5"><DataBadge type={src} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-bold text-slate-900">Source des données</h2>
        <div className="mt-3">
          <SourceLine source={v.source} />
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Ces données ne sont pas issues d&apos;un document constructeur : vérifiez les points importants (version exacte, année, options) auprès du constructeur avant tout achat.{" "}
          <Link href="/sources" className="font-medium text-emerald-800 underline">Politique de sources</Link>.
        </p>
      </div>

      <Faq items={faq} title={`Questions sur la ${v.brand} ${v.model}`} />
      <JsonLd data={faqJsonLd(faq)} />

      {similar.length > 0 && (
        <section className="mt-12" aria-labelledby="similaires">
          <h2 id="similaires" className="text-2xl font-bold text-slate-900">Véhicules similaires</h2>
          <p className="mt-1 text-sm text-slate-600">Même type de carrosserie, capacité de batterie et autonomie proches.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <VehicleCard key={s.id} vehicle={s} href={vehicleHref(s)} />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <RelatedTools
          hrefs={[
            "/outils/cout-100-km",
            "/outils/cout-recharge-voiture-electrique",
            "/outils/autonomie-voiture-electrique",
            "/outils/temps-recharge",
          ]}
        />
        <RelatedGuides slugs={["calculer-autonomie-reelle", "recharge-ac-ou-dc", "batterie-brute-batterie-utile", "choisir-voiture-electrique-selon-usage"]} />
      </div>
    </div>
  );
}
