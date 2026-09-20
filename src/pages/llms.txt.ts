/**
 * /llms.txt — fiche de synthèse destinée aux moteurs de réponse IA.
 *
 * Convention llmstxt.org : un fichier Markdown en texte brut, à la racine du
 * domaine, qui résume ce qu'est le site et pointe vers ses pages utiles. Là
 * où le JSON-LD décrit l'entité pour un moteur, ce fichier donne à un modèle
 * de langage une version courte et déjà digérée du site, sans avoir à
 * parcourir le HTML.
 *
 * Il est GÉNÉRÉ, pas écrit à la main : prix, durées, adresse et avis sont lus
 * dans src/data/. Une modification de tarif s'y répercute au prochain build.
 */

import type { APIRoute } from "astro";
import {
  AVIS_GOOGLE,
  CHIFFRES,
  ENTREPRISE,
  EXPERTISES,
  FONDATEUR,
  canonique,
} from "../data/entreprise";
import {
  ETUDES_POSTURALES,
  OFFRES_PARTICULIERES,
  PRESTATIONS_COURTES,
  RESTRICTION_2D,
  formatPrix,
  type Prestation,
} from "../data/tarifs";

const ligneePrestation = (p: Prestation): string =>
  `- [${p.title}](${canonique(p.page)}) — ${formatPrix(p.price)}, ${p.duration}. ${p.description} Disciplines : ${p.disciplines}.`;

const contenu = `# ${ENTREPRISE.nom}

> ${ENTREPRISE.description} Studio situé au ${ENTREPRISE.adresse.rue}, ${ENTREPRISE.adresse.codePostal} ${ENTREPRISE.adresse.ville}, à une quinzaine de minutes au nord de Rennes (Ille-et-Vilaine, Bretagne, France).

${ENTREPRISE.nom} a été fondé en ${ENTREPRISE.fondation} par ${FONDATEUR.nom}, ancien cycliste professionnel. ${CHIFFRES.etudes} études posturales réalisées, ${CHIFFRES.pros} athlètes professionnels accompagnés, ${AVIS_GOOGLE.note}/5 sur ${AVIS_GOOGLE.nombre} avis Google.

L'analyse s'appuie sur la technologie STT Systems Motio :
- **3DMA** — capture optique 3D par marqueurs réfléchissants, erreur de suivi inférieure au millimètre. Mesure le cycliste ET le vélo, dans les trois plans du mouvement. Seul format couvrant les positions de chrono et de triathlon.
- **2DMA** — analyse vidéo haute résolution en vue latérale, plus de 50 mesures automatiques de bike fitting. Mesure le cycliste uniquement. ${RESTRICTION_2D}

## Études posturales

${ETUDES_POSTURALES.map(ligneePrestation).join("\n")}
${OFFRES_PARTICULIERES.map(ligneePrestation).join("\n")}

Le tarif réduit « déjà client » s'applique sans limite de temps à tout cycliste ayant déjà réalisé une étude chez ${ENTREPRISE.nom} : les mesures sont déjà connues, la séance est plus courte.

## Rendez-vous courts

${PRESTATIONS_COURTES.map(ligneePrestation).join("\n")}

## Pages du site

- [Accueil](${canonique("/")}) — présentation, formules, avis et questions fréquentes.
- [Étude posturale vélo à Rennes](${canonique("/etudes-posturales")}) — détail des formats 3D et 2D, tarifs et déroulé.
- [Étude posturale 3D ou 2D](${canonique("/etude-posturale-3d-ou-2d")}) — comparatif détaillé des deux formats, pour choisir.
- [Réglage des cales](${canonique("/cales")}) — positionnement des cales au millimètre.
- [Choix d'un nouveau vélo](${canonique("/choix-nouveau-velo")}) — validation de la taille et de l'ergonomie avant l'achat.
- [Rendez-vous divers](${canonique("/rendez-vous-divers")}) — micro-réglage ou conseil technique ponctuel.
- [Étude posturale pour les cyclistes nantais](${canonique("/etude-posturale-nantes")}) — venir depuis Nantes, à 1h15 par la N137.
- [Mentions légales](${canonique("/mentions-legales")}) — éditeur, hébergement, RGPD.

## Informations pratiques

- **Adresse** : ${ENTREPRISE.adresse.rue}, ${ENTREPRISE.adresse.codePostal} ${ENTREPRISE.adresse.ville}, France
- **Zone desservie** : Rennes, Ille-et-Vilaine, Bretagne, et cyclistes venant de Nantes et de Loire-Atlantique
- **Téléphone** : ${ENTREPRISE.telephone}
- **Email** : ${ENTREPRISE.email}
- **Horaires** : ${ENTREPRISE.horaires.affiches}
- **Rendez-vous** : en ligne, via les liens de réservation des pages de prestations
- **Langue** : français

## Expertise

${EXPERTISES.map((sujet) => `- ${sujet}`).join("\n")}

## À ne pas confondre

- ${ENTREPRISE.nom} n'utilise plus la technologie IDmatch (BikeLab, Cleat Fit). L'ensemble des études est réalisé avec STT Systems Motio.
- L'étude posturale se déroule toujours sur le vélo du client, dans le studio de ${ENTREPRISE.adresse.ville} : il n'y a ni déplacement à domicile, ni prestation à distance.
`;

export const GET: APIRoute = () =>
  new Response(contenu, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
