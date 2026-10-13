// Decides which built pages are kept out of sitemap.xml (and get noindex).
// Rule: drafts are always out. Pages that show MLS-derived numbers are out
// until data/site.json → mls_display.aggregates_approved is true.
import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../../", import.meta.url).pathname;

const collections = [
  { dir: "src/content/areas", url: (id) => `/charleston/${id}` },
  { dir: "src/content/neighborhoods", url: (id) => `/charleston/${id}` },
  { dir: "src/content/questions", url: (id) => `/${id}` },
  { dir: "src/content/pages", url: (id) => `/${id}` },
];

async function walk(dir) {
  let out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(await walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function flag(frontmatter, key, fallback) {
  const m = frontmatter.match(new RegExp(`^${key}:\\s*(true|false)\\s*$`, "m"));
  return m ? m[1] === "true" : fallback;
}

export async function mlsDisplay() {
  const site = JSON.parse(await readFile(join(root, "data/site.json"), "utf8"));
  return site.mls_display;
}

export async function sitemapExclusions() {
  const { aggregates_approved, neighborhood_pages_approved } = await mlsDisplay();
  const excluded = new Set();
  for (const c of collections) {
    const base = join(root, c.dir);
    for (const file of await walk(base)) {
      const text = await readFile(file, "utf8");
      const fm = (text.match(/^---\n([\s\S]*?)\n---/) || [, ""])[1];
      const id = relative(base, file).replace(/\.md$/, "");
      const draft = flag(fm, "draft", true);
      const showsNumbers = flag(fm, "shows_mls_numbers", c.dir.includes("areas") || c.dir.includes("neighborhoods"));
      // Neighborhood pages wait for Paul to confirm the MLS display rules (data/site.json).
      const gatedHood = c.dir.includes("neighborhoods") && !neighborhood_pages_approved;
      if (draft || gatedHood || (showsNumbers && !aggregates_approved)) excluded.add(c.url(id));
    }
  }
  return excluded;
}
