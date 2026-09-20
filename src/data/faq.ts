/**
 * Questions fréquentes de la page d'accueil.
 *
 * Extraites du composant d'affichage pour qu'une seule liste serve à la fois
 * au rendu visible (src/components/faq.astro) et au balisage FAQPage généré
 * par BaseLayout. Les prix et durées viennent de src/data/tarifs.ts : aucune
 * valeur n'est écrite en dur ici.
 *
 * Les FAQ propres à une page restent définies dans la page concernée.
 */

import { formatPrix, getPrestation } from "./tarifs";
import { ENTREPRISE } from "./entreprise";

const troisD = getPrestation("etude-posturale-3d");
const deuxD = getPrestation("etude-posturale-2d");
const cales = getPrestation("reglage-cales");

export interface QuestionFaq {
  question: string;
  answer: string;
}

export const FAQ_ACCUEIL: QuestionFaq[] = [
  {
    question: "Combien de temps dure une étude posturale ?",
    answer: `L'étude posturale 3D dure ${troisD.duration} et l'étude posturale 2D ${deuxD.duration}. Le réglage seul de vos cales dure ${cales.duration}.`,
  },
  {
    question: "Quelle est la différence de prix entre les formules ?",
    answer: `L'étude posturale 3D coûte ${formatPrix(troisD.price)} et l'étude posturale 2D ${formatPrix(deuxD.price)}. Si vous avez déjà réalisé une étude chez ID Postur, un tarif réduit s'applique. Les rendez-vous courts (réglage des cales, choix d'un nouveau vélo, réglage ponctuel) sont à ${formatPrix(cales.price)}.`,
  },
  {
    question: "Dois-je venir avec mon propre vélo ?",
    answer:
      "Oui, l'étude est effectuée sur votre vélo pour garantir des réglages adaptés à votre morphologie, vos composants et votre pratique (route, VTT, gravel, chrono). Prévoyez également votre tenue complète.",
  },
  {
    question: "Puis-je offrir une séance à un proche ?",
    answer: `Absolument. ID Postur propose des cartes cadeaux personnalisées. Contactez-nous sur Instagram ou directement à ID Postur, ${ENTREPRISE.adresse.rue}, ${ENTREPRISE.adresse.ville}.`,
  },
  {
    question: "Pourquoi faire une étude posturale vélo ?",
    answer:
      "Une position mal réglée provoque des douleurs (genoux, dos, cervicales, mains ou pieds) et fait perdre de la puissance. L'étude posturale analyse votre position sur votre propre vélo pour régler la hauteur et le recul de selle, le cintre, la potence et les cales : plus de confort, moins de blessures et un meilleur rendement, que vous soyez débutant ou compétiteur.",
  },
  {
    question: "Où se déroule l'étude posturale, près de Rennes ?",
    answer: `Le studio ID Postur se trouve au ${ENTREPRISE.adresse.rue} à ${ENTREPRISE.adresse.ville}, à une quinzaine de minutes au nord de Rennes, avec un accès facile depuis toute l'Ille-et-Vilaine. Les rendez-vous se prennent en ligne, ${ENTREPRISE.horaires.affiches.toLowerCase()}.`,
  },
  {
    question:
      "L'étude posturale convient-elle au VTT, au gravel ou au triathlon ?",
    answer:
      "Oui. L'étude posturale s'adapte à chaque discipline : route, VTT, gravel, et aussi chrono et triathlon avec l'étude 3D — le seul format qui prend en charge ces positions spécifiques. Les réglages tiennent compte des exigences propres à votre pratique.",
  },
];
