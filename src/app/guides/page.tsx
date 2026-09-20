import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GuideCard } from "@/components/cards";
import { guides } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Guides sur la voiture électrique",
  description:
    "Guides pratiques : achat, recharge, autonomie, batterie et entretien d'une voiture électrique.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }]} />
      <PageHeader
        eyebrow="Guides"
        title="Comprendre la voiture électrique"
        description="Des guides clairs et pédagogiques pour choisir, recharger et entretenir votre véhicule électrique."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <GuideCard key={g.slug} guide={g} />
        ))}
      </div>
    </Container>
  );
}
