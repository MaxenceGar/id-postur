/**
 * /parcours.json — carte du parcours de réservation, lue par le dashboard
 * (écran « Parcours ») pour dessiner quel écran mène à quoi.
 *
 * GÉNÉRÉ au build : on rejoue l'aiguillage réel (src/lib/parcours-routage.ts)
 * sur toutes les combinaisons de réponses, donc la carte suit le site sans
 * rien recopier. Aucune donnée personnelle, seulement la structure.
 */

import type { APIRoute } from "astro";
import { BESOINS, CALCOM, ETAPES, RESULTATS } from "../data/parcours";
import { RESULTAT_DIRECT, suivant, type Reponses } from "../lib/parcours-routage";

/** Écran « refus » : ses deux boutons sont écrits dans la page /reserver. */
const REFUS = {
  id: "refus",
  question: "Commençons par votre étude posturale",
  choix: [
    { valeur: "etude", titre: "Réserver une étude posturale" },
    { valeur: "taille-velo", titre: "Vous achetez un vélo ?" },
  ],
};

const QUESTIONS = [
  { id: "besoin", question: "Que souhaitez-vous faire ?", choix: BESOINS.map((b) => ({ valeur: b.id, titre: b.titre })) },
  ...ETAPES.map((e) => ({ id: e.id, question: e.question, choix: e.choix.map((c) => ({ valeur: c.valeur, titre: c.titre })) })),
  REFUS,
];

/** `apresRefus` : lien emprunté seulement après l'écran « refus » (réponses déjà connues). */
type Lien = { de: string; vers: string; choix: string; libelle: string; apresRefus: boolean };

/** Parcourt toutes les réponses possibles depuis le premier écran. */
function explorer() {
  const liens = new Map<string, Lien>();
  const vus = new Set<string>();
  const file: { ecran: string; r: Reponses; refus: boolean }[] = [{ ecran: "besoin", r: {}, refus: false }];
  const parId = new Map(QUESTIONS.map((q) => [q.id, q]));

  while (file.length) {
    const { ecran, r, refus } = file.shift()!;
    const cle = `${ecran}|${refus}|${JSON.stringify(r)}`;
    if (vus.has(cle)) continue;
    vus.add(cle);
    const q = parId.get(ecran);
    if (!q) continue; // écran de résultat : fin du chemin
    for (const c of q.choix) {
      const suite = { ...r };
      const vers = suivant(ecran, c.valeur, suite);
      if (!vers) continue;
      const id = `${ecran}>${c.valeur}>${vers}`;
      const apresRefus = refus && (liens.get(id)?.apresRefus ?? true);
      liens.set(id, { de: ecran, vers, choix: c.valeur, libelle: c.titre, apresRefus });
      file.push({ ecran: vers, r: suite, refus: refus || ecran === "refus" });
    }
  }
  const d = RESULTAT_DIRECT;
  liens.set(`${d.depuis}>direct>${d.vers}`, { de: d.depuis, vers: d.vers, choix: "direct", libelle: d.libelle, apresRefus: false });
  return [...liens.values()];
}

export const GET: APIRoute = () => {
  const liens = explorer();
  const atteints = new Set(liens.map((l) => l.vers));
  const corps = {
    genere: new Date().toISOString(),
    calcom: { username: CALCOM.username },
    questions: QUESTIONS.map((q) => ({ ...q, atteint: q.id === "besoin" || atteints.has(q.id) })),
    resultats: RESULTATS.map((r) => ({
      id: `resultat-${r.id}`,
      titre: r.titre,
      prix: r.prix,
      duree: r.duree,
      dureeMinutes: r.dureeMinutes,
      calcomSlug: r.calcomSlug,
      secours: r.lien,
      aConfirmer: r.aConfirmer ?? null,
      atteint: atteints.has(`resultat-${r.id}`),
    })),
    liens,
    /** Écrans visés par l'aiguillage mais absents de la page : bug à corriger. */
    introuvables: [...atteints].filter(
      (id) => !QUESTIONS.some((q) => q.id === id) && !RESULTATS.some((r) => `resultat-${r.id}` === id),
    ),
  };
  return new Response(JSON.stringify(corps, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
};
