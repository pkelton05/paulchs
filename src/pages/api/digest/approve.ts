// "Send to the list" from Paul's preview email.
// GET shows a confirm button (mail scanners open links, so GET never sends).
// POST sends the broadcast – once per week, and only for the version previewed.
import type { APIRoute } from "astro";
import { getDigest, digestFingerprint, dealsApproved } from "../../../lib/deals";
import { checkApproval } from "../../../lib/digest-auth";
import { renderDigestEmail, broadcastName } from "../../../lib/digest-email";
import { resendReady, findBroadcast, sendBroadcast } from "../../../lib/resend";

export const prerender = false;

const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{margin:0;background:#eef0eb;color:#2b2420;font:19px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}main{max-width:34rem;margin:0 auto;padding:3rem 1.25rem}h1{font-size:1.6rem;line-height:1.25}button{font:inherit;font-weight:700;background:#3d5a2c;color:#fff;border:0;border-radius:4px;padding:.75rem 1.25rem;cursor:pointer}button:focus-visible{outline:3px solid #1e3640;outline-offset:2px}a{color:#3d5a2c}</style></head>
<body><main><h1>${title}</h1>${body}</main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );

type Check = { ok: true; week: string; fp: string; sig: string } | { ok: false; res: Response };

async function verify(params: URLSearchParams): Promise<Check & { digest?: Awaited<ReturnType<typeof getDigest>> }> {
  const week = params.get("week") || "";
  const fp = params.get("v") || "";
  const sig = params.get("sig") || "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week) || !checkApproval(week, fp, sig)) {
    return { ok: false, res: page("That link doesn't work", "<p>This send link is invalid. Use the button in the latest preview email.</p>", 403) };
  }
  const digest = await getDigest();
  if (!digest || digest.week_of !== week || digestFingerprint(digest) !== fp) {
    return {
      ok: false,
      res: page(
        "The deals changed after this preview",
        "<p>The digest was updated after this preview went out, so this link no longer matches what would be sent. Use the newest preview email instead.</p>",
        409,
      ),
    };
  }
  if (!dealsApproved) {
    return {
      ok: false,
      res: page(
        "Sending is switched off for now",
        "<p>MLS display for the list isn't approved yet. Once your broker-in-charge and CTAR sign off, set <code>mls_display.deals_digest_approved</code> to <code>true</code> in <code>data/site.json</code>.</p>",
        423,
      ),
    };
  }
  return { ok: true, week, fp, sig, digest };
}

export const GET: APIRoute = async ({ url }) => {
  const v = await verify(url.searchParams);
  if (!v.ok) return v.res;
  const n = v.digest!.deals.length;
  return page(
    "Send this week's deals to the list?",
    `<p>Week of ${v.week} · ${n} ${n === 1 ? "deal" : "deals"}. This goes to everyone subscribed to the Charleston deals list.</p>
     <form method="post"><input type="hidden" name="week" value="${v.week}"><input type="hidden" name="v" value="${v.fp}"><input type="hidden" name="sig" value="${v.sig}"><button type="submit">Send to the list</button></form>`,
  );
};

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData().catch(() => new FormData());
  const params = new URLSearchParams();
  for (const k of ["week", "v", "sig"]) params.set(k, String(form.get(k) ?? ""));
  const v = await verify(params);
  if (!v.ok) return v.res;
  if (!resendReady()) return page("Email isn't connected", "<p>Resend isn't connected to this project.</p>", 503);

  const digest = v.digest!;
  const name = broadcastName(digest);
  try {
    if (await findBroadcast(name)) {
      return page("Already sent", `<p>The digest for the week of ${v.week} already went out. Nothing was sent twice.</p>`);
    }
    const origin = new URL(request.url).origin;
    const email = renderDigestEmail(digest, { siteUrl: origin });
    await sendBroadcast({ name, subject: email.subject, html: email.html, text: email.text });
  } catch (err) {
    console.error("digest approve: send failed", err instanceof Error ? err.message : err);
    return page("Something went wrong", "<p>Resend didn't accept the send. Nothing went out. Try the button again in a minute.</p>", 502);
  }
  return page("Sent", `<p>This week's deals are on their way to the list. You can see it in Resend under Broadcasts.</p><p><a href="/deals">See the members page</a></p>`);
};
