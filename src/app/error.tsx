"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button, ButtonLink } from "@/components/ui/primitives";

/**
 * Filet de sécurité d'une page qui échoue au rendu (ex. base de données injoignable sans
 * catalogue en mémoire). Rendue dans le layout : header et pied de page restent présents.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-section">
      <div className="grid gap-x-12 gap-y-6 border-t-2 border-ink pt-6 lg:grid-cols-12">
        <p className="num text-data-xl font-bold text-ink lg:col-span-4" aria-hidden>
          500
        </p>
        <div className="lg:col-span-8">
          <p className="eyebrow text-signal-deep">Erreur temporaire</p>
          <h1 className="mt-4 text-h1 font-bold text-ink">Cette page n&apos;a pas pu se charger</h1>
          <p className="pretty mt-4 max-w-xl text-dek text-body">
            Un problème passager nous empêche d&apos;afficher cette page. Réessayez dans un instant : les données
            sont conservées.
          </p>
          <div className="mt-8 flex flex-col gap-x-8 gap-y-4 sm:flex-row sm:items-center">
            <Button type="button" variant="primary" size="lg" onClick={reset}>
              Réessayer
            </Button>
            <ButtonLink href="/" variant="secondary" size="lg">
              Retour à l&apos;accueil
            </ButtonLink>
          </div>
        </div>
      </div>
    </Container>
  );
}
