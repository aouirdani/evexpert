import type { ReactNode } from "react";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Faq } from "@/components/ui/Faq";
import { DataBadge } from "@/components/ui/DataBadge";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { JsonLd } from "@/components/ui/JsonLd";
import { RelatedGuides, RelatedTools, RelatedVehicles } from "@/components/related";
import { getTool } from "@/data/tools";
import { toolContent } from "@/data/toolContent";
import { faqJsonLd } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo";

/** Métadonnées d'une page outil, dérivées de data/tools.ts. */
export function toolMetadata(slug: string) {
  const tool = getTool(slug)!;
  return buildMetadata({ title: tool.title, description: tool.description, path: tool.href });
}

export function ToolPageShell({
  slug,
  calculator,
}: {
  slug: string;
  calculator: ReactNode;
}) {
  const tool = getTool(slug)!;
  const c = toolContent[slug];
  const example = c.example();

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Outils", href: "/outils" },
          { name: tool.shortTitle, href: tool.href },
        ]}
      />
      <PageHeader eyebrow="Calculateur" title={tool.title} description={c.intro[0]} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <DataBadge type="estimated" />
        <LastUpdated date={c.updatedAt} />
      </div>

      <div className="mt-8">{calculator}</div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="prose-ev min-w-0">
          {c.intro.slice(1).map((p) => (
            <p key={p}>{p}</p>
          ))}

          <h2 id="formule">Comment le calcul fonctionne</h2>
          <p>Chaque étape est visible : aucune hypothèse n&apos;est cachée.</p>
          <dl className="mt-4 space-y-3">
            {c.formulas.map((f) => (
              <div key={f.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <dt className="text-sm font-bold text-slate-900">{f.label}</dt>
                <dd className="tabular mt-1 text-sm text-slate-700">{f.expr}</dd>
              </div>
            ))}
          </dl>

          <h2 id="exemple">Exemple concret</h2>
          <p className="font-medium text-slate-900">{example.title}</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            {example.steps.map((s) => (
              <li key={s} className="tabular">
                {s}
              </li>
            ))}
          </ol>

          <h2 id="limites">Limites du calcul</h2>
          <ul>
            {c.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p>
            La méthode complète, les hypothèses et les sources sont détaillées sur la page{" "}
            <a href="/methodologie">Méthodologie</a>.
          </p>
        </div>

        <aside className="space-y-2">
          <RelatedTools hrefs={c.relatedTools} title="Autres outils" />
          <RelatedGuides slugs={c.relatedGuides} />
          <RelatedVehicles ids={c.relatedVehicleIds} title="Fiches véhicules à consulter" />
        </aside>
      </div>

      <Faq items={c.faq} />
      <JsonLd data={faqJsonLd(c.faq)} />
    </Container>
  );
}
