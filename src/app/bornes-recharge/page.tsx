import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DemoNotice, SourceBadge } from "@/components/ui/SourceBadge";
import { chargingStations } from "@/data/charging";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bornes de recharge : types, accès et données",
  description:
    "Comprendre les types de bornes de recharge, leur puissance et leur accès. Exemples de stations (données de démonstration).",
  path: "/bornes-recharge",
});

export default function Page() {
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Recharge", href: "/recharge" },
          { name: "Bornes de recharge", href: "/bornes-recharge" },
        ]}
      />
      <PageHeader
        eyebrow="Recharge"
        title="Bornes de recharge"
        description="Panorama des bornes de recharge en France et de leurs caractéristiques."
      />

      <div className="mt-6">
        <DemoNotice />
      </div>

      <p className="mt-6 max-w-3xl text-slate-700">
        Les données de bornes ci-dessous sont des exemples destinés à illustrer la
        structure du modèle de données. Elles pourront à terme être alimentées par
        une source ouverte (par exemple le jeu de données national des points de
        recharge — IRVE — publié sur data.gouv.fr), avec source et date de mise à
        jour.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-4 font-semibold">Opérateur</th>
              <th className="p-4 font-semibold">Ville</th>
              <th className="p-4 font-semibold">Puissance</th>
              <th className="p-4 font-semibold">Connecteur</th>
              <th className="p-4 font-semibold">Prix</th>
              <th className="p-4 font-semibold">Accès</th>
            </tr>
          </thead>
          <tbody>
            {chargingStations.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="p-4 font-medium text-slate-900">{s.operator}</td>
                <td className="p-4 text-slate-700">{s.city}</td>
                <td className="p-4 text-slate-700">{s.power} kW</td>
                <td className="p-4 text-slate-700">{s.connector}</td>
                <td className="p-4 text-slate-700">{s.price}</td>
                <td className="p-4 text-slate-700">{s.access}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <SourceBadge
          source="Données d'exemple EVExpert"
          sourceUrl="/sources"
          isDemo
        />
      </div>
    </Container>
  );
}
