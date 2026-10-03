import type { EditorialImage, ImageCredit } from "@/types";

/**
 * Photographies sous licence libre compatible avec un usage commercial, enregistrées avec leur provenance.
 * Règles : sources autorisées = Unsplash (licence Unsplash, hors Unsplash+), Pexels, Pixabay pour les
 * images génériques ; Wikimedia Commons (licence vérifiée image par image) ou espaces presse des
 * constructeurs (conditions d'usage lues) pour un modèle précis. Jamais d'image récupérée sans licence
 * explicite. Chaque entrée garde l'URL source, l'auteur, la licence et son lien, la date de récupération.
 *
 * Fichiers préparés dans public/editorial/licences : JPEG 1600 × 900 (16:9, servi en AVIF/WebP par
 * next/image) et dérivé Open Graph 1200 × 630.
 */

const UNSPLASH_LICENSE = {
  license: "Licence Unsplash",
  licenseUrl: "https://unsplash.com/license",
  attributionRequired: false,
} as const;

function photo(args: {
  file: string;
  alt: string;
  caption: string;
  credit: Omit<ImageCredit, "license" | "licenseUrl" | "attributionRequired"> & Partial<ImageCredit>;
}): EditorialImage {
  return {
    src: `/editorial/licences/${args.file}.jpeg`,
    share: `/editorial/licences/${args.file}-og.jpeg`,
    shareHeight: 630,
    width: 1600,
    height: 900,
    alt: args.alt,
    caption: args.caption,
    credit: { ...UNSPLASH_LICENSE, ...args.credit },
  };
}

/** Prioritaire sur les illustrations générées par IA (EDITORIAL_PHOTOS) quand les deux existent. */
export const EDITORIAL_LICENSED: Record<string, { image: EditorialImage; schemaAfter?: string }> = {
  "temps-recharge-voiture-electrique": {
    image: photo({
      file: "temps-recharge-voiture-electrique",
      alt: "Main d'une personne qui enfonce le connecteur d'un câble de recharge dans la trappe latérale d'une voiture électrique blanche, en contre-jour.",
      caption: "Brancher le câble ne suffit pas à prévoir la durée : elle dépend de l'énergie à ajouter et de la puissance réellement disponible.",
      credit: {
        sourceName: "Unsplash",
        sourceUrl: "https://unsplash.com/photos/electric-vehicle-charging-with-cable-2jRNVr0ac7s",
        author: "Zaptec",
        authorUrl: "https://unsplash.com/@zaptec",
        retrievedAt: "2026-10-03",
        modifications: "Recadrage 16:9 (1600 × 900) et dérivé Open Graph 1200 × 630, recompression JPEG.",
      },
    }),
  },
};
