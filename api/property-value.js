// Free investment property valuation (POST /api/property-value) → Zapier →
// Follow Up Boss, tagged "Valuation Request". See api/_lib/leads.js.
import { PROPERTY_TYPES, UNIT_COUNTS, OCCUPANCY, SELL_TIMELINES, EMAIL_RE, back, clean, pick, phoneOk, sendLead } from "./_lib/leads.js";

const PAGE = "/property-value";

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return back(request, `${PAGE}?error=send#value`);
  }
  if (clean(form.get("company"), 100)) return back(request, `${PAGE}/thanks`);

  const address = clean(form.get("address"), 200);
  const property_type = pick(clean(form.get("property_type"), 40), PROPERTY_TYPES);
  const units = pick(clean(form.get("units"), 10), UNIT_COUNTS);
  const occupancy = pick(clean(form.get("occupancy"), 40), OCCUPANCY);
  const timeline = pick(clean(form.get("timeline"), 40), SELL_TIMELINES);
  const first_name = clean(form.get("first_name"), 60);
  const last_name = clean(form.get("last_name"), 60);
  const email = clean(form.get("email"), 160).toLowerCase();
  const phone = clean(form.get("phone"), 30);
  const notes = clean(form.get("notes"), 1500);

  if (!address) return back(request, `${PAGE}?error=address#value`);
  if (!first_name) return back(request, `${PAGE}?error=name#value`);
  if (!EMAIL_RE.test(email)) return back(request, `${PAGE}?error=email#value`);
  if (!phoneOk(phone)) return back(request, `${PAGE}?error=phone#value`);

  const message = [
    "Free valuation request (paulchs.com/property-value)",
    `Address: ${address}`,
    `Type: ${property_type || "–"}`,
    `Units: ${units || "–"}`,
    `Occupancy: ${occupancy || "–"}`,
    `Selling: ${timeline || "–"}`,
    notes ? `Notes: ${notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await sendLead({
    form: "property_value",
    first_name,
    last_name,
    email,
    phone,
    message,
    address,
    source: "paulchs.com/property-value",
  });
  if (result !== "ok") return back(request, `${PAGE}?error=${result}#value`);
  return back(request, `${PAGE}/thanks`);
}

export function GET(request) {
  return back(request, PAGE);
}
