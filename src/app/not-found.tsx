import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-section">
      <div className="grid gap-x-12 gap-y-6 border-t-2 border-ink pt-6 lg:grid-cols-12">
        <p className="num text-data-xl font-bold text-ink lg:col-span-4" aria-hidden>
          404
        </p>
        <div className="lg:col-span-8">
          <p className="eyebrow text-signal-deep">Erreur 404</p>
          <h1 className="mt-4 text-h1 font-bold text-ink">Page introuvable</h1>
          <p className="pretty mt-4 max-w-xl text-dek text-body">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="mt-8 flex flex-col gap-x-8 gap-y-4 sm:flex-row sm:items-center">
            <ButtonLink href="/" variant="primary" size="lg">
              Retour à l&apos;accueil
            </ButtonLink>
            <Link href="/outils" className="link-u self-start text-base font-semibold text-signal-deep sm:self-auto">
              Voir les calculateurs
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
