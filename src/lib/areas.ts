// Area data access, formatting, and token filling for area pages.
// Numbers only ever come from data/areas.json; copy references them as
// {{path}} tokens (e.g. {{mf.price_per_door}}), filled here at build time.
import areasData from "../../data/areas.json";
import hoodsData from "../../data/neighborhoods.json";
import site from "../../data/site.json";

export type AreaRecord = (typeof areasData.areas)[number] & Record<string, any>;

export const areas = areasData.areas as AreaRecord[];
export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
export const hoodsInArea = (slug: string) =>
  hoodsData.neighborhoods
    .filter((n) => n.area_slug === slug)
    .sort((a, b) => b.paul_closings.count - a.paul_closings.count || a.name.localeCompare(b.name));

export const COUNTIES = ["Charleston", "Dorchester", "Berkeley"] as const;
export const countySlug = (county: string) => `${county.toLowerCase()}-county`;

// Minimum samples before a change figure is shown (Paul, 2026-10-06):
// both the current and the comparison window need 10+ sales.
export const MIN_CHANGE_SAMPLE = 10;
// Minimum 2–4 unit sales before the multifamily lead line is used (AREAS.md).
export const MIN_MF_SALES = 5;

const money = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

export function get(area: AreaRecord, path: string): unknown {
  return path.split(".").reduce<any>((o, k) => (o == null ? undefined : o[k]), area);
}

export function format(path: string, value: unknown): string {
  if (typeof value !== "number") return String(value);
  if (/pct$/.test(path)) return pct(value);
  if (/^rents\.|price|p25|p75|per_door/.test(path)) return money(value);
  if (/inventory/.test(path)) return value.toFixed(1);
  return value.toLocaleString("en-US");
}

/** Replace {{path}} tokens with formatted data. Missing data fails the build. */
export function fill(text: string, area: AreaRecord, where: string): string {
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    const v = get(area, path);
    if (v === null || v === undefined) {
      throw new Error(`${where}: token {{${path}}} has no data for ${area.slug}. Rewrite the sentence or pull the data.`);
    }
    return format(path, v);
  });
}

/** "October 2026" from "2026-10". */
export function asOfLabel(asOf: string | null | undefined): string | null {
  if (!asOf) return null;
  const [y, m] = asOf.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** Per-block source line: what it is, sample size, and the as-of stamp. */
export function sourceLine(area: AreaRecord, detail: string): string {
  const asOf = asOfLabel(area.as_of);
  return [detail, asOf ? `Data as of ${asOf}` : null].filter(Boolean).join(" · ");
}

/** The MLS attribution, shown once under each set of number blocks. */
export const attribution = site.mls_attribution;

export function changeShown(area: AreaRecord, kind: "mf" | "sfr", which: "1yr" | "5yr"): number | null {
  const block = area[kind];
  const value = block?.[`change_${which}_pct`];
  if (typeof value !== "number") return null;
  const cur = block.sales_12mo ?? 0;
  const prior = which === "1yr" ? block.sample?.prior_year_sales : block.sample?.five_years_ago_sales;
  return cur >= MIN_CHANGE_SAMPLE && (prior ?? 0) >= MIN_CHANGE_SAMPLE ? value : null;
}

/** Data-driven lead line per AREAS.md template item 3. */
export function leadLine(area: AreaRecord, name: string, place = `in ${name}`): string | null {
  const mf = area.mf ?? {};
  if (typeof mf.median_price === "number" && (mf.sales_12mo ?? 0) >= MIN_MF_SALES) {
    return `Small multifamily ${place} sold for about ${money(mf.median_price)} in the last 12 months (${mf.sales_12mo} sales).`;
  }
  const sfr = area.sfr ?? {};
  const rent2 = area.rents?.["2br"];
  if (typeof sfr.median_price === "number") {
    const rent = typeof rent2 === "number" ? ` A 2-bedroom typically leases for ${money(rent2)} a month.` : "";
    return `Small multifamily rarely trades ${place}. Single-family homes sold for a median of ${money(sfr.median_price)} in the last 12 months (${sfr.sales_12mo} sales).${rent}`;
  }
  return null;
}

export const fmt = { money, pct };
