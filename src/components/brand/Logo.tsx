import { cn } from "@/lib/utils";
import { MARK } from "./geometry";

type Tone = "light" | "dark";

/**
 * Symbole EVExpert en SVG inline (~300 octets, aucune requête réseau).
 * `tone="light"` : plaque encre, pour fonds clairs. `tone="dark"` : plaque relevée
 * + filet, pour fonds encre. Le lime « signal » reste le même sur les deux.
 */
export function LogoMark({ tone = "light", className }: { tone?: Tone; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden focusable="false" className={cn("shrink-0", className)}>
      <path
        d={MARK.plate}
        className={tone === "dark" ? "fill-ink-raised stroke-line-ink" : "fill-ink"}
        strokeWidth={tone === "dark" ? 1 : 0}
      />
      <path d={MARK.e} className="fill-paper" />
      <circle cx={MARK.dot.cx} cy={MARK.dot.cy} r={MARK.dot.r} className="fill-signal" />
    </svg>
  );
}

/**
 * Logo complet : symbole + mot-symbole. « EV » en 800, « Expert » en 500, dans la
 * police du site (déjà chargée : le texte reste du vrai texte, sélectionnable et net).
 * À placer dans un lien portant un aria-label ; le symbole est décoratif.
 */
export function Logo({ tone = "light", className }: { tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} className="h-9 w-9" />
      <span
        className={cn(
          "text-[1.375rem] leading-none tracking-[-0.02em]",
          tone === "dark" ? "text-paper" : "text-ink",
        )}
      >
        <span className="font-extrabold">EV</span>
        <span className="font-medium">Expert</span>
      </span>
    </span>
  );
}
