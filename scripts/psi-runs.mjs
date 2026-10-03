// Mesures PageSpeed Insights (mobile) répétées, via l'API de Google.
// Ce sont les serveurs de Google qui chargent la page : rien n'est téléchargé depuis cette machine
// (autorisé pour le domaine de production, contrairement à Lighthouse ou Puppeteer lancés en local).
//
//   PSI_API_KEY=… node scripts/psi-runs.mjs --url https://www.evexpert.fr/ --runs 3 [--pause 35]
//
// Une clé API est nécessaire : sans elle, le quota anonyme partagé est saturé (HTTP 429). Clé gratuite :
// console Google Cloud → API « PageSpeed Insights » → identifiants. Ne jamais la commiter.
//
// Sortie par passage : score, FCP/LCP/TBT/CLS simulés, FCP/LCP OBSERVÉS (avant simulation), élément LCP,
// poids et temps du thread principal des scripts tiers. La comparaison simulé/observé est la clé pour
// comprendre les écarts entre passages (voir docs/perf-mobile.md).

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
};
const url = arg("url");
const runs = Number(arg("runs", "3"));
const pauseS = Number(arg("pause", "35")); // > 30 s : évite le cache de résultats de PSI
const key = process.env.PSI_API_KEY;
if (!url || !key) {
  console.error("Usage : PSI_API_KEY=… node scripts/psi-runs.mjs --url <url> [--runs 3] [--pause 35]");
  process.exit(1);
}

const api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const fmt = (ms) => (ms == null ? "—" : `${(ms / 1000).toFixed(1)} s`);
const rows = [];
for (let i = 1; i <= runs; i++) {
  const q = new URLSearchParams({ url, strategy: "mobile", key });
  for (const c of ["performance", "accessibility", "seo"]) q.append("category", c);
  const res = await fetch(`${api}?${q}`);
  const j = await res.json();
  if (!res.ok) {
    console.error(`passage ${i} : HTTP ${res.status} — ${j.error?.message ?? ""}`.slice(0, 200));
    process.exit(1);
  }
  const lh = j.lighthouseResult;
  const a = lh.audits;
  const m = a.metrics.details.items[0];
  const lcpNode = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? "";
  const third = (a["third-party-summary"]?.details?.items ?? [])
    .map((t) => `${t.entity?.text ?? t.entity}: ${Math.round((t.transferSize ?? 0) / 1024)} Kio, ${Math.round(t.mainThreadTime ?? 0)} ms`)
    .join(" | ");
  rows.push({
    "#": i,
    score: Math.round(lh.categories.performance.score * 100),
    FCP: fmt(m.firstContentfulPaint),
    LCP: fmt(m.largestContentfulPaint),
    TBT: `${Math.round(m.totalBlockingTime)} ms`,
    CLS: m.cumulativeLayoutShift,
    "FCP observé": fmt(m.observedFirstContentfulPaint),
    "LCP observé": fmt(m.observedLargestContentfulPaint),
    "élément LCP": lcpNode.replace(/\s+/g, " ").slice(0, 60),
    "tiers": third.slice(0, 160),
  });
  console.log(JSON.stringify(rows.at(-1)));
  if (i < runs) await new Promise((r) => setTimeout(r, pauseS * 1000));
}
console.table(rows.map(({ tiers, ...r }) => r));
const scores = rows.map((r) => r.score);
console.log(`scores : ${scores.join(", ")} — min ${Math.min(...scores)}, max ${Math.max(...scores)}, médiane ${[...scores].sort((x, y) => x - y)[Math.floor(scores.length / 2)]}`);
