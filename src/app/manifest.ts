import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Manifeste web : icônes de marque et couleurs. « browser » : le site n'est pas une PWA
// (pas de service worker), il s'ouvre donc dans le navigateur même depuis l'écran d'accueil.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: siteConfig.lang,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#F3F6FC",
    theme_color: "#1448C8",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Les icônes ont un fond plein cadre et un symbole dans la zone sûre (56 %).
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
