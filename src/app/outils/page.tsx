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
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Outils", href: "/outils" }]} />
      <PageHeader
        eyebrow="Outils"
        title="Calculateurs pour voiture électrique"
        description="Des outils gratuits et transparents pour estimer vos coûts, votre autonomie et le coût total de possession."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </Container>
  );
}
