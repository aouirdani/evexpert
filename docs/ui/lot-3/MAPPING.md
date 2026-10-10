# Périmètre du lot 3 — état initial

Références des lots 0/1/2 consultées. Les 321 empreintes sources correspondent exactement à la fin du lot 2. Sauvegarde des fichiers actuels : `/private/tmp/evexpert-lot-3-originals/` ; aucun retour au HEAD Git prévu.

| Composant | Usages | Constats et choix |
|---|---|---|
| VehicleExplorer | Catalogue uniquement | Huit états existants, filtres locaux sans paramètres URL ; cinq tris. Recherche hors compteur des quatre filtres ; reset conserve tri et vue. Conserver cette logique et les événements. Renforcer les surfaces, états actifs et accès mobile par CSS. |
| VehicleCard | Catalogue, marques simples, fiches similaires, accueil | Identité et métriques comprimées en deux colonnes sur mobile ; noms complets déjà rétablis au lot 1. Variante de présentation explicite, défaut conservé pour l'accueil. Batterie/DC/consommation/temps et href conservés. Consommation calculée, caractéristiques non assimilées à des données officielles. |
| VehicleRow / VehicleRowsHead | Catalogue et sélection d'accueil | Véritables table/th/td ; lien étiré et pseudo-focus corrigés au lot 1. Variante explicite pour le catalogue, aucun changement de l'accueil. |
| BrandOverview | Marques à plusieurs modèles | Sept colonnes, largeur minimale 800 px, overflow local ; caption et provenance présents. Pas d'indication de défilement ni de région explicitement nommée/focalisable. |
| ModelOverview | Modèles multiversions | Huit colonnes, largeur minimale 736 px ; mêmes besoins de présentation/défilement. Focus étiré, sélection et coûts à conserver. |
| SpecTable | Fiches modèles monoversion et versions | Liste sémantique dl/dt/dd, pas un tableau HTML. Valeurs absentes omises selon la règle existante. Garder cette règle, les notes et les badges ; améliorer la disposition étroite. |
| VehicleDetail | Fiches, cartes similaires | Activer uniquement la variante des cartes similaires. Tableaux de recharge, calculs, estimateur, ancres et éditorial hors modification. |
| GarageToggle, RangeBar, DataBadge, Field, componentStyles | Usages transversaux | Défauts des lots précédents conservés, aucune modification globale. |
| ComparisonTable / ComparisonBuilder / Finder | Comparateur et aide au choix | Hors modification du lot 3 ; inclus dans les contrôles de non-régression. |

Aucune route créée ni supprimée. Hero, sections d'accueil, tokens/polices et styles par défaut, provenance catalogue, SEO, intégrations Google et configurations hors périmètre. La feuille globale importe uniquement les styles privés préfixés du catalogue : nécessité identifiée après la hausse du FCP observée avec une feuille séparée ; aucun défaut global changé. Les seuls nouveaux textes éventuellement nécessaires sont des indications d'interface de défilement et le badge existant Calcul EVExpert ; les captures SEO les distinguent du texte préexistant au moyen d'attributs dédiés, sans ignorer le contenu éditorial.
