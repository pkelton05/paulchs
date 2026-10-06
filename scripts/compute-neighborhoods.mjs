// Turns raw FlexMLS pulls (data/raw/nbhd-<area-slug>--<slug>.json, written by
// the neighborhood-indexer agent) into the published numbers and page types in
// data/neighborhoods.json. Same math as scripts/compute-areas.mjs.
//
// Usage: node scripts/compute-neighborhoods.mjs [area-slug ...]   (default: every pull file)
import { readFile, writeFile, readdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));

const MIN_SAMPLE = 5; // medians need 5+ sales (AREAS.md)
const MIN_LEASES = 3; // NEIGHBORHOODS.md §5: 3 leases per bedroom count
const MIN_RENT = 500; // lease rows below this are dropped as errors
const MIN_CHANGE = 10; // change figures need 10+ sales in both windows (Paul, 2026-10-06)
const MIN_12MO = 10; // use the 12-month window for sale medians when it has 10+ sales, else 24 months
// NEIGHBORHOODS.md §4: full page if any of these hold over 24 months, whole MLS
const FULL = { res: 15, mf: 3, leases: 10 };
const BEDS = ["1br", "2br", "3br", "4br_plus"];

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
const share = (k, n) => (n ? Math.round((k / n) * 100) : null);
const inWin = (date, [from, to]) => date >= from && date <= to;
const bedKey = (b) => (b === 1 ? "1br" : b === 2 ? "2br" : b === 3 ? "3br" : b >= 4 ? "4br_plus" : null);
const mode = (values) => {
  const c = new Map();
  for (const v of values.filter(Boolean)) c.set(v, (c.get(v) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
};

/** Value at percentile p from rank lookups (same interpolation as quantile()). */
function fromRanks(rankRows, field, n, p, where) {
  if (!n) return null;
  const i = (n - 1) * p;
  const lo = Math.floor(i) + 1;
  const hi = Math.ceil(i) + 1;
  const at = (r) => {
    const row = rankRows.find((x) => x.field === field && x.rank === r);
    if (!row) throw new Error(`${where}: missing ${field} rank ${r} of ${n}`);
    return row.value;
  };
  return at(lo) + (at(hi) - at(lo)) * (i - Math.floor(i));
}

function checkRows(pull, key, notes) {
  const p = pull[key];
  if (p.mode !== "rows") return;
  if (p.rows.length !== p.total_entries) notes.push(`${key}: ${p.rows.length} rows but ${p.total_entries} total_entries`);
  const ids = new Set(p.rows.map((r) => r[0]));
  if (ids.size !== p.rows.length) notes.push(`${key}: duplicate ListingIds`);
}

const isSfd = (r) => r[3] === "Single Family Detached";
function sfdChange(c12, p12) {
  const a = c12.filter(isSfd).map((r) => r[1]);
  const b = p12.filter(isSfd).map((r) => r[1]);
  return a.length >= MIN_CHANGE && b.length >= MIN_CHANGE ? pct(median(a), median(b)) : null;
}

function computeRes(pull, notes) {
  const { cur12, prev12 } = pull.windows;
  const where = `${pull.area_slug}/${pull.slug} res`;
  if (pull.res.mode === "ranks") {
    const r = pull.res;
    const use12 = r.cur12.n >= MIN_SAMPLE;
    const val = (p) => (use12 ? r1k(fromRanks(r.cur12.rank_rows, "ClosePrice", r.cur12.n, p, where)) : null);
    const med = use12 ? fromRanks(r.cur12.rank_rows, "ClosePrice", r.cur12.n, 0.5, where) : null;
    const prevMed = r.prev12.n >= MIN_SAMPLE ? fromRanks(r.prev12.rank_rows, "ClosePrice", r.prev12.n, 0.5, where) : null;
    const sfd = r.subtype_counts?.["Single Family Detached"] ?? 0;
    const sfa = r.subtype_counts?.["Single Family Attached"] ?? 0;
    if (sfd + sfa !== r.total_entries && sfa === 0) notes.push("res: ranks mode with non-detached sales; no change shown");
    return {
      res: {
        median_price: val(0.5),
        p25: val(0.25),
        p75: val(0.75),
        window_months: use12 ? 12 : null,
        n: use12 ? r.cur12.n : 0,
        sales_24mo: r.total_entries,
        sales_12mo: r.cur12.n,
        prior_year_sales: r.prev12.n,
        median_dom: use12 ? Math.round(fromRanks(r.cur12.rank_rows, "CumulativeDaysOnMarket", r.cur12.n, 0.5, where)) : null,
        // Ranks mode has no per-subtype medians, so show a change only when every sale is detached.
        change_1yr_pct: med && prevMed && sfa === 0 && r.cur12.n >= MIN_CHANGE && r.prev12.n >= MIN_CHANGE ? pct(med, prevMed) : null,
        change_basis: "Single Family Detached",
        sfd_sales_12mo: sfa === 0 ? r.cur12.n : null,
        sfd_prior_year_sales: sfa === 0 ? r.prev12.n : null,
      },
      mix: { sfd, sfa, other: Math.max(0, r.total_entries - sfd - sfa), n: r.total_entries },
      yearBuilt: null,
      hoa: null,
      rows: r.sample_rows ?? [],
    };
  }
  // rows mode: [ListingId, ClosePrice, CloseDate, PropertySubType, YearBuilt, DOM, PostalCode, City, AssociationYN]
  // A building listed as both residential and multifamily shows up twice; count it once, as multifamily.
  const mfKeys = new Set((pull.mf.rows ?? []).map((r) => `${r[1]}|${r[2]}`));
  const dual = pull.res.rows.filter((r) => mfKeys.has(`${r[1]}|${r[2]}`));
  if (dual.length) notes.push(`res: ${dual.length} row(s) also listed as multifamily (same price and close date) counted as multifamily only`);
  const all = pull.res.rows.filter((r) => r[1] > 10000 && r[3] !== "Fractional Ownership" && !mfKeys.has(`${r[1]}|${r[2]}`));
  const dropped = pull.res.rows.length - all.length - dual.length;
  if (dropped) notes.push(`res: ${dropped} rows dropped (fractional or price under $10k)`);
  const c12 = all.filter((r) => inWin(r[2], cur12));
  const p12 = all.filter((r) => inWin(r[2], prev12));
  const set = c12.length >= MIN_12MO ? c12 : all.length >= MIN_SAMPLE ? all : null;
  const prices = set?.map((r) => r[1]) ?? [];
  const doms = set?.map((r) => r[5]).filter((d) => typeof d === "number") ?? [];
  const years = all.map((r) => r[4]).filter((y) => typeof y === "number" && y > 1700 && y <= 2027);
  const hoaKnown = all.filter((r) => typeof r[8] === "boolean");
  return {
    res: {
      median_price: set ? r1k(median(prices)) : null,
      p25: set ? r1k(quantile(prices, 0.25)) : null,
      p75: set ? r1k(quantile(prices, 0.75)) : null,
      window_months: set ? (set === c12 ? 12 : 24) : null,
      n: set ? set.length : 0,
      sales_24mo: all.length,
      sales_12mo: c12.length,
      prior_year_sales: p12.length,
      median_dom: doms.length >= MIN_SAMPLE ? Math.round(median(doms)) : null,
      // Detached homes only, like the area pages: a shift between houses and townhomes
      // would otherwise read as a price change.
      change_1yr_pct: sfdChange(c12, p12),
      change_basis: "Single Family Detached",
      sfd_sales_12mo: c12.filter(isSfd).length,
      sfd_prior_year_sales: p12.filter(isSfd).length,
    },
    mix: {
      sfd: all.filter((r) => r[3] === "Single Family Detached").length,
      sfa: all.filter((r) => r[3] === "Single Family Attached").length,
      other: all.filter((r) => r[3] !== "Single Family Detached" && r[3] !== "Single Family Attached").length,
      n: all.length,
    },
    yearBuilt: years.length >= MIN_SAMPLE ? Math.round(median(years)) : null,
    hoa: hoaKnown.length >= MIN_SAMPLE ? share(hoaKnown.filter((r) => r[8]).length, hoaKnown.length) : null,
    rows: all,
  };
}

function computeMf(pull, notes) {
  if (pull.mf.mode !== "rows") throw new Error(`${pull.slug}: mf ranks mode not supported`);
  // [ListingId, ClosePrice, CloseDate, NumberOfUnitsTotal, DOM, PostalCode, YearBuilt]
  const all = pull.mf.rows.filter((r) => r[1] > 0);
  const two4 = all.filter((r) => r[3] >= 2 && r[3] <= 4);
  const ok = two4.length >= MIN_SAMPLE;
  const prices = two4.map((r) => r[1]);
  const excluded = all.length - two4.length;
  for (const r of all) if (r[1] < 50000 || r[1] > 5000000) notes.push(`mf: odd price ${r[1]} (${r[0]})`);
  return {
    median_price: ok ? r1k(median(prices)) : null,
    p25: ok ? r1k(quantile(prices, 0.25)) : null,
    p75: ok ? r1k(quantile(prices, 0.75)) : null,
    price_per_door: ok ? r1k(median(two4.map((r) => r[1] / r[3]))) : null,
    median_dom: ok ? Math.round(median(two4.map((r) => r[4]).filter((d) => typeof d === "number"))) : null,
    window_months: 24,
    n: two4.length,
    sales_24mo: all.length,
    unit_range: "2–4 units",
    excluded: excluded ? `${excluded} sale${excluded === 1 ? "" : "s"} outside 2–4 units or with no unit count` : null,
    rows: all,
  };
}

function computeRents(pull, area, notes) {
  const out = {};
  let neighborhoodLeases = 0;
  const bucket = {};
  if (pull.leases.mode === "ranks") {
    neighborhoodLeases = pull.leases.total_entries;
    for (const b of BEDS) {
      const k = pull.leases.buckets[b] ?? { n: 0, rank_rows: [] };
      bucket[b] = { n: k.n, median: k.n >= MIN_LEASES ? fromRanks(k.rank_rows, "ClosePrice", k.n, 0.5, `${pull.slug} leases ${b}`) : null };
    }
  } else {
    // [ListingId, ClosePrice, CloseDate, BedsTotal, PropertySubType]
    // Under $500 a month is a data-entry error (e.g. a $420 "rent"), not a lease comp.
    const rows = pull.leases.rows.filter((r) => r[1] >= MIN_RENT);
    if (rows.length !== pull.leases.rows.length) notes.push(`leases: ${pull.leases.rows.length - rows.length} row(s) under $${MIN_RENT} dropped`);
    neighborhoodLeases = rows.length;
    for (const r of rows) if (r[1] > 8000) notes.push(`leases: rent over $8,000 (${r[0]}: ${r[1]})`);
    for (const b of BEDS) {
      const rents = rows.filter((r) => bedKey(r[3]) === b).map((r) => r[1]);
      bucket[b] = { n: rents.length, median: rents.length >= MIN_LEASES ? median(rents) : null };
    }
  }
  for (const b of BEDS) {
    if (bucket[b].median != null) {
      out[b] = { value: r25(bucket[b].median), level: "neighborhood", n: bucket[b].n, window_months: 24 };
    } else if (typeof area?.rents?.[b] === "number") {
      // Too few leases here: the MLS area's number, labeled as area-level. Never blended.
      out[b] = { value: area.rents[b], level: "area", n: area.rents.source_by_bed?.[b]?.n ?? null, window_months: 12, neighborhood_n: bucket[b].n };
    } else {
      out[b] = { value: null, level: null, n: bucket[b].n };
    }
  }
  return { rents: out, leases: neighborhoodLeases };
}

function compute(pull, record, area) {
  const notes = [];
  for (const k of ["res", "mf", "leases"]) checkRows(pull, k, notes);
  const r = computeRes(pull, notes);
  const mf = computeMf(pull, notes);
  const basis = { res_sales_24mo: r.res.sales_24mo, mf_sales_24mo: mf.sales_24mo, leases_24mo: pull.leases.total_entries };
  // No MLS sales or leases at all: the page says there aren't any comps and shows no numbers,
  // not even area-level fallbacks (Paul, 2026-10-06).
  const no_comps = basis.res_sales_24mo + basis.mf_sales_24mo + basis.leases_24mo === 0;
  const { rents, leases } = computeRents(pull, no_comps ? null : area, notes);
  basis.leases_24mo = leases;
  const page_type = basis.res_sales_24mo >= FULL.res || basis.mf_sales_24mo >= FULL.mf || basis.leases_24mo >= FULL.leases ? "full" : "short";

  const mixN = r.mix.n + mf.sales_24mo;
  const property_mix = mixN
    ? {
        single_family_detached_pct: share(r.mix.sfd, mixN),
        single_family_attached_pct: share(r.mix.sfa, mixN),
        other_residential_pct: share(r.mix.other, mixN),
        multifamily_pct: share(mf.sales_24mo, mixN),
        sales_counted: mixN,
      }
    : null;

  const years = [...r.rows.map((x) => x[4]), ...mf.rows.map((x) => x[6])].filter((y) => typeof y === "number" && y > 1700 && y <= 2027);
  const zips = [...new Set([...r.rows.map((x) => x[6]), ...mf.rows.map((x) => x[5])].filter(Boolean))].sort();
  const cityFromMls = mode(r.rows.map((x) => x[7]));

  const { rows: _r, ...mfOut } = mf;
  return {
    record: {
      ...record,
      city: record.city ?? cityFromMls,
      page_type,
      no_comps,
      page_type_basis: basis,
      res: r.res,
      mf: mfOut,
      rents,
      property_mix,
      typical_year_built: years.length >= MIN_SAMPLE ? Math.round(median(years)) : null,
      hoa_share_pct: r.hoa,
      zips,
      as_of: pull.pulled_on.slice(0, 7),
      window: { from: pull.windows.w24[0], to: pull.windows.w24[1] },
      sources: [
        `Charleston Trident MLS (FlexMLS) closed residential sales (property type A), subdivision ${pull.mls_subdivisions.map((s) => `'${s}'`).join(" or ")} in ${pull.mls_area_label ?? pull.mls_area}, ${pull.windows.w24.join(" to ")}`,
        "Charleston Trident MLS (FlexMLS) closed multifamily sales (property type B), same subdivision and window; prices use 2–4 units by NumberOfUnitsTotal",
        "Charleston Trident MLS (FlexMLS) lease comps (property type D, status Rented), same subdivision and window; ClosePrice = monthly rent; grouped by BedsTotal",
        "Where a bedroom count has fewer than 3 neighborhood leases, the MLS area's 12-month rent is shown and labeled as area-level (data/areas.json)",
      ],
    },
    notes: [...notes, ...(pull.notes ?? [])],
    cityFromMls,
  };
}

const wanted = process.argv.slice(2);
const data = await read("data/neighborhoods.json");
const { areas } = await read("data/areas.json");
const rawFiles = new Set(await readdir(new URL("data/raw/", root)));
const slugify = (t) => t.toLowerCase().replace(/&/g, " and ").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const rawName = (areaSlug, slug) => `nbhd-${areaSlug}--${slug}.json`;

/** A merged record (mls_also) adds the other area's pull rows to its own. Rows mode only. */
async function withAlso(pull, rec) {
  for (const also of rec.mls_also ?? []) {
    const area = areas.find((a) => a.mls_area === also.mls_area);
    const file = rawName(area.slug, slugify(also.subdivision));
    if (!rawFiles.has(file)) throw new Error(`${rec.slug}: missing ${file} for mls_also`);
    const extra = await read(`data/raw/${file}`);
    for (const k of ["res", "mf", "leases"]) {
      if (pull[k].mode !== "rows" || extra[k].mode !== "rows") throw new Error(`${rec.slug}: mls_also merge needs rows mode (${k})`);
      pull[k] = { mode: "rows", total_entries: pull[k].total_entries + extra[k].total_entries, rows: [...pull[k].rows, ...extra[k].rows] };
    }
    pull.notes = [...(pull.notes ?? []), `merged with ${also.subdivision} in ${also.mls_area} (${file})`];
    pull.mls_area_label = `${pull.mls_area} and ${also.mls_area}`;
  }
  return pull;
}

for (const [i, rec] of data.neighborhoods.entries()) {
  if (wanted.length && !wanted.includes(rec.area_slug)) continue;
  const file = rawName(rec.area_slug, rec.slug);
  if (!rawFiles.has(file)) {
    console.log(`MISSING pull: ${rec.area_slug}/${rec.slug}`);
    continue;
  }
  const pull = await withAlso(await read(`data/raw/${file}`), rec);
  if (rec.mls_area !== pull.mls_area) throw new Error(`${file}: mls_area mismatch`);
  if (JSON.stringify(rec.mls_subdivisions) !== JSON.stringify(pull.mls_subdivisions)) throw new Error(`${file}: mls_subdivisions mismatch`);
  const identity = {
    name: rec.name, slug: rec.slug, area_slug: rec.area_slug, mls_area: rec.mls_area, mls_subdivisions: rec.mls_subdivisions,
    ...(rec.mls_also ? { mls_also: rec.mls_also } : {}),
    county: rec.county, city: rec.city, tier: rec.tier, paul_closings: rec.paul_closings,
  };
  const { record, notes, cityFromMls } = compute(pull, identity, areas.find((a) => a.slug === rec.area_slug));
  data.neighborhoods[i] = record;
  const b = record.page_type_basis;
  const rentStr = BEDS.map((k) => `${k}:${record.rents[k].value ?? "-"}${record.rents[k].level === "area" ? "(area)" : record.rents[k].level ? `(n${record.rents[k].n})` : ""}`).join(" ");
  console.log(
    `${rec.area_slug}/${rec.slug} [${record.page_type}${record.no_comps ? ", no comps" : ""}] res24=${b.res_sales_24mo} mf24=${b.mf_sales_24mo} leases24=${b.leases_24mo} | res median=${record.res.median_price} (${record.res.window_months}mo n=${record.res.n}) | mf 2–4 n=${record.mf.n} median=${record.mf.median_price} | ${rentStr}`,
  );
  if (rec.city && cityFromMls && rec.city !== cityFromMls) notes.push(`city: record says ${rec.city}, MLS mode is ${cityFromMls}`);
  for (const n of notes) console.log(`   note: ${n}`);
}
await writeFile(new URL("data/neighborhoods.json", root), JSON.stringify(data, null, 2) + "\n");
