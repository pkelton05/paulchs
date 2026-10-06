# CLAUDE.md – paulchs.com

This file is the standing brief for building Paul Kelton's personal real estate brokerage site. Read it fully at the start of every session. When something here conflicts with a default habit, this file wins. When something here is marked [VERIFY], do not publish it until Paul confirms it.

---

## 1. What this site is

A personal brand site for Paul Kelton, an investment property agent in Charleston, SC. Modeled on danloveshouses.com: it looks like a simple personal site, but it is really a search-and-trust machine. The homepage builds trust. The long tail of MLS area pages and question pages brings people in from Google. A free deal analyzer keeps them coming back. Every page ends with a low-friction way to reach Paul.

**The niche:** small multifamily and rental property in Charleston – from a first duplex or fourplex up to 49 units. This is not a primary-home buyer site. Every page should speak to investors and owners of investment property.

**The reader:** mostly investors – first-time buyers trying to house hack, local landlords growing a portfolio, out-of-state investors buying in Charleston without visiting, and owners of 2–49 unit buildings thinking about selling.

**The job of the site:** get the reader to send Paul a deal, a question, or a phone number.

## 2. Brand

- **Domain:** paulchs.com (primary). paulkelton.com 301-redirects to the homepage. charlestoninvestoragent.com 301-redirects to /investor-friendly-agent-charleston.
- **Wordmark / identity:** matches Instagram and Threads handle **paul_charleston**. Because "CHS" is not obvious to out-of-state readers, the word "Charleston" must appear in the wordmark area or headline of every page.
- **Title line:** Paul Kelton | Investor-Friendly Agent
- **Positioning line:** Charleston investment property agent
- **Primary CTA:** "Send me the deal" – used on buttons site-wide. It opens the contact form (address, a few details, optional photo upload) and offers call/text.
- **Secondary CTAs:** "Text Paul", "Call Paul", "Run the numbers" (once the deal analyzer exists).

### Proof points (use these exact claims, nothing stronger)
- 200+ investor deals [VERIFY wording before launch]
- Founder of Tide Property Management – 300+ doors under management in Charleston [VERIFY current door count]
- Consistently ranked top five for multifamily sales in Charleston [VERIFY source/basis to cite]
- BiggerPockets Elite Agent for Charleston [VERIFY current status]
- Host of GRID Charleston – monthly investor community and podcast

Never invent stats, testimonials, sale prices, or client names. If a section needs real content Paul hasn't provided, leave a clearly marked placeholder like `[TESTIMONIAL – need from Paul]` and list it in the session summary.

### The core argument: skin in the game
Dan's version is "I own rentals." Paul's is stronger: "My company manages 300+ doors here, so the operating costs I quote come from real buildings, not guesses." The published rents and prices come from MLS comps (and RentCast where MLS is thin), never from Tide's data. This is the thread through the homepage story, the investor pages, and the deal analyzer.

## 3. Voice and copy rules

- **Plain talk, real numbers, no hard sell.** Write like Paul explaining a building to a friend over coffee.
- **First person** on the homepage, story, and contact pages ("I", "me"). Question pages can mix first person with direct "you" answers.
- **Specifics over adjectives.** "A fourplex in Park Circle rents for…" beats "great investment opportunity." Never use: "premier", "luxury", "industry-leading", "dream home", "trusted", "seamless".
- **Short sentences, plain verbs.** Aim for an 8th-grade reading level.
- **Empathy for where the reader is.** "Most people who reach out are months away from buying. That's the right time to talk."
- **No hype punctuation.** One exclamation mark per page at most. No all caps for labels.
- **Dashes:** always use the short dash (–) with spaces around it. Never use em dashes (—). Check every file before finishing a session.
- **Sentence case** for headings and buttons.
- Buttons say what happens: "Send me the deal", "Text Paul", "Run the numbers" – not "Submit" or "Learn more".

## 4. Content docs – read these before building any page

All page-level content lives in `docs/`, not in this file, so this file stays short:

- **`docs/SITE-CONTENT.md`** – the full page list (mapped from danloveshouses.com's structure), global elements, and draft copy for every page: homepage, investing, first building, selling, Charleston areas index, send the deal, deal analyzer, GRID, about, links, and all question pages.
- **`docs/AREAS.md`** – one entry per Charleston Trident MLS area (33 areas across Charleston, Dorchester, and Berkeley counties), with exact FlexMLS area values, slugs, build tiers, neighborhood lists, draft copy angles, the area page template, and the data pipeline.

- **`docs/NEIGHBORHOODS.md`** – the neighborhood list (built from Paul's closed MLS listings), proposed merges, page rules, data sources, and the neighborhood page template.

Dan's site is a structural reference only. Never copy its text, headings, or stats.

### Phase 1
Homepage, `/investing`, `/first-building`, `/selling`, `/about`, `/send-the-deal`, `/charleston` index, Tier A area pages (AREAS.md), Phase 1 question pages (SITE-CONTENT.md section 12), `/links`, `/privacy`.

### Phase 2
`/deal-analyzer`, `/grid`, Tier B area pages, Tier A neighborhood sub-pages, Phase 2 question pages.

### Phase 3 (ongoing)
Tier C area pages, remaining neighborhood pages, one new question page and one market update per month (often drafted from GRID transcripts and reviewed by Paul), monthly data refresh.

## 5. Page specs

Detailed specs and draft copy are in `docs/SITE-CONTENT.md` (pages) and `docs/AREAS.md` (area and neighborhood pages). Rules that apply everywhere:

**Area and neighborhood pages:** generated from `data/areas.json` so numbers update in one place. Every number block carries a "Data as of [Month YYYY]" stamp and a source line. Copy is written fresh per page – thin or duplicated area pages hurt rankings. Data sources: FlexMLS closed sales and MLS lease comps, with RentCast ZIP-level data filling gaps in rents. Tide rent data is not used. Neighborhood pages (one per MLS subdivision where Paul has a closed listing, about 75 to start) are specified in `docs/NEIGHBORHOODS.md` and generated from `data/neighborhoods.json`, seeded from `data/seed-neighborhoods.csv`.

**Fair housing rule (non-negotiable):** area and neighborhood pages describe prices, rents, building stock, location, and property characteristics only. Never describe who lives somewhere, safety, crime, school quality, or anything about demographics. No "up and coming", "family-friendly", "safe", or "good schools".

**Question pages:** every legal, tax, lending, insurance, or regulatory fact is [VERIFY] by default. Paul confirms before publishing. Include a short line where appropriate: "Not legal or tax advice – confirm with your attorney or CPA."

### About
Paul's story in first person: how he got into real estate, why investors, building Tide, GRID. Real photo. [Story details need to come from Paul – do not invent biography.]

### Send the deal (`/send-the-deal`)
- Form fields (max 5): name, phone or email, property address, unit count, "anything I should know?" + optional photo upload.
- Big call and text links beside the form.
- Copy: "You don't need it figured out. Send what you have."
- On submit, show a plain confirmation: "Got it. I'll get back to you within one business day." [VERIFY response time Paul wants to promise]

## 6. Selling page and the acquisition page

Paul also has a direct-to-seller acquisition landing page (steve-buys-apartments style, 2–49 units, Charleston + Charlotte/Greenville). That page has a different single audience and a separate campaign phone number (843-460-3173).

- `/selling` on this site is the brand-site version: for owners who want to sell, explaining how Paul prices, markets, and sells investment buildings.
- Do not merge the acquisition page's direct-response structure into the brand site. If Paul decides to host the acquisition page on this domain, it lives at its own URL (e.g. `/sell-your-building`) with its own minimal header, and keeps its own phone number for call tracking.
- On any seller-facing page, be accurate about Paul's role: he is a licensed SC agent. Never imply he is buying as a principal unless that is true for that page, and include agency disclosure language confirmed by his broker-in-charge.

## 7. Deal analyzer (Phase 2)

- Input: a property address (and unit count / bedroom mix if not found).
- Output: estimated rents, expenses, SC property tax (handle the 4% owner-occupied vs. 6% rental assessment ratio as a toggle), insurance, management, vacancy, debt service, cash flow, cap rate, cash-on-cash.
- Every assumption is visible and editable. No email gate. Optional "Send this deal to Paul" button that pre-fills the contact form.
- Default expense assumptions come from aggregated Tide operating data [VERIFY numbers with Paul].
- Clear note: estimates only, not an appraisal or financial advice.
- Paul has an existing deal-scoring pipeline (GitHub Actions + Claude API). Reuse its logic where possible rather than rebuilding.

## 8. Tech stack

- **Framework:** Astro, static output. Keep JavaScript to a minimum – interactive islands only where needed (deal analyzer, mobile menu, form).
- **Content:** markdown/MDX in `src/content/` with typed frontmatter (Astro content collections). Question pages and area commentary are markdown files Paul can edit.
- **Data:** `data/areas.json` (numbers per MLS area, with `as_of`, `source`, and `sample_size`), `data/site.json` (stats, phone, email, address, next event).
- **Hosting:** Vercel or Cloudflare Pages, deploying from GitHub on push to `main`.
- **Domains/redirects:** configure the two redirect domains as 301s at the host.
- **Forms:** POST to a serverless function or Zapier webhook that pushes the lead into Paul's CRM and texts/emails Paul. Keep the endpoint URL in an environment variable, never in the repo. Add a honeypot field for spam.
- **Analytics:** privacy-friendly analytics (Plausible or similar) or GA4 – ask Paul. Track form submits, call clicks, and text clicks as events.
- **SEO:**
  - Unique title and meta description on every page.
  - Canonical URLs on every page, sitemap.xml, robots.txt.
  - Schema.org: `RealEstateAgent` on the homepage and about, `FAQPage` on question pages, `BreadcrumbList` on area pages.
  - Open Graph images per page.
  - Name, address, and phone identical everywhere, matching Google Business Profile and Instagram.
- **Performance:** target Lighthouse 95+ on mobile. Compress and size all images (Astro image component), no hero video, no heavy font files – subset web fonts or use one family.
- **Accessibility:** semantic headings in order, alt text on every image, visible focus states, labeled form fields, color contrast AA minimum, respect reduced motion.

## 9. Compliance (non-negotiable)

- **Brokerage identification:** every page footer shows Paul's name, "Real estate services through Matt O'Neill Real Estate" (or the exact brokerage name and format his broker-in-charge requires), the brokerage phone, and the office address. [VERIFY exact SC advertising requirements and wording with broker-in-charge before launch.]
- **Office address:** 1349 Old Georgetown Road, Mount Pleasant, SC 29464 [VERIFY this is the address to use].
- **Equal Housing Opportunity** logo/text in the footer.
- **Affiliated business disclosure** anywhere the site links to or recommends Tide Property Management – Paul has an ownership interest in Tide. [VERIFY wording.]
- **Fair housing** language rules in section 5 apply to every page, not just area pages.
- **No guarantees** of returns, cash flow, or appreciation anywhere, including the deal analyzer.
- **Privacy policy** covering form data and analytics.

## 10. Design direction

Follow the frontend-design guidance for craft. Direction for this brand:

- **Feel:** credible local operator who knows the numbers. Clean, calm, lots of white space, real photography. It should feel like Charleston without being a tourism site – no Rainbow Row clichés, no pineapple fountains, no stock skylines.
- **Palette inspiration:** the working Lowcountry rather than the postcard. Ideas to explore: haint blue (porch ceilings), pluff mud brown, marsh grass green, oyster-shell/tabby off-white. Choose 4–6 named hex values and record them in `src/styles/tokens.css`. Avoid the common generated defaults: warm cream backgrounds near #F4F1EA with terracotta accents, near-black with a neon accent.
- **Type:** one or two families, chosen deliberately – sturdy and highly legible, comfortable for readers 45+. Body text at least 18px on mobile.
- **Numbers are the hero.** Rents, prices per door, and stats are the most characteristic content of this site. Give number blocks a distinctive, well-crafted treatment – this is where to spend boldness. Keep everything else quiet.
- **Avoid template tells:** all-caps eyebrow labels above every heading, identical rounded card grids with the same shadow, numbered 01/02/03 markers on non-sequential content, arrows appended to every link, fade-in animation on every section.
- **Mobile first.** Most traffic will come from Instagram and Google on phones. Sticky Call / Text / Send me the deal bar on mobile.

## 11. Working rules for Claude Code sessions

- Start each session by reading this file and `TODO.md` (create it if missing). End each session by updating `TODO.md` with what was done, what is next, and every [VERIFY] item or placeholder still open.
- Build one page or feature per session where possible. Commit with clear messages.
- Draft copy before design. Copy is the product.
- Before finishing, run: a build, a link check, an em dash search (`grep -r "—" src/` must return nothing), and a quick check for any invented facts or names.
- Ask Paul rather than guess on: anything factual about him or his business, legal/compliance wording, and how MLS data may be displayed (NEIGHBORHOODS.md section 6).
- Never commit secrets, API keys, webhook URLs, or client personal information.

## 12. Subagents and models

Three subagents live in `.claude/agents/`. Use them for repetitive page work so the main session stays focused:

- **`area-data-puller`** (Haiku) – pulls FlexMLS sales, MLS lease comps, and RentCast numbers into `data/areas.json`. Fast and cheap; it only moves data, never writes copy.
- **`neighborhood-indexer`** (Haiku) – builds and refreshes `data/neighborhoods.json` from Paul's closed MLS listings, with cleaned names, market stats, and page types.
- **`neighborhood-page-writer`** (Sonnet) – writes the neighborhood pages for one MLS area per run.
- **`area-page-writer`** (Sonnet) – writes one area or neighborhood page at a time from `docs/AREAS.md` and the data file.
- **`question-page-writer`** (Sonnet) – writes one question page at a time from `docs/SITE-CONTENT.md` section 12.

Typical area run: pull data for a batch of areas with `area-data-puller`, then run `area-page-writer` once per area, then review the batch in the main session for repetition across pages, fair housing language, em dashes, and open [VERIFY] items.

**Data connections Claude Code needs:**
- FlexMLS MCP server (`https://mcp.flexmls.com/mcp`), added with `claude mcp add` – the same connection Paul uses in claude.ai.
- RentCast API key in `.env` as `RENTCAST_API_KEY` (sent in the `X-Api-Key` header to `https://api.rentcast.io/v1`). Calls are metered – cache responses for 30 days in `data/cache/rentcast/` and check Paul's plan limits before bulk runs.
- The neighborhood list starts from `data/seed-neighborhoods.csv` (already built from Paul's 121 closed listings) and refreshes monthly through the FlexMLS connection. Optional: a Flexmls export of buyer-side closings saved to `data/raw/` (NEIGHBORHOODS.md section 3). `data/raw/`, `data/cache/`, and `.env` go in `.gitignore`.

**Typical neighborhood run:** `neighborhood-indexer` pulls market data for the seed neighborhoods, Paul approves the proposed merges, then `neighborhood-page-writer` runs once per MLS area, Tier A areas first, and the main session reviews each batch before publishing.
