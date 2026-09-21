// Instantané SEO/contenu d'un site servi localement : sert à prouver qu'un
// changement d'architecture (ex. migration des données) ne modifie ni les URLs,
// ni les métadonnées, ni le JSON-LD, ni les liens, ni le texte rendu.
//
// Usage : node scripts/seo-snapshot.mjs <baseUrl> <sortie.json>
//         node scripts/seo-snapshot.mjs --diff a.json b.json
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);

if (args[0] === "--diff") {
  const a = JSON.parse(readFileSync(args[1], "utf8"));
  const b = JSON.parse(readFileSync(args[2], "utf8"));
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let diffs = 0;
  for (const k of [...keys].sort()) {
    if (!a[k] || !b[k]) { console.log(`URL ${a[k] ? "supprimée" : "ajoutée"} : ${k}`); diffs++; continue; }
    for (const f of Object.keys(a[k])) {
      if (JSON.stringify(a[k][f]) !== JSON.stringify(b[k][f])) { console.log(`DIFF ${k} [${f}]`); diffs++; }
    }
  }
  console.log(`${keys.size} URLs comparées, ${diffs} différence(s).`);
  process.exit(diffs ? 1 : 0);
}

const [base, out] = args;
const sm = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = ["", ...[...sm.matchAll(/<loc>[^<]*?evexpert\.fr([^<]*)<\/loc>/g)].map((m) => m[1])];
const uniq = [...new Set(urls)];
const snap = {};
const pick = (re, h) => (h.match(re) || [])[1] ?? null;
for (const u of uniq) {
  const res = await fetch(`${base}${u || "/"}`);
  const h = await res.text();
  const ld = [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]);
  const body = h
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  snap[u || "/"] = {
    status: res.status,
    title: pick(/<title>([^<]*)<\/title>/, h),
    description: pick(/<meta name="description" content="([^"]*)"/, h),
    canonical: pick(/<link rel="canonical" href="([^"]*)"/, h),
    robots: pick(/<meta name="robots" content="([^"]*)"/, h),
    jsonld: ld,
    links: [...new Set([...h.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]))].filter((l) => !l.startsWith("/_next")).sort(),
    textHash: createHash("sha256").update(body).digest("hex").slice(0, 16),
  };
}
writeFileSync(out, JSON.stringify(snap, null, 1));
console.log(`${uniq.length} URLs enregistrées dans ${out}`);
