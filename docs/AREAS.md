# AREAS.md – Charleston tri-county area pages

One hub page per Charleston Trident MLS area. The neighborhood pages (the Charleston version of Dan's neighborhood guides) hang off these hubs and are covered in `docs/NEIGHBORHOODS.md`.

**Source of the area list:** pulled from the Charleston FlexMLS field `MLSAreaMajor` on 2026-10-06. The `mls_value` strings below are exact and must be used verbatim in any FlexMLS query. Area 72 was confirmed later from Paul's closed listings (see its entry). Areas 27 and 28 (Colleton County Edisto) and 81 (Out of Area) are outside the tri-county and are excluded.

**How areas and neighborhoods fit together:**
1. **Area pages** (33) at `/charleston/[slug]` – one per MLS area. These are hub pages: area-wide numbers, plus a list of every neighborhood in the area.
2. **Neighborhood pages** at `/charleston/[area-slug]/[neighborhood-slug]` – one per MLS **Subdivision** where Paul has a closed listing, about 75 to start. The list, merges, and page rules are in `docs/NEIGHBORHOODS.md` and `data/seed-neighborhoods.csv`.

The neighborhood names listed under each area below are **context for the writer only**. The pages that actually get built come from `data/neighborhoods.json`, seeded from Paul's closed listings.

**Everything in the "Paul's angle" drafts is a starting draft for Paul to edit.** Never publish a number that did not come from the data pipeline.

---

## Area page template

Every area page follows this structure. Write each one fresh – no shared paragraphs between pages.

1. **Breadcrumb:** Charleston › [County] › [Area name]
2. **H1:** [Area name] – investment property guide
3. **Lead line (data-driven):** "Small multifamily in [area] sold for about $[median] in the last 12 months ([n] sales)." If fewer than 5 multifamily sales, lead with single-family median and rent instead and say plainly that small multifamily rarely trades here.
4. **Three short cards:**
   - *The buildings* – what the investment stock actually is (duplexes, fourplexes, cottages with a dependency, small apartment buildings, condos).
   - *What drives rent* – employers, hospitals, colleges, bases, port, commute times. Never describe residents.
   - *The numbers* – one sentence on how price, rent, and trend fit together.
5. **Paul's take:** 2–4 paragraphs, first person, plain talk. Who this area works for as an investment and why. What Paul would check before buying here.
6. **Data blocks** (from `data/areas.json`, each with "Data as of [Month YYYY]" and source line):
   - Median sale price of 2–4 unit buildings, sales count, middle-half range, price per door
   - Median single-family price (for context and house-hack comparison)
   - Typical rent by bedroom count (MLS lease comps first, RentCast ZIP data where MLS is thin – see NEIGHBORHOODS.md section 3)
   - Median days on market, months of inventory
   - 1-year and 5-year price change
7. **Watch-outs:** flood zone exposure, short-term rental rules, HOA rental restrictions, which tax district / municipality, anything else that changes underwriting. All [VERIFY].
8. **Neighborhoods in this area:** every neighborhood from `data/neighborhoods.json` for this area, linked to its page, sorted by number of Paul's closed listings. Areas with none omit this block.
9. **Nearby areas:** 2–4 links.
10. **CTA:** "Looking at a building in [area]? Send me the deal." + "Run the numbers" link to the deal analyzer pre-filled with this area.

**Meta description pattern:** "Small multifamily in [area] sold near $[x] in the last 12 months. Rents, price per door, and what to check before you buy, from a Charleston investor agent."

**Fair housing:** prices, rents, building stock, location, and property characteristics only. No demographics, safety, crime, schools, "family-friendly", "up and coming", or descriptions of who lives anywhere.

---

## Data pipeline for area pages

Claude Code fills `data/areas.json` from FlexMLS and RentCast. Paul needs to add the FlexMLS MCP server to Claude Code (`https://mcp.flexmls.com/mcp` – the same connection he uses in claude.ai) and put a RentCast API key in `.env` as `RENTCAST_API_KEY`.

For each area:
1. Call `SemanticSearchListingMetadata` first (required by the tool) to confirm field names and property type codes. In testing, multifamily resolved to property type `B` and residential to `A`, with area field `MLSAreaMajor`.
2. `MarketStatisticsPrice`, `MarketStatisticsDaysOnMarket`, `MarketStatisticsInventory` with `LocationField=MLSAreaMajor`, `LocationValue=[mls_value]`, once for `B` and once for `A`.
3. `ListingsListingSearch` for closed `B` listings in the last 12 months in the area, selecting price and unit count, to compute price per door and the middle-half range.
4. Rents: MLS lease comps (property type `D`, status `Rented`, last 12 months; close price = monthly rent) by bedroom count for the area. Where a bedroom count has fewer than 3 leases, use RentCast market statistics for the area's ZIP codes (`/v1/markets?zipCode=`). Record which source was used. Tide data is not used.
5. Write `as_of`, `source`, and `sample_size` for every number. If a sample is under 5, set the field to null and let the template show the "rarely trades" version.

Refresh monthly. Do not hand-edit numbers on pages.

---

## Build priority

- **Tier A – core small multifamily markets (build first):** 51, 52, 31, 11, 21, 32, 61, 62, 71, 12, 42, 73, 23
- **Tier B – some multifamily, growing:** 74, 41, 63, 22, 78, 77, 13
- **Tier C – resort, condo/STR, or rural (shorter pages):** 43, 44, 45, 46, 47, 24, 25, 26, 30, 64, 75, 76, 72

---

## Charleston County

### Area 51 – Downtown Charleston (Peninsula inside the Crosstown)
- **mls_value:** `51 - Peninsula Charleston Inside of Crosstown`
- **slug:** `downtown-charleston`
- **Tier:** A
- **Example neighborhoods (seed only):** South of Broad, Charlestowne / French Quarter, Ansonborough, Harleston Village, Radcliffeborough, Cannonborough-Elliotborough, Mazyck-Wraggborough, Eastside (southern portion)
- **Paul's angle (draft):** The oldest and most expensive small multifamily in the region. The classic investment here is a Charleston single house split into units, or a main house with a rented dependency behind it. Buildings rarely hit the market, prices per door are the highest in the tri-county, and returns lean on appreciation and premium rents from medical, college, and hospitality workers within walking distance. Underwriting has to account for age: foundations, termites, wiring, and Board of Architectural Review approval for exterior work.
- **Watch-outs [VERIFY]:** City of Charleston short-term rental rules on the peninsula; BAR review; flood zones on the low-lying edges; insurance on older frame buildings.

### Area 52 – Upper Peninsula (outside the Crosstown)
- **mls_value:** `52 - Peninsula Charleston Outside of Crosstown`
- **slug:** `upper-peninsula`
- **Tier:** A
- **Example neighborhoods (seed only):** Wagener Terrace, Westside, North Central, Eastside (all confirmed as MLS subdivision values), Hampton Park Terrace, Silver Hill / Magnolia, Rosemont, the Neck
- **Paul's angle (draft):** Where most peninsula duplex and small multifamily activity happens. Mill-village cottages, early-1900s frame houses, and purpose-built duplexes sit on small lots, with a lot of new infill and redevelopment around the Upper King and Morrison corridors. Entry prices per door are lower than below the Crosstown, but the spread between a renovated and unrenovated building is wide, so the condition of the systems drives the deal.
- **Watch-outs [VERIFY]:** Flood exposure in low-lying blocks near the marsh; STR rules; zoning for adding units.

### Area 11 – West Ashley inside I-526
- **mls_value:** `11 - West of the Ashley Inside I-526`
- **slug:** `west-ashley-inside-526`
- **Tier:** A
- **Example neighborhoods (seed only):** Avondale, Byrnes Downs, Windermere, Moreland, Wespanee, Maryville-Ashleyville, Northbridge, Sylvan Shores, Orleans Woods, Westwood
- **Paul's angle (draft):** Ten minutes from downtown with mid-century brick ranches, scattered duplexes, and small apartment buildings along the Savannah Highway and Sam Rittenberg corridors. A good fit for buyers priced out of the peninsula who still want short commutes for tenants. Flood maps matter block by block here.
- **Watch-outs [VERIFY]:** Flood zones near Church Creek and the Ashley; older sewer laterals; HOA rules in some subdivisions.

### Area 12 – West Ashley outside I-526
- **mls_value:** `12 - West of the Ashley Outside I-526`
- **slug:** `west-ashley-outside-526`
- **Tier:** A
- **Example neighborhoods (seed only):** Shadowmoss, Hunt Club, Grand Oaks, Carolina Bay, Village Green, the Bees Ferry corridor
- **Paul's angle (draft):** Newer subdivisions, townhomes, and some 1980s–2000s duplex stock. Strong rental demand from people working in West Ashley and downtown who want more space. Mostly single-family and townhome rentals – check HOA leasing restrictions before anything else.
- **Watch-outs [VERIFY]:** HOA rental caps and minimum lease terms; Church Creek basin flooding.

### Area 13 – West of the Ashley beyond Rantowles Creek
- **mls_value:** `13 - West of the Ashley beyond Rantowles Creek`
- **slug:** `rantowles-hollywood-ravenel`
- **Tier:** B
- **Example neighborhoods / towns (seed only):** Rantowles, Hollywood, Ravenel, Meggett, Yonges Island, Adams Run
- **Paul's angle (draft):** Rural and semi-rural, with larger lots and limited multifamily. Investors here are usually buying single-family rentals, land with an extra dwelling, or positioning ahead of growth along Highway 17 South.
- **Watch-outs [VERIFY]:** Well and septic; manufactured housing rules; town-by-town zoning.

### Area 21 – James Island
- **mls_value:** `21 - James Island`
- **slug:** `james-island`
- **Tier:** A
- **Example neighborhoods (seed only):** Riverland Terrace, Lawton Bluff, Stiles Point, Clearview, Lighthouse Point, the Folly Road corridor
- **Paul's angle (draft):** Close to downtown and the beach, with a mix of 1950s–70s ranches, duplexes, and small apartment buildings along Folly Road and Camp Road. Tight inventory and strong long-term rental demand. Jurisdiction is split between the Town of James Island, the City of Charleston, and the county, so rules change by address.
- **Watch-outs [VERIFY]:** Which jurisdiction the address is in; flood zones near the marsh; STR rules by jurisdiction.

### Area 22 – Folly Beach
- **mls_value:** `22 - Folly Beach to Battery Island`
- **slug:** `folly-beach`
- **Tier:** B
- **Example neighborhoods (seed only):** East end, west end, center/Center Street area, Folly Road approach
- **Paul's angle (draft):** Beach cottages, duplexes, and condos where the investment case is usually short-term rental income. The math depends almost entirely on STR permit availability and insurance, so those get checked before price.
- **Watch-outs [VERIFY]:** City of Folly Beach STR permit rules; VE flood zones and elevation certificates; wind and flood insurance costs.

### Area 23 – Johns Island
- **mls_value:** `23 - Johns Island`
- **slug:** `johns-island`
- **Tier:** A
- **Example neighborhoods (seed only):** Maybank Highway corridor, River Road, Bohicket Road, Kiawah River area
- **Paul's angle (draft):** One of the fastest-growing parts of the region, mostly new single-family and townhome construction with a small amount of older rental stock. Investors here are buying growth and newer, lower-maintenance buildings rather than classic small multifamily.
- **Watch-outs [VERIFY]:** Traffic and road projects; flood zones; well/septic on older rural parcels; HOA leasing rules in new communities.

### Area 24 – Wadmalaw Island
- **mls_value:** `24 - Wadmalaw Island`
- **slug:** `wadmalaw-island`
- **Tier:** C
- **Paul's angle (draft):** Rural, low-density, and protected by zoning. Very little rental stock. A short page that points investors to Johns Island and James Island for income property.
- **Watch-outs [VERIFY]:** Rural zoning density limits; well and septic.

### Area 25 – Kiawah Island
- **mls_value:** `25 - Kiawah`
- **slug:** `kiawah-island`
- **Tier:** C
- **Paul's angle (draft):** A gated resort market. Investment property here means villas and homes in the rental program, not small multifamily. Returns depend on rental program terms and resort demand.
- **Watch-outs [VERIFY]:** Resort rental program rules and fees; POA rules; flood and wind insurance.

### Area 26 – Edisto Island (Charleston County)
- **mls_value:** `26 - Edisto Island`
- **slug:** `edisto-island`
- **Tier:** C
- **Paul's angle (draft):** Rural island with vacation rentals concentrated near Edisto Beach (which sits in Colleton County and a separate MLS area). Keep this page short and honest about limited income-property inventory.
- **Watch-outs [VERIFY]:** Flood zones; septic; county line between Charleston and Colleton.

### Area 30 – Seabrook Island
- **mls_value:** `30 - Seabrook`
- **slug:** `seabrook-island`
- **Tier:** C
- **Paul's angle (draft):** Gated club community. Villas are the investment product, often in rental programs. Short page.
- **Watch-outs [VERIFY]:** Club and POA rental rules; insurance.

### Area 31 – North Charleston inside I-526
- **mls_value:** `31 - North Charleston Inside I-526`
- **slug:** `north-charleston-inside-526`
- **Tier:** A
- **Example neighborhoods (seed only):** Park Circle, Waylyn, Dorchester Terrace, Accabee (confirmed as MLS subdivision values), Liberty Hill, Chicora-Cherokee, Union Heights, Five Mile, Charleston Heights, Ferndale, Oak Terrace Preserve, Mixson
- **Paul's angle (draft):** The highest concentration of affordable small multifamily in the region: duplexes, fourplexes, and older small apartment buildings close to the port, Boeing, the Navy Base redevelopment, and I-26. Lower price per door than the peninsula with higher cap rates, but condition and management intensity vary a lot from block to block. This is where real operating numbers matter most.
- **Watch-outs [VERIFY]:** Condition of older buildings (wiring, plumbing, roofs); North Charleston rental registration or inspection rules if any; flood zones near the Ashley and Filbin Creek.

### Area 32 – North Charleston outside I-526 (Charleston County)
- **mls_value:** `32 - N.Charleston, Summerville, Ladson, Outside I-526`
- **slug:** `north-charleston-outside-526`
- **Tier:** A
- **Example neighborhoods (seed only):** Pepperhill, the Ashley Phosphate corridor, Northwoods area, Dorchester Road corridor (Charleston County side), Ladson (Charleston County side)
- **Paul's angle (draft):** 1970s–2000s subdivisions with duplexes, townhomes, and single-family rentals near major employers and the airport. Solid workforce rental demand and lower entry prices than inside 526. Many deals here are single-family rentals and duplex pairs rather than larger buildings.
- **Watch-outs [VERIFY]:** HOA leasing rules; flood zones near creeks; city vs. county jurisdiction.

### Area 41 – Mount Pleasant north of the IOP Connector
- **mls_value:** `41 - Mt Pleasant N of IOP Connector`
- **slug:** `mount-pleasant-north`
- **Tier:** B
- **Example neighborhoods (seed only):** Park West, Dunes West, Carolina Park, Rivertowne, Brickyard, Charleston National
- **Paul's angle (draft):** Mostly newer master-planned communities. Strong rents and low maintenance, but almost no small multifamily and many HOAs restrict leasing. Investors here buy single-family and townhomes for appreciation and quality tenants.
- **Watch-outs [VERIFY]:** HOA leasing restrictions; Town of Mount Pleasant STR rules.

### Area 42 – Mount Pleasant south of the IOP Connector
- **mls_value:** `42 - Mt Pleasant S of IOP Connector`
- **slug:** `mount-pleasant-south`
- **Tier:** A
- **Example neighborhoods (seed only):** Old Village, Shem Creek / Coleman Boulevard, Hobcaw, Snee Farm, Belle Hall, I'On, Long Point corridor
- **Paul's angle (draft):** Older Mount Pleasant with scattered duplexes, cottages, and a few small apartment buildings near Coleman Boulevard and the Old Village, plus newer neighborhoods further out. Small multifamily is scarce and priced high, and the Town has tightened rules on new multifamily, which supports values of what already exists.
- **Watch-outs [VERIFY]:** Town of Mount Pleasant STR and building rules; flood zones near Shem Creek and the harbor; HOA rules.

### Area 43 – Sullivan's Island
- **mls_value:** `43 - Sullivan's Island`
- **slug:** `sullivans-island`
- **Tier:** C
- **Paul's angle (draft):** Single-family beach market with very limited rental options. Short page.
- **Watch-outs [VERIFY]:** Town STR rules; VE flood zones.

### Area 44 – Isle of Palms
- **mls_value:** `44 - Isle of Palms`
- **slug:** `isle-of-palms`
- **Tier:** C
- **Paul's angle (draft):** Beach houses and condos bought mostly for short-term rental income. STR rules and insurance drive the numbers.
- **Watch-outs [VERIFY]:** City of Isle of Palms STR rules; flood and wind insurance.

### Area 45 – Wild Dunes
- **mls_value:** `45 - Wild Dunes`
- **slug:** `wild-dunes`
- **Tier:** C
- **Paul's angle (draft):** Gated resort community. Villas and condos in rental programs. Short page.
- **Watch-outs [VERIFY]:** Resort rental program terms and fees; insurance.

### Area 46 – Dewees Island
- **mls_value:** `46 - Dewees Island`
- **slug:** `dewees-island`
- **Tier:** C
- **Paul's angle (draft):** Ferry-access private island. Not an income-property market. Keep the page very short and point to nearby areas.

### Area 47 – Awendaw / McClellanville
- **mls_value:** `47 - Awendaw/McClellanville`
- **slug:** `awendaw-mcclellanville`
- **Tier:** C
- **Paul's angle (draft):** Rural, along Highway 17 North. Mostly land and single-family. Short page.
- **Watch-outs [VERIFY]:** Well, septic, and flood zones.

---

## Dorchester County

### Area 61 – North Charleston / Summerville / Ladson (Dorchester County)
- **mls_value:** `61 - N. Chas/Summerville/Ladson-Dor`
- **slug:** `north-charleston-dorchester-county`
- **Tier:** A
- **Example neighborhoods (seed only):** Wescott, Coosaw Creek, Archdale, Indigo Palms, the Dorchester Road corridor (Dorchester County side)
- **Paul's angle (draft):** Suburban rental demand driven by Boeing, the airport, and the I-26 corridor. Mostly single-family and townhome rentals, with some duplexes. Dorchester County tax rates and HOA rules shape the numbers.
- **Watch-outs [VERIFY]:** HOA leasing restrictions; city vs. county jurisdiction; Dorchester County millage.

### Area 62 – Summerville / Ladson / Ravenel to Highway 165
- **mls_value:** `62 - Summerville/Ladson/Ravenel to Hwy 165`
- **slug:** `summerville`
- **Tier:** A
- **Example neighborhoods (seed only):** Historic Summerville, the Main Street / Hutchinson Square area, Ashborough, Knightsville, the Highway 61 and 165 corridors
- **Paul's angle (draft):** The Town of Summerville has older cottages and duplexes near the historic district plus a lot of newer suburban stock. Entry prices per door are well below Charleston's, and rental demand is steady from people working across the region. Good fit for a first duplex or a buy-and-hold single-family.
- **Watch-outs [VERIFY]:** Town zoning for adding units; flood zones near Sawmill Branch; HOA rules.

### Area 63 – Summerville north / Ridgeville
- **mls_value:** `63 - Summerville/Ridgeville`
- **slug:** `summerville-north-ridgeville`
- **Tier:** B
- **Example neighborhoods / towns (seed only):** Northern Summerville, Ridgeville, Givhans
- **Paul's angle (draft):** Growth corridor toward I-26 and the Ridgeville industrial base. Mostly new single-family. Investors here buy new construction for low maintenance and rent growth.
- **Watch-outs [VERIFY]:** HOA leasing rules; well and septic on rural parcels.

### Area 64 – St. George / Harleyville / Reevesville
- **mls_value:** `64 - St. George, Harleyville, Reevesville, Dorchester`
- **slug:** `st-george-harleyville`
- **Tier:** C
- **Paul's angle (draft):** Small towns in upper Dorchester County. Low prices, thin rental market. Short page.

---

## Berkeley County

### Area 71 – Hanahan
- **mls_value:** `71 - Hanahan`
- **slug:** `hanahan`
- **Tier:** A
- **Example neighborhoods (seed only):** Hanahan city center, Tanner Plantation, Otranto area, Eagle Landing
- **Paul's angle (draft):** Small city between North Charleston and Goose Creek with easy access to the naval weapons station, the port, and I-26. Mostly single-family with some duplexes and townhomes. Strong rental demand tied to nearby employers.
- **Watch-outs [VERIFY]:** HOA rules; flood zones near Goose Creek reservoir.

### Area 72 – Goose Creek / Moncks Corner (Hwy 52, Oakley, Cooper River)
- **mls_value:** `72 - G.Cr/M. Cor. Hwy 52-Oakley-Cooper River`
- **slug:** `goose-creek-hwy-52-oakley`
- **Tier:** B
- **Example neighborhoods (seed only):** Tanner Plantation, Liberty Hall Plantation, Strawberry Station, Carlton Place (all confirmed MLS subdivision values from Paul's closings)
- **Paul's angle (draft):** The Berkeley County growth corridor along Highway 52 and toward the Cooper River, mostly newer subdivisions. Investment stock is largely single-family rentals and some townhomes, with rents supported by Joint Base Charleston and port-area jobs. Check HOA leasing rules and Berkeley County millage before running numbers.
- **Watch-outs [VERIFY]:** HOA leasing restrictions; city vs. county jurisdiction; flood zones near the Cooper River and its creeks.

### Area 73 – Goose Creek / Moncks Corner (Hwy 17A, Oakley, Hwy 52)
- **mls_value:** `73 - G. Cr./M. Cor. Hwy 17A-Oakley-Hwy 52`
- **slug:** `goose-creek-moncks-corner`
- **Tier:** A
- **Example neighborhoods (seed only):** Goose Creek city neighborhoods, Crowfield Plantation, the Highway 52 and 17A corridors
- **Paul's angle (draft):** Workforce and military rental demand (Joint Base Charleston's naval weapons station is nearby) with lower prices than the core. Duplexes and single-family rentals make up most of the investment stock. Good cash flow, with the usual suburban HOA checks.
- **Watch-outs [VERIFY]:** HOA leasing restrictions; city vs. county jurisdiction.

### Area 74 – Summerville / Ladson (Berkeley County)
- **mls_value:** `74 - Summerville, Ladson, Berkeley Cty`
- **slug:** `summerville-berkeley-county`
- **Tier:** B
- **Example neighborhoods (seed only):** Nexton, Carnes Crossroads, Cane Bay, Sangaree
- **Paul's angle (draft):** Large master-planned communities with new construction. Some build-to-rent and townhome product. Investors buy here for newer buildings and population growth, but HOA leasing rules can be strict.
- **Watch-outs [VERIFY]:** HOA leasing restrictions; impact fees; Berkeley County millage.

### Area 75 – Cross / St. Stephen / Bonneau / rural Berkeley County
- **mls_value:** `75 - Cross, St.Stephen, Bonneau, Rural Berkeley Cty`
- **slug:** `rural-berkeley-county`
- **Tier:** C
- **Paul's angle (draft):** Rural Berkeley County and the Lake Moultrie area. Land, lake houses, and single-family. Short page.

### Area 76 – Moncks Corner above Oakley Road
- **mls_value:** `76 - Moncks Corner Above Oakley Rd`
- **slug:** `moncks-corner`
- **Tier:** C
- **Paul's angle (draft):** The county seat with older in-town houses, some duplexes, and new subdivisions. Lower prices and steady local rental demand. Short to medium page.

### Area 77 – Daniel Island
- **mls_value:** `77 - Daniel Island`
- **slug:** `daniel-island`
- **Tier:** B
- **Paul's angle (draft):** Planned community with condos, townhomes, and single-family. Investors buy condos and townhomes for strong rents and low maintenance. No classic small multifamily.
- **Watch-outs [VERIFY]:** HOA and POA leasing rules; City of Charleston STR rules.

### Area 78 – Wando / Cainhoy
- **mls_value:** `78 - Wando/Cainhoy`
- **slug:** `cainhoy-wando`
- **Tier:** B
- **Example neighborhoods (seed only):** Cainhoy, Wando, the Clements Ferry Road corridor, Point Hope
- **Paul's angle (draft):** Fast-growing corridor between Daniel Island and Mount Pleasant with new apartments, townhomes, and single-family. Investors are buying growth and newer product.
- **Watch-outs [VERIFY]:** City vs. county jurisdiction; HOA leasing rules; road capacity.

---

## Neighborhood pages

See `docs/NEIGHBORHOODS.md` for how the neighborhood list is generated, which neighborhoods get pages, the data on each page, and the page template.
