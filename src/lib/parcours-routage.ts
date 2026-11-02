/**
 * Aiguillage du parcours de réservation : quel écran vient après telle réponse.
 *
 * Une seule source pour la page /reserver (qui l'exécute dans le navigateur) et
 * pour /parcours.json (qui le parcourt en entier pour dessiner la carte du
 * parcours dans le dashboard). Modifier l'aiguillage ici suffit pour les deux.
 */

/** Réponses connues à un instant du parcours. */
export type Reponses = {
  besoin?: string;
  format?: string;
  client?: string;
};

/** Besoins réservés aux cyclistes déjà passés par une étude ID Postur. */
export const CLIENTS_SEULEMENT = ["nouveau-velo", "cales", "micro-reglage", "prolongateurs"];

/** Rendez-vous court → résultat correspondant. */
export const RESULTAT_COURT: Record<string, string> = {
  cales: "client-cales",
  "micro-reglage": "client-micro-reglage",
  prolongateurs: "client-prolongateurs",
};

/** Raccourci depuis l'écran « format » : l'étude des moins de 15 ans. */
export const RESULTAT_DIRECT = { depuis: "format", vers: "resultat-etude-moins-15", libelle: "Moins de 15 ans" };

/** Rendez-vous ouvert à tous, sans étude préalable : directement le récapitulatif. */
export const RESULTAT_OUVERT: Record<string, string> = {
  "taille-velo": "taille-velo",
};

/** Nouvelle étude : option selle en 2D, récapitulatif en 3D (selle comprise). */
function apresEtude(r: Reponses) {
  return r.format === "3d" ? "resultat-etude-3d-velo" : "selle";
}

/** Après le format : on saute ce qui est déjà connu (cas d'un refus). */
function apresFormat(r: Reponses) {
  if (r.client === "oui") return `resultat-client-etude-${r.format}`;
  return r.client === "non" ? apresEtude(r) : "client";
}

/**
 * Écran suivant selon l'écran courant et la réponse. Complète `r` avec la
 * réponse donnée (le modifie sur place).
 */
export function suivant(etape: string, choix: string, r: Reponses): string | undefined {
  switch (etape) {
    case "besoin":
      r.besoin = choix;
      if (RESULTAT_OUVERT[choix]) return `resultat-${RESULTAT_OUVERT[choix]}`;
      return CLIENTS_SEULEMENT.includes(choix) ? "client-court" : "format";
    case "format":
      if (choix === "aide") return "aide-chrono";
      r.format = choix;
      return apresFormat(r);
    case "aide-chrono":
      if (choix === "oui") {
        r.format = "3d";
        return apresFormat(r);
      }
      return "aide-route";
    case "aide-route":
      r.format = choix;
      return apresFormat(r);
    case "client":
      r.client = choix;
      if (choix === "oui") return `resultat-client-etude-${r.format}`;
      return apresEtude(r);
    case "selle":
      return `resultat-etude-2d-velo${choix === "avec" ? "-selle" : ""}`;
    case "client-court":
      if (choix === "non") return "refus";
      // Nouveau vélo d'un client : une nouvelle étude au tarif client, sur ce vélo.
      if (r.besoin === "nouveau-velo") {
        r.client = "oui";
        return "format";
      }
      return `resultat-${RESULTAT_COURT[r.besoin ?? ""]}`;
    case "refus":
      // Il vient de dire qu'il n'est pas client : on ne repose pas la question.
      for (const k of Object.keys(r) as (keyof Reponses)[]) delete r[k];
      if (RESULTAT_OUVERT[choix]) return `resultat-${RESULTAT_OUVERT[choix]}`;
      Object.assign(r, { besoin: "etude", client: "non" });
      return "format";
  }
}
