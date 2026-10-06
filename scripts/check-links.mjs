// Internal link check over the built site in dist/. Fails if any internal
// href or src points at a file that wasn't built.
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

async function exists(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function resolves(path) {
  const clean = decodeURI(path.split(/[?#]/)[0]);
  if (clean === "/" ) return exists(join(dist, "index.html"));
  const base = join(dist, clean);
  return (await exists(base)) || (await exists(`${base}.html`)) || (await exists(join(base, "index.html")));
}

const broken = [];
let checked = 0;
for (const file of await walk(dist)) {
  const html = await readFile(file, "utf8");
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    checked++;
    if (!(await resolves(url))) broken.push(`${file.replace(dist, "/")} → ${url}`);
  }
}

if (broken.length) {
  console.error(`Broken internal links (${broken.length}):\n` + broken.join("\n"));
  process.exit(1);
}
console.log(`Link check passed: ${checked} internal links OK.`);
