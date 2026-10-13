// @ts-check
import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { sitemapExclusions } from "./src/lib/sitemap-gate.mjs";

const exclusions = await sitemapExclusions();
// Utility pages that should never be indexed.
for (const path of ["/send-the-deal/sent", "/deals"]) exclusions.add(path);

export default defineConfig({
  site: "https://paulchs.com",
  // Static by default. Only routes with `export const prerender = false`
  // (the form endpoints, /deals and the digest API) run as serverless
  // functions on Vercel.
  output: "static",
  adapter: vercel(),
  trailingSlash: "never",
  build: { format: "file" },
  env: {
    schema: {
      // Zapier catch hook for the contact form. Set in Vercel → Settings →
      // Environment Variables. Never commit it.
      ZAPIER_WEBHOOK_URL: envField.string({ context: "server", access: "secret", optional: true }),
      // Weekly deals digest (lib/deals, lib/resend). Read with process.env at
      // request time; listed here so a missing value is easy to spot.
      // RESEND_* come from the Resend integration, EDGE_CONFIG from the
      // "paulchs-deals" store, Clerk keys from the Clerk integration.
      RESEND_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      RESEND_EMAIL_DOMAIN: envField.string({ context: "server", access: "secret", optional: true }),
      RESEND_SEGMENT_ID: envField.string({ context: "server", access: "secret", optional: true }),
      EDGE_CONFIG: envField.string({ context: "server", access: "secret", optional: true }),
      DIGEST_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
      CRON_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
      CLERK_SECRET_KEY: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
  integrations: [
    sitemap({
      // Draft pages and pages showing MLS numbers stay out until the
      // display rules are confirmed (data/site.json → mls_display).
      filter: (page) => !exclusions.has(new URL(page).pathname.replace(/\/$/, "") || "/"),
    }),
  ],
});
