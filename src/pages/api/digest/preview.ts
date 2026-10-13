// Tuesday morning (Vercel Cron, see vercel.json): emails Paul a preview of the
// week's digest with a signed "Send to the list" button. Nothing goes to the
// list from here.
import type { APIRoute } from "astro";
import { site } from "../../../lib/site";
import { getDigest, isCurrent, digestFingerprint, dealsApproved } from "../../../lib/deals";
import { isCron, signApproval } from "../../../lib/digest-auth";
import { renderDigestEmail } from "../../../lib/digest-email";
import { resendReady, sendEmail } from "../../../lib/resend";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const GET: APIRoute = async ({ request }) => {
  if (!isCron(request)) return json({ error: "unauthorized" }, 401);
  if (!resendReady()) return json({ error: "Resend is not connected to this project" }, 503);

  const origin = new URL(request.url).origin;
  const digest = await getDigest();

  if (!digest || !isCurrent(digest)) {
    await sendEmail({
      to: site.email,
      subject: "No Charleston deals digest this week",
      text: `The weekly Deals Digest task didn't publish anything for this week${
        digest ? ` (latest is the week of ${digest.week_of})` : ""
      }, so there's nothing to send. Check the "Deals Digest" scheduled task in Claude.`,
      html: `<p>The weekly Deals Digest task didn't publish anything for this week${
        digest ? ` (latest is the week of ${digest.week_of})` : ""
      }, so there's nothing to send.</p><p>Check the "Deals Digest" scheduled task in Claude.</p>`,
    });
    return json({ sent: "notice", reason: "no current digest" });
  }

  const fp = digestFingerprint(digest);
  const approveUrl = `${origin}/api/digest/approve?week=${digest.week_of}&v=${fp}&sig=${signApproval(digest.week_of, fp)}`;
  const blockedReason = dealsApproved
    ? undefined
    : "MLS display for this list isn't approved yet. Once your broker-in-charge and CTAR sign off, set mls_display.deals_digest_approved to true in data/site.json.";

  const email = renderDigestEmail(digest, { siteUrl: origin, preview: { approveUrl, blockedReason } });
  await sendEmail({ to: site.email, subject: `[Preview] ${email.subject}`, html: email.html, text: email.text });
  return json({ sent: "preview", week: digest.week_of, deals: digest.deals.length, blocked: !dealsApproved });
};
