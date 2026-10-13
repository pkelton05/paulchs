// The weekly Charleston deals digest: what the members page (/deals) and the
// Tuesday email show. The data lives in the Vercel Edge Config store
// "paulchs-deals" under the key "deals_digest". Paul's weekly "Deals Digest"
// scheduled task writes it from the Deal Intake Screener logs; nothing here
// writes it. Locally (no EDGE_CONFIG), data/deals.sample.json stands in.
import { createClient } from "@vercel/edge-config";
import { createHash } from "node:crypto";
import sample from "../../data/deals.sample.json";
import { site, reviewMode } from "./site";

export const DIGEST_KEY = "deals_digest";

export type Rating = "STRONG BUY" | "GOOD BUY" | "CONDITIONAL";

export type Deal = {
  id: string;
  mls_number: string | null;
  address: string;
  city: string;
  zip: string;
  submarket: string;
  property_type: string;
  units: number;
  unit_mix: string;
  year_built: number | null;
  price: number;
  price_per_unit: number;
  rating: Rating;
  rents_monthly: number | null;
  rents_basis: "actual" | "estimated";
  noi: number | null;
  cap_rate: number | null;
  cash_on_cash: number | null;
  dscr: number | null;
  cash_flow: number | null;
  headline: string;
  upside: string | null;
  watch: string | null;
  listing_office: string | null;
  listing_url: string | null;
  status: string;
};

export type Digest = {
  week_of: string; // YYYY-MM-DD, the Monday the task ran
  updated_at: string;
  intro: string;
  assumptions: string;
  deals: Deal[];
};

/**
 * MLS listings from other brokerages may only go on the site or out to the list
 * once Paul confirms the display rules with CTAR and his broker-in-charge
 * (data/site.json → mls_display.deals_digest_approved). Until then the members
 * page and the list email are review-only: they render on preview builds, and
 * the "Send to the list" step refuses to send.
 */
export const dealsApproved = site.mls_display.deals_digest_approved === true;
export const dealsVisible = dealsApproved || reviewMode;

export async function getDigest(): Promise<Digest | null> {
  const conn = process.env.EDGE_CONFIG;
  if (!conn) return reviewMode ? (sample as Digest) : null;
  try {
    const digest = await createClient(conn).get<Digest>(DIGEST_KEY);
    return digest && Array.isArray(digest.deals) ? digest : null;
  } catch (err) {
    console.error("deals: Edge Config read failed", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Short fingerprint of the deals, so an approval link only works for the version Paul previewed. */
export const digestFingerprint = (d: Digest) =>
  createHash("sha256").update(JSON.stringify([d.week_of, d.deals])).digest("hex").slice(0, 16);

/** True when the digest is from the last 8 days – an older one means the weekly task didn't run. */
export function isCurrent(d: Digest, now = new Date()): boolean {
  const age = now.getTime() - new Date(`${d.week_of}T12:00:00Z`).getTime();
  return age >= -2 * 864e5 && age <= 8 * 864e5;
}

// Formatting
const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const money = (n: number | null | undefined) => (n == null ? "–" : usd0.format(n));
export const moneyK = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(2).replace(/\.?0+$/, "")}M` : `$${Math.round(n / 1000)}K`);
export const pct = (n: number | null | undefined) => (n == null ? "–" : `${n.toFixed(1)}%`);
export const ratio = (n: number | null | undefined) => (n == null ? "–" : `${n.toFixed(2)}x`);
export const unitsLabel = (u: number) => (u === 1 ? "1 unit" : `${u} units`);
export const weekLabel = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });

export const ratingLabel: Record<Rating, string> = {
  "STRONG BUY": "Strong buy",
  "GOOD BUY": "Good buy",
  CONDITIONAL: "Worth a look if it checks out",
};
