import type { ReactNode } from "react";
import { formatDateFr } from "@/lib/format";

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}

/** Bandeau de signature d'un contenu : rédaction, dates, durée de lecture (liste à filets). */
export function Colophon({
  publishedAt,
  updatedAt,
  readingTime,
}: {
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
}) {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-x-10 gap-y-4 border-y border-line py-4 sm:flex sm:flex-wrap">
      <Item label="Rédaction">La rédaction EVExpert</Item>
      <Item label="Publié le">
        <time dateTime={publishedAt}>{formatDateFr(publishedAt)}</time>
      </Item>
      <Item label="Mis à jour le">
        <time dateTime={updatedAt}>{formatDateFr(updatedAt)}</time>
      </Item>
      <Item label="Lecture">{readingTime}&nbsp;min</Item>
    </dl>
  );
}
