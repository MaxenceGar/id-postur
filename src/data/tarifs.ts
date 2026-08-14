/**
 * Source unique de vérité pour les tarifs, durées et prérequis ID Postur.
 *
 * Toute modification de prix ou de durée se fait ICI et nulle part ailleurs :
 * les pages, les FAQ visibles et les JSON-LD lisent ces valeurs.
 */

export interface Prestation {
  /** Identifiant technique, sert de clé et d'ancre. */
  slug: string;
  /** Bandeau rouge affiché au-dessus de la carte. */
  baseline: string;
  title: string;
  description: string;
  /** Prix en euros, sans symbole (utilisé aussi par les JSON-LD Offer). */
  price: number;
  /** Durée lisible par un humain, ex. "2h30". */
  duration: string;
  /** Même durée au format ISO 8601, pour schema.org. */
  durationISO: string;
  /** Liste "Équipement à apporter". */
  equipment: string[];
  /** Avertissement affiché sous la liste d'équipement (optionnel). */
  note?: string;
  /** Lien de réservation Calendly. */
  link: string;
  /** Page interne détaillant la prestation. */
  page: string;
  /** Tarif réservé aux cyclistes déjà venus chez ID Postur. */
  dejaClient?: boolean;
  /** Disciplines couvertes par ce format. */
  disciplines: string;
}

/**
 * TODO — Seul l'événement Calendly « moins de 15 ans » reste à créer.
 * En attendant, cette offre pointe vers la page Calendly générale : le
 * visiteur choisit lui-même, aucun lien ne renvoie vers une ancienne
 * formule au mauvais tarif.
 */
const CALENDLY_A_DEFINIR = "https://calendly.com/idpostur";

/** Équipement commun à toutes les études posturales. */
const EQUIPEMENT_ETUDE = [
  "• Votre vélo",
  "• Votre tenue complète (cuissard + maillot)",
  "• Vos chaussures et vos cales",
  "• Les pièces spécifiques à votre vélo",
];

/**
 * Les positions de chrono et de triathlon ne sont pas couvertes par l'analyse
 * 2D. Message affiché sur toutes les cartes 2D, pour éviter qu'un triathlète
 * réserve un créneau qui ne peut pas le prendre en charge.
 */
export const RESTRICTION_2D =
  "Non disponible pour les vélos de chrono et de triathlon : ces positions nécessitent l'étude 3D.";

/** La captation 3D est perturbée par les matières réfléchissantes. */
const NOTE_3D =
  "À savoir : évitez les vêtements réfléchissants, ils perturbent la captation 3D.";

const DISCIPLINES_TOUTES = "Route, VTT, gravel, chrono et triathlon";
const DISCIPLINES_2D = "Route, VTT et gravel";

/**
 * Équipes citées sur la page comparative.
 *
 * ⚠ Formulation à ne pas modifier sans réfléchir : on affirme uniquement que
 * ces équipes utilisent l'analyse 3D pour leurs études posturales. Écrire
 * qu'elles travaillent avec ID Postur, ou qu'elles utilisent IDmatch BikeLab,
 * serait une revendication que rien ne permet d'appuyer.
 */
export const EQUIPES_3D = [
  "Ineos",
  "Team Visma | Lease a Bike",
  "SN Cycling Team",
];

/** Formulation unique de la règle « déjà client », réutilisée partout. */
export const REGLE_DEJA_CLIENT =
  "Vous avez déjà réalisé une étude posturale chez ID Postur ? Nous disposons déjà de vos mesures : l'étude est plus rapide, et donc moins chère.";

export const ETUDES_POSTURALES: Prestation[] = [
  {
    slug: "etude-posturale-3d",
    baseline: "L'analyse la plus complète",
    title: "Étude posturale 3D",
    description:
      "Analyse posturale complète en 3D avec la technologie IDmatch BikeLab. Toutes disciplines, y compris chrono et triathlon.",
    price: 300,
    duration: "2h30",
    durationISO: "PT2H30M",
    disciplines: DISCIPLINES_TOUTES,
    equipment: EQUIPEMENT_ETUDE,
    note: NOTE_3D,
    link: "https://calendly.com/idpostur/etude-posturale-complete-3d",
    page: "/etudes-posturales",
  },
  {
    slug: "etude-posturale-2d",
    baseline: "Format plus court",
    title: "Étude posturale 2D",
    description:
      "Analyse posturale en 2D et réglage de votre position. Route, VTT et gravel.",
    price: 180,
    duration: "1h30",
    durationISO: "PT1H30M",
    disciplines: DISCIPLINES_2D,
    note: RESTRICTION_2D,
    equipment: EQUIPEMENT_ETUDE,
    link: "https://calendly.com/idpostur/etude-posturale-complete-2d",
    page: "/etudes-posturales",
  },
  {
    slug: "etude-posturale-3d-deja-client",
    baseline: "Déjà client ID Postur",
    title: "Étude posturale 3D — déjà client",
    description:
      "Même analyse 3D complète, au tarif réduit réservé aux cyclistes dont nous avons déjà les mesures.",
    price: 200,
    duration: "2h30",
    durationISO: "PT2H30M",
    disciplines: DISCIPLINES_TOUTES,
    equipment: EQUIPEMENT_ETUDE,
    note: NOTE_3D,
    link: "https://calendly.com/idpostur/etude-posturale-complete-3d-deja-client",
    page: "/etudes-posturales",
    dejaClient: true,
  },
  {
    slug: "etude-posturale-2d-deja-client",
    baseline: "Déjà client ID Postur",
    title: "Étude posturale 2D — déjà client",
    description:
      "Même analyse 2D — route, VTT et gravel — au tarif réduit réservé aux cyclistes dont nous avons déjà les mesures.",
    price: 120,
    duration: "1h30",
    durationISO: "PT1H30M",
    disciplines: DISCIPLINES_2D,
    note: RESTRICTION_2D,
    equipment: EQUIPEMENT_ETUDE,
    link: "https://calendly.com/idpostur/etude-posturale-complete-2d-deja-client",
    page: "/etudes-posturales",
    dejaClient: true,
  },
];

export const PRESTATIONS_COURTES: Prestation[] = [
  {
    slug: "reglage-cales",
    baseline: "Réglage de précision",
    title: "Réglage des cales",
    description:
      "Positionnement de vos cales au millimètre avec IDmatch Cleat Fit, pour un pédalage aligné et sans douleur.",
    price: 30,
    duration: "20 minutes",
    durationISO: "PT20M",
    disciplines: DISCIPLINES_TOUTES,
    equipment: [
      "• Votre vélo",
      "• Vos chaussures et vos cales",
      "• Votre tenue de vélo",
    ],
    link: "https://calendly.com/idpostur/regale-cale",
    page: "/cales",
  },
  {
    slug: "choix-nouveau-velo",
    baseline: "Avant l'achat",
    title: "Choix de votre nouveau vélo",
    description:
      "Validation de la taille et de l'ergonomie du vélo que vous envisagez, avant de finaliser votre achat.",
    price: 30,
    duration: "20 minutes",
    durationISO: "PT20M",
    disciplines: DISCIPLINES_TOUTES,
    equipment: [
      "• Le vélo que vous envisagez",
      "• Vos chaussures et vos cales",
      "• Votre tenue de vélo",
    ],
    link: "https://calendly.com/idpostur/choix-nouveau-velo",
    page: "/choix-nouveau-velo",
  },
  {
    slug: "rendez-vous-divers",
    baseline: "Intervention ponctuelle",
    title: "Rendez-vous divers",
    description:
      "Micro-réglage, vérification rapide ou conseil technique ponctuel sur votre vélo.",
    price: 30,
    duration: "20 minutes",
    durationISO: "PT20M",
    disciplines: DISCIPLINES_TOUTES,
    equipment: [
      "• Votre vélo",
      "• Vos chaussures et vos cales",
      "• Votre tenue de vélo",
    ],
    link: "https://calendly.com/idpostur/rendez-vous-divers-20min",
    page: "/rendez-vous-divers",
  },
];

/**
 * Offres réservées à un public particulier. Tarif unique : elles ne se
 * déclinent pas en « première visite / déjà client », et n'apparaissent donc
 * pas dans le parcours des clients existants.
 *
 * Moins de 15 ans : pas de tarif réduit au retour — la croissance modifie
 * les mesures d'une visite à l'autre, l'étude est donc refaite entièrement.
 */
export const OFFRES_PARTICULIERES: Prestation[] = [
  {
    slug: "etude-moins-de-15-ans",
    baseline: "Moins de 15 ans",
    title: "Étude posturale — moins de 15 ans",
    description:
      "L'analyse posturale 2D adaptée aux jeunes cyclistes de moins de 15 ans, sur une séance d'1h30. Tarif unique.",
    price: 120,
    duration: "1h30",
    durationISO: "PT1H30M",
    disciplines: DISCIPLINES_2D,
    equipment: EQUIPEMENT_ETUDE,
    note: RESTRICTION_2D,
    link: CALENDLY_A_DEFINIR,
    page: "/etudes-posturales",
  },
];

export const TOUTES_PRESTATIONS: Prestation[] = [
  ...ETUDES_POSTURALES,
  ...OFFRES_PARTICULIERES,
  ...PRESTATIONS_COURTES,
];

/** Formate un prix pour l'affichage : 300 → "300€". */
export const formatPrix = (prix: number): string => `${prix}€`;

/** Études posturales au tarif plein (première visite). */
export const ETUDES_PREMIERE_VISITE = ETUDES_POSTURALES.filter(
  (p) => !p.dejaClient,
);

/** Études posturales au tarif réduit (cycliste déjà venu). */
export const ETUDES_DEJA_CLIENT = ETUDES_POSTURALES.filter((p) => p.dejaClient);

/**
 * Prix d'entrée d'une étude posturale pour un nouveau client.
 * À utiliser dans tout « à partir de X€ » destiné au grand public : annoncer
 * le tarif réduit ferait miroiter un prix inaccessible à un nouveau venu.
 * Les offres particulières (moins de 15 ans) sont volontairement
 * exclues du calcul : elles ne concernent pas la majorité des visiteurs.
 */
export const PRIX_ENTREE_ETUDE = Math.min(
  ...ETUDES_PREMIERE_VISITE.map((p) => p.price),
);

/** Prix d'entrée d'une étude posturale pour un client déjà venu. */
export const PRIX_REDUIT_ETUDE = Math.min(
  ...ETUDES_DEJA_CLIENT.map((p) => p.price),
);

const byslug = (slug: string): Prestation => {
  const prestation = TOUTES_PRESTATIONS.find((p) => p.slug === slug);
  if (!prestation) throw new Error(`Prestation inconnue : ${slug}`);
  return prestation;
};

export const getPrestation = byslug;

/* -------------------------------------------------------------------------
 * Contenu de la page comparative /etude-posturale-3d-ou-2d
 * ---------------------------------------------------------------------- */

/**
 * Tableau comparatif 3D / 2D.
 *
 * Les lignes ci-dessous ne contiennent que des faits vérifiés (tarifs, durées,
 * prérequis). Les lignes techniques — ce que mesure réellement chaque analyse
 * — restent à ajouter : voir le TODO de POUR_QUI_3D plus bas.
 */
export interface LigneComparatif {
  critere: string;
  troisD: string;
  deuxD: string;
}

export const COMPARATIF_3D_2D: LigneComparatif[] = [
  {
    critere: "Durée du rendez-vous",
    troisD: "2h30",
    deuxD: "1h30",
  },
  {
    critere: "Tarif première étude",
    troisD: "300€",
    deuxD: "180€",
  },
  {
    critere: "Tarif si vous êtes déjà venu",
    troisD: "200€",
    deuxD: "120€",
  },
  {
    critere: "Disciplines",
    troisD: DISCIPLINES_TOUTES,
    deuxD: `${DISCIPLINES_2D} — chrono et triathlon non pris en charge`,
  },
  {
    critere: "À apporter",
    troisD: "Vélo, tenue complète, chaussures et cales",
    deuxD: "Vélo, tenue complète, chaussures et cales",
  },
  {
    critere: "Vêtements réfléchissants",
    troisD: "À éviter : ils perturbent la captation",
    deuxD: "Sans importance",
  },
];

/** Bloc texte + image de la page comparative. */
export interface FormatEtude {
  ancre: string;
  titre: string;
  accroche: string;
  paragraphes: string[];
  image: string;
  imageAlt: string;
  /** Place l'image à droite du texte (false = image à gauche). */
  imageADroite: boolean;
  prestation: Prestation;
}

/**
 * TODO — « Choisissez la 3D si… » / « Choisissez la 2D si… »
 *
 * À remplir dès que la différence technique entre les deux analyses est
 * connue (ce que mesure chaque système, dans quels cas l'une est préférable).
 * Tant que ces deux tableaux sont vides, la section « Comment choisir »
 * n'est pas rendue : sur une page dont c'est tout l'objet, une réponse
 * approximative vaut moins que pas de réponse.
 */
export const POUR_QUI_3D: string[] = [
  "Vous roulez sur un vélo de chrono ou de triathlon : c'est le seul format qui prend ces positions en charge.",
];
export const POUR_QUI_2D: string[] = [];

export const FORMATS_ETUDE: FormatEtude[] = [
  {
    ancre: "etude-3d",
    titre: "L'étude posturale 3D",
    accroche: "300€ · 2h30 · toutes disciplines, chrono et triathlon compris",
    paragraphes: [
      "L'étude posturale 3D est le format le plus complet proposé par ID Postur. Elle s'appuie sur la technologie IDmatch BikeLab et se déroule sur une séance de 2h30, entièrement consacrée à votre position sur le vélo.",
      "C'est aussi le seul format ouvert aux vélos de chrono et de triathlon : ces positions très spécifiques ne peuvent pas être analysées en 2D.",
      "Le rendez-vous se fait sur votre propre vélo, avec votre tenue complète, vos chaussures et vos cales. Seule contrainte : évitez les vêtements réfléchissants, qui perturbent la captation.",
    ],
    image: "/images/id-postur-img-1.webp",
    imageAlt:
      "Analyse posturale 3D d'un cycliste sur son vélo chez ID Postur à Rennes",
    imageADroite: true,
    prestation: ETUDES_POSTURALES[0],
  },
  {
    ancre: "etude-2d",
    titre: "L'étude posturale 2D",
    accroche: "180€ · 1h30 · route, VTT et gravel",
    paragraphes: [
      "L'étude posturale 2D est un format plus court, sur une séance d'1h30. Elle s'adresse aux cyclistes route, VTT et gravel, et se déroule elle aussi sur votre propre vélo.",
      "Les prérequis sont identiques : votre vélo, votre tenue complète, vos chaussures et vos cales, sans contrainte sur les vêtements réfléchissants. En revanche, les vélos de chrono et de triathlon ne peuvent pas être pris en charge dans ce format : leur position demande l'analyse 3D.",
    ],
    image: "/images/id-postur-img-2.webp",
    imageAlt:
      "Étude posturale 2D d'un cycliste chez ID Postur près de Rennes",
    imageADroite: false,
    prestation: ETUDES_POSTURALES[1],
  },
];
