// Clerk for the members page. Server-side only: there is no Clerk script on
// the rest of the site. Sign-in and sign-up happen on Clerk's hosted pages
// (the "Account Portal"), which send people back to /deals.

// The Vercel Marketplace install names the publishable key for Next.js.
// @clerk/astro reads PUBLIC_CLERK_PUBLISHABLE_KEY, so accept either.
export function clerkPublishableKey(): string | undefined {
  const pk = process.env.PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (pk && !process.env.PUBLIC_CLERK_PUBLISHABLE_KEY) process.env.PUBLIC_CLERK_PUBLISHABLE_KEY = pk;
  return pk || undefined;
}

export const clerkReady = () => Boolean(clerkPublishableKey() && process.env.CLERK_SECRET_KEY);

/**
 * Account Portal base URL, worked out from the publishable key:
 * pk_test_… → "<slug>.clerk.accounts.dev" → https://<slug>.accounts.dev
 * pk_live_… → "clerk.paulchs.com"         → https://accounts.paulchs.com
 */
export function accountPortalBase(): string | null {
  const pk = clerkPublishableKey();
  if (!pk) return null;
  try {
    const host = Buffer.from(pk.split("_").slice(2).join("_"), "base64").toString("utf8").replace(/\$$/, "");
    if (host.endsWith(".clerk.accounts.dev")) return `https://${host.replace(".clerk.accounts.dev", ".accounts.dev")}`;
    if (host.startsWith("clerk.")) return `https://accounts.${host.slice("clerk.".length)}`;
    return null;
  } catch {
    return null;
  }
}

export function portalUrl(path: "sign-in" | "sign-up" | "user", returnTo: string): string | null {
  const base = accountPortalBase();
  if (!base) return null;
  const url = new URL(`/${path}`, base);
  url.searchParams.set("redirect_url", returnTo);
  return url.toString();
}
