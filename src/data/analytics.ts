/**
 * Mesure d'audience — Google Analytics 4.
 *
 * Tant que l'ID est vide, rien n'est chargé : ni gtag.js ni bandeau cookies.
 * L'ID de mesure est public (il apparaît dans le HTML), il peut donc vivre ici
 * comme les autres données du site.
 */
export const GA4_ID = "G-R4XP38CF97";

/** Clé localStorage où est mémorisé le choix du visiteur. */
export const CLE_CONSENTEMENT = "idpostur-consentement";

/**
 * Durée de validité du choix : la CNIL recommande de redemander le
 * consentement au bout de 6 mois.
 */
export const DUREE_CONSENTEMENT_JOURS = 180;
