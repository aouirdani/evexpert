// Poids gzip du JS et du CSS chargés par page (site servi localement).
//   node scripts/ui-metrics.mjs [baseUrl]      (défaut http://localhost:3100)
// Sert de garde-fou pendant la refonte UI : voir docs/ui-redesign-plan.md, section 13.
import { gzipSync } from "node:zlib";

const base = process.argv[2] ?? "http://localhost:3100";
const pages = {
  accueil: "/",
  catalogue: "/voitures-electriques",
  fiche: "/voitures-electriques/renault/5-e-tech",
  version: "/voitures-electriques/tesla/model-3/rwd",
  comparateur: "/comparer",
  recharge: "/recharge",
  guide: "/guides/recharge-ac-ou-dc",
  article: "/blog/voitures-electriques-les-plus-sobres",
  outil: "/outils/cout-100-km",
};
const cache = new Map();
async function gz(path) {
  if (!cache.has(path)) {
    const buf = Buffer.from(await (await fetch(base + path)).arrayBuffer());
    cache.set(path, gzipSync(buf).length);
  }
  return cache.get(path);
}
const kb = (n) => (n / 1024).toFixed(1).padStart(6);
console.log("page          html     js    css");
for (const [name, path] of Object.entries(pages)) {
  const html = await (await fetch(base + path)).text();
  const js = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\\ ]+\.js/g)].map((m) => m[0]))];
  const css = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\\ ]+\.css/g)].map((m) => m[0]))];
  const j = (await Promise.all(js.map(gz))).reduce((a, b) => a + b, 0);
  const c = (await Promise.all(css.map(gz))).reduce((a, b) => a + b, 0);
  console.log(`${name.padEnd(12)} ${kb(gzipSync(html).length)} ${kb(j)} ${kb(c)}`);
}
