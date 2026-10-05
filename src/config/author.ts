/**
 * Identité éditoriale unique du site (voir /auteur). Centralisée ici pour que la signature des
 * guides, articles, connecteurs et outils, ainsi que le JSON-LD des articles, pointent tous vers
 * la même personne sans dupliquer son nom ou sa bio.
 */
export const author = {
  name: "Aymane Ouirdani",
  role: "Fondateur et éditeur",
  href: "/auteur",
  bio: "Aymane Ouirdani est le fondateur et l'éditeur d'EVExpert. Il a créé le site pour réunir au même endroit des données fiables et comparables sur les voitures électriques, à destination du public français, avec pour chaque chiffre sa source et sa date. Il conçoit et maintient le catalogue, les calculateurs et les guides, et relit chaque contenu en le vérifiant contre les sources citées avant sa publication.",
} as const;
