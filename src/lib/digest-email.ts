// The Tuesday "Charleston deals" email. Teaser numbers only – address, rents
// and the full breakdown live on the members page (/deals), which is the point
// of the click. Plain tables and inline styles so it renders in every inbox.
import { site, officeAddressLine } from "./site";
import { type Digest, money, moneyK, pct, unitsLabel, weekLabel, ratingLabel } from "./deals";

const C = {
  bg: "#eef0eb", // oyster
  text: "#2b2420", // pluff
  soft: "#4a423c",
  haint: "#bfe0da", // numbers only
  marsh: "#3d5a2c",
  piling: "#1e3640",
  rule: "#c9cdc4",
};
const FONT = "'Atkinson Hyperlegible Next', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const MONO = "'Atkinson Hyperlegible Mono', 'SF Mono', Menlo, Consolas, monospace";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function digestSubject(d: Digest): string {
  const n = d.deals.length;
  if (n === 0) return "Charleston deals: nothing worth your money this week";
  return `${n} Charleston ${n === 1 ? "deal" : "deals"} worth a look this week`;
}

export const broadcastName = (d: Digest) => `Charleston deals – week of ${d.week_of}`;

type Options = {
  siteUrl: string;
  /** Set for Paul's preview: adds the banner with the send button. */
  preview?: { approveUrl: string; blockedReason?: string };
};

export function renderDigestEmail(d: Digest, opts: Options) {
  const membersUrl = `${opts.siteUrl}/deals`;
  const unsubscribe = opts.preview ? "#" : "{{{RESEND_UNSUBSCRIBE_URL}}}";
  const subject = digestSubject(d);

  const button = (href: string, label: string, bg = C.marsh) =>
    `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:#ffffff;font-family:${FONT};font-size:17px;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:4px;">${esc(label)}</a>`;

  const previewBanner = opts.preview
    ? `<tr><td style="background:${C.piling};color:${C.bg};padding:20px 24px;font-family:${FONT};font-size:16px;line-height:1.5;">
        <strong>Preview – only you got this.</strong> Check the deals below, then send it to the list.
        ${
          opts.preview.blockedReason
            ? `<br><br><strong>Sending is switched off:</strong> ${esc(opts.preview.blockedReason)}`
            : `<br><br>${button(opts.preview.approveUrl, "Send to the list", "#3d5a2c")}`
        }
      </td></tr>`
    : "";

  const dealRows = d.deals
    .map((deal) => {
      const metric = (label: string, value: string) =>
        `<td style="background:${C.haint};padding:10px 12px;font-family:${FONT};font-size:13px;color:${C.text};" width="33%">
           <div style="font-family:${MONO};font-size:22px;font-weight:600;line-height:1.1;">${esc(value)}</div>${esc(label)}</td>`;
      return `<tr><td style="padding:24px 24px 0;">
        <p style="margin:0 0 4px;font-family:${FONT};font-size:14px;color:${C.soft};">${esc(deal.submarket)} · ${esc(deal.property_type)} · ${unitsLabel(deal.units)}</p>
        <p style="margin:0 0 8px;font-family:${FONT};font-size:22px;font-weight:700;color:${C.text};">${money(deal.price)}${
          deal.units > 1 ? ` <span style="font-weight:400;font-size:17px;color:${C.soft};">· ${moneyK(deal.price_per_unit)} a door</span>` : ""
        }</p>
        <p style="margin:0 0 12px;font-family:${FONT};font-size:17px;line-height:1.5;color:${C.text};">${esc(deal.headline)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="4" style="border-collapse:separate;"><tr>
          ${metric("cap rate", pct(deal.cap_rate))}${metric("cash-on-cash", pct(deal.cash_on_cash))}${metric(
            "cash flow / yr",
            money(deal.cash_flow),
          )}
        </tr></table>
        <p style="margin:8px 0 0;font-family:${FONT};font-size:13px;color:${C.soft};">${esc(ratingLabel[deal.rating])}${
          deal.listing_office ? ` · Listed by ${esc(deal.listing_office)}` : ""
        }</p>
        <p style="margin:12px 0 0;"><a href="${esc(`${membersUrl}#${deal.id}`)}" style="font-family:${FONT};font-size:16px;color:${C.marsh};font-weight:700;">See the address and full numbers</a></p>
        <hr style="border:0;border-top:1px solid ${C.rule};margin:24px 0 0;">
      </td></tr>`;
    })
    .join("");

  const empty =
    d.deals.length === 0
      ? `<tr><td style="padding:24px;font-family:${FONT};font-size:17px;line-height:1.5;color:${C.text};">Nothing I looked at this week works at the asking price. That happens. I'd rather send you nothing than send you a bad deal.</td></tr>`
      : "";

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(d.intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:16px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;">
  ${previewBanner}
  <tr><td style="padding:28px 24px 0;">
    <p style="margin:0;font-family:${FONT};font-size:14px;color:${C.soft};">Charleston deals · week of ${esc(weekLabel(d.week_of))}</p>
    <h1 style="margin:8px 0 12px;font-family:${FONT};font-size:26px;line-height:1.25;color:${C.text};">${esc(subject)}</h1>
    <p style="margin:0;font-family:${FONT};font-size:17px;line-height:1.55;color:${C.text};">${esc(d.intro)}</p>
  </td></tr>
  ${dealRows}${empty}
  <tr><td style="padding:24px;">
    ${d.deals.length ? `<p style="margin:0 0 16px;font-family:${FONT};font-size:17px;line-height:1.5;color:${C.text};">Addresses, rents and the full breakdown are on the members page. It's free – make an account once and you're in.</p>${button(membersUrl, "See this week's deals")}` : ""}
    <p style="margin:20px 0 0;font-family:${FONT};font-size:17px;line-height:1.5;color:${C.text};">Want me to dig into one of these, or have something I should run? Just reply to this email or text me at ${esc(site.phone)}.</p>
    <p style="margin:12px 0 0;font-family:${FONT};font-size:17px;color:${C.text};">– Paul</p>
  </td></tr>
  <tr><td style="padding:16px 24px 24px;border-top:1px solid ${C.rule};font-family:${FONT};font-size:12px;line-height:1.5;color:${C.soft};">
    <p style="margin:0 0 8px;">Numbers are my estimates for screening, not an appraisal and not financial advice. No return is guaranteed. ${esc(d.assumptions)}</p>
    <p style="margin:0 0 8px;">${esc(site.mls_attribution)}</p>
    <p style="margin:0 0 8px;">${esc(site.name)}, ${esc(site.designation)} · ${esc(site.brokerage_line)} · ${esc(officeAddressLine)} · ${esc(site.brokerage_phone)} · Equal Housing Opportunity</p>
    <p style="margin:0;">You're getting this because you signed up at paulchs.com. <a href="${unsubscribe}" style="color:${C.soft};">Unsubscribe</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    opts.preview
      ? opts.preview.blockedReason
        ? `PREVIEW – sending is switched off: ${opts.preview.blockedReason}\n`
        : `PREVIEW – only you got this. Send to the list: ${opts.preview.approveUrl}\n`
      : "",
    `Charleston deals – week of ${weekLabel(d.week_of)}`,
    subject,
    "",
    d.intro,
    "",
    ...d.deals.map((deal) =>
      [
        `${deal.submarket} · ${deal.property_type} · ${unitsLabel(deal.units)}`,
        `${money(deal.price)}${deal.units > 1 ? ` (${moneyK(deal.price_per_unit)} a door)` : ""}`,
        deal.headline,
        `Cap rate ${pct(deal.cap_rate)} · Cash-on-cash ${pct(deal.cash_on_cash)} · Cash flow ${money(deal.cash_flow)}/yr`,
        deal.listing_office ? `Listed by ${deal.listing_office}` : "",
        `Full numbers: ${membersUrl}#${deal.id}`,
      ]
        .filter(Boolean)
        .join("\n") + "\n",
    ),
    d.deals.length ? `Addresses, rents and the full breakdown: ${membersUrl}\n` : "Nothing worked at the asking price this week.\n",
    `Reply to this email or text me at ${site.phone}. – Paul`,
    "",
    `Numbers are my estimates for screening, not an appraisal and not financial advice. No return is guaranteed. ${d.assumptions}`,
    site.mls_attribution,
    `${site.name} · ${site.brokerage_line} · ${officeAddressLine} · Equal Housing Opportunity`,
    `Unsubscribe: ${unsubscribe}`,
  ].join("\n");

  return { subject, html, text };
}

export function renderWelcomeEmail(siteUrl: string) {
  const subject = "You're on the Charleston deals list";
  const text = [
    "Thanks for signing up.",
    "",
    "Every Tuesday I send the few Charleston-area rentals that are worth a look, with the numbers. Some weeks that's five. Some weeks it's none – I'd rather send nothing than a bad deal.",
    "",
    `The full breakdowns live on a free members page: ${siteUrl}/deals`,
    "",
    `If you're looking for something specific, reply and tell me what you want to buy. Or text me at ${site.phone}.`,
    "",
    "– Paul",
    "",
    `${site.name} · ${site.brokerage_line} · ${officeAddressLine} · Equal Housing Opportunity`,
  ].join("\n");
  const html = `<div style="font-family:${FONT};font-size:17px;line-height:1.55;color:${C.text};max-width:560px;">${text
    .split("\n\n")
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("")}</div>`;
  return { subject, html, text };
}
