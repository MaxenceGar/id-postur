#!/usr/bin/env node
/**
 * Configure le compte Cal.com d'ID Postur pour le parcours /reserver :
 * horaires d'ouverture + un type de rendez-vous par prestation.
 *
 * Rejouable sans risque : crée ce qui manque, met à jour ce qui existe
 * (repéré par son slug), ne supprime jamais rien. C'est ce qui permettra de
 * reproduire la configuration sur le compte de Romain en une commande.
 *
 *   node scripts/calcom-config.mjs            → applique
 *   node scripts/calcom-config.mjs --essai    → affiche sans rien modifier
 *
 * Clé API : variable CALCOM_API_KEY, sinon ~/.config/id-postur/calcom.env.
 * ⚠ Cette clé donne accès à tout le compte : elle ne doit JAMAIS aller dans
 * le site (tout ce qu'il contient est public).
 */

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { ENTREPRISE } from "../src/data/entreprise.ts";

const ESSAI = process.argv.includes("--essai");
const API = "https://api.cal.com/v2";

const ADRESSE = `${ENTREPRISE.nom}, ${ENTREPRISE.adresse.rue}, ${ENTREPRISE.adresse.codePostal} ${ENTREPRISE.adresse.ville}`;

/** Horaires annoncés sur le site (ENTREPRISE.horaires). */
const HORAIRES = {
  jours: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  debut: ENTREPRISE.horaires.ouverture,
  fin: ENTREPRISE.horaires.fermeture,
};

/** Réglages communs à tous les types. */
const COMMUN = {
  locations: [{ type: "address", address: ADRESSE, public: true }],
  minimumBookingNotice: 24 * 60, // 24 h
  // ~6 mois. « rolling: true » est plafonné à 61 jours par Cal.com.
  bookingWindow: { type: "calendarDays", value: 183, rolling: false },
};

/**
 * Un type par prestation. Les slugs doivent correspondre aux `calcomSlug`
 * de src/data/parcours.ts (vérifié plus bas). « PROVISOIRE » = en attente
 * de la validation de Romain (questions Q1 à Q6 du FigJam).
 */
const TYPES = [
  {
    slug: "etude-posturale-3d",
    title: "Étude posturale 3D",
    lengthInMinutes: 150,
    description: "Première étude posturale 3D (capture STT 3DMA), sur votre vélo ou sur le vélo du studio.",
  },
  {
    slug: "etude-posturale-2d",
    title: "Étude posturale 2D",
    lengthInMinutes: 90,
    description: "Première étude posturale 2D (analyse vidéo STT 2DMA), route, VTT et gravel.",
  },
  {
    slug: "etude-posturale-2d-selle",
    title: "Étude posturale 2D + pression de selle",
    lengthInMinutes: 90, // PROVISOIRE (Q2)
    description: "Première étude posturale 2D avec cartographie de pression de selle (Velometrik).",
  },
  {
    slug: "etude-moins-15-ans",
    title: "Étude posturale moins de 15 ans",
    lengthInMinutes: 90,
    description: "Étude posturale 2D pour les jeunes cyclistes de moins de 15 ans.",
  },
  {
    slug: "client-etude-3d",
    title: "Nouvelle étude posturale 3D (client)",
    lengthInMinutes: 150,
    description: "Nouvelle étude 3D pour un cycliste déjà venu chez ID Postur.",
  },
  {
    slug: "client-etude-2d",
    title: "Nouvelle étude posturale 2D (client)",
    lengthInMinutes: 90,
    description: "Nouvelle étude 2D pour un cycliste déjà venu chez ID Postur.",
  },
  {
    slug: "mise-en-position-3d",
    title: "Mise en position 3D d'un nouveau vélo",
    lengthInMinutes: 60, // PROVISOIRE (Q6)
    description: "Report de la position mesurée en 3D sur votre nouveau vélo.",
  },
  {
    slug: "mise-en-position-2d",
    title: "Mise en position 2D d'un nouveau vélo",
    lengthInMinutes: 60, // PROVISOIRE (Q6)
    description: "Report de la position mesurée en 2D sur votre nouveau vélo.",
  },
  {
    slug: "reglage-cales",
    title: "Réglage des chaussures et/ou cales",
    lengthInMinutes: 20,
    description: "Positionnement de vos cales au millimètre. Réservé aux clients ID Postur.",
  },
  {
    slug: "micro-reglage",
    title: "Micro-réglage",
    lengthInMinutes: 20,
    description: "Retouche sur un vélo déjà réglé par Romain. Réservé aux clients ID Postur.",
  },
  {
    slug: "prolongateurs",
    title: "Pose et réglage de prolongateurs",
    lengthInMinutes: 20,
    description: "Montage et réglage de prolongateurs. Réservé aux clients ID Postur.",
  },
  {
    slug: "choix-taille-velo",
    title: "Choix de la taille de votre futur vélo",
    lengthInMinutes: 20,
    description: "Validation de la taille et de l'ergonomie avant l'achat. Réservé aux clients ID Postur.",
  },
];

/* ------------------------------------------------------------------------ */

function cle() {
  if (process.env.CALCOM_API_KEY) return process.env.CALCOM_API_KEY;
  try {
    const fichier = readFileSync(`${homedir()}/.config/id-postur/calcom.env`, "utf8");
    return fichier.match(/^CALCOM_API_KEY=(.+)$/m)?.[1].trim();
  } catch {
    return undefined;
  }
}

const CLE = cle();
if (!CLE) {
  console.error("Clé API introuvable (CALCOM_API_KEY ou ~/.config/id-postur/calcom.env).");
  process.exit(1);
}

async function appel(methode, chemin, version, corps) {
  const r = await fetch(API + chemin, {
    method: methode,
    headers: {
      Authorization: `Bearer ${CLE}`,
      "cal-api-version": version,
      ...(corps && { "Content-Type": "application/json" }),
    },
    body: corps && JSON.stringify(corps),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok || json.status !== "success") {
    throw new Error(`${methode} ${chemin} → ${r.status} ${JSON.stringify(json.error ?? json)}`);
  }
  return json.data;
}

/** Garde-fou : chaque slug utilisé par le site doit exister ici. */
function verifierParcours() {
  const source = readFileSync(new URL("../src/data/parcours.ts", import.meta.url), "utf8");
  const utilises = new Set([...source.matchAll(/calcomSlug: "([^"]+)"/g)].map((m) => m[1]));
  const definis = new Set(TYPES.map((t) => t.slug));
  const manquants = [...utilises].filter((s) => !definis.has(s));
  if (manquants.length) {
    console.error("Slugs utilisés par le site mais absents du script :", manquants.join(", "));
    process.exit(1);
  }
  const inutilises = [...definis].filter((s) => !utilises.has(s));
  if (inutilises.length) console.warn("Types créés mais pas encore utilisés par le site :", inutilises.join(", "));
}

async function main() {
  verifierParcours();
  console.log(ESSAI ? "Mode essai : rien ne sera modifié.\n" : "");

  // 1. Horaires
  const horaire = await appel("GET", "/schedules/default", "2024-06-11");
  const voulu = [{ days: HORAIRES.jours, startTime: HORAIRES.debut, endTime: HORAIRES.fin }];
  if (JSON.stringify(horaire.availability) === JSON.stringify(voulu) && horaire.timeZone === "Europe/Paris") {
    console.log(`= Horaires « ${horaire.name} » déjà à jour (lun.–ven. ${HORAIRES.debut}–${HORAIRES.fin})`);
  } else {
    console.log(`~ Horaires « ${horaire.name} » → lun.–ven. ${HORAIRES.debut}–${HORAIRES.fin}, Europe/Paris`);
    if (!ESSAI) {
      await appel("PATCH", `/schedules/${horaire.id}`, "2024-06-11", {
        timeZone: "Europe/Paris",
        availability: voulu,
      });
    }
  }

  // 2. Types de rendez-vous
  const existants = await appel("GET", "/event-types", "2024-06-14");
  for (const type of TYPES) {
    const corps = { ...COMMUN, ...type, scheduleId: horaire.id };
    const existant = existants.find((e) => e.slug === type.slug);
    if (existant) {
      console.log(`~ ${type.slug} (${type.lengthInMinutes} min) : mis à jour`);
      if (!ESSAI) await appel("PATCH", `/event-types/${existant.id}`, "2024-06-14", corps);
    } else {
      console.log(`+ ${type.slug} (${type.lengthInMinutes} min) : créé`);
      if (!ESSAI) await appel("POST", "/event-types", "2024-06-14", corps);
    }
  }
  console.log("\nTerminé.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
