import type { ImageCredit } from "@/types";

const rel = "noopener noreferrer nofollow";

/**
 * Crédit d'une photographie sous licence libre : auteur, source et licence, avec leurs liens. Affiché
 * sous chaque image licenciée, même quand la licence (Unsplash) n'impose pas de crédit : la provenance
 * reste vérifiable par le lecteur.
 */
export function ImageCreditLine({ credit }: { credit: ImageCredit }) {
  return (
    <p className="mt-1 max-w-2xl text-caption text-muted">
      Photo :{" "}
      <a href={credit.authorUrl} target="_blank" rel={rel} className="link-u font-semibold text-signal-deep">
        {credit.author}
      </a>
      {" · "}
      <a href={credit.sourceUrl} target="_blank" rel={rel} className="link-u font-semibold text-signal-deep">
        {credit.sourceName}
      </a>
      {" · "}
      <a href={credit.licenseUrl} target="_blank" rel={rel} className="link-u font-semibold text-signal-deep">
        {credit.license}
      </a>
    </p>
  );
}
