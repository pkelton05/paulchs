// Neighborhood data access and the data-driven lines on neighborhood pages
// (docs/NEIGHBORHOODS.md §5–6). Numbers only ever come from data/neighborhoods.json
// (and data/areas.json for area-level rent fallbacks, already copied in by
// scripts/compute-neighborhoods.mjs with level "area").
import hoodsData from "../../data/neighborhoods.json";
import site from "../../data/site.json";
import { areaBySlug, asOfLabel, fmt } from "./areas";

export type HoodRecord = (typeof hoodsData.neighborhoods)[number] & Record<string, any>;
export type RentCell = { value: number | null; level: "neighborhood" | "area" | null; n: number | null; window_months?: number; neighborhood_n?: number };

export const hoods = hoodsData.neighborhoods as HoodRecord[];
export const hoodById = (id: string) => hoods.find((h) => `${h.area_slug}/${h.slug}` === id);

/** Neighborhood pages stay noindex and out of the sitemap until Paul confirms the MLS display rules. */
export const hoodPagesApproved = Boolean((site.mls_display as Record<string, unknown>).neighborhood_pages_approved);

export const BEDS = [
  ["1br", "1-bedroom"],
  ["2br", "2-bedroom"],
  ["3br", "3-bedroom"],
  ["4br_plus", "4+ bedroom"],
] as const;

const money = (v: unknown) => (typeof v === "number" ? fmt.money(v) : null);
const windowPhrase = (months: number | null | undefined) => (months === 12 ? "the last 12 months" : "the last 24 months");

/** H1 per NEIGHBORHOODS.md §6: "[Neighborhood] – [City], SC". */
export function heading(h: HoodRecord): string {
  return h.city ? `${h.name} – ${h.city}, SC` : `${h.name}, SC`;
}

/** Short area name for labels, e.g. "Upper Peninsula" from "Upper Peninsula (outside the Crosstown)". */
export function areaShortName(h: HoodRecord): string {
  return (areaBySlug(h.area_slug)?.name ?? h.area_slug).replace(/\s*\(.*\)$/, "");
}

/** Lead line (§6 item 3): the strongest available numbers, nulls skipped. */
export function leadLine(h: HoodRecord): string | null {
  if (h.no_comps) return null;
  const parts: string[] = [];
  const mf = h.mf ?? {};
  const res = h.res ?? {};
  if (typeof mf.median_price === "number") {
    parts.push(`Small multifamily buildings (2–4 units) in ${h.name} sold for a median of ${money(mf.median_price)} over the last 24 months (${mf.n} sales).`);
  }
  if (typeof res.median_price === "number") {
    parts.push(`${parts.length ? "Homes" : `Homes in ${h.name}`} sold for a median of ${money(res.median_price)} over ${windowPhrase(res.window_months)} (${res.n} sales).`);
  }
  const r2 = h.rents?.["2br"] as RentCell | undefined;
  const r3 = h.rents?.["3br"] as RentCell | undefined;
  const pick = r2?.value != null && r2.level === "neighborhood" ? ["2-bedroom", r2] : r3?.value != null && r3.level === "neighborhood" ? ["3-bedroom", r3] : r2?.value != null ? ["2-bedroom", r2] : null;
  if (pick) {
    const [beds, cell] = pick as [string, RentCell];
    parts.push(
      cell.level === "neighborhood"
        ? `A ${beds} typically leases for ${money(cell.value)} a month.`
        : `Across the wider ${areaShortName(h)} area, a ${beds} typically leases for ${money(cell.value)} a month.`,
    );
  }
  return parts.length ? parts.join(" ") : null;
}

/** "I've closed N listings here" (§6 item 5). Counts only – never addresses or prices. */
export function closingsLine(h: HoodRecord): string | null {
  const c = h.paul_closings;
  if (!site.mls_display.paul_closing_counts_approved || !c?.count) return null;
  const year = c.first_close?.slice(0, 4);
  const types = c.by_property_type ?? {};
  const kinds: string[] = [];
  const word = (n: number, one: string, many: string) => `${n === 1 ? "one" : n === 2 ? "two" : n === 3 ? "three" : n === 4 ? "four" : n} ${n === 1 ? one : many}`;
  if (types.B) kinds.push(word(types.B, "multifamily building", "multifamily buildings"));
  if (types.A) kinds.push(word(types.A, "home", "homes"));
  if (types.C) kinds.push(word(types.C, "lot", "lots"));
  const what = c.count === 1 ? "I've closed a listing here" : `I've closed ${c.count} listings here`;
  const since = year && c.count > 1 ? ` since ${year}` : year ? ` (${year})` : "";
  const detail = c.count > 1 && kinds.length ? `: ${kinds.join(" and ")}` : "";
  return `${what}${since}${detail}.`;
}

/** Source line for a block. */
export function sourceLine(h: HoodRecord, detail: string): string {
  const asOf = asOfLabel(h.as_of);
  return [detail, asOf ? `Data as of ${asOf}` : null].filter(Boolean).join(" · ");
}

export function rentSource(h: HoodRecord, cell: RentCell): string {
  if (cell.level === "neighborhood") return sourceLine(h, `MLS lease comps in ${h.name}, last 24 months · ${cell.n} leases`);
  if (cell.level === "area") {
    const here = cell.neighborhood_n ? `only ${cell.neighborhood_n} here` : "none here";
    return sourceLine(h, `Area-level: MLS lease comps across ${areaShortName(h)}, last 12 months · ${cell.n} leases (${here})`);
  }
  return sourceLine(h, "MLS lease comps · fewer than 3 leases here or in the area");
}

/** Property mix sentence from shares of 24-month sales, e.g. "70% single-family detached, 30% townhomes and attached". */
export function mixLine(h: HoodRecord): string | null {
  const m = h.property_mix;
  if (!m || !m.sales_counted) return null;
  const parts: string[] = [];
  if (m.single_family_detached_pct) parts.push(`${m.single_family_detached_pct}% single-family detached`);
  if (m.single_family_attached_pct) parts.push(`${m.single_family_attached_pct}% townhomes and other attached homes`);
  if (m.multifamily_pct) parts.push(`${m.multifamily_pct}% multifamily`);
  if (m.other_residential_pct) parts.push(`${m.other_residential_pct}% other`);
  return parts.length ? parts.join(", ") : null;
}

export { money };
