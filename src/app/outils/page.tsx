import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolCard } from "@/components/cards";
import { tools } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Calculateurs pour voiture électrique",
  description:
    "Tous nos calculateurs : coût de recharge, autonomie réelle, coût aux 100 km, essence vs électrique, TCO et temps de recharge.",
  path: "/outils",
});

export default function OutilsPage() {
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Outils", href: "/outils" }]} />
      <PageHeader
        eyebrow="Outils"
        title="Calculateurs pour voiture électrique"
        description="Des outils gratuits et transparents pour estimer vos coûts, votre autonomie et le coût total de possession."
      />
      <ol className="mt-12 grid gap-x-14 border-t-2 border-ink md:grid-cols-2">
        {tools.map((t, i) => (
          <ToolCard key={t.slug} tool={t} index={i} />
        ))}
      </ol>
    </Container>
  );
}
