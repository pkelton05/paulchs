// Production-mode check (engagement plan P0 #1–#2): build with review mode off,
// then fail if any VERIFY tag or bracketed placeholder still renders.
// Usage: npm run check:launch   (builds with SITE_MODE=production first)
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const dist = new URL("../dist/client/", import.meta.url).pathname;
const PATTERNS = [/\bVERIFY\b/, /\[NEED\b/i, /\[PLACEHOLDER/i, /\[TESTIMONIAL/i, /\[PHOTO/i, /\[Ranking/i];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

// Visible text only: drop scripts, styles, and tags.
const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");

let problems = 0;
for (const file of await walk(dist)) {
  const text = textOf(await readFile(file, "utf8"));
  for (const re of PATTERNS) {
    const m = text.match(re);
    if (m) {
      const i = m.index;
      console.log(`${relative(dist, file)}: "${text.slice(Math.max(0, i - 40), i + 60).replace(/\s+/g, " ").trim()}"`);
      problems++;
    }
  }
}
if (problems) {
  console.log(`\n${problems} review marker(s) would render on the production site.`);
  process.exit(1);
}
console.log("Launch check passed: no VERIFY tags or placeholders in the production build.");
