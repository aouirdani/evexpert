// Garde-fou AdSense (appelé par `npm run verify`, serveur local uniquement) :
//   - <meta name="google-adsense-account" content="ca-pub-…"> : une seule, dans le <head> ;
//   - script adsbygoogle.js?client=ca-pub-… : chargé une seule fois par page ;
//   - public/ads.txt : exactement la ligne attendue, aussi servi tel quel sur /ads.txt.
// Contrôle chaque page du sitemap local. Usage : node scripts/check-adsense.mjs --base http://localhost:3101

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const PUB = "ca-pub-7903460199253248";
export const ADS_TXT_LINE = "google.com, pub-7903460199253248, DIRECT, f08c47fec0942fa0";

/** Anomalies d'une page HTML rendue (liste vide = conforme). */
export function checkHtml(html) {
  const problems = [];
  const headEnd = html.search(/<\/head>/i);
  const head = headEnd === -1 ? "" : html.slice(0, headEnd);
  if (headEnd === -1) problems.push("balise </head> introuvable");

  const metaRe = /<meta\b[^>]*\bname=["']google-adsense-account["'][^>]*>/gi;
  const metas = html.match(metaRe) ?? [];
  const metasInHead = head.match(metaRe) ?? [];
  if (metas.length === 0) problems.push("balise google-adsense-account absente");
  else if (metas.length > 1) problems.push(`balise google-adsense-account dupliquée (${metas.length})`);
  else if (metasInHead.length !== 1) problems.push("balise google-adsense-account hors du <head>");
  if (metas.length >= 1 && !metas.every((m) => m.includes(`content="${PUB}"`))) problems.push(`google-adsense-account : content ≠ ${PUB}`);

  // Chargements du script : <script src> littéral (HTML), et élément <Script> de next/script dans les
  // données RSC ("src":"…adsbygoogle.js…"), qui l'injecte au chargement (afterInteractive). Le
  // <link rel="preload"> n'est qu'un indice : il n'est pas compté, mais doit lui aussi rester unique.
  const literal = html.match(/<script\b[^>]*\bsrc=["'][^"']*adsbygoogle\.js[^"']*["'][^>]*>/gi) ?? [];
  const flight = html.match(/\\*"src\\*":\\*"https:[^"\\]*adsbygoogle\.js[^"\\]*/g) ?? [];
  const loads = [...literal, ...flight];
  const preloads = html.match(/<link\b[^>]*rel=["']preload["'][^>]*adsbygoogle\.js[^>]*>/gi) ?? [];
  if (loads.length === 0) problems.push("script adsbygoogle.js absent");
  else if (loads.length > 1) problems.push(`script adsbygoogle.js chargé ${loads.length} fois`);
  else if (!loads[0].includes(`client=${PUB}`)) problems.push(`script adsbygoogle.js : client ≠ ${PUB}`);
  if (preloads.length > 1) problems.push(`préchargement adsbygoogle.js dupliqué (${preloads.length})`);
  return problems;
}

/** Contenu de ads.txt : exactement la ligne attendue (fin de ligne finale tolérée). */
export function checkAdsTxt(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");
  if (lines.length !== 1 || lines[0] !== ADS_TXT_LINE) return [`ads.txt ≠ « ${ADS_TXT_LINE} » (${lines.length} ligne(s))`];
  return [];
}

async function main() {
  const i = process.argv.indexOf("--base");
  const base = i !== -1 ? process.argv[i + 1] : "http://localhost:3101";
  if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) {
    console.error(`Refusé : --base doit être un serveur local (reçu ${base}).`);
    process.exit(2);
  }
  const failures = [];
  const file = checkAdsTxt(readFileSync(new URL("../public/ads.txt", import.meta.url), "utf8"));
  file.forEach((p) => failures.push(`public/ads.txt : ${p}`));
  const served = await fetch(`${base}/ads.txt`);
  if (!served.ok) failures.push(`/ads.txt : HTTP ${served.status}`);
  else checkAdsTxt(await served.text()).forEach((p) => failures.push(`/ads.txt servi : ${p}`));

  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const paths = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
  if (!paths.includes("/")) paths.unshift("/");
  for (const path of paths) {
    const res = await fetch(`${base}${path}`);
    if (!res.ok) {
      failures.push(`${path} : HTTP ${res.status}`);
      continue;
    }
    checkHtml(await res.text()).forEach((p) => failures.push(`${path} : ${p}`));
  }
  if (failures.length) {
    console.log(failures.map((f) => `  ✘ ${f}`).join("\n"));
    console.log(`AdSense : ${failures.length} anomalie(s) sur ${paths.length} page(s).`);
    process.exit(1);
  }
  console.log(`AdSense : balise, script et ads.txt conformes sur ${paths.length} page(s).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
