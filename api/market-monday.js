// Charleston Market Monday sign-up (Vercel function, POST /api/market-monday).
//
// Primary path: MARKET_MONDAY_WEBHOOK_URL (set in Vercel) is a Zapier catch
// hook. The Zapier workflow "paulchs Market Monday sign-up → Kit" adds the
// person to Kit with the "Charleston Market Monday" tag via Paul's Kit
// connection in Zapier, so no Kit API key lives in Vercel.
//
// Fallbacks: with KIT_API_KEY set (Kit → Settings → Developer → v4 API key, added in
// Vercel → Settings → Environment Variables): creates the subscriber in Kit
// and tags them "Charleston Market Monday".
// Without it: falls back to Kit's public form endpoint for the existing
// "Newsletter site" form, so no sign-up is lost (but no tag is applied).

const KIT_TAG_ID = 25121747; // "Charleston Market Monday"
const KIT_FALLBACK_FORM_ID = 8033319; // "Newsletter site"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const back = (request, path) =>
  new Response(null, { status: 303, headers: { Location: new URL(path, request.url).toString() } });

const clean = (v) => (typeof v === "string" ? v.trim() : "");

async function viaWebhook(url, email, firstName) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      first_name: firstName,
      source: "paulchs.com/market-monday",
      submitted_at: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
}

async function viaApi(key, email, firstName) {
  const headers = { "Content-Type": "application/json", Accept: "application/json", "X-Kit-Api-Key": key };
  const body = { email_address: email, ...(firstName ? { first_name: firstName } : {}) };
  const sub = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!sub.ok) throw new Error(`Kit subscriber ${sub.status}`);
  const tag = await fetch(`https://api.kit.com/v4/tags/${KIT_TAG_ID}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email }),
    signal: AbortSignal.timeout(8000),
  });
  if (!tag.ok) throw new Error(`Kit tag ${tag.status}`);
}

async function viaPublicForm(email, firstName) {
  const body = new URLSearchParams({ email_address: email });
  if (firstName) body.set("fields[first_name]", firstName);
  const res = await fetch(`https://app.kit.com/forms/${KIT_FALLBACK_FORM_ID}/subscriptions`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Kit form ${res.status}`);
}

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return back(request, "/market-monday?error=send#signup");
  }

  // Honeypot: bots get the success page and learn nothing.
  if (clean(form.get("company"))) return back(request, "/market-monday/thanks");

  const email = clean(form.get("email")).toLowerCase();
  const firstName = clean(form.get("first_name"));
  if (!email || email.length > 160 || !EMAIL_RE.test(email)) return back(request, "/market-monday?error=email#signup");
  if (firstName.length > 60) return back(request, "/market-monday?error=name#signup");

  try {
    const hook = process.env.MARKET_MONDAY_WEBHOOK_URL;
    const key = process.env.KIT_API_KEY;
    if (hook) await viaWebhook(hook, email, firstName);
    else if (key) await viaApi(key, email, firstName);
    else await viaPublicForm(email, firstName);
  } catch (err) {
    console.error("market-monday: sign-up failed", err instanceof Error ? err.message : err);
    return back(request, "/market-monday?error=send#signup");
  }

  return back(request, "/market-monday/thanks");
}

export function GET(request) {
  return back(request, "/market-monday");
}
