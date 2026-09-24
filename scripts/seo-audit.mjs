// Filet de sécurité SEO pour le lot d'optimisations « Optimiser » de docs/seo/keyword-mapping.md.
// Node natif uniquement (fetch), aucune dépendance npm.
//
// Mode capture : lit le sitemap d'un build de production servi en local (`next start`) et relève,
// pour chaque URL, le statut HTTP, le title, la meta description, le canonical, les meta robots,
// le nombre et le texte des H1, les liens internes, et la validité JSON de chaque bloc JSON-LD.
// Vérifie aussi que chaque lien interne unique répond 200.
//
//   node scripts/seo-audit.mjs --base http://localhost:3000 --out docs/seo/audit/baseline.json
//
// Mode compare : signale les écarts inattendus entre deux captures (avant/après un sous-lot).
//
//   node scripts/seo-audit.mjs --compare docs/seo/audit/baseline.json docs/seo/audit/apres-a.json
//
// Écarts signalés : URL disparue du sitemap, statut != 200, canonical ou robots modifié,
// H1 absent ou multiple, title (> 60 caractères) ou meta description (> 160 caractères) trop
// longs, title ou meta description dupliqués entre pages, JSON-LD invalide, lien interne cassé.

import { readFileSync, writeFileSync } from "node:fs";

const TITLE_MAX = 60;
const META_MAX = 160;

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

/** Texte visible d'un H1 : tags internes retirés, entités HTML courantes décodées. */
function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(re, html) {
  const m = html.match(re);
  return m ? m[1] : null;
}

/** Décode les entités HTML : la longueur d'un title/meta doit compter les caractères
 * rendus (Google, un lecteur), pas la source HTML — `&#x27;` (7 car.) est un `'` (1 car.). */
function decodeEntities(text) {
  if (text == null) return text;
  return text
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

async function capturePage(base, path) {
  const res = await fetch(`${base}${path}`);
  const status = res.status;
  const html = status === 200 ? await res.text() : "";

  const title = decodeEntities(pick(/<title>([^<]*)<\/title>/, html));
  const description = decodeEntities(pick(/<meta name="description" content="([^"]*)"/, html));
  const canonical = pick(/<link rel="canonical" href="([^"]*)"/, html);
  const robots = pick(/<meta name="robots" content="([^"]*)"/, html);

  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => stripTags(m[1]));

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      JSON.parse(m[1]);
      return { valid: true };
    } catch {
      return { valid: false, raw: m[1].slice(0, 200) };
    }
  });

  const internalLinks = [...new Set([...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]))].filter(
    (l) => !l.startsWith("/_next"),
  );

  return {
    path,
    url: `${base}${path}`,
    status,
    title,
    titleLength: title?.length ?? null,
    description,
    descriptionLength: description?.length ?? null,
    canonical,
    robots,
    h1Count: h1.length,
    h1,
    internalLinks,
    jsonLd,
  };
}

async function checkLink(base, link) {
  try {
    const res = await fetch(`${base}${link}`);
    return { status: res.status, redirected: res.redirected };
  } catch {
    return { status: 0, redirected: false };
  }
}

async function capture(base, out) {
  const smRes = await fetch(`${base}/sitemap.xml`);
  if (smRes.status !== 200) {
    console.error(`Sitemap inaccessible (${smRes.status}) sur ${base}/sitemap.xml`);
    process.exit(1);
  }
  const sm = await smRes.text();
  const locs = [...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  const paths = locs.map((loc) => {
    try {
      return new URL(loc).pathname || "/";
    } catch {
      return loc;
    }
  });
  const uniquePaths = [...new Set(["/", ...paths])];

  const pages = [];
  for (const path of uniquePaths) {
    pages.push(await capturePage(base, path));
  }

  const allInternalLinks = new Set();
  for (const p of pages) for (const l of p.internalLinks) allInternalLinks.add(l);

  const brokenLinks = [];
  for (const link of allInternalLinks) {
    const { status, redirected } = await checkLink(base, link);
    if (status !== 200) brokenLinks.push({ link, status, redirected });
  }

  const snapshot = {
    capturedAt: new Date().toISOString(),
    base,
    pageCount: pages.length,
    internalLinkCount: allInternalLinks.size,
    brokenLinkCount: brokenLinks.length,
    brokenLinks,
    pages,
  };
  writeFileSync(out, JSON.stringify(snapshot, null, 1));
  console.log(
    `${pages.length} pages capturées, ${allInternalLinks.size} liens internes uniques vérifiés, ${brokenLinks.length} cassé(s). Écrit dans ${out}.`,
  );
}

function compare(beforePath, afterPath) {
  const before = JSON.parse(readFileSync(beforePath, "utf8"));
  const after = JSON.parse(readFileSync(afterPath, "utf8"));
  const beforeByPath = new Map(before.pages.map((p) => [p.path, p]));
  const afterByPath = new Map(after.pages.map((p) => [p.path, p]));

  const issues = [];

  for (const path of beforeByPath.keys()) {
    if (!afterByPath.has(path)) issues.push({ type: "url-disparue", path });
  }

  for (const [path, a] of afterByPath) {
    const b = beforeByPath.get(path);
    if (a.status !== 200) issues.push({ type: "statut-non-200", path, status: a.status });
    if (b) {
      if (b.canonical !== a.canonical) {
        issues.push({ type: "canonical-modifie", path, before: b.canonical, after: a.canonical });
      }
      if (b.robots !== a.robots) {
        issues.push({ type: "robots-modifie", path, before: b.robots, after: a.robots });
      }
    }
    if (a.h1Count === 0) issues.push({ type: "h1-absent", path });
    if (a.h1Count > 1) issues.push({ type: "h1-multiple", path, count: a.h1Count, h1: a.h1 });
    if (a.titleLength != null && a.titleLength > TITLE_MAX) {
      issues.push({ type: "title-trop-long", path, length: a.titleLength, title: a.title });
    }
    if (a.descriptionLength != null && a.descriptionLength > META_MAX) {
      issues.push({ type: "meta-trop-longue", path, length: a.descriptionLength });
    }
    a.jsonLd.forEach((ld, i) => {
      if (!ld.valid) issues.push({ type: "json-ld-invalide", path, index: i });
    });
  }

  const titleMap = new Map();
  const descMap = new Map();
  for (const [path, a] of afterByPath) {
    if (a.title) {
      if (!titleMap.has(a.title)) titleMap.set(a.title, []);
      titleMap.get(a.title).push(path);
    }
    if (a.description) {
      if (!descMap.has(a.description)) descMap.set(a.description, []);
      descMap.get(a.description).push(path);
    }
  }
  for (const [title, paths] of titleMap) if (paths.length > 1) issues.push({ type: "title-duplique", title, paths });
  for (const [description, paths] of descMap) {
    if (paths.length > 1) issues.push({ type: "meta-dupliquee", description, paths });
  }

  for (const b of after.brokenLinks ?? []) issues.push({ type: "lien-casse", link: b.link, status: b.status });

  console.log(JSON.stringify(issues, null, 2));
  console.log(`\n${issues.length} anomalie(s) sur ${afterByPath.size} pages comparées (référence : ${beforeByPath.size}).`);
  process.exit(issues.length ? 1 : 0);
}

const args = process.argv.slice(2);
if (args[0] === "--compare") {
  compare(args[1], args[2]);
} else {
  const base = arg("base", "http://localhost:3000");
  const out = arg("out");
  if (!out) {
    console.error("Usage : node scripts/seo-audit.mjs --base <url> --out <fichier.json>");
    console.error("        node scripts/seo-audit.mjs --compare <avant.json> <apres.json>");
    process.exit(1);
  }
  await capture(base, out);
}
