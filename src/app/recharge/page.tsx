import Link from "next/link";
import { ArrowRight, PlugZap } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { chargingTopics } from "@/data/charging";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Recharge des voitures électriques : le dossier complet",
  description:
    "Recharge à domicile, publique et rapide, prix, connecteurs (Type 2, CCS, CHAdeMO) et puissances : tout comprendre sur la recharge.",
  path: "/recharge",
});

const hubLinks = [
  { href: "/recharge-a-domicile", title: "Recharge à domicile", desc: "Wallbox, puissance, installation et coûts." },
  { href: "/recharge-rapide", title: "Recharge rapide", desc: "Bornes DC, courbe de charge et longs trajets." },
  { href: "/recharge/prix", title: "Prix de la recharge", desc: "Comparer domicile, borne publique et recharge rapide." },
  { href: "/bornes-recharge", title: "Bornes de recharge", desc: "Types de bornes, accès et données (exemple)." },
];

export default function RechargePage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Recharge", href: "/recharge" }]} />
      <PageHeader
        eyebrow="Recharge"
        title="Tout comprendre sur la recharge"
        description="Standards, puissances, prix et bonnes pratiques pour recharger sereinement, à domicile comme sur la route."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {hubLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <PlugZap className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="flex items-center gap-1 text-base font-bold text-slate-900">
                {l.title}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span className="mt-1 block text-sm text-slate-600">{l.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold text-slate-900">
        Standards et puissances
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chargingTopics.map((t) => (
          <Link
            key={t.slug}
            href={`/recharge/${t.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md"
          >
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
              {t.shortTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{t.description}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
