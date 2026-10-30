// Off-market buyer list (POST /api/off-market) → Zapier → Follow Up Boss,
// tagged "Off-Market Buyer". See api/_lib/leads.js.
import { BUY_TYPES, BUDGETS, FUNDING, TIMELINES, EMAIL_RE, back, clean, pick, phoneOk, sendLead } from "./_lib/leads.js";

const PAGE = "/off-market";

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return back(request, `${PAGE}?error=send#buyer`);
  }
  if (clean(form.get("company"), 100)) return back(request, `${PAGE}/thanks`);

  const first_name = clean(form.get("first_name"), 60);
  const last_name = clean(form.get("last_name"), 60);
  const email = clean(form.get("email"), 160).toLowerCase();
  const phone = clean(form.get("phone"), 30);
  const types = form.getAll("type").filter((t) => BUY_TYPES.includes(t));
  const budget = pick(clean(form.get("budget"), 40), BUDGETS);
  const funding = pick(clean(form.get("funding"), 40), FUNDING);
  const timeline = pick(clean(form.get("timeline"), 40), TIMELINES);
  const areas = clean(form.get("areas"), 200);
  const notes = clean(form.get("notes"), 1500);

  if (!first_name) return back(request, `${PAGE}?error=name#buyer`);
  if (!EMAIL_RE.test(email)) return back(request, `${PAGE}?error=email#buyer`);
  if (!phoneOk(phone)) return back(request, `${PAGE}?error=phone#buyer`);
  if (types.length === 0) return back(request, `${PAGE}?error=type#buyer`);

  const message = [
    "Off-market buyer list sign-up (paulchs.com/off-market)",
    `Looking for: ${types.join(", ")}`,
    `Price range: ${budget || "–"}`,
    `Buying with: ${funding || "–"}`,
    `Areas: ${areas || "–"}`,
    `Timeline: ${timeline || "–"}`,
    notes ? `Notes: ${notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await sendLead({ form: "off_market", first_name, last_name, email, phone, message, source: "paulchs.com/off-market" });
  if (result !== "ok") return back(request, `${PAGE}?error=${result}#buyer`);
  return back(request, `${PAGE}/thanks`);
}

export function GET(request) {
  return back(request, PAGE);
}
