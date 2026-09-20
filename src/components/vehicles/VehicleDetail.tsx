import Link from "next/link";
import {
  BatteryCharging,
  Gauge,
  Ruler,
  Timer,
  Weight,
  Zap,
} from "lucide-react";
import type { Vehicle } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { DemoNotice, LastUpdated, SourceBadge } from "@/components/ui/SourceBadge";
import { Faq } from "@/components/ui/Faq";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { computeChargingCost, computeRange, costPer100km } from "@/lib/calculators";
import { formatEuro, formatNumber } from "@/lib/utils";
import { getSimilarVehicles, vehicleTitle } from "@/data/vehicles";
import { guides } from "@/data/guides";

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 text-sm">
      <dt className="text-slate-600">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export function VehicleDetail({ vehicle: v }: { vehicle: Vehicle }) {
  const similar = getSimilarVehicles(v, 3);
  const title = vehicleTitle(v);

  // Cost estimates (transparent, computed live).
  const homeCharge = computeChargingCost({
    batteryCapacity: v.usableBatteryCapacity,
    currentSoc: 20,
    targetSoc: 80,
    electricityPrice: 0.25,
    efficiency: 90,
    consumption: v.consumptionWltp,
  });
  const per100Home = costPer100km({ consumption: v.consumptionWltp, price: 0.25 });
  const winterRange = computeRange({
    usableCapacity: v.usableBatteryCapacity,
    baseConsumption: v.consumptionWltp,
    speed: 110,
    temperature: 0,
    drivingType: "autoroute",
    reserve: 10,
  });

  const relatedGuides = guides.filter((g) =>
    ["achat", "recharge", "autonomie"].includes(g.category),
  );

  const faq = [
    {
      question: `Quelle est l'autonomie réelle de la ${title} ?`,
      answer: `L'autonomie WLTP annoncée est de ${formatNumber(v.rangeWltp)} km. En usage réel, comptez une valeur inférieure (estimation ~${formatNumber(v.realWorldRange)} km en mixte, moins sur autoroute et par temps froid).`,
    },
    {
      question: `Combien coûte une recharge de la ${title} ?`,
      answer: `Une recharge de 20 à 80 % à domicile (0,25 €/kWh) coûte environ ${formatEuro(homeCharge.cost, 2)} et ajoute ≈ ${formatNumber(homeCharge.rangeAdded)} km (données d'exemple).`,
    },
    {
      question: `Quelle est la puissance de recharge rapide ?`,
      answer: `La ${title} accepte jusqu'à ${formatNumber(v.chargingDC)} kW en courant continu, pour un passage 10-80 % annoncé autour de ${formatNumber(v.chargingTime10to80)} minutes.`,
    },
  ];

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Voitures électriques", href: "/voitures-electriques" },
          { name: v.brand, href: `/voitures-electriques/${v.brandSlug}` },
          { name: `${v.model} ${v.version}`, href: `/voitures-electriques/${v.brandSlug}/${v.modelSlug}` },
        ]}
      />

      <div className="mb-6">
        <DemoNotice />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            {v.brand} · {v.bodyType} · {v.year}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {v.model} <span className="text-slate-500">{v.version}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">{v.summary}</p>
          <p className="mt-4 text-3xl font-extrabold text-slate-900">
            {formatEuro(v.price)}{" "}
            <span className="text-sm font-medium text-slate-500">à partir de (indicatif)</span>
          </p>

          {/* Summary specs */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Spec icon={Gauge} label="Autonomie WLTP" value={`${formatNumber(v.rangeWltp)} km`} />
            <Spec icon={BatteryCharging} label="Batterie utile" value={`${formatNumber(v.usableBatteryCapacity, 1)} kWh`} />
            <Spec icon={Zap} label="Recharge DC" value={`${formatNumber(v.chargingDC)} kW`} />
            <Spec icon={Timer} label="10-80 %" value={`${formatNumber(v.chargingTime10to80)} min`} />
          </div>
        </div>

        <aside
          className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-emerald-50 lg:aspect-auto"
          aria-hidden
        >
          <span className="text-5xl font-black tracking-tight text-slate-300">
            {v.brand}
          </span>
        </aside>
      </div>

      {/* Technical specifications */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Caractéristiques techniques</h2>
        <div className="mt-4 grid gap-x-10 gap-y-0 sm:grid-cols-2">
          <dl>
            <SpecRow label="Batterie totale" value={`${formatNumber(v.batteryCapacity, 1)} kWh`} />
            <SpecRow label="Batterie utile" value={`${formatNumber(v.usableBatteryCapacity, 1)} kWh`} />
            <SpecRow label="Autonomie WLTP" value={`${formatNumber(v.rangeWltp)} km`} />
            <SpecRow label="Consommation WLTP" value={`${formatNumber(v.consumptionWltp, 1)} kWh/100 km`} />
            <SpecRow label="Recharge AC" value={`${formatNumber(v.chargingAC)} kW`} />
            <SpecRow label="Recharge DC" value={`${formatNumber(v.chargingDC)} kW`} />
            <SpecRow label="Pic DC observé" value={`${formatNumber(v.dcPeakPower)} kW`} />
          </dl>
          <dl>
            <SpecRow label="0-100 km/h" value={`${formatNumber(v.acceleration, 1)} s`} />
            <SpecRow label="Puissance" value={`${formatNumber(v.power)} ch`} />
            <SpecRow label="Couple" value={`${formatNumber(v.torque)} Nm`} />
            <SpecRow label="Poids" value={`${formatNumber(v.weight)} kg`} />
            <SpecRow label="Coffre" value={`${formatNumber(v.trunkVolume)} L`} />
            <SpecRow label="Places" value={`${v.seats}`} />
            <SpecRow label="Dimensions (L×l×h)" value={`${v.dimensions.length} × ${v.dimensions.width} × ${v.dimensions.height} mm`} />
          </dl>
        </div>
      </section>

      {/* Real-world usage */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Usage réel (estimations)</h2>
        <p className="mt-2 text-sm text-slate-600">
          Estimations calculées à titre indicatif. Ce ne sont pas des valeurs officielles.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Spec icon={Gauge} label="Autonomie mixte (est.)" value={`≈ ${formatNumber(v.realWorldRange)} km`} />
          <Spec icon={Ruler} label="Autoroute par 0°C (est.)" value={`≈ ${formatNumber(winterRange.estimatedRange)} km`} />
          <Spec icon={Weight} label="Conso ajustée hiver" value={`≈ ${formatNumber(winterRange.adjustedConsumption, 1)} kWh/100`} />
        </div>
      </section>

      {/* Charging */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Recharge</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Spec icon={Zap} label="AC (chargeur embarqué)" value={`${formatNumber(v.chargingAC)} kW`} />
          <Spec icon={Zap} label="DC (recharge rapide)" value={`${formatNumber(v.chargingDC)} kW`} />
          <Spec icon={Timer} label="10-80 % en DC" value={`${formatNumber(v.chargingTime10to80)} min`} />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Besoin d&apos;estimer votre temps de recharge&nbsp;?{" "}
          <Link href="/outils/temps-recharge" className="font-medium text-emerald-700 hover:underline">
            Utilisez le calculateur de temps de recharge
          </Link>
          .
        </p>
      </section>

      <div className="mt-10">
        <AdSlot slot="vehicle-inline" format="inline" />
      </div>

      {/* Cost of ownership + per 100km */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Coûts d&apos;usage (estimations)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Spec icon={Zap} label="Recharge 20-80 % à domicile" value={formatEuro(homeCharge.cost, 2)} />
          <Spec icon={Gauge} label="Coût aux 100 km (domicile)" value={formatEuro(per100Home, 2)} />
          <Spec icon={BatteryCharging} label="km ajoutés (20-80 %)" value={`≈ ${formatNumber(homeCharge.rangeAdded)} km`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/outils/cout-recharge-voiture-electrique" className="font-medium text-emerald-700 hover:underline">
            Calculateur de coût de recharge →
          </Link>
          <Link href="/outils/tco-voiture-electrique" className="font-medium text-emerald-700 hover:underline">
            Calculateur de TCO →
          </Link>
        </div>
      </section>

      {/* Compare with similar */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Comparer avec des modèles proches
          </h2>
          <ComparisonTable vehicles={[v, ...similar]} />
        </section>
      )}

      {/* Related guides */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Guides associés</h2>
        <ul className="mt-3 space-y-2">
          {relatedGuides.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="font-medium text-emerald-700 hover:underline">
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <Faq items={faq} />
      <JsonLd data={faqJsonLd(faq)} />

      {/* Sources */}
      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-bold text-slate-900">Sources et mise à jour</h2>
        <div className="mt-3 space-y-2">
          <SourceBadge source={v.source} sourceUrl={v.sourceUrl} isDemo={v.isDemo} />
          <LastUpdated date={v.lastUpdated} />
        </div>
      </section>
    </Container>
  );
}
