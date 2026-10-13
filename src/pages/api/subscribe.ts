// Adds someone to the Charleston deals list (a Resend segment) and sends a
// short welcome note. Plain form POST, redirects back with ?joined=1.
import type { APIRoute } from "astro";
import { isSpam } from "../../lib/lead";
import { resendReady, subscribe, sendEmail } from "../../lib/resend";
import { renderWelcomeEmail } from "../../lib/digest-email";

export const prerender = false;

const clean = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

// Only send people back to a page on this site.
const safePath = (p: string) => (/^\/[a-z0-9/_-]*$/i.test(p) ? p : "/");

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.redirect(new URL("/?joined=error#join", request.url), 303);
  }
  const back = (status: string) =>
    Response.redirect(new URL(`${safePath(clean(form.get("return_to")))}?joined=${status}#join`, request.url), 303);

  if (isSpam(form)) return back("1");

  const email = clean(form.get("email")).toLowerCase();
  const firstName = clean(form.get("first_name")).slice(0, 60);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) return back("email");
  if (!resendReady()) return back("offline");

  try {
    await subscribe(email, firstName || undefined);
  } catch (err) {
    console.error("subscribe: Resend failed", err instanceof Error ? err.message : err);
    return back("error");
  }

  // The welcome note is a nice-to-have; a failure here doesn't undo the signup.
  try {
    await sendEmail({ to: email, ...renderWelcomeEmail(new URL(request.url).origin) });
  } catch (err) {
    console.error("subscribe: welcome email failed", err instanceof Error ? err.message : err);
  }

  return back("1");
};

export const ALL: APIRoute = ({ request }) => Response.redirect(new URL("/deals", request.url), 303);
