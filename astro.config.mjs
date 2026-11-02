// @ts-check
import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { sitemapExclusions } from "./src/lib/sitemap-gate.mjs";

const exclusions = await sitemapExclusions();
// Utility pages that should never be indexed.
for (const p of ["/market-monday/thanks", "/off-market/thanks", "/property-value/thanks", "/send-the-deal/sent"]) exclusions.add(p);

export default defineConfig({
  site: "https://paulchs.com",
  // Static by default. Only routes with `export const prerender = false`
  // (the form endpoint) run as serverless functions on Vercel.
  output: "static",
  adapter: vercel(),
  trailingSlash: "never",
  build: { format: "file" },
  env: {
    schema: {
      // Zapier catch hook for the contact form. Set in Vercel → Settings →
      // Environment Variables. Never commit it.
      ZAPIER_WEBHOOK_URL: envField.string({ context: "server", access: "secret", optional: true }),
      // Fallback: the shared "paulchs website leads → Follow Up Boss" hook the
      // off-market and valuation forms use (JSON, so photos can't ride along).
      LEADS_WEBHOOK_URL: envField.string({ context: "server", access: "secret", optional: true }),
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
