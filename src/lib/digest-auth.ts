// Approval links in Paul's preview email are signed, so only that email can
// trigger a send – and only for the exact version of the deals he previewed.
import { createHmac, timingSafeEqual } from "node:crypto";

const secret = () => process.env.DIGEST_SECRET || "";

export function signApproval(week: string, fingerprint: string): string {
  return createHmac("sha256", secret()).update(`${week}:${fingerprint}`).digest("hex");
}

export function checkApproval(week: string, fingerprint: string, sig: string): boolean {
  if (!secret() || !/^[0-9a-f]{64}$/.test(sig)) return false;
  const a = Buffer.from(signApproval(week, fingerprint), "hex");
  const b = Buffer.from(sig, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Vercel Cron sends "Authorization: Bearer <CRON_SECRET>". A manual run can pass
 * ?key=<CRON_SECRET> instead – it only ever emails Paul a preview, never the list.
 */
export function isCron(request: Request): boolean {
  const s = process.env.CRON_SECRET;
  if (!s) return false;
  const same = (a: string, b: string) => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && timingSafeEqual(x, y);
  };
  const key = new URL(request.url).searchParams.get("key") || "";
  return same(request.headers.get("authorization") || "", `Bearer ${s}`) || (key !== "" && same(key, s));
}
