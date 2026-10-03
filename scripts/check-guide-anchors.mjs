// Contrôle des intertitres des guides, des articles du blog et des pages connecteurs : H1, H2 et H3 (niveau, ancre `id`, texte) identiques avant/après.
// Les ancres servent aux liens profonds et au sommaire : un lot éditorial ne doit pas les changer.
// Node natif uniquement (fetch).
//
//   node scripts/check-guide-anchors.mjs --capture --base http://localhost:3000 --out docs/seo/audit/anchors-main.json
//   node scripts/check-guide-anchors.mjs --compare docs/seo/audit/anchors-main.json --base http://localhost:3000
//
// Une page absente de la référence (nouvelle page) est signalée mais n'est pas une erreur ; une page de la
// référence qui a disparu ou dont un intertitre diffère est une erreur (code de sortie 1).

import { readFileSync, writeFileSync } from "node:fs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

const text = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&(?:apos|#39|#x27);/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Chemins des guides (/guides/x), articles (/blog/x) et connecteurs (/recharge/x), lus dans le sitemap. */
async function contentPaths(base) {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>[^<]*(\/(?:guides|blog|recharge)\/[^<\/]+)<\/loc>/g)].map((m) => m[1]).sort();
}

async function headings(base, path) {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`${path} : HTTP ${res.status}`);
  const html = await res.text();
  return [...html.matchAll(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    id: /\bid="([^"]*)"/.exec(m[2])?.[1] ?? null,
    text: text(m[3]),
  }));
}

async function capture(base) {
  const out = {};
  for (const path of await contentPaths(base)) out[path] = await headings(base, path);
  return out;
}

const base = arg("base", "http://localhost:3000");
if (process.argv.includes("--capture")) {
  const out = arg("out");
  if (!out) throw new Error("--out requis");
  const data = await capture(base);
  writeFileSync(out, JSON.stringify(data, null, 1));
  console.log(`${Object.keys(data).length} pages, intertitres écrits dans ${out}`);
} else if (arg("compare")) {
  const before = JSON.parse(readFileSync(arg("compare"), "utf8"));
  const after = await capture(base);
  const errors = [];
  for (const [slug, list] of Object.entries(before)) {
    if (!after[slug]) {
      errors.push(`${slug} : page disparue`);
      continue;
    }
    const a = after[slug];
    const max = Math.max(list.length, a.length);
    for (let i = 0; i < max; i++) {
      const x = list[i], y = a[i];
      if (!x || !y || x.level !== y.level || x.id !== y.id || x.text !== y.text) {
        errors.push(`${slug} : intertitre n°${i + 1} modifié — avant ${x ? `H${x.level} #${x.id} « ${x.text} »` : "(absent)"}, après ${y ? `H${y.level} #${y.id} « ${y.text} »` : "(absent)"}`);
        break;
      }
    }
  }
  const added = Object.keys(after).filter((s) => !before[s]);
  if (added.length) console.log(`Nouvelles pages (hors référence) : ${added.join(", ")}`);
  if (errors.length) {
    console.error(errors.join("\n"));
    console.error(`${errors.length} page(s) avec intertitres modifiés.`);
    process.exit(1);
  }
  console.log(`Intertitres identiques sur ${Object.keys(before).length} pages (guides, blog, connecteurs).`);
} else {
  console.error("Usage : --capture --out <fichier> | --compare <référence>  [--base <url>]");
  process.exit(1);
}
