import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const county = z.enum(["Charleston", "Dorchester", "Berkeley"]);
const tier = z.enum(["A", "B", "C"]);

// Copy only. Every number lives in data/*.json and reaches the page through the
// layout. Frontmatter strings may use {{path}} tokens (see src/lib/areas.ts);
// the markdown body (Paul's take) may not contain tokens or typed numbers.
const areas = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/areas" }),
  schema: z.object({
    title: z.string(), // <title> tag
    description: z.string(), // meta description, tokens allowed
    name: z.string(), // short area name used in H1, breadcrumb, and copy, e.g. "Upper Peninsula"
    place_phrase: z.string().optional(), // how the lead line says "in X", e.g. "on James Island"; default "in <name>"
    summary: z.string(), // one line for the /charleston index card, no numbers
    mls_area: z.string(), // exact FlexMLS MLSAreaMajor value
    county,
    tier,
    cards: z.object({
      buildings: z.string(),
      rent_drivers: z.string(),
      numbers: z.string(), // tokens allowed
    }),
    watch_outs: z.array(z.object({ text: z.string(), verify: z.boolean().default(true) })).default([]),
    nearby: z.array(z.string()).default([]), // area slugs
    neighborhoods: z.array(z.string()).default([]), // optional override; default comes from data/neighborhoods.json
    shows_mls_numbers: z.boolean().default(true),
    draft: z.boolean().default(true),
  }),
});

// Files live at src/content/neighborhoods/[area-slug]/[slug].md
const neighborhoods = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/neighborhoods" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    mls_area: z.string(),
    area_slug: z.string(),
    county,
    city: z.string().nullable(),
    tier,
    type: z.enum(["full", "short"]),
    nearby: z.array(z.string()).default([]), // neighborhood slugs in the same area
    watch_outs: z.array(z.object({ text: z.string(), verify: z.boolean().default(true) })).default([]),
    shows_mls_numbers: z.boolean().default(true),
    draft: z.boolean().default(true),
  }),
});

const questions = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/questions" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string().optional(),
    phase: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]), // FAQPage schema, answers trimmed to 1–2 sentences
    mentions_tide: z.boolean().default(false),
    shows_mls_numbers: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    mentions_tide: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

export const collections = { areas, neighborhoods, questions, pages };
