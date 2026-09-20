import type { Tool } from "@/types";

export const tools: Tool[] = [
  {
    slug: "cout-recharge-voiture-electrique",
    href: "/outils/cout-recharge-voiture-electrique",
    title: "Calculateur de coût de recharge d'une voiture électrique",
    shortTitle: "Coût de recharge",
    description:
      "Estimez le coût d'une recharge selon la capacité de batterie, le prix du kWh et le rendement.",
    icon: "Zap",
  },
  {
    slug: "autonomie-voiture-electrique",
    href: "/outils/autonomie-voiture-electrique",
    title: "Calculateur d'autonomie d'une voiture électrique",
    shortTitle: "Autonomie réelle",
    description:
      "Obtenez une estimation d'autonomie selon la vitesse, la température et le type de conduite.",
    icon: "Gauge",
  },
  {
    slug: "cout-100-km",
    href: "/outils/cout-100-km",
    title: "Calculateur de coût aux 100 km",
    shortTitle: "Coût aux 100 km",
    description:
      "Comparez le coût énergétique aux 100 km entre électrique, essence, diesel et hybride.",
    icon: "Route",
  },
  {
    slug: "essence-vs-electrique",
    href: "/outils/essence-vs-electrique",
    title: "Comparateur essence vs électrique",
    shortTitle: "Essence vs électrique",
    description:
      "Comparez le coût annuel et pluriannuel d'une voiture électrique et d'une voiture essence.",
    icon: "Fuel",
  },
  {
    slug: "tco-voiture-electrique",
    href: "/outils/tco-voiture-electrique",
    title: "Calculateur de coût total de possession (TCO)",
    shortTitle: "Calculateur TCO",
    description:
      "Calculez le coût total de possession et comparez deux véhicules sur plusieurs années.",
    icon: "Calculator",
  },
  {
    slug: "temps-recharge",
    href: "/outils/temps-recharge",
    title: "Calculateur de temps de recharge",
    shortTitle: "Temps de recharge",
    description:
      "Estimez le temps de recharge théorique selon la puissance et l'état de charge.",
    icon: "Timer",
  },
  {
    slug: "puissance-borne-recharge",
    href: "/outils/puissance-borne-recharge",
    title: "Comprendre la puissance des bornes de recharge",
    shortTitle: "Puissance des bornes",
    description:
      "Découvrez ce que change la puissance d'une borne sur le temps de recharge réel.",
    icon: "PlugZap",
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByHref(hrefs: string[]): Tool[] {
  return tools.filter((t) => hrefs.includes(t.href) || hrefs.includes(t.slug));
}
