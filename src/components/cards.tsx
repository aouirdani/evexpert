import Image from "next/image";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { Article, EditorialImage, Guide, Tool } from "@/types";
import { formatDateFr } from "@/lib/utils";
import { Kicker } from "@/components/layout/Section";
import { guideCategoryLabels } from "@/data/guides/labels";

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ??
    Icons.Calculator;
  return <Icon className={className} aria-hidden />;
}

/** Ligne d'outil : numéro, nom, description, lien étiré. Pas de boîte, pas d'icône de décor. */
export function ToolCard({ tool, index }: { tool: Tool; index?: number }) {
  return (
    <li className="group relative border-b border-line">
      <Link href={tool.href} className="flex items-baseline gap-5 py-5 after:absolute after:inset-0 after:content-['']">
        {index !== undefined && (
          <span className="num w-7 shrink-0 text-sm font-semibold text-signal-deep">{String(index + 1).padStart(2, "0")}</span>
        )}
        <span className="flex-1">
          <span className="block text-lg font-bold text-ink">
            <span className="link-h group-hover:[background-size:100%_2px]">{tool.shortTitle}</span>
          </span>
          <span className="mt-1 block max-w-xl text-sm text-muted">{tool.description}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 self-center text-signal-deep transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </li>
  );
}

/** Photographie d'un contenu, si sa vignette est une photo ; les schémas SVG ne servent pas de vignette. */
function Thumb({ image }: { image?: EditorialImage }) {
  if (!image || image.src.endsWith(".svg")) return null;
  return (
    <div className="mb-5 aspect-[3/2] overflow-hidden bg-paper-deep">
      <Image
        src={image.src}
        alt=""
        width={image.width}
        height={image.height}
        sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 100vw"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}

function EditorialCard({
  href,
  image,
  kicker,
  aside,
  title,
  description,
  footer,
}: {
  href: string;
  image?: EditorialImage;
  kicker: string;
  aside?: string;
  title: string;
  description: string;
  footer?: React.ReactNode;
}) {
  return (
    <article className="group relative flex flex-col border-t-2 border-ink pt-5">
      <Thumb image={image} />
      <Kicker aside={aside}>{kicker}</Kicker>
      <h3 className="mt-3 text-h3 font-bold text-ink">
        <Link href={href} className="link-h after:absolute after:inset-0 after:content-[''] group-hover:[background-size:100%_2px]">
          {title}
        </Link>
      </h3>
      <p className="pretty mt-2 flex-1 text-sm text-muted">{description}</p>
      {footer && <p className="mt-4 text-caption text-muted">{footer}</p>}
    </article>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <EditorialCard
      href={`/blog/${article.slug}`}
      image={article.hero}
      kicker={article.category}
      aside={`${article.readingTime} min`}
      title={article.title}
      description={article.excerpt}
      footer={<time dateTime={article.updatedAt}>Mis à jour le {formatDateFr(article.updatedAt)}</time>}
    />
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <EditorialCard
      href={`/guides/${guide.slug}`}
      image={guide.hero}
      kicker={guideCategoryLabels[guide.category]}
      aside={`${guide.readingTime} min`}
      title={guide.title}
      description={guide.description}
    />
  );
}
