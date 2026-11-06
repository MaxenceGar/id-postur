/**
 * Athlètes accompagnés par ID Postur : une seule liste pour le bandeau
 * « Ils lui ont fait confiance » de l'accueil et pour le mur /athletes-accompagnes.
 *
 * `photo` : portrait petit format (pastilles rondes de l'accueil).
 * `photoGrande` : photo du mur, cadrée en 4:5 (sinon `photo` est reprise).
 */

export interface Athlete {
  nom: string;
  role: string;
  photo: string;
  photoGrande?: string;
}

export const ATHLETES: Athlete[] = [
  { nom: "Warren Barguil", role: "Cycliste professionnel", photo: "/images/warren-barguil.webp" },
  { nom: "Amandine Fouquenet", role: "Cycliste professionnelle", photo: "/images/AmandineFouquenet.webp" },
  { nom: "Thibault Gernalec", role: "Cycliste professionnel", photo: "/images/thibaultgernalec.webp" },
  { nom: "Yann Guyot", role: "Triathlète", photo: "/images/yannguyot.jpg" },
  { nom: "Robin Lemercier", role: "Triathlète", photo: "/images/robin-lemercier.jpg" },
  { nom: "Florentin Lecamus", role: "Cycliste professionnel", photo: "/images/florentin-lecamus.jpg" },
  { nom: "Swan Gloux", role: "Cycliste professionnel", photo: "/images/Swan-gloux.jpg" },
  {
    nom: "Anaïs Morichon",
    role: "Cycliste professionnelle",
    photo: "/images/athlete-anais-morichon.webp",
    photoGrande: "/images/athlete-anais-morichon-grand.webp",
  },
  {
    nom: "Axel Mariault",
    role: "Cycliste professionnel",
    photo: "/images/athlete-axel-mariault.webp",
    photoGrande: "/images/athlete-axel-mariault-grand.webp",
  },
  {
    nom: "Maxence Lemardelé",
    role: "Champion de Normandie VTT",
    photo: "/images/athlete-maxence-lemardele.webp",
    photoGrande: "/images/athlete-maxence-lemardele-grand.webp",
  },
  {
    nom: "Emile Sinquin",
    role: "Champion de Bretagne VTT",
    photo: "/images/athlete-emile-sinquin.webp",
    photoGrande: "/images/athlete-emile-sinquin-grand.webp",
  },
  {
    nom: "Aurélien Le Lay",
    role: "Triathlète",
    photo: "/images/athlete-aurelien-le-lay.webp",
    photoGrande: "/images/athlete-aurelien-le-lay-grand.webp",
  },
  {
    nom: "Valentin Tortelier",
    role: "Triathlète",
    photo: "/images/athlete-valentin-tortelier.webp",
    photoGrande: "/images/athlete-valentin-tortelier-grand.webp",
  },
];

/** Rôle en milieu de phrase : seule la première lettre passe en minuscule. */
export const roleEnPhrase = (role: string) => role.charAt(0).toLowerCase() + role.slice(1);
