/**
 * Informations d'identification de l'éditeur, lues dans l'environnement pour
 * ne jamais figer de coordonnées dans le dépôt. Les champs absents ne sont pas
 * affichés. À renseigner avant toute demande AdSense (voir README).
 */
function env(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t ? t : undefined;
}

export const legalConfig = {
  publisherName: env(process.env.NEXT_PUBLIC_PUBLISHER_NAME),
  publisherStatus: env(process.env.NEXT_PUBLIC_PUBLISHER_STATUS),
  publisherAddress: env(process.env.NEXT_PUBLIC_PUBLISHER_ADDRESS),
  publicationDirector: env(process.env.NEXT_PUBLIC_PUBLICATION_DIRECTOR),
} as const;
