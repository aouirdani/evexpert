import type { ReactNode } from "react";
import Link from "next/link";
import { formatDateFr } from "@/lib/format";
import { author } from "@/config/author";

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
      <Item label="Rédaction">
        <Link href={author.href} className="link-u">{author.name}</Link>
      </Item>
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
