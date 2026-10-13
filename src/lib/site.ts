import site from "../../data/site.json";

export { site };

export const telHref = `tel:${site.phone_e164}`;
export const smsHref = `sms:${site.phone_e164}`;

export const officeAddressLine = (() => {
  const a = site.office_address;
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`;
})();

// Visible marker for a value Paul still has to supply or confirm.
export const placeholder = (label: string) => `[${label}]`;

// Review mode shows VERIFY tags and [NEED …] placeholders so Paul can see what
// still needs him. It is on for local and Vercel preview builds and off for the
// production build (VERCEL_ENV=production on Vercel; SITE_MODE=production to
// test locally), so none of it renders on the public site.
export const reviewMode = process.env.VERCEL_ENV !== "production" && process.env.SITE_MODE !== "production";
