import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bloc de chargement : purement décoratif, masqué aux lecteurs d'écran. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-paper-deep", className)} />;
}

function StateBox({
  title,
  description,
  action,
  className,
  role,
  tone,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  role?: "status" | "alert";
  tone: "neutral" | "danger";
}) {
  return (
    <div
      role={role}
      className={cn(
        "rounded-2xl border p-6 text-center sm:p-10",
        tone === "danger" ? "border-danger/30 bg-danger-bg" : "border-line bg-surface",
        className,
      )}
    >
      <p className="text-h3 font-bold text-ink">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-body">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Aucun résultat / aucune donnée : explique et propose une sortie. */
export function EmptyState(props: { title: string; description?: string; action?: ReactNode; className?: string }) {
  return <StateBox {...props} tone="neutral" role="status" />;
}

/** Erreur récupérable : annoncée immédiatement aux lecteurs d'écran. */
export function ErrorState(props: { title: string; description?: string; action?: ReactNode; className?: string }) {
  return <StateBox {...props} tone="danger" role="alert" />;
}
