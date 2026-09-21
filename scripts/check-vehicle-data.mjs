// Contrôle de cohérence du catalogue véhicules (lancé par `npm run check:data`).
// Repère les erreurs de saisie / de conversion d'unités avant publication.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/data/vehicles.ts", import.meta.url), "utf8");
const rowRe = /^\s*\[("[^\]]*)\],\s*$/gm;
const rows = [];
for (const m of src.matchAll(rowRe)) {
  try { rows.push(JSON.parse(`[${m[1]}]`)); } catch { /* ignore non-row arrays */ }
}
const problems = [];
const seen = new Set();
for (const r of rows) {
  const [brand, model, version, , , , , gross, usable, range, cons, kw, ps, , acc, top, ac, dc, t, , , , kg, boot, bootMax, seats, , path] = r;
  const name = `${brand} ${model} ${version}`;
  if (seen.has(name)) problems.push(`${name}: doublon`);
  seen.add(name);
  if (gross && usable > gross) problems.push(`${name}: batterie utile > brute`);
  if (cons != null) {
    const ratio = ((cons / 1000) * range) / usable;
    if (ratio < 1.05 || ratio > 1.4) problems.push(`${name}: consommation incohérente (ratio ${ratio.toFixed(2)})`);
  }
  const kwFromPs = ps * 0.7355;
  if (Math.abs(kwFromPs - kw) / kw > 0.03) problems.push(`${name}: kW/ch incohérents`);
  if (acc && (acc < 2 || acc > 20)) problems.push(`${name}: 0-100 hors plage`);
  if (top && (top < 100 || top > 300)) problems.push(`${name}: vitesse max hors plage`);
  if (dc && dc < ac) problems.push(`${name}: DC < AC`);
  if (t && (t < 10 || t > 60)) problems.push(`${name}: 10-80 % hors plage`);
  if (boot && bootMax && bootMax < boot) problems.push(`${name}: coffre max < coffre`);
  if (kg && (kg < 900 || kg > 3000)) problems.push(`${name}: poids hors plage`);
  if (![2, 4, 5, 6, 7].includes(seats)) problems.push(`${name}: places`);
  if (!/^(uk\/)?car\/\d+\//.test(path)) problems.push(`${name}: chemin source`);
}
console.log(`${rows.length} véhicules contrôlés.`);
if (problems.length) {
  console.error(problems.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}
console.log("Aucune incohérence détectée.");
