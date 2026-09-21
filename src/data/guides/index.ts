import "server-only";
import type { Guide } from "@/types";
import { getCatalog, type Catalog } from "@/data/catalog";
import { buildAutonomieGuides } from "./autonomie";
import { makeGuideContext } from "./helpers";
import { buildRechargeGuides } from "./recharge";
import { buildUsageGuides } from "./usage";

export { guideCategoryLabels } from "./labels";

// Les tableaux chiffrés des guides sont calculés depuis le catalogue : on les
// construit une fois par catalogue chargé.
const cache = new WeakMap<Catalog, Guide[]>();

export async function getGuides(): Promise<Guide[]> {
  const catalog = await getCatalog();
  let guides = cache.get(catalog);
  if (!guides) {
    const ctx = makeGuideContext(catalog.vehicles);
    guides = [...buildAutonomieGuides(ctx), ...buildRechargeGuides(ctx), ...buildUsageGuides(ctx)];
    cache.set(catalog, guides);
  }
  return guides;
}

export async function getGuide(slug: string): Promise<Guide | undefined> {
  return (await getGuides()).find((g) => g.slug === slug);
}
