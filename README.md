# paulchs.com

Paul Kelton's Charleston investment property site. Astro, static output.

Start every working session by reading `CLAUDE.md` and `TODO.md`.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at http://localhost:4321 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run check:links` | Check internal links in `dist/` (run after build) |
| `npm run check:emdash` | Fails if any em dash is in `src/` |
| `npm run seed:data` | Rebuild the identity fields of `data/areas.json` and `data/neighborhoods.json` from `docs/AREAS.md`, `data/seed-neighborhoods.csv`, and approved merges. Keeps numbers already pulled. |

## Where things live

- `docs/` – page content and rules (SITE-CONTENT, AREAS, NEIGHBORHOODS).
- `src/content/` – page copy as markdown (areas, neighborhoods, questions, pages). Schemas in `src/content.config.ts`.
- `data/site.json` – phone, address, brokerage line, stats, next event, MLS display flags. `_status` lists what is still VERIFY or NEED.
- `data/areas.json` – one record per MLS area. Numbers come from the `area-data-puller` subagent only.
- `data/neighborhoods.json` – one record per neighborhood from Paul's closed listings. Numbers come from `neighborhood-indexer` only.
- `data/neighborhood-aliases.json` – approved merges and splits of MLS subdivision names.
- `data/paul-notes.json` – see below.
- `src/lib/nav.ts` – navigation. Links stay hidden (`live: false`) until their page exists.
- `src/lib/sitemap-gate.mjs` – keeps drafts, and any page showing MLS numbers, out of the sitemap until `data/site.json → mls_display.aggregates_approved` is `true`.

## data/paul-notes.json

Paul's own notes about specific neighborhoods or areas, for the page writers to use in "Paul's take". It starts empty. Add entries keyed by `area-slug/neighborhood-slug` (or just `area-slug` for an area), for example:

```json
{
  "upper-peninsula/wagener-terrace": "Most of what I've sold here were 1940s cottages with original wiring. Budget for it.",
  "hanahan": "Check which side of the reservoir before anything else."
}
```

Write it the way you'd say it. Facts about rules, flood zones, or HOAs still get checked before publishing. The writers never invent a note when there isn't one.

## Secrets

Never commit `.env`, API keys, or webhook URLs. `RENTCAST_API_KEY` and `ZAPIER_WEBHOOK_URL` live in `.env` locally and in the host's environment variables in production.
