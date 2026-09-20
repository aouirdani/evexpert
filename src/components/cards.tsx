import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight, Clock } from "lucide-react";
import type { Article, Guide, Tool } from "@/types";
import { formatDateFr } from "@/lib/utils";
import { Badge } from "@/components/ui/primitives";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ??
    Icons.Calculator;
  return <Icon className={className} aria-hidden />;
}

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
        <DynamicIcon name={tool.icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-base font-bold text-slate-900">
        {tool.shortTitle}
      </h3>
      <p className="mt-1 flex-1 text-sm text-slate-600">{tool.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
        Ouvrir l&apos;outil
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div
        className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100"
        aria-hidden
      >
        <span className="px-4 text-center text-sm font-semibold text-emerald-700/70">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Badge tone="emerald">{article.category}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" aria-hidden /> {article.readingTime} min
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">
          <Link href={`/blog/${article.slug}`} className="hover:text-emerald-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-slate-600">{article.excerpt}</p>
        <p className="mt-4 text-xs text-slate-500">
          {formatDateFr(article.publishedAt)}
        </p>
      </div>
    </article>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <Badge tone="blue">Guide</Badge>
      <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-emerald-700">
        {guide.title}
      </h3>
      <p className="mt-1 flex-1 text-sm text-slate-600">{guide.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
        Lire le guide
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
