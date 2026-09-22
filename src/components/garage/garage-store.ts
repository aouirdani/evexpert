"use client";

/**
 * « Ma sélection » : jusqu'à 3 véhicules gardés en mémoire pour être comparés, sans compte
 * ni cookie de suivi — juste `localStorage`, sur cet appareil. Même schéma que le consentement
 * cookies (`CookieBanner.tsx`) : repli en mémoire si `localStorage` est indisponible (navigation
 * privée, données de site bloquées), événement custom pour que les composants restent synchronisés
 * entre eux (une carte ajoutée met à jour la barre flottante sans recharger la page).
 */
const STORAGE_KEY = "evexpert-garage";
const CHANGE_EVENT = "evexpert:garage";
export const GARAGE_MAX = 3;

// `useSyncExternalStore` exige que `getSnapshot()` renvoie la MÊME référence tant que rien n'a
// changé ; sans ce cache, `JSON.parse` construirait un nouveau tableau à chaque appel et React
// boucle indéfiniment (« Maximum update depth exceeded »). `cached` est donc la seule source
// lue par les composants ; `parse()` ne la remplace que si le contenu a réellement changé.
let cached: string[] = [];

function parse(): string[] {
  if (typeof window === "undefined") return cached;
  let next = cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    next = Array.isArray(ids) ? ids.filter((x): x is string => typeof x === "string").slice(0, GARAGE_MAX) : [];
  } catch {
    return cached;
  }
  if (next.length !== cached.length || next.some((id, i) => id !== cached[i])) cached = next;
  return cached;
}

function write(ids: string[]): void {
  cached = ids;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Repli mémoire : la sélection ne survit qu'à cette page vue.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function getGarageIds(): string[] {
  return parse();
}

export function isInGarage(id: string): boolean {
  return parse().includes(id);
}

/** Ajoute ou retire un véhicule. Retourne `false` si l'ajout est refusé (sélection pleine). */
export function toggleGarage(id: string): boolean {
  const ids = parse();
  if (ids.includes(id)) {
    write(ids.filter((x) => x !== id));
    return true;
  }
  if (ids.length >= GARAGE_MAX) return false;
  write([...ids, id]);
  return true;
}

export function clearGarage(): void {
  write([]);
}

export function subscribeGarage(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
