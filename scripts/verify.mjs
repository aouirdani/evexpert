// Vérification complète d'un lot : `npm run verify`.
//   1. lint, typecheck, tests (avec intégration : Postgres local, OrbStack/Docker lancé), build ;
//   2. serveur de production local (port 3101, jamais le domaine de production) ;
//   3. seo:audit --compare contre une baseline de main générée en local ;
//   4. intertitres H1/H2/H3 des guides inchangés ;
//   5. AdSense : balise google-adsense-account unique dans le <head>, adsbygoogle.js chargé une fois,
//      public/ads.txt exact (scripts/check-adsense.mjs) ;
//   6. avertissement : nombres ajoutés en dur dans les guides (non bloquant).
//
// Baselines (générées sur un build local de main, voir docs/seo/audit/) :
//   --seo-baseline docs/seo/audit/baseline-main.json   --anchors-baseline docs/seo/audit/anchors-main.json
//   --base-ref main   --port 3101   --skip-tests
//   --allow <type>=<motif>[,<motif>…]   écarts attendus du lot (répétable), ex.
//     --allow title-texte-modifie=/,/guides,/voitures-electriques/*/*   (« * » = un segment d'URL)
//   Un écart autorisé est compté à part ; tout autre écart de ce type reste une erreur.
// Régénérer les baselines : node scripts/seo-audit.mjs --base <url> --out … et
// node scripts/check-guide-anchors.mjs --capture --base <url> --out … sur un build de main.

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
};
const seoBaseline = arg("seo-baseline", "docs/seo/audit/baseline-main.json");
const anchorsBaseline = arg("anchors-baseline", "docs/seo/audit/anchors-main.json");
const baseRef = arg("base-ref", "main");
const port = arg("port", "3101");
const skipTests = process.argv.includes("--skip-tests");
/** Écarts SEO attendus : { type: [RegExp] }. */
const allowed = {};
process.argv.forEach((a, i) => {
  if (a !== "--allow") return;
  const [type, patterns = ""] = process.argv[i + 1].split(/=(.*)/s);
  for (const p of patterns.split(",").filter(Boolean)) {
    const re = new RegExp(`^${p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]+")}$`);
    (allowed[type] ??= []).push(re);
  }
});
const isAllowed = (x) => (allowed[x.type] ?? []).some((re) => re.test(x.path));
const base = `http://localhost:${port}`;

const results = [];
const step = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "✔" : "✘"} ${name}${detail ? ` — ${detail}` : ""}`);
};

function run(name, cmd, args) {
  console.log(`\n▶ ${name}`);
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  const ok = r.status === 0;
  if (!ok) console.log(((r.stdout ?? "") + (r.stderr ?? "")).split("\n").slice(-40).join("\n"));
  step(name, ok);
  return { ok, out: (r.stdout ?? "") + (r.stderr ?? "") };
}

async function waitFor(url, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

let failed = false;
const gate = (ok) => {
  if (!ok) failed = true;
  return ok;
};

gate(run("lint", "npm", ["run", "lint", "--silent"]).ok);
gate(run("typecheck", "npm", ["run", "typecheck", "--silent"]).ok);
if (skipTests) step("tests", true, "ignorés (--skip-tests)");
else {
  const db = run("base de test (Postgres local)", "npm", ["run", "db:local:up", "--silent"]);
  if (gate(db.ok)) {
    const t = run("tests (unitaires + intégration)", "npm", ["test", "--silent"]);
    gate(t.ok);
    const m = /Tests\s+(\d+ passed[^\n]*)/.exec(t.out);
    if (m) console.log(`  ${m[1]}`);
  }
}
const build = run("build", "npm", ["run", "build", "--silent"]);
gate(build.ok);

if (build.ok) {
  const server = spawn("npx", ["next", "start", "-p", port], { stdio: "ignore" });
  try {
    if (!gate(await waitFor(`${base}/`))) step("serveur local", false, `pas de réponse sur ${base}`);
    else {
      const dir = mkdtempSync(join(tmpdir(), "evexpert-verify-"));
      const current = join(dir, "seo.json");
      const cap = run("seo:audit (capture)", "node", ["scripts/seo-audit.mjs", "--base", base, "--out", current]);
      gate(cap.ok);
      if (cap.ok) {
        console.log("\n▶ seo:audit --compare");
        // Sortie via un fichier : seo-audit.mjs appelle process.exit juste après console.log, ce qui tronque
        // la sortie quand elle passe par un tube.
        const cmpOut = join(dir, "compare.txt");
        spawnSync("sh", ["-c", `node scripts/seo-audit.mjs --compare "${seoBaseline}" "${current}" > "${cmpOut}" 2>&1`]);
        const text = readFileSync(cmpOut, "utf8");
        const cut = text.search(/\n\s*\d+ anomalie/);
        let issues = [];
        let readable = true;
        try {
          issues = JSON.parse(cut === -1 ? text : text.slice(0, cut));
        } catch {
          readable = text.includes("Aucune anomalie");
        }
        if (!readable) console.log("  ✘ sortie de seo:audit --compare illisible");
        gate(readable);
        // Longueurs de title/meta : constat historique présent dans la baseline, hors périmètre d'un lot.
        const info = new Set(["title-trop-long", "meta-trop-longue"]);
        const warn = new Set(["liens-internes-modifies"]);
        const expected = issues.filter(isAllowed);
        const errors = issues.filter((x) => !info.has(x.type) && !warn.has(x.type) && !isAllowed(x));
        const warnings = issues.filter((x) => warn.has(x.type));
        for (const w of warnings) console.log(`  ⚠ ${w.type} ${w.path}`);
        for (const e of errors) console.log(`  ✘ ${e.type} ${e.path} ${JSON.stringify(e).slice(0, 200)}`);
        step("seo:audit --compare", gate(errors.length === 0), `${errors.length} erreur(s), ${expected.length} écart(s) attendu(s), ${warnings.length} avertissement(s), ${issues.filter((x) => info.has(x.type)).length} longueurs historiques ignorées`);
      }
      const anc = spawnSync("node", ["scripts/check-guide-anchors.mjs", "--compare", anchorsBaseline, "--base", base], { encoding: "utf8" });
      console.log((anc.stdout + anc.stderr).trim().split("\n").map((l) => `  ${l}`).join("\n"));
      step("intertitres H1/H2/H3 des guides, articles et connecteurs inchangés", gate(anc.status === 0));
      const ads = spawnSync("node", ["scripts/check-adsense.mjs", "--base", base], { encoding: "utf8" });
      console.log("\n▶ AdSense (balise, script, ads.txt)");
      console.log((ads.stdout + ads.stderr).trim().split("\n").map((l) => `  ${l}`).join("\n"));
      step("AdSense : balise unique dans le <head>, script chargé une fois, ads.txt exact", gate(ads.status === 0));
    }
  } finally {
    server.kill();
  }
}

console.log("\n▶ nombres ajoutés en dur dans les guides (avertissement)");
console.log(spawnSync("node", ["scripts/check-guide-literals.mjs", "--base-ref", baseRef], { encoding: "utf8" }).stdout);

console.log(failed ? "\nverify : ÉCHEC" : "\nverify : OK");
process.exit(failed ? 1 : 0);
