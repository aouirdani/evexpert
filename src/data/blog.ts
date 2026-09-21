import "server-only";
import type { Article } from "@/types";
import { getCatalog, type Catalog } from "@/data/catalog";
import { buildArticles } from "./articles";

// Les analyses du blog sont calculées depuis le catalogue : une construction par catalogue chargé.
const cache = new WeakMap<Catalog, Article[]>();

export async function getArticles(): Promise<Article[]> {
  const catalog = await getCatalog();
  let articles = cache.get(catalog);
  if (!articles) {
    articles = buildArticles(catalog.vehicles);
    cache.set(catalog, articles);
  }
  return articles;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.slug === slug);
}
