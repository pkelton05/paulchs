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
