// Shared by the lead forms: choice lists (also imported by the Astro pages via
// src/lib/leads.ts) and the helper that forwards a lead to Zapier.
//
// LEADS_WEBHOOK_URL (set in Vercel) is the Zapier catch hook for the workflow
// "paulchs website leads → Follow Up Boss". It creates or updates the person
// in Follow Up Boss as a website inquiry, tagged by form:
//   off_market → "Off-Market Buyer"   property_value → "Valuation Request"

export const BUY_TYPES = [
  "Single-family rental",
  "Duplex to fourplex (2–4 units)",
  "Small apartments (5–49 units)",
  "50+ units",
  "Fix-and-flip",
  "Land or new construction",
];
export const BUDGETS = ["Under $300K", "$300K–$500K", "$500K–$1M", "$1M–$3M", "$3M–$10M", "$10M+"];
export const FUNDING = ["Cash", "Financing", "1031 exchange", "Not sure yet"];
export const TIMELINES = ["Ready now", "Next 3 months", "3–6 months", "6+ months, just looking"];

export const PROPERTY_TYPES = ["Single-family rental", "Condo or townhouse", "Duplex to fourplex", "Apartment building", "Mixed-use", "Other"];
export const UNIT_COUNTS = ["1", "2", "3–4", "5–10", "11–24", "25–49", "50+"];
export const OCCUPANCY = ["Fully rented", "Partly vacant", "Vacant", "Short-term rental", "I live in part of it"];
export const SELL_TIMELINES = ["Just curious", "Maybe in the next year", "Next 3–6 months", "Ready to sell now"];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const back = (request, path) =>
  new Response(null, { status: 303, headers: { Location: new URL(path, request.url).toString() } });
export const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const pick = (v, list) => (list.includes(v) ? v : "");
export const phoneOk = (phone) => {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

export async function sendLead(payload) {
  const hook = process.env.LEADS_WEBHOOK_URL;
  if (!hook) return "offline";
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, submitted_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook ${res.status}`);
    return "ok";
  } catch (err) {
    console.error(`${payload.form}: delivery failed`, err instanceof Error ? err.message : err);
    return "send";
  }
}
