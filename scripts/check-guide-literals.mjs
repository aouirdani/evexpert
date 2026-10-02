// Avertissement (jamais bloquant) : nombres ajoutés en dur dans les guides.
// Règle éditoriale : aucun chiffre de véhicule écrit à la main, tout vient du catalogue (`${…}`).
// Compare le contenu actuel de src/data/guides à une référence git (défaut : main) et liste, par fichier et
// ligne, les nombres présents dans les chaînes ajoutées, hors expressions `${…}`, dates, états de charge
// (« 10 à 80 % », « 80 % »), unité « aux 100 km » et puissances de borne standard (3,7 / 7,4 / 11 / 22 kW).
//
//   node scripts/check-guide-literals.mjs [--base-ref main]

import { execFileSync } from "node:child_process";

const i = process.argv.indexOf("--base-ref");
const baseRef = i !== -1 ? process.argv[i + 1] : "main";
const PATHS = ["src/data/guides"];
const STANDARD_KW = new Set(["3,7", "7,4", "11", "22"]);

const diff = execFileSync("git", ["diff", "-U0", baseRef, "--", ...PATHS], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** Retire les `${…}` (accolades imbriquées comprises). */
function stripExpressions(s) {
  let out = "";
  for (let k = 0; k < s.length; k++) {
    if (s[k] === "$" && s[k + 1] === "{") {
      let depth = 0;
      for (k += 1; k < s.length; k++) {
        if (s[k] === "{") depth++;
        else if (s[k] === "}" && --depth === 0) break;
      }
      out += " ";
    } else out += s[k];
  }
  return out;
}

function numbersIn(literal) {
  let t = stripExpressions(literal)
    .replace(/\]\([^)]*\)/g, "]") // cible d'un lien markdown
    .replace(/\d{4}-\d{2}-\d{2}/g, " ")
    .replace(/(?:\/|aux |par |de |pour )100\s?km/gi, " ") // unité « aux 100 km »
    .replace(/\d+(?:[,.]\d+)?\s*(?:à|-|–|→|et)\s*\d+(?:[,.]\d+)?\s*(?:%|pour cent)/gi, " ")
    .replace(/\d+(?:[,.]\d+)?\s*(?:%|pour cent)/gi, " ");
  if (/kW\b/.test(t)) {
    t = t.replace(/\d+(?:,\d+)?/g, (n) => (STANDARD_KW.has(n) ? " " : n));
  }
  return [...t.matchAll(/\d+(?:[,.]\d+)?/g)].map((m) => m[0]);
}

const findings = [];
let file = "";
let line = 0;
for (const raw of diff.split("\n")) {
  if (raw.startsWith("+++ ")) {
    file = raw.slice(6);
    continue;
  }
  const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(raw);
  if (hunk) {
    line = Number(hunk[1]);
    continue;
  }
  if (!raw.startsWith("+") || raw.startsWith("+++")) continue;
  const content = raw.slice(1);
  for (const m of content.matchAll(/"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) {
    const literal = m[1] ?? m[2];
    if (/^[\w./#-]+$/.test(literal) || literal.startsWith("/")) continue; // identifiants, chemins
    const nums = numbersIn(literal);
    if (nums.length) findings.push({ file, line, nums, excerpt: literal.slice(0, 110) });
  }
  line++;
}

if (!findings.length) {
  console.log("Aucun nombre ajouté en dur dans les guides.");
} else {
  console.log(`⚠ ${findings.length} chaîne(s) ajoutée(s) avec des nombres hors \${…} (avertissement, à relire) :`);
  for (const f of findings) console.log(`  ${f.file}:${f.line}  [${f.nums.join(", ")}]  « ${f.excerpt} »`);
}
