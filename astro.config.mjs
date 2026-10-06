// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { sitemapExclusions } from "./src/lib/sitemap-gate.mjs";

const exclusions = await sitemapExclusions();

export default defineConfig({
  site: "https://paulchs.com",
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [
    sitemap({
      // Draft pages and pages showing MLS numbers stay out until the
      // display rules are confirmed (data/site.json → mls_display).
      filter: (page) => !exclusions.has(new URL(page).pathname.replace(/\/$/, "") || "/"),
    }),
  ],
});
