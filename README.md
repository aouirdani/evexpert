# EVExpert

Plateforme française dédiée à la voiture électrique : base de véhicules, comparateur, calculateurs interactifs, informations sur la recharge, guides et blog éditorial.

> **Comprendre. Comparer. Calculer.**
>
> `EVExpert` est un nom de projet temporaire, modifiable via un seul fichier de configuration (`src/config/site.ts`).

## Stack technique

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Recharts** (visualisation de données)
- **Zod** (validation), **Lucide** (icônes)
- **Drizzle ORM** + **PostgreSQL** (couche base de données prête pour l'avenir)
- Rendu **serveur par défaut**, composants client uniquement pour l'interactivité

## Politique de données

- Les fiches véhicules et bornes sont des **données d'exemple** (`isDemo: true`), clairement signalées.
- Chaque donnée factuelle possède `source`, `sourceUrl` et `lastUpdated`.
- Aucune spécification n'est inventée comme officielle. Les calculs sont des **estimations transparentes**.

## Démarrage local

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# renseignez DATABASE_URL et NEXT_PUBLIC_SITE_URL

# 3. (Optionnel) Appliquer le schéma Drizzle
npx drizzle-kit push

# 4. Lancer en développement
npm run dev

# 5. Build de production
npm run build && npm run start
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |

## Variables d'environnement

| Variable | Rôle | Défaut |
|----------|------|--------|
| `NEXT_PUBLIC_SITE_URL` | URL canonique (SEO, sitemap, OG) | `https://evexpert.example` |
| `DATABASE_URL` | Connexion PostgreSQL | — |
| `ADSENSE_ENABLED` | Active la publicité | `false` |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Identifiant AdSense | — |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (après consentement) | — |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (après consentement) | — |

## Architecture

```
src/
  app/            # Routes App Router (pages, sitemap, robots, RSS)
  components/     # UI, calculateurs, véhicules, comparaison, layout, ads
  lib/            # calculateurs, SEO, recherche, comparaison, utils
  data/           # données d'exemple typées (véhicules, outils, guides, articles, recharge)
  types/          # interfaces du domaine (Vehicle, ChargingStation, Article…)
  config/         # configuration de marque et de navigation
  db/             # client Drizzle + schéma
public/
  ads.txt         # placeholder AdSense
```

## SEO

- Metadata unique par page, canonical, Open Graph, Twitter Cards
- JSON-LD : `WebSite`, `Organization`, `BreadcrumbList`, `Article`, `FAQPage`
- `sitemap.xml`, `robots.txt`, flux RSS (`/blog/rss.xml`)
- Fil d'Ariane, liens internes contextuels, hiérarchie sémantique
- Pages de recherche / vues filtrées en `noindex`
- Pages de comparaison **sélectionnées** uniquement (pas de combinaisons vides)

## Monétisation (préparée, désactivée)

- Composant `<AdSlot />` avec emplacements réservés (aucune fausse publicité)
- Activation via `ADSENSE_ENABLED` + `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- Bannière de consentement RGPD ; analytics chargés uniquement après accord

## Déploiement Vercel

1. Poussez le dépôt sur GitHub.
2. Importez le projet dans Vercel.
3. Renseignez les variables d'environnement (voir tableau ci-dessus).
4. Déployez : la build Next.js est détectée automatiquement.

## Limites connues / prochaines étapes

- Remplacer les données d'exemple par des données sourcées et vérifiées.
- Brancher la base PostgreSQL/Supabase pour la couche véhicules.
- Intégrer une source ouverte pour les bornes (IRVE / data.gouv.fr).
- Étendre la recherche côté serveur et ajouter des images officielles (next/image).
