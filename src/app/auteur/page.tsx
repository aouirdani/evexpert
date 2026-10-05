import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { LastUpdated } from "@/components/ui/SourceBadge";
import { author } from "@/config/author";
import { buildMetadata, personJsonLd } from "@/lib/seo";

// Dernière révision de cette page.
const LAST_UPDATED = "2026-10-05";

export const metadata = buildMetadata({
  title: `${author.name} — Auteur d'EVExpert`,
  description: "Qui écrit et vérifie les fiches, calculateurs et guides d'EVExpert : présentation de l'auteur et de sa démarche éditoriale.",
  path: author.href,
});

export default function Page() {
  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs items={[{ name: "Auteur", href: author.href }]} />
      <article className="max-w-3xl">
        <PageHeader eyebrow="Auteur" title={author.name} description={author.role} />
        <div className="mt-3">
          <LastUpdated date={LAST_UPDATED} />
        </div>
        <div className="prose-ev mt-8">
          <p>{author.bio}</p>
        </div>
        <ul className="mt-8 space-y-2 border-t-2 border-ink pt-6 text-sm">
          <li><Link href="/politique-editoriale" className="link-u font-semibold text-signal-deep">Politique éditoriale</Link></li>
          <li><Link href="/methodologie" className="link-u font-semibold text-signal-deep">Méthodologie : comment nous calculons</Link></li>
          <li><Link href="/contact" className="link-u font-semibold text-signal-deep">Contacter l&apos;auteur ou signaler une erreur</Link></li>
        </ul>
      </article>
      <JsonLd data={personJsonLd()} />
    </Container>
  );
}
