/**
 * Typographie française : espace insécable avant ? ! : ; » et après «,
 * pour qu'aucun signe ne se retrouve seul en début de ligne.
 */
export const fr = (texte: string): string =>
  texte.replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ");
