import { Mail } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: `Contacter l'équipe ${siteConfig.name}.`,
  path: "/contact",
});

export default function Page() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
      <PageHeader
        title="Contact"
        description="Une question, une correction de donnée, une suggestion ? Écrivez-nous."
      />
      <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Mail className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm text-slate-500">Adresse e-mail</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-lg font-bold text-emerald-700 hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-600">
          Pour signaler une erreur dans une fiche ou proposer une source, merci
          d&apos;indiquer le modèle concerné et, si possible, un lien vers la
          donnée officielle.
        </p>
      </div>
    </Container>
  );
}
