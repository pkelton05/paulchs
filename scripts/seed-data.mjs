// Builds the empty data skeletons from the docs:
//   data/areas.json         ← docs/AREAS.md (exact mls_value strings, slugs, tiers, counties)
//   data/neighborhoods.json ← data/seed-neighborhoods.csv + data/neighborhood-aliases.json
//
// Safe to rerun: existing numbers in areas.json / neighborhoods.json are kept,
// only the identity fields (names, slugs, counts) are refreshed.
// Usage: node scripts/seed-data.mjs
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (p) => readFile(new URL(p, root), "utf8");
const readJson = async (p, fallback) => {
  try {
    return JSON.parse(await read(p));
  } catch {
    return fallback;
  }
};
const write = (p, obj) => writeFile(new URL(p, root), JSON.stringify(obj, null, 2) + "\n");

// ---------- Areas ----------

function parseAreas(md) {
  const areas = [];
  let county = null;
  let current = null;
  for (const line of md.split("\n")) {
    const c = line.match(/^## (Charleston|Dorchester|Berkeley) County/);
    if (/^## /.test(line)) {
      county = c ? c[1] : null;
      current = null;
    }
    const h = line.match(/^### Area (\d+) – (.+)$/);
    if (h && county) {
      current = { area_number: Number(h[1]), name: h[2].trim(), county };
      areas.push(current);
      continue;
    }
    if (!current) continue;
    const v = line.match(/^- \*\*mls_value:\*\* `(.+)`/);
    if (v) current.mls_area = v[1];
    const s = line.match(/^- \*\*slug:\*\* `(.+)`/);
    if (s) current.slug = s[1];
    const t = line.match(/^- \*\*Tier:\*\* ([ABC])/);
    if (t) current.tier = t[1];
  }
  for (const a of areas) {
    if (!a.mls_area || !a.slug || !a.tier) throw new Error(`Incomplete area entry: ${JSON.stringify(a)}`);
  }
  return areas;
}

const emptyAreaNumbers = () => ({
  mf: {
    median_price: null,
    p25: null,
    p75: null,
    price_per_door: null,
    sales_12mo: null,
    median_dom: null,
    change_1yr_pct: null,
    change_5yr_pct: null,
  },
  sfr: { median_price: null, sales_12mo: null, median_dom: null, change_1yr_pct: null, change_5yr_pct: null },
  rents: { "1br": null, "2br": null, "3br": null, "4br_plus": null, source_by_bed: {}, lease_sample: null },
  months_inventory: null,
  zips: [],
  as_of: null,
  sources: [],
});

// ---------- Neighborhoods ----------

function parseCsv(text) {
  const rows = [];
  for (const line of text.trim().split("\n")) {
    const cells = [];
    let cur = "";
    let quoted = false;
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) {
        cells.push(cur);
        cur = "";
      } else cur += ch;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// "A2/B1" → { A: 2, B: 1 }
function parseTypes(s) {
  const out = {};
  for (const part of s.split("/")) {
    const m = part.match(/^([A-Z])(\d+)$/);
    if (m) out[m[1]] = (out[m[1]] || 0) + Number(m[2]);
  }
  return out;
}

// Cities are filled only where certain from the MLS area itself. Everything else stays null for Paul.
const CITY_BY_AREA = {
  51: "Charleston",
  52: "Charleston",
  77: "Charleston",
  42: "Mount Pleasant",
  22: "Folly Beach",
  71: "Hanahan",
};

const emptyNeighborhoodNumbers = () => ({
  page_type: null,
  sfr: { median_price: null, p25: null, p75: null, sales_24mo: null, median_dom: null, change_1yr_pct: null },
  mf: { median_price: null, p25: null, p75: null, price_per_door: null, sales_24mo: null, median_dom: null },
  rents: { "1br": null, "2br": null, "3br": null, "4br_plus": null, source_by_bed: {}, lease_sample: null },
  property_mix: null,
  typical_year_built: null,
  zips: [],
  as_of: null,
  sources: [],
});

async function main() {
  const areas = parseAreas(await read("docs/AREAS.md"));
  const byMls = new Map(areas.map((a) => [a.mls_area, a]));

  // areas.json – keep any numbers already pulled
  const prevAreas = await readJson("data/areas.json", { areas: [] });
  const prevAreaBySlug = new Map((prevAreas.areas || []).map((a) => [a.slug, a]));
  const areasOut = areas.map((a) => {
    const prev = prevAreaBySlug.get(a.slug) || {};
    const numbers = emptyAreaNumbers();
    for (const k of Object.keys(numbers)) if (k in prev) numbers[k] = prev[k];
    return { ...a, ...numbers };
  });
  await write("data/areas.json", {
    _comment:
      "One record per Charleston Trident MLS area (docs/AREAS.md). Identity fields come from scripts/seed-data.mjs; numbers are filled by the area-data-puller subagent. Every number needs as_of, source, and sample_size; samples under 5 stay null. Never hand-edit numbers.",
    areas: areasOut,
  });

  // neighborhoods.json
  const seed = parseCsv(await read("data/seed-neighborhoods.csv"));
  const aliases = await readJson("data/neighborhood-aliases.json", { merges: [] });
  const approved = (aliases.merges || []).filter((m) => m.status === "approved");
  const canonicalFor = (mls, sub) => {
    const m = approved.find((x) => x.mls_area === mls && x.from.includes(sub));
    return m ? m.into : sub;
  };

  const groups = new Map();
  for (const row of seed) {
    const area = byMls.get(row.mls_area);
    if (!area) {
      console.warn(`Skipping row outside the tri-county area list: ${row.mls_area} / ${row.subdivision}`);
      continue;
    }
    const name = canonicalFor(row.mls_area, row.subdivision);
    const key = `${row.mls_area}|${name}`;
    const g = groups.get(key) || {
      name,
      area,
      mls_subdivisions: [],
      closed: 0,
      types: {},
      first_close: row.first_close,
      last_close: row.last_close,
    };
    g.mls_subdivisions.push(row.subdivision);
    g.closed += Number(row.closed_listings);
    for (const [t, n] of Object.entries(parseTypes(row.property_types))) g.types[t] = (g.types[t] || 0) + n;
    if (row.first_close < g.first_close) g.first_close = row.first_close;
    if (row.last_close > g.last_close) g.last_close = row.last_close;
    groups.set(key, g);
  }

  const prevHoods = await readJson("data/neighborhoods.json", { neighborhoods: [] });
  const prevHoodByKey = new Map((prevHoods.neighborhoods || []).map((n) => [`${n.area_slug}/${n.slug}`, n]));

  const seen = new Set();
  const hoods = [...groups.values()]
    .sort((a, b) => a.area.area_number - b.area.area_number || a.name.localeCompare(b.name))
    .map((g) => {
      const slug = slugify(g.name);
      const key = `${g.area.slug}/${slug}`;
      if (seen.has(key)) throw new Error(`Duplicate neighborhood slug in area: ${key}`);
      seen.add(key);
      const prev = prevHoodByKey.get(key) || {};
      const numbers = emptyNeighborhoodNumbers();
      for (const k of Object.keys(numbers)) if (k in prev) numbers[k] = prev[k];
      return {
        name: g.name,
        slug,
        area_slug: g.area.slug,
        mls_area: g.area.mls_area,
        mls_subdivisions: g.mls_subdivisions,
        county: g.area.county,
        city: prev.city ?? CITY_BY_AREA[g.area.area_number] ?? null,
        tier: g.area.tier,
        paul_closings: {
          count: g.closed,
          by_property_type: g.types,
          first_close: g.first_close,
          last_close: g.last_close,
        },
        ...numbers,
      };
    });

  await write("data/neighborhoods.json", {
    _comment:
      "One record per neighborhood (MLS SubdivisionName) where Paul has a closed listing. Identity fields come from scripts/seed-data.mjs (seed CSV + approved merges in neighborhood-aliases.json); numbers and page_type are filled by the neighborhood-indexer subagent. mls_subdivisions lists every exact MLS string to query. paul_closings is counts only – never publish addresses or prices of Paul's sales. Property type codes: A residential, B multifamily, C land.",
    neighborhoods: hoods,
  });

  console.log(`areas.json: ${areasOut.length} areas`);
  console.log(`neighborhoods.json: ${hoods.length} neighborhoods from ${seed.length} seed rows`);
}

await main();
