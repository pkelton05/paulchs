# SITE-CONTENT.md – page-by-page content for paulchs.com

This is the page-by-page build list for paulchs.com, modeled on the structure of danloveshouses.com (indexed 2026-10-06). **Dan's site is a structural reference only.** Every line of copy below is original and written for Charleston. Do not copy text, headings, or stats from Dan's site – that is his copyrighted work, and duplicate content would also hurt rankings.

Conventions in this file:
- `{{site.stat_deals}}`-style tokens come from `data/site.json`.
- `{{area.*}}` tokens come from `data/areas.json` (see `docs/AREAS.md`).
- **[VERIFY]** = Paul must confirm before publishing. **[NEED]** = Paul must supply content.
- Short dashes only (–). No em dashes anywhere.

---

## 1. Page index: Dan's site → paulchs.com

| Dan's page | What it does | paulchs.com page | Phase |
|---|---|---|---|
| `/` | Positioning, proof, story, three paths, team | `/` | 1 |
| `/investing` | Investor landing page, philosophy, FAQ links, client stories | `/investing` | 1 |
| `/buying` | First home or 2-flat you live in (house hack) | `/buying` (was `/first-building`; 301s) | 1 |
| `/selling` | Seller page | `/selling` | 1 |
| `/neighborhoods` | Index of 150 neighborhood guides by region | `/charleston` (index by county, then MLS area) | 1 |
| `/[neighborhood]` (e.g. avondale) | Neighborhood guide with sale price and rent data | `/charleston/[area]` hubs (AREAS.md) and one page per neighborhood in Paul's closed sales at `/charleston/[area]/[neighborhood]` (NEIGHBORHOODS.md) – about 75 to start | 1–3 |
| `/reach` | Contact form | `/send-the-deal` | 1 |
| `/deal-analyzer` | Free 2–4 unit analyzer | `/deal-analyzer` | 2 |
| `/summit` | Free investor event | `/grid` | 2 |
| `/investor-friendly-agent-chicago` | Q&A page for the main search phrase | `/investor-friendly-agent-charleston` | 1 |
| `/what-is-a-2-flat` | Explains the local building type | `/what-is-a-charleston-single-house` | 1 |
| `/what-is-house-hacking-chicago` | House hacking explainer | `/house-hacking-charleston` | 1 |
| `/what-is-a-garden-unit-chicago` | Local unit type explainer | `/charleston-carriage-house-and-dependency-rentals` | 2 |
| `/how-much-rent-2-flat-chicago` | Rent data page | `/how-much-does-a-duplex-rent-for-in-charleston` | 2 |
| `/how-much-does-a-2-flat-cost-in-chicago` | Price data page | `/how-much-does-a-duplex-cost-in-charleston` | 2 |
| `/which-chicago-neighborhood-should-i-buy-in` | Area chooser | `/which-charleston-area-should-i-buy-in` | 2 |
| `/is-chicago-a-good-place-to-buy-rental-property` | Market thesis | `/is-charleston-a-good-place-to-buy-rental-property` | 1 |
| `/[agent-name]` (team pages) | Agent bios tied to local data | None for now. Add if Paul builds a team. | – |
| `/privacy` | Privacy policy | `/privacy` | 1 |
| (none) | – | `/sc-property-tax-4-vs-6-percent` | 1 |
| (none) | – | `/buying-charleston-rental-property-from-out-of-state` | 1 |
| (none) | – | `/charleston-flood-zones-and-insurance-for-rental-property` | 2 |
| (none) | – | `/charleston-short-term-rental-rules` | 2 |
| (none) | – | `/what-does-property-management-cost-in-charleston` | 2 |
| (none) | – | `/sc-deed-recording-fee` | 3 |
| (none) | – | `/about` | 1 |
| (none) | – | `/links` (Instagram link-in-bio) | 1 |

The last eight rows are Charleston-specific pages Dan has no equivalent for. They answer questions only a South Carolina investor asks, which makes them good search targets.

---

## 2. Global elements

### Header
- Wordmark: **paul_charleston** with "Paul Kelton · Charleston" beneath it. Final treatment is set in the design pass.
- Nav: Investing · Buying · Selling · Charleston areas · GRID (About in the footer) – per Paul's engagement plan, 2026-10-07
- Right side: `Call` · `Text` · **Send me the deal** (button)

### Event strip (above the header, only when an event is scheduled)
Driven by `data/site.json → next_event`. Pattern:
> GRID Charleston · {{event.date}} · {{event.title}} · Save your seat

### Mobile sticky bar
`Call` · `Text` · `Send me the deal`

### Footer
- paul_charleston wordmark
- Paul Kelton, REALTOR® [VERIFY designation] · {{site.brokerage_line}} [VERIFY exact wording with broker-in-charge]
- {{site.office_address}} · {{site.phone}} · {{site.email}}
- Nav repeated
- **Questions I get a lot:** Investor-friendly agent in Charleston · What is a Charleston single house · House hacking in Charleston · SC 4% vs. 6% property tax · Buying from out of state
- Social: Instagram (paul_charleston), Threads, LinkedIn, YouTube [NEED links], BiggerPockets profile [NEED link], GRID podcast [NEED link]
- © {{year}} Paul Kelton · Equal Housing Opportunity · Privacy
- Affiliated business disclosure line if Tide is mentioned on the page [VERIFY wording]

---

## 3. Homepage `/`

**Title tag:** Paul Kelton | Investor-Friendly Agent in Charleston, SC
**Meta description:** Charleston investment property agent for duplexes, small multifamily, and rentals. Real MLS comps, plus operating costs from 300+ doors I manage. Send me the deal.

**Hero**
- H1: Charleston investment property, with real numbers.
- Sub: I help investors buy, sell, and hold duplexes, small multifamily, and rental property across the tri-county.
- Buttons: **Send me the deal** · See the areas
- Media: GRID podcast clip or photo of Paul on a property [NEED]

**Proof strip** (three stats from site.json)
- {{site.stat_deals}} investor deals [VERIFY]
- {{site.stat_doors}} doors managed through Tide [VERIFY]
- {{site.stat_rank}} – #1 in 2–4 unit sales among individual Charleston agents, each of the last 3 years (confirmed by Paul 2026-10-06)

**Client words** – three short testimonials, real names or initials, with deal type. [NEED from Paul]

**The story**
> I got into real estate through rental property, and I still spend most of my days inside it. My property management company, Tide, takes care of more than {{site.stat_doors}} doors across Charleston. That means when I tell you what the insurance runs, what a turnover costs, or what an old roof is going to do to your first year, I'm not guessing. I see it on buildings we run every month. And the rents and prices on this site come straight from MLS comps, so you can check my math.
>
> So that's how I work with investors. Plain talk, real numbers, and no pressure to buy anything that doesn't pencil.

[NEED: Paul's own origin details to replace or extend the first sentence.]

**Three ways I help**
- **Investing** – Duplexes to 49-unit buildings. I underwrite like an owner, because I see owner-level numbers every day. → `/investing`
- **Your first building** – Live in one unit, rent the rest. The most common first step I see, and the one I'd take again. → `/buying`
- **Selling** – I know who's buying Charleston income property right now and what they'll pay for it. → `/selling`

**Areas teaser**
- H2: Every corner of the tri-county, with the numbers.
- Line: Prices, rents, and price per door for each MLS area from downtown to Moncks Corner.
- Link: See all Charleston areas → `/charleston`

**GRID block**
- H2: GRID Charleston
- Line: A monthly room full of local investors talking about real deals. No gurus, no pitch.
- Link: Next event → `/grid`

**Closing CTA**
- H2: Not sure where to start?
- Line: Send me what you've got – an address, a question, or just a budget. Most people who reach out are months from buying, and that's the right time to talk.
- Buttons: Send me the deal · Text Paul

---

## 4. Investing `/investing`

**Title:** Charleston Small Multifamily and Rental Property | Paul Kelton
**Meta:** Duplexes, fourplexes, and buildings up to 49 units in Charleston. Underwritten with real operating numbers from 300+ managed doors.

- H1: Numbers that survive the first year.
- Intro:
> Most deals look good on the listing. The question is what they look like after a full year of insurance renewals, turnovers, and a roof that's older than the disclosure said. I underwrite every building using what similar Charleston buildings actually cost to run, because my management company runs them.

- H2: What I help investors buy
  - Duplexes, triplexes, and fourplexes – the easiest entry, and financeable with residential loans.
  - 5–49 unit buildings – small commercial loans, real cap rates, and far less competition from big funds.
  - Single-family and townhome rentals in areas where small multifamily is scarce.
- H2: How I underwrite
  - Rents: what the unit rents for today after a light refresh, not what the current tenant pays. [Paul to confirm this is his stance.]
  - Expenses: insurance, taxes at the correct 6% assessment, management, maintenance, and capital reserves based on real buildings.
  - The building: roof, HVAC, water heaters, wiring, and whether utilities are separately metered.
  - The exit: who buys this building from you in five years, and at what price.
- H2: Where in Charleston
  - Short paragraph + link to `/charleston` and the area chooser page.
- H2: Questions I get a lot (links to question pages)
- H2: Investors I've worked with – testimonials [NEED]
- CTA: Send me the deal · Run the numbers (`/deal-analyzer`, Phase 2)

---

## 5. Your first building `/buying` (moved from `/first-building`, Paul's engagement plan 2026-10-07)

Dan's `/buying` page targets first-time buyers house hacking a 2-flat. This is the Charleston version.

**Title:** House Hacking Your First Duplex in Charleston | Paul Kelton
**Meta:** Live in one unit and rent the other. How much you need down, what it costs in each Charleston area, and how the 4% owner tax rate changes the math.

- H1: Live in one unit. Let the rent help pay the mortgage.
- Intro:
> Buying a duplex or fourplex and living in one of the units is the most common way I see people start investing in Charleston. You get owner-occupant financing, and in South Carolina you may also get a much lower property tax rate on the part you live in.

- H2: What happens when you reach out
  1. You tell me what you're thinking – even if it's just a budget and an area.
  2. I show you what that budget buys in Charleston right now, with rents.
  3. We tour, run the numbers on each building, and only write offers on the ones that work.
- H2: How much money you need
> Owner-occupant loans can get you into a 2–4 unit building with a small down payment. FHA loans can go as low as 3.5% down, and some conventional loans allow 5% down on 2–4 units you live in. The exact rules depend on the loan and the lender, and they change, so talk to a lender early. I can introduce you to lenders who do this every week.

[VERIFY current FHA and conventional 2–4 unit owner-occupied minimums before publishing.]
- H2: The South Carolina tax advantage – summary + link to `/sc-property-tax-4-vs-6-percent`
- H2: Which area – link to `/which-charleston-area-should-i-buy-in` and `/charleston`
- H2: Buying from out of state – link
- Testimonials from first-time buyers [NEED]
- CTA

---

## 6. Selling `/selling`

**Title:** Sell Your Charleston Duplex or Apartment Building | Paul Kelton
**Meta:** Selling a duplex, small multifamily, or rental in Charleston? Pricing based on real income, and a list of active investor buyers.

- H1: Sell your building to the right buyer, at a price the numbers support.
- Intro:
> Investment property sells on income. I price your building the way a buyer's lender will look at it – rents, expenses, and condition – so there are no surprises after the appraisal. And because I work with investors every day, I usually know who's buying before we list.

- H2: How I price a building – rent roll, T-12, condition, recent trades, and what buyers are paying per door in your area.
- H2: How I market it – on-market with full investor packaging, or quietly to my buyer list first. Your choice.
- H2: Tenants – how showings and notices work so your tenants are respected and your income keeps coming in.
- H2: What I'll need from you – rent roll, leases, expenses, recent repairs.
- H2: Recent sales [NEED – real closed deals Paul wants to show, with client permission]
- CTA: "Thinking about selling? Send me the address."

**Note for Claude Code:** The separate direct-to-seller acquisition page (if hosted here) lives at `/sell-your-building` with its own layout and campaign phone number – see CLAUDE.md section 6. Do not merge the two.

---

## 7. Charleston areas index `/charleston`

**Title:** Charleston Investment Property by Area | Prices and Rents | Paul Kelton
**Meta:** Every Charleston, Dorchester, and Berkeley County MLS area with small multifamily prices, rents, and price per door.

- H1: Charleston, area by area.
- Intro: "Prices, rents, and what to check before you buy, for every MLS area in the tri-county. Updated monthly."
- Grouped by county, then listed by MLS area (from AREAS.md). Each card: area name, one-line description, median 2–4 unit price or "rarely trades", link.
- Optional Phase 2: an interactive map of MLS areas.

---

## 8. Send me the deal `/send-the-deal`

- H1: Send me the deal.
- Line: You don't need it figured out. Send what you have and I'll get back to you within {{site.response_time}} [VERIFY].
- Form (max 5 fields + upload): Name · Phone or email · Property address (or area you're looking in) · Number of units · Anything I should know? · Optional photos
- Side: big Call and Text links, office address.
- Confirmation: "Got it. I'll be in touch within {{site.response_time}}."

---

## 9. Deal analyzer `/deal-analyzer` (Phase 2)

Dan's analyzer is a good model for the inputs. The Charleston version needs local defaults:

**Property:** address, MLS area (auto from address or dropdown), purchase price, units, bed/bath per unit
**Rents:** pre-filled from MLS lease comps for the area and bedroom count (`data/areas.json` / `data/neighborhoods.json`), editable. Optional "Estimate this address" button calls the RentCast rent estimate endpoint (`/v1/avm/rent/long-term`) through a serverless function so the API key is never exposed in the page. Cache results and rate-limit per visitor – calls are metered.
**Expenses (all editable, defaults from aggregated Tide data [VERIFY]):**
- Property tax: toggle **Owner-occupied (4%)** vs **Investment (6%)**, times the area's typical millage [VERIFY millage source per tax district]
- Insurance: separate wind/hurricane and flood lines – flood zone dropdown (X, AE, VE)
- Water/sewer and trash if owner-paid
- HOA if applicable
- Management % (0 if self-managing)
- Vacancy, repairs, capex as % of rent
**Financing:** down payment %, rate, term, closing costs
**Output:** monthly cash flow, cap rate, cash-on-cash, price per door, DSCR
**Buttons:** Send this deal to Paul (pre-fills the contact form) · Reset
**Disclaimer:** Estimates only. Not an appraisal, financial, or tax advice.

---

## 10. GRID `/grid` (Phase 2)

- H1: GRID Charleston
- Line: A monthly meetup and podcast for Charleston real estate investors. Real deals, real numbers, no gurus.
- Next event block (from site.json), past episodes list, sign-up link [NEED event platform and podcast links]

---

## 11. About `/about`

- H1: I'm Paul.
- [NEED: Paul's story in his own words – how he started, first deal, building Tide, starting GRID, why investors.]
- Facts block: Tide founder ({{site.stat_doors}} doors), GRID host, {{site.stat_deals}} investor deals, BiggerPockets Elite Agent [VERIFY], top 5 multifamily ranking [VERIFY]
- Photo [NEED]
- Brokerage and license line [VERIFY]

---

## 12. Question pages

Format for every question page: H1 is the question or search phrase; 5–9 H2 questions, each answered in 2–4 short paragraphs; one internal link per section where natural; testimonials or a CTA at the end; `FAQPage` schema. 400–900 words. Draft copy below is a starting point for Paul to edit.

### 12.1 `/investor-friendly-agent-charleston` (Phase 1 – the page charlestoninvestoragent.com points to)

**Title:** Investor-Friendly Real Estate Agent in Charleston, SC | Paul Kelton
**Meta:** What makes an agent investor-friendly, how to tell if a Charleston deal works, and what to check on older buildings. Straight answers from a Charleston investor agent.

- H1: Investor-friendly agent in Charleston
- Intro: Most of the people I work with are buying their first or second building. You don't need to have it figured out before you call.

**What does "investor-friendly" actually mean?**
> It means your agent reads a building the way an owner does. A lot of agents can tell you whether a kitchen is updated. Fewer can tell you what the insurance will cost on a 1950s duplex in a flood zone, or whether the rents in the listing are real. My company manages {{site.stat_doors}} doors in Charleston, so I see the actual operating costs every month.

**Will the rent cover the mortgage?**
> Sometimes, and it depends on which rent number you use. Many Charleston buildings have long-time tenants paying well under market. I underwrite using what the unit would rent for today after a reasonable refresh, and I show you both numbers so you can see the upside and the risk.

**How do I know if it's a good deal?**
> Start with the rent, then the real expenses: property tax at the right rate, insurance, management, repairs, and reserves for big items. If it still works with a realistic interest rate, it's worth a closer look. Send me the address and I'll run it with you. [Phase 2: link to deal analyzer]

**Is Charleston a good place to buy rental property?**
> Short answer + link to `/is-charleston-a-good-place-to-buy-rental-property`.

**Which part of Charleston should I buy in?**
> Short answer + link to `/charleston` and the area chooser.

**What should I check on an older Charleston building?**
> Four things move the numbers more than anything cosmetic: the roof, the HVAC systems, the electrical (especially in older frame buildings), and whether the units have separate meters. In some areas, add the flood zone and the elevation. I'm in these buildings every week, so I can usually flag the big items before you pay for an inspection.

**What happens to the tenants who are already there?**
> Their leases transfer with the building. You honor the existing terms until they end. South Carolina has its own landlord-tenant rules for notices and deposits, and I'll walk you through them for the specific building. [VERIFY: add a short accurate summary of SC Residential Landlord and Tenant Act notice basics, or link to it.]

**Can I buy from out of state?**
> Yes. Link to `/buying-charleston-rental-property-from-out-of-state`.

**How little can I put down?**
> If you'll live in one unit, owner-occupant loans can get you into a 2–4 unit building with a small down payment. Link to `/buying`. [VERIFY loan minimums]

- CTA: You don't need a budget, a lender, or a building picked out yet. Send me the deal.

### 12.2 `/what-is-a-charleston-single-house` (Phase 1 – Charleston's equivalent of Dan's 2-flat page)

**Title:** What Is a Charleston Single House? (And How It Works as a Rental)
**Meta:** The Charleston single house is one room wide with its side to the street and a piazza along the length. Here's how investors use them as rentals.

- H1: What is a Charleston single house?

**What it is**
> A Charleston single house is one room wide, set with its narrow end facing the street, with a long porch – locals call it a piazza – running down one side. You usually enter through a door on the street that opens onto the piazza, not straight into the house. It's the signature building type on the peninsula and you'll see it on almost every downtown block.

**Why it was built that way** – narrow deep lots, cross-breezes before air conditioning, shade from the piazza. [Keep historical claims general and accurate.]

**How investors use them today**
> Many single houses have been split into two or more apartments, often one unit per floor. Some have a separate rear building – a dependency or carriage house – that's rented on its own. Others are single-family rentals. Each setup works differently for financing, taxes, and rental rules.

**Why they hold value**
> You can't build more of them. The peninsula is out of land, historic review protects the existing buildings, and a new building with the same detail would cost far more than an old one sells for. When you own one, there's a limited supply of competing buildings like it.

**What to watch for** – age-related systems, foundations and termites, Board of Architectural Review approval for exterior changes, insurance on older frame houses, flood zones on low-lying blocks, and whether the unit count is legal. [VERIFY specifics]

**What they cost and rent for** – pull from `data/areas.json` for areas 51 and 52. Only publish if the sample is meaningful.

- Links: Downtown Charleston area page, Upper Peninsula area page, carriage house page.

### 12.3 `/house-hacking-charleston` (Phase 1)

**Title:** House Hacking in Charleston, SC: How It Works and What It Costs
**Meta:** Buy a duplex, live in one side, and rent the other. How house hacking works in Charleston, including the SC 4% owner tax rate.

- H1: House hacking in Charleston
- H2: What house hacking is – buy a 2–4 unit building (or a house with a legal rentable unit), live in one, and rent the rest.
- H2: Why it works especially well in South Carolina – link to the 4% vs. 6% page. Keep the claim simple and [VERIFY] how the assessment applies to a 2–4 unit building where the owner lives in one unit (it may be apportioned).
- H2: How much you need down – owner-occupant loan summary [VERIFY].
- H2: Where house hacking works in Charleston – Tier A areas from AREAS.md with links.
- H2: What happens when you move out – the building becomes a full rental; the tax rate on your unit changes; rerun the numbers at 6%.
- H2: Common mistakes – buying for the unit you'll live in rather than the rent of the others; ignoring HOA leasing rules; underestimating insurance.
- CTA

### 12.4 `/sc-property-tax-4-vs-6-percent` (Phase 1 – Charleston-specific)

**Title:** SC Property Tax: 4% vs. 6% Assessment Explained for Investors
**Meta:** South Carolina assesses your primary residence at 4% and rental property at 6%. Here's what that means for Charleston investors and house hackers.

- H1: South Carolina property tax: 4% vs. 6%, explained for investors
- H2: The short version
> In South Carolina, the home you live in as your legal residence is generally assessed at 4% of its value. Rental and other property is generally assessed at 6%. On top of that, owner-occupied homes are generally exempt from school operating millage. Together, these can make the tax bill on a rental far higher than on the same house lived in by its owner. [VERIFY all three statements and current law.]
- H2: What it means for a rental's numbers – a worked example with clearly labeled hypothetical numbers, not a real property. [VERIFY the math against a current Charleston County tax bill.]
- H2: What it means if you house hack – how the 4% may apply to the owner's unit, and what to ask the assessor. [VERIFY]
- H2: The mistake I see most – underwriting a rental using the seller's owner-occupied tax bill. Always recalculate at 6%.
- H2: How to apply for the 4% rate – link to the county assessor (Charleston, Dorchester, Berkeley). [VERIFY links and deadlines]
- Disclaimer: Not tax advice. Confirm with the county assessor or a CPA.

### 12.5 `/buying-charleston-rental-property-from-out-of-state` (Phase 1)

**Title:** Buying Charleston Rental Property From Out of State | Paul Kelton
**Meta:** How out-of-state investors buy Charleston duplexes and rentals: video tours, real rent numbers, management, and closing remotely.

- H1: Buying Charleston rental property from out of state
- H2: Can you really buy without seeing it? – yes; video walk-throughs, inspection reports, and you can visit before closing if you want.
- H2: How I make up for you not being here – I walk it on video, pull the leases, tell you which buildings I'd pass on and why.
- H2: Who manages it – self-manage remotely vs. a local manager. Mention Tide with affiliated business disclosure. [VERIFY disclosure wording]
- H2: South Carolina specifics out-of-state buyers miss – 6% assessment, flood and wind insurance, SC closings are attorney-led. [VERIFY]
- H2: Closing remotely – how signing and funding work. [VERIFY with Paul's usual closing attorneys]
- CTA

### 12.6 `/is-charleston-a-good-place-to-buy-rental-property` (Phase 1)

**Title:** Is Charleston a Good Place to Buy Rental Property?
**Meta:** Why Charleston rental demand holds up: jobs, growth, and limited new supply in the places renters want to live. And the risks to price in.

- H1: Is Charleston a good place to buy rental property?
- H2: Why demand holds up – a diverse employer base: the port, healthcare and MUSC, Joint Base Charleston, aerospace and manufacturing, tourism and hospitality, and several colleges. Keep it qualitative or source every number. [VERIFY any stat]
- H2: Why supply is limited where renters want to be – the peninsula is out of land, historic buildings can't be replaced at today's cost, and some towns have slowed new multifamily approvals. [VERIFY the Mount Pleasant claim before publishing]
- H2: The risks to price in – insurance and flood costs, hurricane exposure, higher property tax on rentals, and prices that already reflect a lot of growth.
- H2: Where the numbers work best right now – link to the area chooser.
- CTA

### 12.7 Phase 2 question pages – outlines

**`/charleston-carriage-house-and-dependency-rentals`** (Charleston's version of Dan's garden unit page)
- What a dependency or carriage house is; renting it long-term vs. short-term; legality and permits; how lenders treat it; whether it counts as a second unit for financing; insurance. [VERIFY all rules]

**`/how-much-does-a-duplex-cost-in-charleston`** (data page)
- Region-wide median 2–4 unit price and middle-half range from FlexMLS, then a table by MLS area linking to each area page. Same methodology note on every number. "Data as of" stamp.

**`/how-much-does-a-duplex-rent-for-in-charleston`** (data page)
- Rent by bedroom count, region-wide and by area, from MLS lease comps (property type D, status Rented), with RentCast ZIP data where MLS is thin. Source and sample size per row.

**`/which-charleston-area-should-i-buy-in`**
- Groups areas by investor goal: cash flow (e.g. 31, 32, 73), balance of cash flow and growth (e.g. 11, 21, 62, 71), appreciation and premium rents (e.g. 51, 52, 42), short-term rental (22, 44). Pull the grouping from data, not opinion alone, and have Paul approve it. Fair housing language rules apply.

**`/charleston-flood-zones-and-insurance-for-rental-property`**
- How to read a flood zone (X, AE, VE), elevation certificates, NFIP vs. private flood, wind coverage, how insurance changes the deal. [VERIFY]

**`/charleston-short-term-rental-rules`**
- Rules differ by municipality: City of Charleston, Mount Pleasant, Folly Beach, Isle of Palms, James Island, county. A short summary per jurisdiction with a link to the official source and a "last checked" date. [VERIFY all – these change often]

**`/what-does-property-management-cost-in-charleston`**
- Typical fee structures in the market (management %, leasing fee, renewal fee, maintenance markups), what to compare. Mentions Tide with affiliated business disclosure. Keep the page useful to someone who never hires Tide.

**`/sc-deed-recording-fee`** (Phase 3)
- What the fee is, how it's calculated, who customarily pays it in Charleston. [VERIFY rate and custom]

---

## 13. `/links` (Instagram link-in-bio)

Simple, branded, mobile-first. Buttons in this order: Send me the deal · Charleston areas · Next GRID event · Latest podcast · House hacking in Charleston · Call/Text. Track clicks.

---

## 14. Testimonials and proof to collect from Paul [NEED]

- 6–10 client testimonials with permission, tagged by type (investor buyer, first building, seller, out-of-state)
- 3–6 recent deals to feature (area, unit count, what happened – no client names without permission)
- Headshots and on-site photos
- Podcast and media links
- Confirmation and sources for every stat in site.json
