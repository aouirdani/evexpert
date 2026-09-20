import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Erreur 404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Page introuvable
        </h1>
        <p className="mt-3 text-slate-600">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="primary">
            Retour à l&apos;accueil
          </ButtonLink>
          <Link href="/outils" className="text-sm font-semibold text-emerald-700 hover:underline">
            Voir les calculateurs →
          </Link>
        </div>
      </div>
    </Container>
  );
}
