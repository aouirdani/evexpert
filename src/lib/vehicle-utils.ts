import type { Vehicle } from "@/types";

/**
 * Helpers PURS sur les véhicules (aucun accès aux données) : utilisables dans
 * les Server Components comme dans les composants client.
 */

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/#/g, "")
    .replace(/,/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function vehicleTitle(v: Vehicle): string {
  return `${v.brand} ${v.model} ${v.version}`;
}

/** Titre court, sans version, pour les pages modèle. */
export function modelTitle(v: Vehicle): string {
  return `${v.brand} ${v.model}`;
}

export function vehicleSlug(v: Vehicle): string {
  return `${v.brandSlug}-${v.modelSlug}`;
}

export function vehicleHref(v: Vehicle, level: "brand" | "model" | "version" = "model"): string {
  const base = `/voitures-electriques/${v.brandSlug}`;
  if (level === "brand") return base;
  if (level === "model") return `${base}/${v.modelSlug}`;
  return `${base}/${v.modelSlug}/${v.versionSlug}`;
}
