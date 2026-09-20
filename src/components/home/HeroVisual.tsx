import { BatteryCharging, Gauge, TrendingDown, Zap } from "lucide-react";

/**
 * Server-rendered "product" hero visual: a mock cost/energy dashboard.
 * Communicates data + trust without stock photography or heavy client JS.
 * Values are illustrative and labelled as an example.
 */
export function HeroVisual() {
  const bars = [
    { label: "WLTP", value: 100, tone: "bg-emerald-500" },
    { label: "Réel (est.)", value: 82, tone: "bg-emerald-400" },
    { label: "Hiver (est.)", value: 64, tone: "bg-emerald-300" },
  ];

  return (
    <div className="animate-rise lg:justify-self-end">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Coût de recharge
            </p>
            <p className="tabular mt-1 text-4xl font-extrabold text-slate-900">
              8,42 €
            </p>
            <p className="tabular mt-0.5 text-sm text-slate-500">
              ≈ 5,61 €/100 km
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Zap className="h-5 w-5" aria-hidden />
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: BatteryCharging, label: "Énergie", value: "52,6 kWh" },
            { icon: Gauge, label: "Autonomie", value: "+245 km" },
            { icon: TrendingDown, label: "vs essence", value: "−68 %" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <m.icon className="h-4 w-4 text-emerald-600" aria-hidden />
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {m.label}
              </p>
              <p className="tabular text-sm font-bold text-slate-900">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Autonomie estimée
          </p>
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-slate-500">{b.label}</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <span
                  className={`block h-full rounded-full ${b.tone}`}
                  style={{ width: `${b.value}%` }}
                />
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          Exemple illustratif — les résultats dépendent de vos paramètres.
        </p>
      </div>
    </div>
  );
}
