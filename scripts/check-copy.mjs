// Copy checks across src/content: em dashes, fair-housing red flags, and
// repeated wording between pages (same sentence, or a shared 8-word run).
// Usage: node scripts/check-copy.mjs [collection]   e.g. areas
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const base = new URL("../src/content/", import.meta.url).pathname;
const only = process.argv[2];

// Fair housing (CLAUDE.md §5). Word-boundary matches, case-insensitive.
const RED_FLAGS = [
  "resident", "residents", "safe", "safety", "crime", "criminal", "school", "schools",
  "family-friendly", "family friendly", "up and coming", "up-and-coming", "good schools",
  "families", "young professionals", "retirees", "students live", "demographic", "diverse",
  "quiet neighborhood", "exclusive", "integrated", "transitional", "gentrif",
];
// Phrases that are fine even though they contain a flagged word.
const ALLOWED = [/medical university/i, /college of charleston/i];

const N = 8;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

const textOf = (md) =>
  md
    .replace(/^---\n([\s\S]*?)\n---/, (_, fm) =>
      fm
        .split("\n")
        .filter((l) => /^\s*(description|summary|buildings|rent_drivers|numbers|- text|text):/.test(l))
        .map((l) => l.replace(/^[^:]+:\s*/, "").replace(/^"|"$/g, ""))
        .join("\n"),
    )
    .replace(/\{\{[^}]+\}\}/g, " ");

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();

const files = (await walk(only ? join(base, only) : base)).sort();
const docs = await Promise.all(files.map(async (f) => ({ id: relative(base, f), text: textOf(await readFile(f, "utf8")) })));

let problems = 0;
for (const d of docs) {
  if (d.text.includes("—")) {
    console.log(`EM DASH  ${d.id}`);
    problems++;
  }
  for (const w of RED_FLAGS) {
    const re = new RegExp(`\\b${w.replace(/[-\s]/g, "[-\\s]")}`, "gi");
    for (const m of d.text.matchAll(re)) {
      const ctx = d.text.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, " ");
      if (ALLOWED.some((a) => a.test(ctx))) continue;
      console.log(`FAIR HOUSING  ${d.id}: "${m[0]}" … ${ctx}`);
      problems++;
    }
  }
}

// Repeated sentences and shared 8-word runs between different files.
const sentences = new Map();
const grams = new Map();
for (const d of docs) {
  for (const s of d.text.split(/(?<=[.!?])\s+/)) {
    const k = norm(s);
    if (k.split(" ").length < 5) continue;
    if (!sentences.has(k)) sentences.set(k, new Set());
    sentences.get(k).add(d.id);
  }
  const words = norm(d.text).split(" ");
  const seen = new Set();
  for (let i = 0; i + N <= words.length; i++) {
    const g = words.slice(i, i + N).join(" ");
    if (seen.has(g)) continue;
    seen.add(g);
    if (!grams.has(g)) grams.set(g, new Set());
    grams.get(g).add(d.id);
  }
}
for (const [s, ids] of sentences) {
  if (ids.size > 1) {
    console.log(`REPEATED SENTENCE  [${[...ids].join(", ")}]: ${s}`);
    problems++;
  }
}
const reportedPairs = new Set();
for (const [g, ids] of grams) {
  if (ids.size < 2) continue;
  const key = [...ids].sort().join(" + ");
  if (reportedPairs.has(key + g.slice(0, 20))) continue;
  reportedPairs.add(key + g.slice(0, 20));
  console.log(`SHARED ${N}-WORD RUN  [${key}]: ${g}`);
  problems++;
}

console.log(problems ? `\n${problems} issue(s) in ${docs.length} file(s).` : `Copy check passed: ${docs.length} file(s).`);
process.exit(problems ? 1 : 0);
