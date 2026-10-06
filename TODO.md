# TODO – paulchs.com

What Claude Code needs from Paul, grouped by who resolves it. Updated at the end of every session.
**VERIFY** = Paul (or the person named) confirms before publishing. **NEED** = Paul supplies it.

Last updated: 2026-10-06 (Session 1)

---

## Open VERIFY items

### Broker-in-charge
- [ ] Exact brokerage identification wording and format for the footer (currently "Real estate services through Matt O'Neill Real Estate") and SC advertising requirements (CLAUDE.md §9).
- [ ] Office address to use: 1349 Old Georgetown Road, Mount Pleasant, SC 29464.
- [ ] REALTOR® designation in the footer, and any license line required.
- [ ] Agency disclosure language for seller-facing pages (CLAUDE.md §6).
- [ ] Affiliated business disclosure wording for Tide (Paul has an ownership interest). Placeholder in `data/site.json → tide_disclosure`.

### CTAR / Charleston Trident MLS
- [ ] **Blocking for area and neighborhood pages:** may aggregated statistics (medians, counts, ranges) from closed sales and leases be published on an agent website? Until yes, `data/site.json → mls_display.aggregates_approved` stays `false`, and any page showing MLS numbers is kept out of the sitemap.
- [ ] Exact required attribution line (placeholder in `data/site.json → mls_attribution`).
- [ ] Rules for showing individual sold or leased listings (default: never shown).
- [ ] Any disclaimer or refresh-frequency requirements.

### Paul
- [ ] "200+ investor deals" – wording (CLAUDE.md §2).
- [ ] "300+ doors" under management at Tide – current count.
- [ ] "Top five for multifamily sales in Charleston" – source/basis to cite. `stats.stat_rank.value` is null until then.
- [ ] BiggerPockets Elite Agent – current status.
- [ ] Response time to promise on the form ("one business day" for now).
- [ ] "I've closed N listings here" wording on neighborhood pages (NEIGHBORHOODS.md §6).
- [ ] Underwriting stance: rent at today's market after a light refresh, not current tenant rent (SITE-CONTENT §4).
- [ ] Deal analyzer default expenses from aggregated Tide data (Phase 2).
- [ ] Recommended 2–4 unit groupings on `/which-charleston-area-should-i-buy-in` (Phase 2).
- [ ] Instagram and Threads profile URLs in `data/site.json → social` (guessed from the handle paul_charleston).
- [ ] **Phone number:** 843-460-3173 is now the site-wide number (Paul, 2026-10-06). CLAUDE.md §6 also names it as the acquisition page's campaign number for call tracking. If the acquisition page goes live, decide whether it needs a different number so calls can be told apart. Update CLAUDE.md §6 once decided.
- [ ] Merged neighborhood page name "Asheford Place" (from Asheford Place at Canterbury Place / Canterbury Woods) – chosen by Claude, rename if you prefer.
- [ ] City for 54 neighborhoods (left `null` in `data/neighborhoods.json` – only filled where certain). Also confirm the area-based defaults below:
  - Filled from the MLS area: Areas 51, 52, 77 → Charleston; 42 → Mount Pleasant; 22 → Folly Beach; 71 → Hanahan.
  - Still null:
    - `west-ashley-inside-526`: Concord West of The Ashley, Maryville, Orange Grove Estates, Parkwood Estates, West Glow
    - `west-ashley-outside-526`: Asheford Place, Ashleytowne Village, Carolina Cove, Castlewood, Parsonage Point, Red Top, Shadowmoss, Springfield
    - `james-island`: Crosscreek, Lynwood Villas, Mira Vista, Oakcrest, Regatta On James Island
    - `johns-island`: Kiawah River, Oakfield
    - `north-charleston-inside-526`: Accabee, Admiral Apartments, Buckfield, Dorchester Terrace, Russelldale, Waylyn
    - `north-charleston-outside-526`: Brookdale, Buckshire, Fetteressa, Pt Dowling Tract
    - `mount-pleasant-north`: Crown Pointe, Dunes West, Hamlin Plantation, The Meridian
    - `wild-dunes`: Beachwood, Wild Dunes Yacht Harbor
    - `north-charleston-dorchester-county`: Appian Landing, Pepperidge, Stratton Capers, Woodington
    - `summerville`: Bridges of Summerville, Millbrook, Shady Oaks
    - `summerville-north-ridgeville`: Rose Hill, Summers Corner, White Gables
    - `goose-creek-hwy-52-oakley`: Carlton Place, Liberty Hall Plantation, Strawberry Station, Tanner Plantation
    - `goose-creek-moncks-corner`: Berkeley Commons Townhomes, Persimmon Hill Townhouses
    - `summerville-berkeley-county`: Briddleford Ridge, College Park
  - The indexer can fill most of these from the MLS `City` field in Session 4.
- [ ] Tanner Plantation (Areas 71 and 72): one community split by an MLS area line, or two? Two pages for now.
- [ ] Area 72 tier: its AREAS.md entry says Tier B, but the build-priority list puts it in Tier C. `data/areas.json` uses B.

### Attorney or CPA (all question-page facts are VERIFY by default – CLAUDE.md §5)
- [ ] SC 4% vs. 6% assessment ratios, legal residence definition, school operating millage exemption, how it applies to an owner-occupied 2–4 unit building, how and when to apply (Charleston, Dorchester, Berkeley assessors).
- [ ] Worked property tax example checked against a current Charleston County bill.
- [ ] Millage source per tax district (deal analyzer).
- [ ] SC Residential Landlord and Tenant Act basics for the "existing tenants" answer.
- [ ] SC attorney-led closings and how remote signing and funding work (check with Paul's usual closing attorneys).
- [ ] Deed recording fee rate and who customarily pays (Phase 3).

### Lender
- [ ] Current FHA and conventional minimum down payments for owner-occupied 2–4 unit buildings.
- [ ] How lenders treat a dependency / carriage house unit (Phase 2).

### Area and neighborhood watch-outs (check per page as each is built)
- [ ] Every "Watch-outs" line in AREAS.md is VERIFY: STR rules by jurisdiction (City of Charleston, Mount Pleasant, Folly Beach, Isle of Palms, James Island, county), Board of Architectural Review, flood zones, HOA leasing restrictions, rental registration in North Charleston, zoning for added units, well/septic, resort rental program terms, county millage.
- [ ] Mount Pleasant "slowed new multifamily approvals" claim (SITE-CONTENT §12.6).
- [ ] Any employer or growth statistic on `/is-charleston-a-good-place-to-buy-rental-property`.

---

## Open NEED items from Paul

- [ ] Email address for the site (`data/site.json → email`).
- [ ] Brokerage phone number for the footer.
- [ ] Analytics choice: Plausible or GA4 (needed in Session 2 for call, text, and form events).
- [ ] Zapier (or other) webhook for the contact form – set as `ZAPIER_WEBHOOK_URL` in the host's environment variables, never in the repo (Session 2).
- [ ] Social links: LinkedIn, YouTube, BiggerPockets profile, GRID podcast.
- [ ] Next GRID event details (`data/site.json → next_event`) and event sign-up platform.
- [ ] Photos: headshot, Paul on a property, any GRID podcast clip.
- [ ] Origin story for the homepage and `/about` (how you started, first deal, building Tide, starting GRID, why investors).
- [ ] 6–10 client testimonials with permission, tagged by type (investor buyer, first building, seller, out-of-state).
- [ ] 3–6 recent deals to feature (area, unit count, what happened – no client names without permission).
- [ ] RentCast API key: needed for Session 3. In this cloud setup, add it as an environment secret (`RENTCAST_API_KEY`), not a committed file.
- [ ] Optional: export of buyer-side closings to `data/raw/buyer-side-closed.csv` to add more neighborhoods (NEIGHBORHOODS.md §3).
- [ ] Optional: notes on neighborhoods you know well in `data/paul-notes.json` (see README).

---

## Done this session (Session 1 – 2026-10-06)

- Committed the starter files and `.gitignore`.
- Scaffolded Astro 7 (static output, TypeScript strict) alongside the docs. No hosting adapter yet.
- Content collections with typed frontmatter: `areas`, `neighborhoods`, `questions`, `pages` (`src/content.config.ts`). Schemas were tested with throwaway files: valid frontmatter passes and a bad value fails the build.
- `data/site.json` with every VERIFY/NEED tracked in its `_status` block, and MLS display flags (aggregates and individual listings not approved; Paul's closing counts approved, counts only).
- `data/areas.json`: 33 areas generated from `docs/AREAS.md` by `scripts/seed-data.mjs`. mls_value strings match the doc exactly. All numbers null.
- `data/neighborhoods.json`: 72 neighborhoods from 75 seed rows, after the 3 approved merges. Tanner Plantation kept as two pages. 103 closed listings, counts only. Each record keeps every exact MLS subdivision string in `mls_subdivisions`.
- `data/neighborhood-aliases.json` (merges marked approved) and `data/paul-notes.json` (empty; purpose in README).
- Base layout: SEO component (title, description, canonical, Open Graph, JSON-LD), header, compliance footer with visible placeholders, skip link, 404 page, `robots.txt`, sitemap.
- Sitemap gate (`src/lib/sitemap-gate.mjs`): drafts, and pages showing MLS numbers, stay out of `sitemap.xml` until `mls_display.aggregates_approved` is true.
- Navigation links stay hidden until their page exists (`src/lib/nav.ts`, `live` flag), so the placeholder site has no dead links.
- Placeholder homepage with Call and Text links and `RealEstateAgent` schema.
- `vercel.json` with 301 redirects: paulkelton.com → homepage, charlestoninvestoragent.com → `/investor-friendly-agent-charleston`.
- Checks: build passes, internal link check passes, no em dashes in `src/`.

## Next session (Session 2 – design, homepage, send the deal)

- Design plan first (palette, type, wireframes) for Paul's approval.
- Add the Vercel adapter for the form endpoint (`/send-the-deal` posts to a serverless function that forwards to `ZAPIER_WEBHOOK_URL`).
- Flip nav items to `live: true` as pages ship (`src/lib/nav.ts`), including the footer privacy link once `/privacy` exists.
- Gated pages should also get `noindex` – wire the gate into the area and neighborhood layouts when they're built (Session 3).
- Note for Session 5: PROMPTS.md says "five" Phase 1 question pages but lists six. Plan for all six.
- Until Session 5 ships `/investor-friendly-agent-charleston`, the charlestoninvestoragent.com redirect lands on the 404 page. Either connect that domain after Session 5, or accept it temporarily.
