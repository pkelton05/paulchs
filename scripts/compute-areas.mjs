// Turns raw FlexMLS pulls (data/raw/pull-<slug>.json, written by the
// area-data-puller agent) into the published numbers in data/areas.json.
// One script, so every area uses the same math.
//
// Usage: node scripts/compute-areas.mjs [slug ...]   (default: every pull file)
import { readFile, writeFile, readdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));

const MIN_SAMPLE = 5; // AREAS.md: samples under 5 are null
const MIN_LEASES = 3; // NEIGHBORHOODS.md §5: 3 leases per bedroom count

const quantile = (values, p) => {
  const a = [...values].sort((x, y) => x - y);
  const i = (a.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return a[lo] + (a[hi] - a[lo]) * (i - lo);
};
const median = (v) => quantile(v, 0.5);
const r1k = (v) => Math.round(v / 1000) * 1000;
const r25 = (v) => Math.round(v / 25) * 25;
const pct = (a, b) => Math.round((a / b - 1) * 1000) / 10;
const twoToFour = (rows) => rows.filter((r) => r[2] >= 2 && r[2] <= 4 && r[1] > 0);

function computeArea(pull) {
  const notes = [];
  const cur = twoToFour(pull.mf.cur.rows);
  const prev = twoToFour(pull.mf.prev.rows);
  const y5 = twoToFour(pull.mf.y5.rows);
  for (const w of ["cur", "prev", "y5"]) {
    const m = pull.mf[w];
    if (m.rows.length !== m.total_entries) notes.push(`mf.${w}: ${m.rows.length} rows but ${m.total_entries} total_entries`);
    const ids = new Set(m.rows.map((r) => r[0]));
    if (ids.size !== m.rows.length) notes.push(`mf.${w}: duplicate ListingIds`);
  }
  const excluded = pull.mf.cur.rows.length - cur.length;
  const ok = cur.length >= MIN_SAMPLE;
  const prices = cur.map((r) => r[1]);

  const mf = {
    median_price: ok ? r1k(median(prices)) : null,
    p25: ok ? r1k(quantile(prices, 0.25)) : null,
    p75: ok ? r1k(quantile(prices, 0.75)) : null,
    price_per_door: ok ? r1k(median(cur.map((r) => r[1] / r[2]))) : null,
    sales_12mo: cur.length,
    median_dom: ok ? Math.round(median(cur.map((r) => r[3]).filter((d) => typeof d === "number"))) : null,
    change_1yr_pct: ok && prev.length >= MIN_SAMPLE ? pct(median(prices), median(prev.map((r) => r[1]))) : null,
    change_5yr_pct: ok && y5.length >= MIN_SAMPLE ? pct(median(prices), median(y5.map((r) => r[1]))) : null,
    sample: { sales_12mo: cur.length, prior_year_sales: prev.length, five_years_ago_sales: y5.length },
    unit_range: "2–4 units",
    excluded: excluded ? `${excluded} sale${excluded === 1 ? "" : "s"} outside 2–4 units or with no unit count` : null,
  };

  const s = pull.sfr;
  const sfrOk = (s.cur?.n ?? 0) >= MIN_SAMPLE && typeof s.cur?.median_price === "number";
  const sfr = {
    median_price: sfrOk ? r1k(s.cur.median_price) : null,
    sales_12mo: s.cur?.n ?? 0,
    median_dom: sfrOk && typeof s.cur.median_dom === "number" ? Math.round(s.cur.median_dom) : null,
    change_1yr_pct: sfrOk && (s.prev?.n ?? 0) >= MIN_SAMPLE ? pct(s.cur.median_price, s.prev.median_price) : null,
    change_5yr_pct: sfrOk && (s.y5?.n ?? 0) >= MIN_SAMPLE ? pct(s.cur.median_price, s.y5.median_price) : null,
    subtype_filter: "Single Family Detached",
    sample: { prior_year_sales: s.prev?.n ?? 0, five_years_ago_sales: s.y5?.n ?? 0 },
  };

  const rents = { source_by_bed: {}, lease_sample: 0 };
  for (const bed of ["1br", "2br", "3br", "4br_plus"]) {
    const r = pull.rents[bed] ?? { n: 0, median: null };
    rents.lease_sample += r.n;
    const enough = r.n >= MIN_LEASES && typeof r.median === "number";
    rents[bed] = enough ? r25(r.median) : null;
    rents.source_by_bed[bed] = enough
      ? { source: "Charleston Trident MLS lease comps", n: r.n }
      : { source: "MLS leases < 3 – RentCast pending", n: r.n };
  }

  const salesPerMonth = cur.length / 12;
  const months_inventory = ok && salesPerMonth > 0 ? Math.round((pull.active_2_4 / salesPerMonth) * 10) / 10 : null;
  const zips = [...new Set(pull.mf.cur.rows.map((r) => r[4]).filter(Boolean))].sort();
  const [from, to] = pull.windows.cur;
  const asOf = pull.pulled_on.slice(0, 7);

  return {
    record: {
      mf,
      sfr,
      rents,
      months_inventory,
      inventory_detail: { active_2_4_unit: pull.active_2_4, sales_per_month: Math.round(salesPerMonth * 100) / 100 },
      zips,
      as_of: asOf,
      window: { from, to },
      sources: [
        "Charleston Trident MLS (FlexMLS) closed sales, property type B (multifamily), CloseDate in window, 2–4 units by NumberOfUnitsTotal",
        "Charleston Trident MLS (FlexMLS) closed sales, property type A, sub-type Single Family Detached",
        "Charleston Trident MLS (FlexMLS) lease comps, property type D, status Rented, CloseDate in window; ClosePrice = monthly rent; grouped by BedsTotal",
        `Charleston Trident MLS (FlexMLS) active 2–4 unit listings on ${pull.pulled_on} for months of inventory`,
        `Comparison windows: ${pull.windows.prev.join(" to ")} (1-year) and ${pull.windows.y5.join(" to ")} (5-year)`,
      ],
    },
    notes: [...notes, ...(pull.notes ?? [])],
  };
}

const wanted = process.argv.slice(2);
const files = (await readdir(new URL("data/raw/", root))).filter((f) => /^pull-.+\.json$/.test(f));
const data = await read("data/areas.json");
for (const file of files) {
  const pull = await read(`data/raw/${file}`);
  if (wanted.length && !wanted.includes(pull.slug)) continue;
  const area = data.areas.find((a) => a.slug === pull.slug);
  if (!area) throw new Error(`${file}: no area with slug ${pull.slug}`);
  if (area.mls_area !== pull.mls_area) throw new Error(`${file}: mls_area mismatch`);
  const { record, notes } = computeArea(pull);
  const identity = { area_number: area.area_number, slug: area.slug, name: area.name, mls_area: area.mls_area, county: area.county, tier: area.tier };
  for (const k of Object.keys(area)) delete area[k];
  Object.assign(area, identity, record);
  const m = record.mf;
  console.log(
    `${pull.slug}: 2–4 unit n=${m.sales_12mo} median=${m.median_price} ppd=${m.price_per_door} | SFR n=${record.sfr.sales_12mo} median=${record.sfr.median_price} | rents ${["1br", "2br", "3br", "4br_plus"].map((b) => `${b}:${record.rents[b]}(${record.rents.source_by_bed[b].n})`).join(" ")} | MOI ${record.months_inventory}`,
  );
  for (const n of notes) console.log(`   note: ${n}`);
}
await writeFile(new URL("data/areas.json", root), JSON.stringify(data, null, 2) + "\n");
