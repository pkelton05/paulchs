# NEIGHBORHOODS.md – one page per neighborhood in Paul's closed sales

**The neighborhood list comes from Paul's own closed listings in the MLS, not from every subdivision in the tri-county.** "Neighborhood" means the MLS **Subdivision** field (`SubdivisionName`). Every neighborhood where Paul has closed a listing gets its own page. That is a real, defensible reason for each page to exist, and it lets "Paul's take" be grounded in actual experience.

The 33 MLS areas in `docs/AREAS.md` stay as the hub pages each neighborhood sits under.

---

## 1. The seed list (snapshot 2026-10-06)

Pulled from FlexMLS `ListingsMyListings` with `MlsStatus Eq 'Closed'`: **121 closed listings, July 2020 to September 2026.** Saved as `data/seed-neighborhoods.csv`.

- **4 listings outside the tri-county** (Orangeburg x2, Colleton, Out of Area) – excluded.
- **14 tri-county listings with no usable neighborhood name** ("None", "City of Charleston", "Downtown", "North Charleston") – not a page. They still count toward their MLS area's numbers.
- **103 listings in named neighborhoods = 75 distinct (MLS area, subdivision) pairs.** After the merges in section 2, about 72 pages.

| MLS area | Neighborhoods (closed listings) |
|---|---|
| 11 West of the Ashley inside I-526 | Concord West of The Ashley (1), Maryville (1), Orange Grove Estates (1), Parkwood Estates (1), West Glow (1) |
| 12 West of the Ashley outside I-526 | Asheford Place at Canterbury Place (1) and Canterbury Woods (1), Ashleytowne Village (1), Carolina Cove (2), Castlewood (1), Parsonage Point (1), Red Top (1), Shadowmoss (2), Springfield (1) |
| 21 James Island | Crosscreek (1), Lynwood Villas (1), Mira Vista (2), Oakcrest (1), Regatta On James Island (2) |
| 22 Folly Beach | Pavilion Watch (1) |
| 23 Johns Island | Kiawah River (1), Oakfield (1) |
| 31 North Charleston inside I-526 | Accabee (1), Admiral Apartments (1), Buckfield (3), Dorchester Terrace (2), Russelldale (1), Waylyn (1) |
| 32 North Charleston / Summerville / Ladson outside I-526 | Brookdale (1), Buckshire (2), Fetteressa (2), Pt Dowling Tract (2) |
| 41 Mt Pleasant north of IOP Connector | Crown Pointe (1), Dunes West (1), Hamlin Plantation (2), The Meridian (3) |
| 42 Mt Pleasant south of IOP Connector | Belle Hall (2), Marsh Grass Condominiums (2), Snee Farm (1) |
| 45 Wild Dunes | Beachwood (1), Wild Dunes Yacht Harbor (1) |
| 51 Downtown Charleston | Ansonborough (1), Cannonborough (2), Cannonborough-Elliotborough (2), Eastside (1), Wraggborough (1) |
| 52 Upper Peninsula | Garden Hill (1), North Central (3), Wagener Terrace (3), Westside (3) |
| 61 North Charleston / Summerville / Ladson (Dorchester) | Appian Landing (1), Appian Landing III (1), Pepperidge (1), Stratton Capers (1), Woodington (1) |
| 62 Summerville / Ladson / Ravenel | Bridges of Summerville (1), Millbrook (2), Shady Oaks (1) |
| 63 Summerville / Ridgeville | Rose Hill (1), Summers Corner (1), White Gables (2) |
| 71 Hanahan | Belvedere Estates (1), Bowen (4), Otranto (1), Tanner Plantation (1) |
| 72 Goose Creek / Moncks Corner (Hwy 52, Oakley, Cooper River) | Carlton Place (1), Liberty Hall Plantation (1), Strawberry Station (1), Tanner Plantation (1) |
| 73 Goose Creek / Moncks Corner (Hwy 17A, Oakley, Hwy 52) | Berkeley Commons Townhomes (1), Persimmon Hill Townhouses (1) |
| 74 Summerville / Ladson (Berkeley) | Briddleford Ridge (1), College Park (1) |
| 77 Daniel Island | Center Park (1), Daniel Island (1) |

MLS areas with no neighborhood from Paul's closings (13, 24, 25, 26, 30, 43, 44, 46, 47, 64, 75, 76, 78) still get an area hub page from `AREAS.md`, with no neighborhood list.

**Area 72 is confirmed.** Its exact MLS value is `72 - G.Cr/M. Cor. Hwy 52-Oakley-Cooper River`. It had been missing from the earlier area lookup.

---

## 2. Merges and flags for Paul to approve

Do not apply any of these automatically. Record them in `data/neighborhood-aliases.json` with `"status": "proposed"` until Paul marks them approved.

- **Asheford Place at Canterbury Place / Asheford Place at Canterbury Woods** – almost certainly one neighborhood spelled two ways. Propose merging.
- **Appian Landing / Appian Landing III** – a phase of the same community. Propose merging into Appian Landing.
- **Cannonborough / Cannonborough-Elliotborough** – both are MLS values on the peninsula, and one is a combined neighborhood name. Propose merging, but Paul decides which name is the page.
- **Tanner Plantation appears in both Area 71 and Area 72.** Treat as two pages by default (same name in different MLS areas = different records), but check whether it is really one community split by an area line. If so, one page under the area with most of its sales.

---

## 3. What this list leaves out

**Listing-side only.** `ListingsMyListings` returns listings where Paul was the listing agent. Buyer-side closings, which are likely a large share of his 200+ investor deals, are not in it. If Paul wants those neighborhoods too, he exports closed sales where he was the buyer's agent from Flexmls (Closed status, tri-county, all dates) and saves it to `data/raw/buyer-side-closed.csv`. The indexer then adds any new neighborhoods to the seed list. This is optional and can wait until after the first batch of pages is live.

**Neighborhoods where Paul hasn't closed a deal.** They don't get pages for now. Later, the same pipeline can be pointed at the full MLS subdivision list, with page tiers based on market sample size, if Paul wants more search coverage.

---

## 4. Which neighborhoods get which kind of page

Every seed neighborhood gets a page. How much data it has depends on the **market-wide** sample for that subdivision in the MLS (not just Paul's sales, which are only 1–4 per neighborhood):

| Page type | Rule (last 24 months, whole MLS) | Data shown |
|---|---|---|
| **Full** | 15+ residential sales, OR 3+ multifamily sales, OR 10+ leases | Neighborhood-level sales and rent numbers |
| **Short** | Anything below that | Neighborhood numbers only where the sample supports them; otherwise the MLS area's numbers, clearly labeled as area-level |

Roll out by MLS area, Tier A areas first (see `AREAS.md`), and review each batch before the next goes live.

---

## 5. Data on each page

All numbers come from `data/neighborhoods.json` and `data/areas.json`. Every block shows "Data as of [Month YYYY]", the source, and the sample size.

**Sales (whole MLS, not just Paul's):** use the FlexMLS market statistics tools with `LocationField` = `SubdivisionName` and `LocationValue` = the exact MLS subdivision string, once for residential (`A`) and once for multifamily (`B`). Call `SemanticSearchListingMetadata` first, as the tools require. Report median sale price and middle-half range, price per door for multifamily, median days on market, and 1-year change where the sample allows.

**Rents:**
1. **MLS lease comps** – property type `D`, status `Rented`, last 12–24 months, filtered to the subdivision. The close price is the monthly rent. Median rent by bedroom count with sample size. Minimum 3 leases per bedroom count.
2. **RentCast** – where MLS leases are too thin, `GET https://api.rentcast.io/v1/markets?zipCode=…` for the neighborhood's ZIP (API key in the `X-Api-Key` header, from `RENTCAST_API_KEY`). Label as ZIP-level. Cache responses for 30 days in `data/cache/rentcast/`.
3. If neither has enough data, use the MLS area's rent numbers, labeled as area-level.

Never blend sources in one number. Tide data is not used anywhere on the site.

**Paul's closings (counts only):** number of listings Paul closed in the neighborhood since 2020, and the property types (single-family, multifamily, land). Never show addresses or prices of Paul's sales unless MLS display rules and the client allow it (section 8).

**Property mix:** share of sales that were single-family, townhome, condo, and multifamily; typical year built.

---

## 6. Neighborhood page template

URL: `/charleston/[area-slug]/[neighborhood-slug]`

1. Breadcrumb: Charleston › [County] › [MLS area] › [Neighborhood]
2. H1: [Neighborhood] – [City], SC
3. Lead line (data): "Homes in [Neighborhood] sold for a median of $X over the last 12 months (n sales). A 2-bedroom typically leases for $Y." Use the strongest available numbers and skip nulls.
4. **Snapshot block** with the numbers from section 5.
5. **"I've closed N listings here"** line, if Paul's count is 2 or more; for 1, say "I've closed a listing here" in plain language. [VERIFY wording with Paul – these are listings closed under his MLS account.]
6. **Paul's take:** 2 short paragraphs on full pages, 1 on short pages. Must say something specific to this neighborhood, based on the data, the property mix, and any note Paul left in `data/paul-notes.json`. If nothing specific can be said, write one plain paragraph rather than padding.
7. **Watch-outs:** HOA rental restrictions (if the MLS shows an HOA), flood exposure, municipality, short-term rental rules – all [VERIFY].
8. **Nearby neighborhoods:** 3–5 in the same MLS area from the seed list, then link to the area hub.
9. **CTA:** "Looking at a property in [Neighborhood]? Send me the deal." + deal analyzer link pre-filled with the area.

Meta description: "[Neighborhood] in [City], SC: median sale price, rent by bedroom, and what investors should check. From a Charleston investor agent."

**Fair housing:** prices, rents, buildings, location, and property characteristics only. Never describe residents, safety, crime, schools, or use "family-friendly", "up and coming", "safe", or "good schools". Do not use the MLS school fields.

---

## 7. Keeping the list current

Monthly, the `neighborhood-indexer` agent re-runs `ListingsMyListings` for Closed listings since the last run, adds any new neighborhoods to `data/neighborhoods.json` (flagging them as new for Paul), updates Paul's closing counts and the market data, and recomputes page types. A new closing in a new neighborhood becomes a new page in the next batch.

---

## 8. MLS data display rules [VERIFY before launch]

Before any MLS-derived number goes live, Paul confirms with CTAR / the Charleston Trident MLS:
- Whether **aggregated statistics** (medians, counts, ranges) from closed sales and leases can be published on an agent website, and the required attribution line (for example "Source: Charleston Trident MLS, [date]. Information deemed reliable but not guaranteed.")
- Whether **individual sold or leased listings** (address and price) can be displayed, and under what rules. Default: **do not display them**.
- Any disclaimer or refresh-frequency requirements.

Also confirm with Paul before showing his closing counts that he is comfortable showing his sales history, and that nothing in it involves a client who expects confidentiality. Add the confirmed attribution text to `data/site.json` so every data block uses the same line.
