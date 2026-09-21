/**
 * Hypothèses par défaut des calculateurs et des fiches véhicules.
 * Ce sont des valeurs de départ MODIFIABLES par l'utilisateur, choisies par
 * EVExpert pour illustrer un cas courant. Elles ne sont PAS issues d'un relevé
 * officiel : vérifiez votre propre contrat d'électricité et les prix affichés
 * en station. Elles sont regroupées ici pour être mises à jour en un seul endroit.
 */
export const ASSUMPTIONS_UPDATED_AT = "2026-09-21";

export const ASSUMPTIONS = {
  /** Prix du kWh à domicile (€/kWh TTC). */
  homePrice: 0.25,
  /** Prix du kWh sur borne publique AC (€/kWh TTC). */
  publicAcPrice: 0.45,
  /** Prix du kWh en recharge rapide DC (€/kWh TTC). */
  fastDcPrice: 0.65,
  /** Prix du litre d'essence (€/L TTC). */
  petrolPrice: 1.75,
  /** Prix du litre de gazole (€/L TTC). */
  dieselPrice: 1.65,
  /** Rendement de charge (% de l'énergie tirée du réseau stockée en batterie). */
  chargingEfficiency: 90,
  /** Kilométrage annuel de référence. */
  annualKm: 12000,
} as const;
