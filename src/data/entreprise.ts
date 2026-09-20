/**
 * Source unique de vérité pour l'identité ID Postur.
 *
 * Même principe que src/data/tarifs.ts : ces valeurs alimentent à la fois
 * l'affichage (header, footer, pages) et les données structurées JSON-LD.
 * Google exige que le markup corresponde au contenu visible — passer par ces
 * constantes rend la divergence impossible.
 *
 * Toute modification de NAP (Name / Address / Phone), d'avis ou de réseaux
 * se fait ICI et nulle part ailleurs.
 */

/** Origine du site, sans slash final. Sert à construire toutes les URLs absolues. */
export const SITE_URL = "https://id-postur.fr";

/** Construit une URL absolue à partir d'un chemin interne. */
export const absolu = (chemin: string): string =>
  chemin.startsWith("http") ? chemin : `${SITE_URL}${chemin}`;

/**
 * Forme canonique d'une page : URL absolue AVEC slash final.
 *
 * Astro génère des dossiers (`/cales/index.html`), donc la balise
 * `<link rel="canonical">` et le sitemap pointent vers `/cales/`. Toutes les
 * URLs et tous les `@id` du JSON-LD doivent utiliser exactement la même
 * forme, sinon les références du graphe ne se résolvent pas et les moteurs
 * voient deux entités là où il n'y en a qu'une.
 */
export const canonique = (chemin: string): string => {
  const propre = chemin.replace(/^https?:\/\/[^/]+/, "").replace(/\/+$/, "");
  return propre === "" ? `${SITE_URL}/` : `${SITE_URL}${propre}/`;
};

/**
 * Identifiants stables des nœuds JSON-LD.
 *
 * Ces `@id` sont des adresses permanentes : les moteurs et les LLM s'en
 * servent pour relier entre elles les entités rencontrées sur des pages
 * différentes. Ne jamais les renommer une fois le site indexé.
 */
export const SCHEMA_ID = {
  entreprise: `${SITE_URL}/#business`,
  site: `${SITE_URL}/#website`,
  fondateur: `${SITE_URL}/#romain-hardy`,
} as const;

export const ENTREPRISE = {
  nom: "ID Postur",
  /** Description courte, réutilisée dans le JSON-LD et le llms.txt. */
  description:
    "Centre d'étude posturale et de bike fitting pour cyclistes à Rennes. Analyse de la position sur le vélo par capture de mouvement STT (3D ou 2D), réglage des cales et conseil avant l'achat d'un vélo.",
  fondation: "2023",
  telephone: "+33607167323",
  /** Même numéro, au format affiché sur le site. */
  telephoneAffiche: "06 07 16 73 23",
  email: "idpostur@gmail.com",
  /** Fourchette de prix schema.org, cohérente avec src/data/tarifs.ts (30€ – 300€). */
  gammePrix: "€€",
  devise: "EUR",
  adresse: {
    rue: "112 Route du Meuble",
    ville: "La Mézière",
    codePostal: "35520",
    region: "Bretagne",
    pays: "FR",
  },
  geo: {
    latitude: 48.2183,
    longitude: -1.7867,
  },
  horaires: {
    jours: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    ouverture: "09:00",
    fermeture: "19:00",
    /** Formulation affichée sur le site. */
    affiches: "Du lundi au vendredi, de 9h à 19h",
  },
  logo: "/images/LOGO-ID-POSTUR.webp",
  image: "/images/id-postur-interieur-og.jpg",
} as const;

/** Fiche Google Business — sert de `hasMap` et de preuve d'identité (`sameAs`). */
export const FICHE_GOOGLE =
  "https://www.google.com/maps?cid=9269044768465958318";

export const RESEAUX = [
  "https://www.instagram.com/idpostur/",
  "https://www.facebook.com/profile.php?id=100090578517497",
  FICHE_GOOGLE,
];

/**
 * Avis Google.
 *
 * ⚠ `nombre` doit TOUJOURS correspondre au chiffre affiché sur le site :
 * le hero et la page Nantes lisent cette constante. Mettre à jour ici
 * met à jour l'affichage et le JSON-LD d'un seul coup.
 *
 * À savoir : Google n'affiche pas d'étoiles pour un `aggregateRating` qu'une
 * entreprise déclare sur elle-même (règle « self-serving reviews »). On le
 * conserve car il reste lu par Bing et par les moteurs de réponse IA, mais
 * il ne produira pas de rich snippet dans Google.
 */
export const AVIS_GOOGLE = {
  note: "5.0",
  nombre: 78,
  url: FICHE_GOOGLE,
} as const;

/** Chiffres clés de l'activité, repris à l'identique partout. */
export const CHIFFRES = {
  etudes: "800+",
  pros: "25+",
  anciennete: "3+",
} as const;

export const FONDATEUR = {
  nom: "Romain Hardy",
  role: "Fondateur d'ID Postur, spécialiste de l'étude posturale cycliste",
  description:
    "Ancien cycliste professionnel, Romain Hardy a fondé ID Postur en 2023 à La Mézière, près de Rennes. Il réalise les études posturales avec la technologie de capture de mouvement STT : plus de 800 études menées et plus de 25 athlètes professionnels accompagnés.",
  image: "/images/romain-hardy.jpg",
  expertises: [
    "Étude posturale cycliste",
    "Bike fitting",
    "Capture de mouvement STT 3DMA",
    "Analyse vidéo STT 2DMA",
    "Réglage des cales",
    "Position sur le vélo",
    "Cyclisme professionnel",
  ],
} as const;

/**
 * Zone desservie.
 *
 * Rennes et l'Ille-et-Vilaine constituent la zone principale ; Nantes et la
 * Loire-Atlantique y figurent parce que le centre accueille régulièrement des
 * cyclistes nantais (cf. /etude-posturale-nantes).
 */
export const ZONE_DESSERVIE = [
  { type: "City" as const, nom: "Rennes" },
  { type: "City" as const, nom: "Nantes" },
  { type: "AdministrativeArea" as const, nom: "Ille-et-Vilaine" },
  { type: "AdministrativeArea" as const, nom: "Loire-Atlantique" },
  { type: "AdministrativeArea" as const, nom: "Bretagne" },
];

/**
 * Domaines d'expertise de la structure.
 *
 * `knowsAbout` est l'un des rares champs explicitement pensés pour dire
 * « voici ce sur quoi cette entité fait autorité ». C'est un signal utile
 * pour les moteurs de réponse IA, qui cherchent à rattacher une entité à
 * un sujet avant de la citer.
 */
export const EXPERTISES = [
  "Étude posturale cycliste",
  "Bike fitting",
  "Capture de mouvement 3D STT 3DMA",
  "Analyse vidéo 2D STT 2DMA",
  "Réglage des cales de vélo",
  "Position sur le vélo de route",
  "Position sur le vélo de chrono et de triathlon",
  "Prévention des douleurs liées au vélo",
  "Choix de la taille d'un vélo",
];

/**
 * Libellés du fil d'Ariane, par chemin.
 *
 * Le BreadcrumbList est généré automatiquement dans BaseLayout à partir de
 * cette table : ajouter une page ici suffit à lui donner un fil d'Ariane.
 */
export const LIBELLES_FIL_ARIANE: Record<string, string> = {
  "/": "Accueil",
  "/etudes-posturales": "Étude posturale",
  "/etude-posturale-3d-ou-2d": "3D ou 2D",
  "/etude-posturale-nantes": "Étude posturale à Nantes",
  "/cales": "Réglage des cales",
  "/choix-nouveau-velo": "Choix d'un nouveau vélo",
  "/rendez-vous-divers": "Rendez-vous divers",
  "/mentions-legales": "Mentions légales",
  "/reserver": "Réserver",
  "/reserver/premiere-etude": "Première étude",
  "/reserver/deja-client": "Déjà client",
};
