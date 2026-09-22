// Vérifie que les routes publiques principales répondent 200 sur un site servi
// localement (`npm run build && npm start`).
//   node scripts/smoke-routes.mjs [baseUrl]      (défaut http://localhost:3000)
const base = process.argv[2] ?? "http://localhost:3000";
const routes = [
  "/", "/outils",
  "/outils/cout-recharge-voiture-electrique", "/outils/autonomie-voiture-electrique", "/outils/cout-100-km",
  "/outils/essence-vs-electrique", "/outils/tco-voiture-electrique", "/outils/temps-recharge", "/outils/puissance-borne-recharge",
  "/outils/trajet-longue-distance",
  "/voitures-electriques", "/voitures-electriques/renault", "/voitures-electriques/tesla/model-3",
  "/voitures-electriques/tesla/model-3/rwd", "/voitures-electriques/renault/5-e-tech",
  "/comparer", "/comparer/renault-5-e-tech-52-kwh-150-ch-vs-peugeot-e-208-50-kwh",
  "/recharge", "/recharge/ccs", "/guides", "/guides/wltp-definition", "/blog", "/blog/recharge-rapide-temps-10-80",
  "/a-propos", "/contact", "/sources", "/methodologie", "/mentions-legales", "/confidentialite", "/cookies", "/conditions-utilisation",
  "/sitemap.xml", "/robots.txt", "/blog/rss.xml", "/api/health",
];
let failed = 0;
for (const r of routes) {
  const res = await fetch(base + r, { redirect: "manual" });
  const ok = res.status === 200;
  if (!ok) failed++;
  console.log(`${ok ? "OK " : "KO "} ${res.status} ${r}`);
}
// Anciennes URLs : redirections permanentes attendues.
for (const [from, to] of [["/recharge-a-domicile", "/guides/recharge-domicile-ou-borne-publique"], ["/bornes-recharge", "/recharge"]]) {
  const res = await fetch(base + from, { redirect: "manual" });
  const ok = [301, 308].includes(res.status) && (res.headers.get("location") ?? "").endsWith(to);
  if (!ok) failed++;
  console.log(`${ok ? "OK " : "KO "} ${res.status} ${from} -> ${res.headers.get("location")}`);
}
console.log(failed ? `\n${failed} route(s) en échec.` : `\nToutes les routes répondent correctement (${routes.length + 2}).`);
process.exit(failed ? 1 : 0);
