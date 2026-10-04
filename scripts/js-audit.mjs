// Diagnostic du JavaScript côté client (Lighthouse mobile, CPU ×4, serveur LOCAL uniquement).
//   node scripts/js-audit.mjs [--base http://localhost:3101] [--runs 3] [--out dossier] [--label avant]
// Pour chaque page : médiane de N passages (score, TBT, FCP, LCP, exécution JS, travail du thread
// principal, poids JS) ; temps d'exécution par script, séparé entre nos fichiers (/_next/…) et
// les scripts tiers (Google…) ; poids de chaque chunk (treemap Lighthouse).
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? process.argv[i + 1] : d; };
const base = arg("base", "http://localhost:3101");
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) { console.error("Refusé : serveur local uniquement."); process.exit(2); }
const runs = Number(arg("runs", "3"));
const out = arg("out", "/tmp/js-audit");
const label = arg("label", "run");
const pages = { accueil: "/", fiche: "/voitures-electriques/tesla/model-y/rwd", guide: "/guides/temps-recharge-voiture-electrique" };
mkdirSync(out, { recursive: true });

const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const own = (url) => url.startsWith(base) || url.includes("/_next/");
const result = {};
for (const [name, path] of Object.entries(pages)) {
  const rows = [];
  for (let i = 0; i < runs; i++) {
    const file = join(out, `${label}-${name}-${i}.json`);
    const r = spawnSync("npx", ["--no-install", "lighthouse", `${base}${path}`, "--output=json", `--output-path=${file}`, "--quiet", "--only-categories=performance",
      "--chrome-flags=--headless=new --no-sandbox"], { encoding: "utf8", maxBuffer: 1 << 28 });
    if (r.status !== 0) { console.error(r.stderr.slice(-400)); continue; }
    const j = JSON.parse(readFileSync(file, "utf8"));
    const a = j.audits;
    const boot = a["bootup-time"].details?.items ?? [];
    const sum = (f, k) => boot.filter(f).reduce((s, x) => s + (x[k] ?? 0), 0);
    const net = (a["network-requests"].details?.items ?? []).filter((x) => x.resourceType === "Script");
    rows.push({
      score: Math.round(j.categories.performance.score * 100),
      tbt: a["total-blocking-time"].numericValue, fcp: a["first-contentful-paint"].numericValue, lcp: a["largest-contentful-paint"].numericValue,
      scriptEval: sum(() => true, "scripting"), ownEval: sum((x) => own(x.url), "scripting"), thirdEval: sum((x) => !own(x.url), "scripting"),
      ownTotal: sum((x) => own(x.url), "total"), thirdTotal: sum((x) => !own(x.url), "total"),
      mainThread: a["mainthread-work-breakdown"].numericValue, bootup: a["bootup-time"].numericValue,
      jsKB: net.reduce((s, x) => s + (x.transferSize ?? 0), 0) / 1024, ownJsKB: net.filter((x) => own(x.url)).reduce((s, x) => s + (x.transferSize ?? 0), 0) / 1024,
      nScripts: net.length, boot, net,
    });
  }
  const keys = ["score", "tbt", "fcp", "lcp", "scriptEval", "ownEval", "thirdEval", "ownTotal", "thirdTotal", "mainThread", "bootup", "jsKB", "ownJsKB", "nScripts"];
  const med = Object.fromEntries(keys.map((k) => [k, Math.round(median(rows.map((r) => r[k])) * 10) / 10]));
  // Détail par script (passage médian sur le score de TBT)
  const mid = [...rows].sort((x, y) => x.tbt - y.tbt)[Math.floor(rows.length / 2)];
  result[name] = { median: med, scripts: mid.boot.map((x) => ({ url: x.url.replace(base, ""), scripting: Math.round(x.scripting), total: Math.round(x.total) })).sort((a, b) => b.total - a.total).slice(0, 14),
    sizes: mid.net.map((x) => ({ url: x.url.replace(base, "").slice(0, 90), kb: Math.round(x.transferSize / 102.4) / 10 })).sort((a, b) => b.kb - a.kb).slice(0, 14) };
}
writeFileSync(join(out, `${label}.json`), JSON.stringify(result, null, 1));
for (const [n, v] of Object.entries(result)) console.log(n, JSON.stringify(v.median));
