# TODO – paulchs.com

What Claude Code needs from Paul, grouped by who resolves it. Updated at the end of every session.
**VERIFY** = Paul (or the person named) confirms before publishing. **NEED** = Paul supplies it.

Last updated: 2026-10-06 (Session 2)

---

## Hosting status (Vercel)

- `npm audit` reports 3 high-severity advisories inside `@astrojs/vercel` (via `@vercel/routing-utils`), used at build time only. Recheck when a new adapter release is out; don't `audit fix --force`.

- Project `paulchs` on team `paul-chs`, linked to `pkelton05/paulchs`. Every push to `main` deploys to production. Other branches get preview links.
- **paulchs.com** – live. DNS is on Vercel nameservers. `www.paulchs.com` 301s to `paulchs.com`.
- **paulkelton.com** and **charlestoninvestoragent.com** (plus `www`) – added to the project, but their DNS is at GoDaddy and doesn't point to Vercel yet. Until it does, the 301 redirects in `vercel.json` can't fire.
- [ ] **Paul (GoDaddy), later:** for each of the two domains, set an A record for `@` → `76.76.21.21` and a CNAME for `www` → `cname.vercel-dns.com`, removing any existing A record for `@` or "forwarding" setting. If the Vercel dashboard (Project → Settings → Domains) shows different values, use those.
- [x] Vercel team upgraded to Pro (2026-10-06).
- [x] Vercel token pasted in chat deleted (2026-10-06). The Vercel connector is used instead.
- [ ] Later, no rush: set the GitHub repo's default branch to `main` (GitHub → Settings → General → Default branch). Vercel already deploys from `main` regardless.

## Open VERIFY items

### Broker-in-charge
- [ ] Footer brokerage phone is 843-460-3173, the same as Paul's own number. Confirm that satisfies the brokerage phone requirement, or supply the office line.
- [ ] Exact brokerage identification wording and format for the footer (currently "Real estate services through Matt O'Neill Real Estate") and SC advertising requirements (CLAUDE.md §9).
- [ ] Office address to use: 1349 Old Georgetown Road, Mount Pleasant, SC 29464.
- [ ] REALTOR® designation in the footer, and any license line required.
- [ ] Agency disclosure language for seller-facing pages (CLAUDE.md §6).
- [ ] Affiliated business disclosure wording for Tide (Paul has an ownership interest). Placeholder in `data/site.json → tide_disclosure`.

### CTAR / Charleston Trident MLS
- [x] Aggregated MLS statistics (medians, counts, ranges) may be published – confirmed by Paul 2026-10-06. `mls_display.aggregates_approved` is now `true`.
- [ ] Exact required attribution line. Using the standard "Source: Charleston Trident MLS. Information deemed reliable but not guaranteed." until CTAR gives other wording.
- [ ] Rules for showing individual sold or leased listings (default: never shown).
- [ ] Any disclaimer or refresh-frequency requirements.

### Paul
- [x] "200+ investor deals" and "300+ doors" confirmed by Paul 2026-10-06.
- [ ] #1 in 2–4 unit sales among individual Charleston agents, each of the last 3 years (confirmed by Paul 2026-10-06). Keep the MLS report behind it on file; consider naming the years (e.g. 2023–2025) so the claim doesn't go stale, and confirm with broker-in-charge that the wording meets SC advertising rules.
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
- [ ] `/privacy` draft (Session 2): form data, Zapier routing, Vercel hosting logs, no analytics yet, deletion requests, record retention period. Needs legal review before launch. Update the analytics section the day a provider is added.
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
- [ ] **Tier A batch (11 pages, drafted 2026-10-06)** – every watch-out on each page is tagged VERIFY. Highlights to check:
  - Downtown (51): City of Charleston STR rules on the peninsula; BAR review; flood zones on the low edges; insurance on older frame buildings. Card claims: employers (hospitals, medical university, College of Charleston, hotels, King and Meeting Street offices).
  - West Ashley inside 526 (11): flood zones near Church Creek and the Ashley; older sewer laterals; HOA rules; city vs. county.
  - West Ashley outside 526 (12): HOA rental caps and minimum lease terms; Church Creek basin flooding; city vs. county.
  - James Island (21): Town of James Island / City of Charleston / county split; flood zones near the marsh; STR rules by jurisdiction.
  - Johns Island (23): road projects; flood zones; well and septic; HOA leasing rules; City of Charleston vs. county.
  - Mount Pleasant south (42): Town rules on new multifamily and adding units; Town STR rules; flood zones near Shem Creek and the harbor; HOA rules. Card claim: Wando terminal nearby.
  - North Charleston outside 526 (32): HOA rental caps; city vs. county; flood zones near creeks; rental registration.
  - North Charleston, Dorchester County (61): Dorchester County millage and rental assessment; HOA leasing rules; North Charleston / Summerville / county jurisdiction.
  - Summerville (62): Town zoning for adding units; Sawmill Branch flood zones; HOA rules; addresses with a Summerville mailing address outside town limits.
  - Hanahan (71): HOA leasing limits; flood zones near the Goose Creek reservoir; Berkeley County millage and city limits.
  - Goose Creek / Moncks Corner (73): HOA leasing rules; Goose Creek / Moncks Corner / county jurisdiction; Berkeley County millage. Card claim: Moncks Corner "county seat and nearby industrial sites".
- [ ] Six Tier A areas had fewer than 5 small multifamily sales in 12 months (12, 23, 32, 42, 71, 73). Their pages say small multifamily rarely trades there and lead with single-family prices and rents. AREAS.md's "Paul's angle" for Area 73 (duplexes are most of the stock) and Area 71 (some duplexes) is not supported by MLS sales – Paul to confirm the pages' framing.
- [ ] Data to eyeball before publishing: Downtown single-family median up about 30% in a year (234 sales; likely mix of high-end sales); Downtown 3BR and 4BR+ and Mount Pleasant south 4BR+ rent medians are high (probably include furnished or by-the-room leases).
- [ ] **Upper Peninsula (Area 52) page:** rent drivers (downtown jobs, the hospitals and medical university on the lower peninsula, I-26 and Morrison Drive to North Charleston employers); watch-outs: flood exposure near the marsh and tidal creeks, City of Charleston STR rules, zoning for adding a unit and whether BAR applies, insurance on older frame buildings.
- [ ] **North Charleston inside I-526 (Area 31) page:** rent drivers (port terminals, Boeing, old Navy Base redevelopment, I-26); watch-outs: North Charleston rental registration or inspection rules, flood zones near the Ashley River and Filbin Creek, City of North Charleston vs. unincorporated county parcels, older-building systems.
- [ ] Every "Watch-outs" line in AREAS.md is VERIFY: STR rules by jurisdiction (City of Charleston, Mount Pleasant, Folly Beach, Isle of Palms, James Island, county), Board of Architectural Review, flood zones, HOA leasing restrictions, rental registration in North Charleston, zoning for added units, well/septic, resort rental program terms, county millage.
- [ ] Mount Pleasant "slowed new multifamily approvals" claim (SITE-CONTENT §12.6).
- [ ] Any employer or growth statistic on `/is-charleston-a-good-place-to-buy-rental-property`.

---

## Open NEED items from Paul

- [ ] Later: analytics choice, Plausible (simpler, no cookies, about $9/month – recommended) or GA4 (free, uses cookies). Events are already tagged; set `data/site.json → analytics.provider` and update `/privacy`.
- [ ] Later: Zapier webhook for the contact form. In Zapier, create a Zap with "Webhooks by Zapier → Catch Hook", copy the URL, and add it in Vercel → Project → Settings → Environment Variables as `ZAPIER_WEBHOOK_URL` (Production). Then redeploy. Fields sent: name, contact, contact_type, address_or_area, units, notes, source, submitted_at, photo_1..3. [VERIFY that photos arrive as files in Zapier on the first real test]
- [ ] Social links: LinkedIn, YouTube, BiggerPockets profile, GRID podcast.
- [ ] Next GRID event details (`data/site.json → next_event`) and event sign-up platform.
- [ ] Photos: headshot, Paul on a property, any GRID podcast still (homepage hero placeholder is waiting for one).
- [ ] Origin story for the homepage and `/about` (how you started, first deal, building Tide, starting GRID, why investors).
- [ ] 6–10 client testimonials with permission, tagged by type (investor buyer, first building, seller, out-of-state).
- [ ] 3–6 recent deals to feature (area, unit count, what happened – no client names without permission).
- [ ] Later (Paul chose to wait): RentCast API key. Until then, rents come from MLS lease comps only; bedroom counts with fewer than 3 leases show "not enough data". In this cloud setup, add it as an environment secret (`RENTCAST_API_KEY`), not a committed file.
- [ ] Optional: export of buyer-side closings to `data/raw/buyer-side-closed.csv` to add more neighborhoods (NEIGHBORHOODS.md §3).
- [ ] Optional: notes on neighborhoods you know well in `data/paul-notes.json` (see README).

---

## Done in Session 2 (2026-10-06) – design, homepage, send the deal

- Design system approved and built: "haint blue means a number". Tokens in `src/styles/tokens.css` (Oyster, Pluff mud, Haint blue, Marsh, Piling, Spartina). Atkinson Hyperlegible Next + Mono, self-hosted, 3 files, about 35 KB.
- Shared components: header (desktop nav + no-JS mobile menu), footer (compliance, Piling), sticky mobile bar (Call / Text / Send me the deal), event strip (hidden while `next_event` is null), number block + proof strip, testimonial, CTA block, breadcrumb (with BreadcrumbList schema), analytics hook.
- Homepage from SITE-CONTENT §3 with visible placeholders for photo, origin story, testimonials, and the ranking stat. Proof stats show a VERIFY marker until confirmed.
- `/send-the-deal`: 5 fields + up to 3 photos, honeypot, server-side validation (`src/lib/lead.ts`), serverless endpoint `/api/send-the-deal` forwarding multipart to `ZAPIER_WEBHOOK_URL`. With no webhook set, visitors are told to call or text instead of losing their message. Tested: valid, with photo, honeypot, bad contact, missing name, bad unit count, non-image file, GET, and no-webhook.
- `/send-the-deal/sent` confirmation (noindex, out of sitemap) fires the `form_submit` event.
- Call taps, text taps, and form submits are tagged (`data-event`) and ready for Plausible or GA4 – set `data/site.json → analytics.provider`.
- `/privacy` draft (VERIFY for legal review).
- Checks: build passes; internal link check passes (54 links); no em dashes in `src/`; axe accessibility scan 0 violations on every page at 390px and 1440px; no horizontal scroll on mobile; Lighthouse mobile 100/100/100/100 on `/`, `/send-the-deal`, `/privacy`.
- Pushed to the working branch only (Vercel preview). The live site still shows the coming-soon page until Paul says publish.

## Done this session (Session 1 – 2026-10-06)

- Site email set to pkelton@mattoneillteam.com and footer brokerage phone set to 843-460-3173 (Paul, 2026-10-06).

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

## Session 3 progress (2026-10-06)

- Pilot data for Areas 52 and 31 pulled from FlexMLS (MLS only, no RentCast), checked against raw rows, approved by Paul. Change figures hide when either window has under 10 sales (Paul, 2026-10-06).
- Area page layout (`src/layouts/AreaLayout.astro`), `/charleston` index, and `src/lib/areas.ts` (token filling, formatting, sample rules). Build fails if copy references missing data or types a number into the body.
- Draft pages for Upper Peninsula and North Charleston inside I-526 (`draft: true` – noindex, out of sitemap) waiting for Paul's review.
- Paul approved the two pilot pages; they are published (draft: false).
- Data pulled for the other 11 Tier A areas with a rewritten area-data-puller (stable paging, rank-lookup medians, raw files in data/raw/) and computed with scripts/compute-areas.mjs; spot checks against FlexMLS matched.
- 11 Tier A pages drafted (draft: true), reviewed for repetition, fair housing, invented claims, and em dashes. `npm run verify` (build, links, em dash, copy check) passes. Waiting for Paul's approval to publish.
- Next: Tier B areas, or Session 4 (neighborhoods).

## Next session (Session 3 – area hub pages, Tier A pilot)

- Before starting: `RENTCAST_API_KEY` as an environment secret, and `api.rentcast.io` allowed under Network access.
- Pilot Areas 52 and 31 with area-data-puller, review numbers, then area-page-writer.
- Use `NumberBlock` for every data block, `Breadcrumb` for the area breadcrumb.
- Flip `pageLinks.areas` and the Charleston areas nav item to `live: true` once `/charleston` exists.

## Carried over from Session 1 notes

- Design plan first (palette, type, wireframes) for Paul's approval.
- Add the Vercel adapter for the form endpoint (`/send-the-deal` posts to a serverless function that forwards to `ZAPIER_WEBHOOK_URL`).
- Flip nav items to `live: true` as pages ship (`src/lib/nav.ts`), including the footer privacy link once `/privacy` exists.
- Gated pages should also get `noindex` – wire the gate into the area and neighborhood layouts when they're built (Session 3).
- Note for Session 5: PROMPTS.md says "five" Phase 1 question pages but lists six. Plan for all six.
- Until Session 5 ships `/investor-friendly-agent-charleston`, the charlestoninvestoragent.com redirect lands on the 404 page. Either connect that domain after Session 5, or accept it temporarily.
