/**
 * Constructeurs de données structurées schema.org.
 *
 * Principe : le site émet UN SEUL bloc JSON-LD par page, sous forme de
 * `@graph`. Tous les nœuds y sont reliés par des `@id` stables
 * (cf. SCHEMA_ID dans src/data/entreprise.ts) plutôt que dupliqués.
 *
 * Pourquoi un graphe unique plutôt que plusieurs balises séparées :
 * - un moteur (ou un LLM) reconstruit l'entité complète en une seule lecture,
 *   au lieu de recouper des blocs indépendants ;
 * - l'entreprise, le fondateur et la page sont explicitement liés
 *   (`about`, `author`, `provider`, `isPartOf`), ce qui est exactement ce
 *   qu'un moteur de réponse cherche avant de citer une source ;
 * - aucune donnée n'est répétée, donc aucune ne peut diverger.
 */

import {
  AVIS_GOOGLE,
  ENTREPRISE,
  EXPERTISES,
  FICHE_GOOGLE,
  FONDATEUR,
  LIBELLES_FIL_ARIANE,
  RESEAUX,
  SCHEMA_ID,
  SITE_URL,
  ZONE_DESSERVIE,
  absolu,
  canonique,
} from "../data/entreprise";
import type { Prestation } from "../data/tarifs";

export type NoeudSchema = Record<string, unknown>;

/** Référence vers un nœud déjà présent dans le graphe. */
const ref = (id: string) => ({ "@id": id });

/** Retire les clés dont la valeur est `undefined`, pour un JSON-LD propre. */
const sansVides = (noeud: NoeudSchema): NoeudSchema =>
  Object.fromEntries(Object.entries(noeud).filter(([, v]) => v !== undefined));

const zoneDesservieSchema = ZONE_DESSERVIE.map((zone) => ({
  "@type": zone.type,
  name: zone.nom,
}));

/* -------------------------------------------------------------------------
 * Nœuds permanents — présents sur toutes les pages
 * ---------------------------------------------------------------------- */

/**
 * L'entreprise elle-même.
 *
 * Typée `LocalBusiness` + `SportsActivityLocation` : le second type est plus
 * précis pour un centre d'analyse sportive, le premier reste nécessaire pour
 * que Google l'interprète comme un établissement local.
 */
export const noeudEntreprise = (): NoeudSchema => ({
  "@type": ["LocalBusiness", "SportsActivityLocation"],
  "@id": SCHEMA_ID.entreprise,
  name: ENTREPRISE.nom,
  legalName: ENTREPRISE.nom,
  description: ENTREPRISE.description,
  url: canonique("/"),
  foundingDate: ENTREPRISE.fondation,
  founder: ref(SCHEMA_ID.fondateur),
  employee: ref(SCHEMA_ID.fondateur),
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: absolu(ENTREPRISE.logo),
    caption: ENTREPRISE.nom,
  },
  image: [
    absolu(ENTREPRISE.image),
    absolu("/images/id-postur-img-1.webp"),
    absolu("/images/id-postur-interieur.webp"),
  ],
  telephone: ENTREPRISE.telephone,
  email: ENTREPRISE.email,
  priceRange: ENTREPRISE.gammePrix,
  currenciesAccepted: ENTREPRISE.devise,
  address: {
    "@type": "PostalAddress",
    streetAddress: ENTREPRISE.adresse.rue,
    addressLocality: ENTREPRISE.adresse.ville,
    postalCode: ENTREPRISE.adresse.codePostal,
    addressRegion: ENTREPRISE.adresse.region,
    addressCountry: ENTREPRISE.adresse.pays,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: ENTREPRISE.geo.latitude,
    longitude: ENTREPRISE.geo.longitude,
  },
  hasMap: FICHE_GOOGLE,
  areaServed: zoneDesservieSchema,
  knowsAbout: EXPERTISES,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...ENTREPRISE.horaires.jours],
      opens: ENTREPRISE.horaires.ouverture,
      closes: ENTREPRISE.horaires.fermeture,
    },
  ],
  sameAs: RESEAUX,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: AVIS_GOOGLE.note,
    reviewCount: String(AVIS_GOOGLE.nombre),
    bestRating: "5",
    worstRating: "1",
  },
});

/** Le site web, qui rattache chaque page à une publication identifiée. */
export const noeudSite = (): NoeudSchema => ({
  "@type": "WebSite",
  "@id": SCHEMA_ID.site,
  url: `${SITE_URL}/`,
  name: ENTREPRISE.nom,
  description: ENTREPRISE.description,
  inLanguage: "fr-FR",
  publisher: ref(SCHEMA_ID.entreprise),
});

/**
 * Le fondateur.
 *
 * Présent sur toutes les pages, et pas seulement sur celles qui parlent de
 * lui : c'est le principal actif d'expertise du site (E-E-A-T), et les
 * moteurs de réponse IA privilégient les contenus rattachés à une personne
 * identifiable et compétente sur le sujet.
 */
export const noeudFondateur = (): NoeudSchema => ({
  "@type": "Person",
  "@id": SCHEMA_ID.fondateur,
  name: FONDATEUR.nom,
  jobTitle: FONDATEUR.role,
  description: FONDATEUR.description,
  image: absolu(FONDATEUR.image),
  url: canonique("/"),
  worksFor: ref(SCHEMA_ID.entreprise),
  knowsAbout: [...FONDATEUR.expertises],
});

/* -------------------------------------------------------------------------
 * Nœuds propres à la page
 * ---------------------------------------------------------------------- */

export interface Question {
  question: string;
  answer: string;
}

/**
 * Fil d'Ariane, déduit du chemin de la page.
 *
 * Retourne `undefined` pour l'accueil : un fil d'Ariane à un seul élément
 * n'apporte rien et n'est pas affiché par Google.
 */
export const noeudFilAriane = (chemin: string): NoeudSchema | undefined => {
  const propre = chemin.replace(/\/$/, "");
  if (propre === "") return undefined;

  const segments = propre.split("/").filter(Boolean);
  const etapes = ["/", ...segments.map((_, i) => `/${segments.slice(0, i + 1).join("/")}`)];

  const elements = etapes.map((etape, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: LIBELLES_FIL_ARIANE[etape] ?? etape,
    item: canonique(etape),
  }));

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonique(propre)}#fil-ariane`,
    itemListElement: elements,
  };
};

export interface OptionsPage {
  /** URL canonique de la page. */
  url: string;
  name: string;
  description: string;
  /** Image principale, en URL absolue. */
  image: string;
  /** Questions/réponses affichées sur la page, le cas échéant. */
  faq?: Question[];
  datePublished?: string;
  dateModified?: string;
  filAriane?: NoeudSchema;
}

/**
 * La page courante.
 *
 * Quand la page comporte une FAQ visible, le nœud porte aussi le type
 * `FAQPage` et expose les questions en `mainEntity` : une seule entité
 * décrit l'URL, plutôt que deux nœuds concurrents.
 *
 * ⚠ Google n'affiche plus de rich snippet FAQ depuis août 2023 (réservé aux
 * sites institutionnels et de santé). On conserve le balisage parce qu'il
 * reste l'un des formats les mieux exploités par les moteurs de réponse IA,
 * qui y trouvent des paires question/réponse déjà structurées.
 */
export const noeudPage = (options: OptionsPage): NoeudSchema => {
  const { url, name, description, image, faq, datePublished, dateModified, filAriane } =
    options;

  const aUneFaq = faq !== undefined && faq.length > 0;

  return sansVides({
    "@type": aUneFaq ? ["WebPage", "FAQPage"] : "WebPage",
    "@id": `${url}#page`,
    url,
    name,
    description,
    inLanguage: "fr-FR",
    isPartOf: ref(SCHEMA_ID.site),
    about: ref(SCHEMA_ID.entreprise),
    author: ref(SCHEMA_ID.fondateur),
    publisher: ref(SCHEMA_ID.entreprise),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: image,
    },
    breadcrumb: filAriane ? ref(filAriane["@id"] as string) : undefined,
    datePublished,
    dateModified,
    mainEntity: aUneFaq
      ? faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        }))
      : undefined,
  });
};

/* -------------------------------------------------------------------------
 * Prestations
 * ---------------------------------------------------------------------- */

/**
 * Transforme une prestation de src/data/tarifs.ts en `Offer`.
 *
 * La durée est intégrée à la description : schema.org n'a pas de propriété
 * normalisée pour la durée d'une prestation de service (`timeRequired` ne
 * s'applique qu'aux CreativeWork). La mettre en texte la rend malgré tout
 * exploitable par les moteurs de réponse, qui lisent ces champs.
 */
export const offreDepuisPrestation = (prestation: Prestation): NoeudSchema => ({
  "@type": "Offer",
  name: prestation.title,
  description: `${prestation.description} Durée : ${prestation.duration}. Disciplines : ${prestation.disciplines}.`,
  price: String(prestation.price),
  priceCurrency: ENTREPRISE.devise,
  availability: "https://schema.org/InStock",
  url: canonique(prestation.page),
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    price: String(prestation.price),
    priceCurrency: ENTREPRISE.devise,
    valueAddedTaxIncluded: true,
  },
});

export interface OptionsService {
  /** Suffixe d'`@id`, ex. "etude-posturale" → https://id-postur.fr/#service-etude-posturale */
  id: string;
  name: string;
  serviceType: string;
  description: string;
  /** Chemin interne de la page qui décrit ce service, ex. "/cales". */
  page: string;
  prestations: Prestation[];
  image?: string;
}

/** Une prestation vendue par ID Postur, reliée à l'entreprise et à sa page. */
export const noeudService = (options: OptionsService): NoeudSchema => {
  const url = canonique(options.page);

  return sansVides({
    "@type": "Service",
    "@id": `${SITE_URL}/#service-${options.id}`,
    name: options.name,
    serviceType: options.serviceType,
    description: options.description,
    url,
    image: options.image,
    provider: ref(SCHEMA_ID.entreprise),
    areaServed: zoneDesservieSchema,
    mainEntityOfPage: ref(`${url}#page`),
    offers: options.prestations.map(offreDepuisPrestation),
  });
};

/* -------------------------------------------------------------------------
 * Assemblage
 * ---------------------------------------------------------------------- */

export interface OptionsGraphe extends OptionsPage {
  /** Nœuds spécifiques à la page : Service, Person supplémentaire, etc. */
  noeuds?: NoeudSchema[];
}

/** Assemble le `@graph` complet d'une page. */
export const construireGraphe = (options: OptionsGraphe): NoeudSchema => {
  const { noeuds = [], ...page } = options;
  const filAriane = page.filAriane;

  return {
    "@context": "https://schema.org",
    "@graph": [
      noeudEntreprise(),
      noeudSite(),
      noeudFondateur(),
      noeudPage(page),
      ...(filAriane ? [filAriane] : []),
      ...noeuds,
    ],
  };
};
