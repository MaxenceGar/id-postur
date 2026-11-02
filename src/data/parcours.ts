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

import { formatPrix, getPrestation } from "./tarifs";

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
 * partager le même type, ex. la selle et l'étude 2D sur son vélo.
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
      "L'analyse complète de votre position, sur votre vélo.",
    icone: "etude",
    clientsSeulement: false,
  },
  {
    id: "nouveau-velo",
    titre: "Régler mon nouveau vélo",
    detail: "Une nouvelle étude sur le vélo que vous venez d'acheter, au tarif client.",
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
    detail: "20 min sur le Zwift Ride du studio, pour connaître la taille exacte à acheter.",
    icone: "regle",
    clientsSeulement: false,
  },
];

/** Les choix d'une étape : [valeur, titre, détail, icône]. */
export type Choix = { valeur: string; titre: string; detail?: string; icone?: string; badge?: string };

/** Étapes 2 et suivantes (l'aiguillage est dans src/lib/parcours-routage.ts). */
export const ETAPES: { id: string; question: string; aide?: string; choix: Choix[] }[] = [
  {
    id: "format",
    question: "Quel format d'étude ?",
    aide: "Les deux se font avec la capture de mouvement STT. La 3D est la plus complète.",
    choix: [
      {
        valeur: "3d",
        titre: "Étude 3D",
        detail: `${etude3D.duration} · ${formatPrix(etude3D.price)}, ${formatPrix(etude3DClient.price)} si vous êtes déjà client · toutes disciplines, chrono et triathlon compris`,
        badge: "3D",
      },
      {
        valeur: "2d",
        titre: "Étude 2D",
        detail: `${etude2D.duration} · ${formatPrix(etude2D.price)}, ${formatPrix(etude2DClient.price)} si vous êtes déjà client · route, VTT et gravel`,
        badge: "2D",
      },
      {
        valeur: "aide",
        titre: "Je ne sais pas, aidez-moi à choisir",
        icone: "aide",
      },
    ],
  },
  {
    id: "aide-chrono",
    question: "Roulez-vous en chrono ou en triathlon ?",
    choix: [
      { valeur: "oui", titre: "Oui", detail: "Vélo de chrono ou de triathlon", icone: "chrono" },
      { valeur: "non", titre: "Non", detail: "Route, VTT ou gravel", icone: "velo" },
    ],
  },
  {
    id: "aide-route",
    question: "Les deux formats vous conviennent",
    aide: "La 3D analyse votre position dans les trois plans : elle repère aussi les asymétries gauche/droite et les désalignements des genoux ou du bassin. La 2D, en vue latérale, va à l'essentiel en moins de temps.",
    choix: [
      {
        valeur: "3d",
        titre: "Je choisis la 3D",
        detail: `L'analyse la plus complète · ${etude3D.duration}`,
        badge: "3D",
      },
      {
        valeur: "2d",
        titre: "Je choisis la 2D",
        detail: `Plus courte · ${etude2D.duration}`,
        badge: "2D",
      },
    ],
  },
  {
    id: "client",
    question: "Avez-vous déjà fait une étude posturale complète chez ID Postur ?",
    aide: "Ne compte pas : une étude faite ailleurs, un réglage de cales, un conseil d'achat ou un rendez-vous court.",
    choix: [
      { valeur: "non", titre: "Non, c'est ma première", detail: "Nous partons de zéro", icone: "non" },
      { valeur: "oui", titre: "Oui, je suis déjà venu", detail: "Tarif client : nous avons déjà vos mesures", icone: "oui" },
    ],
  },
  {
    id: "selle",
    question: "Ajouter la cartographie de pression de selle ?",
    aide: "Le capteur Velometrik montre comment votre poids se répartit sur la selle : utile en cas d'inconfort ou pour choisir une selle.",
    choix: [
      { valeur: "avec", titre: "Oui, avec la pression de selle", detail: "+30 €", icone: "selle" },
      { valeur: "sans", titre: "Non merci", detail: "L'étude 2D seule", icone: "non" },
    ],
  },
  {
    id: "client-court",
    question: "Avez-vous déjà fait une étude posturale complète chez ID Postur ?",
    aide: "Ce rendez-vous court part des mesures de votre étude : il est réservé aux cyclistes déjà passés chez ID Postur.",
    choix: [
      { valeur: "oui", titre: "Oui, je suis déjà venu", icone: "oui" },
      { valeur: "non", titre: "Non, pas encore", icone: "non" },
    ],
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
  /** Lien Calendly de secours si Cal.com ne répond pas (null : on propose l'e-mail). */
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
  },
  {
    id: "taille-velo",
    dureeMinutes: 20,
    calcomSlug: "choix-taille-velo",
    titre: "Choix de la taille de votre futur vélo",
    pourQui: "Sur le Zwift Ride du studio, avant d'acheter votre vélo",
    prix: `${choixVelo.price} €`,
    duree: choixVelo.duration,
    aApporter: choixVelo.equipment.map((e) => e.replace(/^•\s*/, "")),
    lien: choixVelo.link,
  },
];
