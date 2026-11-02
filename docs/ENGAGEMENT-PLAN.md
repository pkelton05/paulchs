# paulchs.com – Engagement Plan

**Reviewed:** latest Vercel preview of paulchs.com (home, /charleston, /charleston/james-island, /send-the-deal) and danloveshouses.com (home, /investing, /neighborhoods, /deal-analyzer, a client success story).
**Date:** October 6, 2026
**Status:** Paul's plan, saved 2026-10-07. Progress is tracked in `TODO.md` under "Engagement plan". Where this plan and CLAUDE.md disagree (analyzer email gate, `/buying` vs `/first-building`), the open decisions are listed in `TODO.md`.

---

## The short version

The foundation is strong. The voice is right, the area pages are genuinely useful (James Island is better than most agent sites in the country), and the mobile Call / Text / Send me the deal bar is exactly what an investor site needs.

What's missing is **reasons to stay, come back, and raise a hand before they have a deal.** Right now the site has one action: "Send me the deal." Most visitors aren't there yet. Dan's site gives them five other things to do – run a deal, read a client story, listen to a podcast, save a seat at an event, get weekly deal alerts – and every one of those captures a lead earlier.

The plan below is in priority order. Each item has a "done when" line so it can be handed straight to Claude Code.

---

## Priority 0 – Launch blockers

Fix these before the site goes public. None of them are about engagement, but any one of them hurts trust.

1. **Remove the visible "VERIFY" tags** on area pages (James Island's "What to check before you buy" list shows them to the public).
   *Done when:* no "VERIFY" text renders on any page; keep the flag in source/CMS only.

2. **Fill or hide every placeholder.** Hero photo, origin story, three testimonials, affiliated business disclosure.
   *Done when:* no bracketed `[NEED from Paul]` text renders anywhere. If a testimonial isn't ready, hide the section rather than ship a blank.

3. **Finalize the affiliated business disclosure and show it site-wide.** It's on the homepage footer but missing from /charleston, area pages, and /send-the-deal.
   *Done when:* final wording (approved by Matt / broker) appears in the shared footer component.

4. **Source the "#1 in 2–4 unit sales" claim.** Add a one-line source under the proof bar (data source, date range, how "individual agent" is defined).
   *Done when:* every number in the proof bar has a source line, matching the style already used on area pages.

5. **Confirm the brokerage phone.** The footer lists 843-460-3173 as both Paul's line and "Brokerage phone." Confirm with the broker which number SC advertising rules require there.

6. **Test the deal form end to end.** The form code includes an "isn't connected yet" error state. Submit a real test with photos and confirm it lands where it should (email + CRM).

7. **Add SMS consent language to the form** if you'll text leads back. Dan's form includes a consent checkbox covering marketing texts, frequency, rates, HELP/STOP. Needed for A2P 10DLC registration anyway.

---

## Priority 1 – The six biggest engagement levers

These are the things Dan's site does that Paul's doesn't, ranked by how much they'd move leads.

### 1. A Charleston deal analyzer (the single biggest lever)

**What Dan does:** A 2–4 unit analyzer at `/deal-analyzer`. Enter an address, price, unit mix, and expenses; it shows cash flow, cash-on-cash, and cap rate, plus "live AI rent comps" for the address. It's email-gated, and the email signs you up for weekly deal alerts. His investing page ends with two buttons: "Reach out" and "Try the deal analyzer."

**Why Paul can do it better:**
- Dan stops at 4 units. Paul's niche is 2–49. Build for 2–49 and you own a lane nobody else in Charleston is in.
- Dan's expense defaults are generic percentages. Paul's homepage already promises "operating costs from 300+ doors I manage." Use Tide-informed defaults for insurance, turnover, repairs, and management by area – that's the moat. (Rents should still come from MLS comps or RentCast, consistent with the rest of the site.)
- Charleston-specific line items Dan doesn't need: flood insurance, wind/hail, jurisdiction (city vs. town vs. county), STR allowed or not.

**Recommended gating:** Show the headline cash flow free. Gate the full breakdown, a PDF "Paul's read," or saving the deal behind email. Less friction than Dan's full wall, still captures the lead.

**Done when:**
- `/deal-analyzer` live with address, price, units (2–49), unit mix, financing, and expense inputs
- Defaults pull by MLS area (insurance, flood risk flag, rent by bedroom from the area page data)
- Outputs: monthly cash flow, cash-on-cash, cap rate, price per door vs. area median
- "Send this deal to Paul" button pre-fills `/send-the-deal`
- Linked from homepage, every area page ("Run a James Island duplex"), and nav

### 2. A site-wide event strip and a real GRID page

**What Dan does:** A strip at the top of every page promoting his free Investor Summit with a date and "Save your seat." He runs these roughly quarterly and has an events archive. It gives return visitors something new every time.

**What Paul has:** GRID is mentioned in one homepage paragraph with no link. That's Paul's best asset sitting idle – a monthly room of local investors is a stronger draw than a quarterly summit.

**Done when:**
- Thin strip above the header on every page: next GRID event, date, "Free · Save your seat" (data-driven so it updates itself)
- `/grid` page: what GRID is, next event with RSVP, past events, latest podcast episodes, photos from the room
- Homepage GRID section links to `/grid`
- RSVP captures name, email, phone into the same CRM as deal leads

### 3. Media proof in the hero

**What Dan does:** His hero image is him on the BiggerPockets podcast, with the episode title and a "Full episode" link. His investing page adds a "Podcasts" section with three episodes and a photo of him on stage at BPCon.

**What Paul should do:** Paul hosts his own podcast. That's better proof than being a guest.

**Done when:**
- Hero image is a real photo of Paul – GRID podcast still or on stage at a GRID event (already flagged in the placeholder)
- Caption under it: "Host of the GRID Charleston podcast" + link to latest episode
- "As heard on" / "Listen" section on the investing page with 3 episodes and one-line descriptions
- Any guest appearances on other shows added alongside

### 4. Client success stories (dedicated pages, not just quotes)

**What Dan does:** Three story pages (`/sam-blaisdell` etc.). Each has a headline quote, how the client found Dan, the first property, the cash flow number ("third property, cash flowing $1,400/mo"), their goals, and their philosophy. Linked from the investing page as cards.

**Why it works:** A quote says "Dan's great." A story says "someone like me did this, and here's the number." That's what converts a person who's "months from buying."

**Done when:**
- 3 story pages at `/stories/<name>` using a consistent template: headline quote, photo, how they found Paul, the property, the numbers, what's next
- Mix of profiles: a first-time house hacker, a scaling investor (5+ units), and a seller
- Story cards on homepage and investing page
- The three homepage testimonials pull from these clients (with name or initials and deal type, like Dan's "S. B. · sold their home")

### 5. Weekly deal alert email

**What Dan does:** The analyzer gate promises "Dan's weekly Chicago deal alerts." That's the retention engine – it brings people back weekly.

**What Paul should do:** "This week's Charleston 2–49 unit deals, with Paul's take." Paul already sees deal flow through MORE Commercial and writes content daily.

**Done when:**
- Email signup block on homepage, area pages, and analyzer ("Get the weekly deal list")
- Signups flow into Kit (or whatever runs the GRID newsletter), tagged by source page
- One-line promise of frequency and content, no fluff

### 6. "Questions we get a lot" content pages

**What Dan does:** A short set of FAQ pages linked in every footer and on the investing page: what a 2-flat is, how house hacking works in Chicago, what a garden unit is, what a 2-flat rents for, investor-friendly agent in Chicago. These rank in search and answer the exact questions new investors type.

**Charleston equivalents for Paul:**
- How house hacking works in Charleston
- What a duplex rents for in Charleston
- Flood insurance on Charleston rental property
- Short-term rental rules in Charleston, by jurisdiction
- Buying a 5–49 unit building: how financing changes after 4 units
- Investor-friendly agent in Charleston

**Done when:** 6 pages live, each 600–1,000 words in Paul's voice, pulling real numbers from the area data, with a "Send me the deal" CTA and links to relevant area pages. Linked from footer and investing page.

---

## Priority 2 – Page-by-page changes

### Navigation and structure

Paul's nav has one item ("Charleston areas"). Dan's has Investing, Buying, Selling, Neighborhoods & Suburbs, phone, Text, Reach out.

**Done when the nav reads:** Investing · Buying · Selling · Charleston areas · GRID · [Call] [Text] [Send me the deal]

New pages this requires:
- `/investing` – the owner's read, podcast episodes, story cards, analyzer CTA (model on Dan's investing page)
- `/buying` – first building / house hack: how much cash you need, what happens after you reach out, lender intro for 2–4 units
- `/selling` – for owners of 2–49 units: what buyers are paying now, how Paul markets to his investor list, recent sales
- `/about` – the origin story (currently a placeholder), Tide, MORE Commercial, GRID, family-legacy angle if Paul wants it

### Homepage

- **Hero:** keep the H1 – it's good. Swap the placeholder for a real photo plus podcast caption (see #3). Add a secondary button "Run a deal" next to "Send me the deal."
- **Proof bar:** keep the three numbers, add source line (P0 #4).
- **"How I help" cards:** each card should link to its page (Investing → `/investing`, etc.). Right now they're dead ends.
- **Add a "Results" section** with 3 story cards (see #4), above or replacing the plain testimonials.
- **GRID section:** add next event + "Save your seat" button and latest episode.
- **Add an email signup** for the weekly deal list before the closing CTA.
- **Closing CTA copy** ("Most people who reach out are months from buying") is excellent – keep it. Dan uses nearly the same idea on his contact page: you don't need a budget, a lender, or a building picked.

### Charleston areas index

- About 20 of 34 areas say "Guide coming soon," while the homepage promises "every corner of the tri-county, with the numbers." Either hide unbuilt areas behind a "More areas" toggle or soften the homepage line.
- Steal Dan's line for the gap: *"No guide for that one yet. Ask me about it and I'll tell you what I know, then write it up."* Turns a dead end into a lead.
- Add a search box (Dan has one).
- Fix the duplicate: areas 72 and 73 are both labeled Goose Creek / Moncks Corner.
- Show a 2-bed rent figure next to median sale price for each area, so "rarely trade here" rows still have a useful number.
- Add a simple tri-county map with the areas clickable.

### Area pages (e.g. James Island)

These are already the best part of the site. Small upgrades:
- Remove "VERIFY" tags (P0 #1).
- Add one real photo or a map at the top – the page is all text and number blocks.
- Embed a mini analyzer: "Run a James Island duplex" pre-filled with the area's median price and rents.
- Add "Recent deals I've done here" if Paul has closed in the area.
- Link Folly Beach in "Nearby areas" once its guide exists (currently plain text).
- Add an email signup: "Get James Island deals when they hit."

### Send the deal page

- Add a first question: **"What are you working on?"** – Buying / Selling / Own a building, just exploring / Something else. Routes the lead and makes sellers feel welcome (right now the form reads buyer-only).
- Add SMS consent checkbox (P0 #7).
- After submit, send people to a thank-you page with: what happens next, Paul's typical response time, next GRID event, and latest podcast episode. Turns a dead end into a second touch.
- Test it end to end (P0 #6).

---

## Priority 3 – Social, sharing, and tracking

- **Add an Open Graph image** (Paul's photo + "Charleston investment property, with real numbers"). Right now links shared by text, LinkedIn, or Instagram preview with no image.
- **Add LinkedIn and YouTube to the social links.** Paul posts on LinkedIn up to daily; it's missing from the footer. Dan links YouTube, Facebook, TikTok, Instagram, LinkedIn, and BiggerPockets.
- **Instagram link-in-bio landing page** (`/ig`): photo, one line, three buttons (Send me the deal, Run a deal, Next GRID event). Since the brand mirrors @paul_charleston, this is where most first visits will come from.
- **Analytics goals:** tracking events already exist for call/text taps. Add events for analyzer runs, email signups, GRID RSVPs, story page reads, and form submits so you can see which levers actually work.

---

## Where Paul should beat Dan, not copy him

Dan's site is the right model for structure. These are the places Paul has an edge he should lean into:

| Dan | Paul's advantage |
|---|---|
| 2–4 units only | 2–49 units – own the 5–49 gap nobody serves |
| Owns his own rentals | Runs 300+ doors through Tide – real operating cost data |
| Guest on BiggerPockets | Hosts his own podcast and a monthly investor room |
| Quarterly summit | Monthly GRID events – a new reason to visit every month |
| Generic expense defaults | Charleston-specific: flood, wind, jurisdiction, STR rules |

---

## What Paul needs to provide

Content only Paul can supply. Everything else can be built now.

- [ ] Hero photo (on a property or a GRID podcast still – real, no stock)
- [ ] 2–3 more photos (GRID room, on stage, at a property)
- [ ] Origin story: how you started, your first deal (5–10 sentences, voice memo is fine)
- [ ] 3 client stories: name, photo, how they found you, the property, the numbers, a quote (with permission)
- [ ] 3 short testimonials (name or initials + deal type)
- [ ] Final affiliated business disclosure wording (broker-approved)
- [ ] Source for the #1 in 2–4 unit sales claim
- [ ] Confirmed brokerage phone number
- [ ] Next GRID event date + RSVP link, podcast feed URL
- [ ] Tide-based expense ranges by area for the analyzer (insurance, turnover, repairs)
- [ ] Email platform for deal alerts (Kit?) and CRM for form leads

---

## Suggested build order

1. **Week 1:** All of Priority 0. Nav + empty `/investing`, `/buying`, `/selling`, `/about`, `/grid` pages. OG image. Social links.
2. **Week 2:** GRID strip + `/grid` page. Email signup blocks. Thank-you page. Form routing question.
3. **Weeks 3–4:** Deal analyzer (start 2–4 units, extend to 49).
4. **Week 5:** Success stories (as content comes in). FAQ pages. Areas index cleanup.
5. **Ongoing:** Fill "coming soon" areas, weekly deal email, add episodes and events as they happen.
