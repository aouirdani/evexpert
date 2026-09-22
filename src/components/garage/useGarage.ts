"use client";

import { useSyncExternalStore } from "react";
import { getGarageIds, subscribeGarage } from "./garage-store";

const emptyServerSnapshot = () => [] as string[];

/** Identifiants de « Ma sélection » ; toujours `[]` côté serveur et jusqu'à l'hydratation. */
export function useGarageIds(): string[] {
  return useSyncExternalStore(subscribeGarage, getGarageIds, emptyServerSnapshot);
}
