/**
 * Parcours de réservation « pas à pas » de /reserver.
 *
 * Le cycliste répond à quelques questions (besoin, format, déjà client…) et
 * arrive sur UNE prestation, au bon tarif, réservable directement dans la page.
 * C'est ce qui empêche de réserver un créneau « déjà client » ou un
 * rendez-vous court sans être passé par une étude.
 *
 * ⚠ PROTOTYPE : les prix, durées et liens marqués `aConfirmer` attendent la
 * validation de Romain (questions Q1 à Q6 du FigJam « ID Postur Prestation »).
 * La réservation passe par Cal.com (CALCOM ci-dessous) ; le `lien` Calendly ne
 * sert plus que de secours si Cal.com ne répond pas.
 */

import { getPrestation } from "./tarifs";

const etude3D = getPrestation("etude-posturale-3d");
const etude2D = getPrestation("etude-posturale-2d");
const etude3DClient = getPrestation("etude-posturale-3d-deja-client");
const etude2DClient = getPrestation("etude-posturale-2d-deja-client");
const moins15 = getPrestation("etude-moins-de-15-ans");
const cales = getPrestation("reglage-cales");
const choixVelo = getPrestation("choix-nouveau-velo");
const rdvDivers = getPrestation("rendez-vous-divers");

/**
 * Compte Cal.com de Romain. Tant que `username` vaut null, l'écran de
 * réservation tourne en DÉMO : créneaux factices, aucune réservation réelle.
 * Le `calcomSlug` de chaque résultat est l'identifiant du type de rendez-vous
 * dans Cal.com (cal.com/id-postur/<slug>). Plusieurs résultats peuvent
 * partager le même type, ex. l'étude 3D sur son vélo ou sur celui du studio.
 */
export const CALCOM = {
  username: "id-postur" as string | null,
  timeZone: "Europe/Paris",
};

export type Besoin =
  | "etude"
  | "nouveau-velo"
  | "cales"
  | "micro-reglage"
  | "prolongateurs"
  | "taille-velo";

export interface ChoixBesoin {
  id: Besoin;
  titre: string;
  detail: string;
  /** Nom d'icône, cf. ICONES dans /reserver. */
  icone: string;
  /** Réservé aux cyclistes déjà passés par une étude ID Postur. */
  clientsSeulement: boolean;
}

/** Étape 1 — « Que souhaitez-vous faire ? » */
export const BESOINS: ChoixBesoin[] = [
  {
    id: "etude",
    titre: "Une étude posturale",
    detail:
      "L'analyse complète de votre position, sur votre vélo ou pour définir la taille de votre futur vélo.",
    icone: "etude",
    clientsSeulement: false,
  },
  {
    id: "nouveau-velo",
    titre: "Régler mon nouveau vélo",
    detail: "Reporter votre position sur le vélo que vous venez d'acheter.",
    icone: "velo",
    clientsSeulement: true,
  },
  {
    id: "cales",
    titre: "Régler mes cales ou mes chaussures",
    detail: "Nouvelles chaussures, nouvelles cales : on les positionne au millimètre.",
    icone: "cible",
    clientsSeulement: true,
  },
  {
    id: "micro-reglage",
    titre: "Un micro-réglage",
    detail: "Une retouche sur un vélo déjà réglé par Romain.",
    icone: "cle",
    clientsSeulement: true,
  },
  {
    id: "prolongateurs",
    titre: "Ajouter des prolongateurs",
    detail: "Monter et régler des prolongateurs sur votre vélo.",
    icone: "prolongateurs",
    clientsSeulement: true,
  },
  {
    id: "taille-velo",
    titre: "Choisir la taille de mon futur vélo",
    detail: "Valider la taille et l'ergonomie avant d'acheter.",
    icone: "regle",
    clientsSeulement: true,
  },
];

export interface Resultat {
  id: string;
  titre: string;
  /** Une ligne sous le titre : à qui s'adresse la prestation. */
  pourQui: string;
  prix: string;
  duree: string;
  disciplines?: string;
  aApporter: string[];
  note?: string;
  /** Lien Calendly de secours si Cal.com ne répond pas (null : on propose le téléphone). */
  lien: string | null;
  /** Durée du créneau à bloquer dans l'agenda, en minutes. */
  dureeMinutes: number;
  /** Type de rendez-vous Cal.com correspondant (slug prévu, à créer). */
  calcomSlug: string;
  /** Points à valider avec Romain (affichés tant que le site est en prototype). */
  aConfirmer?: string;
}

const APPORTER_ETUDE = [
  "Votre vélo",
  "Votre tenue complète (cuissard et maillot)",
  "Vos chaussures et vos cales",
];
const APPORTER_ETUDE_STUDIO = [
  "Votre tenue complète (cuissard et maillot)",
  "Vos chaussures et vos cales",
  "Le modèle du vélo que vous visez, si vous l'avez déjà repéré",
];
const APPORTER_COURT = ["Votre vélo", "Vos chaussures et vos cales", "Votre tenue de vélo"];

/** Écran final : une prestation par combinaison de réponses. */
export const RESULTATS: Resultat[] = [
  // — Nouveau client, étude 3D
  {
    id: "etude-3d-velo",
    dureeMinutes: 150,
    calcomSlug: "etude-posturale-3d",
    titre: "Étude posturale 3D",
    pourQui: "Première étude, sur votre vélo",
    prix: `${etude3D.price} €`,
    duree: etude3D.duration,
    disciplines: etude3D.disciplines,
    aApporter: APPORTER_ETUDE,
    note: "Pression de selle (Velometrik) comprise. Évitez les vêtements réfléchissants : ils perturbent la captation 3D.",
    lien: etude3D.link,
  },
  {
    id: "etude-3d-studio",
    dureeMinutes: 150,
    calcomSlug: "etude-posturale-3d",
    titre: "Étude posturale 3D sur le vélo du studio",
    pourQui: "Première étude, pour définir la taille exacte de votre futur vélo",
    prix: `${etude3D.price} €`,
    duree: etude3D.duration,
    disciplines: etude3D.disciplines,
    aApporter: APPORTER_ETUDE_STUDIO,
    note: "Pression de selle (Velometrik) comprise. Une fois votre vélo acheté, on fixe ensemble un rendez-vous pour le régler.",
    lien: etude3D.link,
    aConfirmer:
      "Même type de rendez-vous que l'étude 3D sur son vélo, ou un type dédié ? (Q3) · Nom du vélo du studio (Q4)",
  },
  // — Nouveau client, étude 2D
  {
    id: "etude-2d-velo",
    dureeMinutes: 90,
    calcomSlug: "etude-posturale-2d",
    titre: "Étude posturale 2D",
    pourQui: "Première étude, sur votre vélo",
    prix: `${etude2D.price} €`,
    duree: etude2D.duration,
    disciplines: etude2D.disciplines,
    aApporter: APPORTER_ETUDE,
    note: etude2D.note,
    lien: etude2D.link,
  },
  {
    id: "etude-2d-velo-selle",
    dureeMinutes: 90,
    calcomSlug: "etude-posturale-2d-selle",
    titre: "Étude posturale 2D + pression de selle",
    pourQui: "Première étude, sur votre vélo, avec cartographie de pression de selle (Velometrik)",
    prix: `${etude2D.price + 30} €`,
    duree: etude2D.duration,
    disciplines: etude2D.disciplines,
    aApporter: APPORTER_ETUDE,
    note: etude2D.note,
    lien: null,
    aConfirmer: "Type de rendez-vous « 2D + selle » séparé, ou simple question au moment de réserver ? (Q2)",
  },
  {
    id: "etude-2d-studio",
    dureeMinutes: 90,
    calcomSlug: "etude-posturale-2d",
    titre: "Étude posturale 2D sur le vélo du studio",
    pourQui: "Première étude, pour définir la taille exacte de votre futur vélo",
    prix: `${etude2D.price} €`,
    duree: etude2D.duration,
    disciplines: etude2D.disciplines,
    aApporter: APPORTER_ETUDE_STUDIO,
    note: "Une fois votre vélo acheté, on fixe ensemble un rendez-vous pour le régler.",
    lien: etude2D.link,
    aConfirmer: "Même type de rendez-vous que l'étude 2D sur son vélo, ou un type dédié ? (Q3) · Nom du vélo du studio (Q4)",
  },
  {
    id: "etude-2d-studio-selle",
    dureeMinutes: 90,
    calcomSlug: "etude-posturale-2d-selle",
    titre: "Étude posturale 2D sur le vélo du studio + pression de selle",
    pourQui: "Première étude pour définir la taille de votre futur vélo, avec cartographie de pression de selle",
    prix: `${etude2D.price + 30} €`,
    duree: etude2D.duration,
    disciplines: etude2D.disciplines,
    aApporter: APPORTER_ETUDE_STUDIO,
    note: "Une fois votre vélo acheté, on fixe ensemble un rendez-vous pour le régler.",
    lien: null,
    aConfirmer: "Type « 2D + selle » séparé ou non (Q2, Q3)",
  },
  {
    id: "etude-moins-15",
    dureeMinutes: 90,
    calcomSlug: "etude-moins-15-ans",
    titre: moins15.title,
    pourQui: "Pour les jeunes cyclistes de moins de 15 ans",
    prix: `${moins15.price} €`,
    duree: moins15.duration,
    disciplines: moins15.disciplines,
    aApporter: APPORTER_ETUDE,
    note: "Tarif unique : la croissance modifie les mesures, l'étude est refaite entièrement à chaque venue.",
    lien: moins15.link,
  },
  // — Ancien client
  {
    id: "client-etude-3d",
    dureeMinutes: 150,
    calcomSlug: "client-etude-3d",
    titre: "Nouvelle étude posturale 3D",
    pourQui: "Tarif client : nous avons déjà vos mesures",
    prix: `${etude3DClient.price} €`,
    duree: etude3DClient.duration,
    disciplines: etude3DClient.disciplines,
    aApporter: APPORTER_ETUDE,
    lien: etude3DClient.link,
    aConfirmer: "Prix ancien client inchangé ? (Q1)",
  },
  {
    id: "client-etude-2d",
    dureeMinutes: 90,
    calcomSlug: "client-etude-2d",
    titre: "Nouvelle étude posturale 2D",
    pourQui: "Tarif client : nous avons déjà vos mesures",
    prix: `${etude2DClient.price} €`,
    duree: etude2DClient.duration,
    disciplines: etude2DClient.disciplines,
    aApporter: APPORTER_ETUDE,
    note: etude2DClient.note,
    lien: etude2DClient.link,
    aConfirmer: "Prix ancien client inchangé ? (Q1)",
  },
  {
    id: "client-mise-en-position-3d",
    dureeMinutes: 60,
    calcomSlug: "mise-en-position-3d",
    titre: "Mise en position 3D de votre nouveau vélo",
    pourQui: "On reporte votre position, mesurée en 3D, sur votre nouveau vélo",
    prix: "180 €",
    duree: "À confirmer",
    aApporter: ["Votre nouveau vélo", "Vos chaussures et vos cales", "Votre tenue complète"],
    lien: null,
    aConfirmer: "Durée provisoire d'1 h (Q6) · C'est bien le rendez-vous qui suit une étude sur le vélo du studio ? (Q6)",
  },
  {
    id: "client-mise-en-position-2d",
    dureeMinutes: 60,
    calcomSlug: "mise-en-position-2d",
    titre: "Mise en position 2D de votre nouveau vélo",
    pourQui: "On reporte votre position, mesurée en 2D, sur votre nouveau vélo",
    prix: "120 €",
    duree: "À confirmer",
    aApporter: ["Votre nouveau vélo", "Vos chaussures et vos cales", "Votre tenue complète"],
    lien: null,
    aConfirmer: "Durée provisoire d'1 h (Q6) · Même prix que l'étude 2D ancien client, c'est voulu ? (Q1)",
  },
  {
    id: "client-cales",
    dureeMinutes: 20,
    calcomSlug: "reglage-cales",
    titre: "Réglage de vos chaussures et/ou cales",
    pourQui: "Rendez-vous court, réservé aux clients ID Postur",
    prix: `${cales.price} €`,
    duree: cales.duration,
    aApporter: APPORTER_COURT,
    lien: cales.link,
    aConfirmer: "Prix des rendez-vous de 20 min inchangé ? (Q1)",
  },
  {
    id: "client-micro-reglage",
    dureeMinutes: 20,
    calcomSlug: "micro-reglage",
    titre: "Micro-réglage de votre vélo",
    pourQui: "Sur un vélo déjà réglé par Romain",
    prix: `${rdvDivers.price} €`,
    duree: rdvDivers.duration,
    aApporter: APPORTER_COURT,
    lien: rdvDivers.link,
    aConfirmer: "Prix des rendez-vous de 20 min inchangé ? (Q1)",
  },
  {
    id: "client-prolongateurs",
    dureeMinutes: 20,
    calcomSlug: "prolongateurs",
    titre: "Pose et réglage de prolongateurs",
    pourQui: "Rendez-vous court, réservé aux clients ID Postur",
    prix: "30 €",
    duree: "20 minutes",
    aApporter: ["Votre vélo", "Vos prolongateurs", "Vos chaussures et vos cales"],
    lien: null,
    aConfirmer: "Prix à confirmer (Q1)",
  },
  {
    id: "client-taille-velo",
    dureeMinutes: 20,
    calcomSlug: "choix-taille-velo",
    titre: "Choix de la taille de votre futur vélo",
    pourQui: "Rendez-vous court, réservé aux clients ID Postur",
    prix: `${choixVelo.price} €`,
    duree: choixVelo.duration,
    aApporter: choixVelo.equipment.map((e) => e.replace(/^•\s*/, "")),
    lien: choixVelo.link,
    aConfirmer: "Prix des rendez-vous de 20 min inchangé ? (Q1)",
  },
];
