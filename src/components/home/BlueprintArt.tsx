/**
 * Planche « fiche technique » du hero : profil de SUV en trait fin, trois annotations
 * (autonomie, batterie, recharge). SVG statique, décoratif (aria-hidden), aucune valeur
 * chiffrée : c'est une illustration, pas une donnée. Aucune image, aucun JavaScript.
 */
export function BlueprintArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 330"
      aria-hidden
      focusable="false"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cadre de planche aux coins coupés, comme la plaque du logo. */}
      <path d="M28 2H558V296L528 326H2V32Z" className="stroke-line-ink" strokeWidth="1.5" />

      {/* Profil de SUV (géométrie du sprite, agrandie). */}
      <g transform="translate(80 64) scale(2.5)" className="stroke-paper" strokeWidth="0.75">
        <path d="M20 52V36Q20 31 26 30L40 28Q42 10 58 9H120Q136 10 146 28L170 33Q180 35 180 44V52M60 5.5H118" />
        <path d="M46 28Q48 15 60 14H118Q130 15 138 28Z" />
        <path d="M20 52H39A13 13 0 0 1 65 52H135A13 13 0 0 1 161 52H180" />
        <circle cx="52" cy="54" r="9" />
        <circle cx="52" cy="54" r="2.5" />
        <circle cx="148" cy="54" r="9" />
        <circle cx="148" cy="54" r="2.5" />
      </g>

      {/* Autonomie : cote horizontale au-dessus du véhicule. */}
      <g className="stroke-ink-muted" strokeWidth="1.25">
        <path d="M130 50H530M130 42V58M530 42V58" />
        <path d="M130 50l8-4M130 50l8 4M530 50l-8-4M530 50l-8 4" />
      </g>
      <text x="330" y="32" textAnchor="middle" className="fill-ink-muted" fontSize="12" fontWeight="600" letterSpacing="1.6">
        AUTONOMIE · KM WLTP
      </text>

      {/* Batterie : bloc sous le plancher, entre les essieux. */}
      <rect x="244" y="176" width="172" height="14" rx="3" className="stroke-signal" strokeWidth="1.5" strokeDasharray="5 4" />
      <path d="M330 190V262" className="stroke-ink-muted" strokeWidth="1.25" />
      <circle cx="330" cy="183" r="3.5" className="fill-signal" stroke="none" />
      <text x="330" y="284" textAnchor="middle" className="fill-paper" fontSize="13" fontWeight="700" letterSpacing="1.6">
        BATTERIE
      </text>
      <text x="330" y="302" textAnchor="middle" className="fill-ink-muted" fontSize="12">
        kWh utiles
      </text>

      {/* Recharge : trappe sur l'aile arrière. */}
      <circle cx="150" cy="165" r="4.5" className="fill-signal" stroke="none" />
      <path d="M150 165L120 236V262" className="stroke-ink-muted" strokeWidth="1.25" />
      <text x="120" y="284" textAnchor="middle" className="fill-paper" fontSize="13" fontWeight="700" letterSpacing="1.6">
        RECHARGE
      </text>
      <text x="120" y="302" textAnchor="middle" className="fill-ink-muted" fontSize="12">
        kW AC / DC
      </text>
    </svg>
  );
}
