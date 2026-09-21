import type { Guide, GuideCategory } from "@/types";
import { autonomieGuides } from "./autonomie";
import { rechargeGuides } from "./recharge";
import { usageGuides } from "./usage";

export const guides: Guide[] = [...autonomieGuides, ...rechargeGuides, ...usageGuides];

export const guideCategoryLabels: Record<GuideCategory, string> = {
  autonomie: "Autonomie",
  recharge: "Recharge",
  batterie: "Batterie",
  coûts: "Coûts",
  achat: "Achat",
  comprendre: "Comprendre",
};

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
