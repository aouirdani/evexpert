"use client";

import { ButtonLink, Button } from "@/components/ui/primitives";
import { ErrorState } from "@/components/ui/states";
import { Container } from "@/components/layout/Container";

/**
 * Erreur de la recherche, seule page rendue à la demande. Les pages statiques n'ont pas
 * de boundary dédié : un error.tsx racine coûterait ~10 Ko de JS gzip sur chaque page.
 */
export default function SearchError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-section">
      <ErrorState
        title="Une erreur est survenue"
        description="La page n'a pas pu s'afficher. Réessayez, ou revenez à l'accueil : vos données ne sont pas affectées."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => reset()}>Réessayer</Button>
            <ButtonLink href="/" variant="outline">Retour à l&apos;accueil</ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
