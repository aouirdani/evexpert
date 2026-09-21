import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/states";

// /recherche est la seule page rendue à la demande : squelette pendant le calcul.
export default function SearchLoading() {
  return (
    <Container className="pb-section pt-8">
      <div role="status" aria-live="polite">
        <span className="sr-only">Chargement des résultats…</span>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-4 h-6 w-full max-w-xl" />
        <Skeleton className="mt-6 h-12 w-full max-w-2xl" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </Container>
  );
}
