// Validation for the "Send me the deal" form. Shared by the endpoint and kept
// separate so it can be tested without a network call.

export const UNIT_OPTIONS = ["Not sure", "1 (single-family or condo)", "2", "3–4", "5–10", "11–49", "50+"] as const;

export const LIMITS = {
  name: 100,
  contact: 120,
  address: 200,
  notes: 2000,
  photos: 3,
  photoBytesTotal: 4 * 1024 * 1024, // Vercel functions accept ~4.5 MB request bodies
};

export type LeadError = "name" | "contact" | "address" | "units" | "notes" | "photos";

export type Lead = {
  name: string;
  contact: string;
  contact_type: "email" | "phone";
  address: string;
  units: string;
  notes: string;
  photos: File[];
};

const clean = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export function isSpam(form: FormData): boolean {
  // Honeypot: hidden from people, filled by bots.
  return clean(form.get("company")) !== "";
}

export function validateLead(form: FormData): { ok: true; lead: Lead } | { ok: false; error: LeadError } {
  const name = clean(form.get("name"));
  const contact = clean(form.get("contact"));
  const address = clean(form.get("address"));
  const units = clean(form.get("units"));
  const notes = clean(form.get("notes"));
  const photos = form
    .getAll("photos")
    .filter((f): f is File => typeof f !== "string" && f.size > 0);

  if (!name || name.length > LIMITS.name) return { ok: false, error: "name" };

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact);
  const digits = contact.replace(/\D/g, "");
  const isPhone = !isEmail && digits.length >= 10 && digits.length <= 15 && /^[\d\s().+-]+$/.test(contact);
  if (!contact || contact.length > LIMITS.contact || (!isEmail && !isPhone)) return { ok: false, error: "contact" };

  if (address.length > LIMITS.address) return { ok: false, error: "address" };
  if (units && !(UNIT_OPTIONS as readonly string[]).includes(units)) return { ok: false, error: "units" };
  if (notes.length > LIMITS.notes) return { ok: false, error: "notes" };

  const total = photos.reduce((s, f) => s + f.size, 0);
  if (
    photos.length > LIMITS.photos ||
    total > LIMITS.photoBytesTotal ||
    photos.some((f) => !f.type.startsWith("image/"))
  ) {
    return { ok: false, error: "photos" };
  }

  return {
    ok: true,
    lead: { name, contact, contact_type: isEmail ? "email" : "phone", address, units, notes, photos },
  };
}
