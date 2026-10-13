// Receives the "Send me the deal" form and forwards it to Paul's Zapier hook.
// Runs on demand (serverless); everything else on the site is static.
import type { APIRoute } from "astro";
import { ZAPIER_WEBHOOK_URL } from "astro:env/server";
import { isSpam, validateLead } from "../../lib/lead";

export const prerender = false;

const back = (request: Request, path: string) => Response.redirect(new URL(path, request.url), 303);

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    // Body too large or malformed – most often oversized photos.
    return back(request, "/send-the-deal?error=photos#form");
  }

  // Bots get the same success page so they learn nothing.
  if (isSpam(form)) return back(request, "/send-the-deal/sent");

  const result = validateLead(form);
  if (!result.ok) return back(request, `/send-the-deal?error=${result.error}#form`);

  if (!ZAPIER_WEBHOOK_URL) return back(request, "/send-the-deal?error=offline#form");

  const { lead } = result;
  const payload = new FormData();
  payload.set("name", lead.name);
  payload.set("contact", lead.contact);
  payload.set("contact_type", lead.contact_type);
  payload.set("address_or_area", lead.address);
  payload.set("units", lead.units);
  payload.set("notes", lead.notes);
  payload.set("source", "paulchs.com/send-the-deal");
  payload.set("submitted_at", new Date().toISOString());
  lead.photos.forEach((photo, i) => payload.append(`photo_${i + 1}`, photo, photo.name || `photo-${i + 1}`));

  try {
    const res = await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      body: payload,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    // Log the failure without the lead's details.
    console.error("send-the-deal: webhook delivery failed", err instanceof Error ? err.message : err);
    return back(request, "/send-the-deal?error=send#form");
  }

  return back(request, "/send-the-deal/sent");
};

export const ALL: APIRoute = ({ request }) => back(request, "/send-the-deal");
