# Matchwork Roofing — source audit (site-src/docs/), baseline bf614bc
Date: 2026-09-10. Scope: 16 HTML files under `/Users/jpmackbookpro/Projects/matchworkroofing/site-src/docs/` + sitemap.xml/robots.txt. Read-only audit. The sibling `/docs/` build was NOT audited (ciphertext).

## VERDICT TABLE
| # | Item | Result |
|---|---|---|
| 1 | Fake / non-canonical phone numbers | **FAIL** (11 lines: `(614) 000-0000` placeholders). No 555 numbers. |
| 2 | Owner personal name / non-canonical email | **FAIL** (`claims@matchworkroofing.com` x4). Personal name: CLEAN. |
| 3 | `certif*` | **FAIL** (9 lines) |
| 4 | Manufacturer certification / brand claims | **FAIL** (33 lines; CertainTeed, Owens Corning, "Master CertainTeed", "Certified ITEL Laboratory Partner") |
| 5 | Financing copy | **FAIL** (14 lines; 0% APR, 120-month payments) |
| 6 | Fabricated reviews / aggregateRating / Review JSON-LD | **PASS — clean** (0 hits across 12 JSON-LD blocks) |
| 7 | Other invented specific claims | **FAIL** (8 fabricated project case studies + warranty/superlative claims) |
| 8 | Broken internal links | **PASS — clean** (0 broken) |
| 9 | sitemap.xml both directions | **PASS — clean** (16/16 both ways) |
| 10 | service-areas + referral in nav AND footer on all pages | **FAIL** (12 of 16 pages deficient) |
| 11 | HTML well-formedness | **PASS — clean** (16/16 parse, no unclosed structural tags) |

---

## AUDIT A DETAIL

### 1. Phone numbers — FAIL
Distinct phone strings found across the source:
- `(614) 741-1393` — 38 occurrences (canonical, correct)
- `+16147411393` — 27 occurrences, all in `tel:` hrefs (canonical)
- `+1-614-741-1393` — 10 occurrences (canonical, JSON-LD)
- `(614) 000-0000` — **11 occurrences, NON-CANONICAL**

No `555` anywhere in any format (grep `555` over all .html/.xml/.txt/.md returned zero).

The 11 offending lines are all `<input type="tel" placeholder="(614) 000-0000">`. They are form placeholders (asking the visitor for THEIR number), not the business number — but they are a fake phone string in shipped plaintext and are reported here per the ban:

```
index.html:180
referral.html:166
referral.html:186
locations/dublin-oh.html:134
locations/new-albany-oh.html:133
locations/powell-oh.html:133
locations/upper-arlington-oh.html:133
locations/westerville-oh.html:133
services/roof-replacement-columbus.html:173
services/shingle-matching-test.html:157
services/storm-damage-insurance-claims.html:165
```

### 2. Owner name / email — FAIL (email), CLEAN (name)
No occurrence of `jordan`, `peplinski`, `owner`, `founder`, or "ask for <person>" as contact copy. (`referral.html:95` contains an HTML comment `<!-- OWNER DECISION: reward amount and trigger — placeholder default below, confirm before this goes public -->`; that is a build note shipped in plaintext, not a contact name, but it IS visible in page source and flags an unresolved decision.)

Non-canonical email addresses present (4 real + 1 form placeholder):
```
services/shingle-matching-test.html:79            <span>claims@matchworkroofing.com</span>
services/shingle-matching-test.html:267           <p>✉️ claims@matchworkroofing.com</p>
services/storm-damage-insurance-claims.html:87    <span>claims@matchworkroofing.com</span>
services/storm-damage-insurance-claims.html:325   <p>✉️ claims@matchworkroofing.com</p>
referral.html:162                                 placeholder="you@example.com"   (form placeholder)
```
`claims@matchworkroofing.com` was NOT covered by commit 8b43913 (which only fixed `jordan@` -> `info@`). If that mailbox does not exist, these two pages publish a dead contact.

### 3. `certif*` — FAIL (9 lines)
```
services/roof-replacement-columbus.html:7    <meta name="description" content="... Certified CertainTeed & Owens Corning systems, transparent pricing, 50-year warranties, and flexible financing in Columbus, OH.">
services/roof-replacement-columbus.html:228  ... Heavier grade Max Def color granules with 130 mph wind certification. ...
services/shingle-matching-test.html:7        <meta name="description" content="... We pull sample shingles for certified ITEL laboratory analysis ...">
services/shingle-matching-test.html:35       "description": "Certified laboratory shingle identification and discontinuation reporting ..."
services/shingle-matching-test.html:76       <div><span>📍 Central Ohio Forensic Shingle Testing Center</span> | <span>🔬 Certified ITEL Laboratory Partner</span></div>
services/shingle-matching-test.html:129      ... send it for certified ITEL laboratory analysis ...
services/shingle-matching-test.html:144      ... and deliver certified lab results.
services/storm-damage-insurance-claims.html:137  ... uses Ohio Administrative Code 3901-1-54 and certified laboratory testing to mandate full roof replacement coverage.
services/storm-damage-insurance-claims.html:212  <strong>Starter Course Shingles:</strong> Required for wind resistance certification, often missing from initial adjuster scopes.
```
Most severe: `services/shingle-matching-test.html:76` — "Certified ITEL Laboratory Partner" is a direct third-party certification/partnership claim.

### 4. Manufacturer certification / preferred-contractor branding — FAIL (33 lines)
"Owens Corning" appears at `index.html:227`, `services/roof-replacement-columbus.html:7`, `services/roof-replacement-columbus.html:145`, `services/shingle-matching-test.html:230`, `blog/hail-damage-vs-blistering-ohio.html:92`.

Explicit certification/endorsement claims:
```
index.html:135   ... Master CertainTeed installations, designer slate profiles, 100% white-glove property care, and transferable 50-year non-prorated warranties.
index.html:227   Backed directly by CertainTeed and Owens Corning with transferable 50-year non-prorated material protection plus our 10-year Matchwork Workmanship Guarantee.
services/roof-replacement-columbus.html:7   ... Certified CertainTeed & Owens Corning systems ...
```
"Master CertainTeed" and "Backed directly by CertainTeed and Owens Corning" are manufacturer-program claims of exactly the banned type. The remaining ~28 CertainTeed/Owens Corning/Atlas/GAF hits are product-line names (Landmark PRO, Grand Manor, Horizon, Atlas Chalet, GAF Timberline 30) across `portfolio-map.html` (9), `index.html` (3), `locations/*` (5), `blog/*` (3), `services/*` (5). Product naming is a weaker offense than certification claims but still ties the site to brands. Full list in appendix.

### 5. Financing — FAIL (14 lines)
```
index.html:114   <a href="#pricing" ...>Financing</a>
index.html:151   <span class="text-amber-400 font-bold text-base block">0% APR</span>
index.html:152   Flexible Financing
index.html:299   <!-- Flexible Financing & Custom Proposals -->
index.html:303   <span ...>Bespoke Investment & Financing</span>
index.html:304   <h2 ...>Custom Architectural Proposals. Zero Guesswork. 0% APR Financing.</h2>
index.html:309   <div><strong ...>0% APR</strong> for 12 or 24 Months</div>
index.html:310   <div><strong ...>Up to 120 Mos</strong> Low Monthly Payment Plans</div>
services/roof-replacement-columbus.html:7    ... and flexible financing in Columbus, OH.
services/roof-replacement-columbus.html:62   "text": "... Matchwork provides detailed, itemized fixed-price proposals with 0% APR financing options."   (JSON-LD FAQPage answer)
services/roof-replacement-columbus.html:300  ... itemized, fixed-price proposal with physical sample boards and 0% financing options.
services/roof-replacement-columbus.html:307  <h3 ...>Do you offer roof financing?</h3>
services/roof-replacement-columbus.html:308  Yes. We provide 0% interest promotional financing for 12 or 24 months and low-monthly-payment options up to 120 months through top home improvement lenders.
```
No Hearth/GreenSky named. `services/storm-damage-insurance-claims.html:275` matched the grep only on the word "financial" in a legally-correct ORC 3999.22 deductible-compliance paragraph — not a financing offer, not a violation.

### 6. Fabricated reviews / ratings — PASS, clean
Zero hits for `aggregateRating`, `"Review"`, `reviewBody`, `ratingValue`, `reviewCount`, `testimonial`, `★`, `5-star`, `five star`, `google review` across all 16 pages. The 12 `application/ld+json` blocks in the source contain RoofingContractor / LocalBusiness / Service / FAQPage / BlogPosting / BreadcrumbList types only — no Review or AggregateRating objects. Clean.

### 7. Other invented specific claims — FAIL
No license numbers, no BBB, no "insured for $X", no awards, no years-in-business, no employee/crew counts, no "since 19xx", no Angi/HomeAdvisor badges. Those specific categories are clean.

What IS invented:
- **`portfolio-map.html:94–186` — 8 fully fabricated project case studies**, each with a specific neighborhood, precise lat/lng, material, color, and work narrative. Examples: id 1 "Muirfield Village, Dublin OH" lat 40.1345 lng -83.1532, details "...Muirfield ARB approved."; id 2 "Old Arlington, Upper Arlington OH"; id 7 "Bexley Historic District". These are presented as a portfolio of completed jobs. If these jobs were not performed, the entire page is fabricated evidence of a track record — the single largest integrity exposure on the site.
- Unsubstantiated superlatives/guarantees, e.g. `locations/westerville-oh.html:7` "Top-rated Westerville, OH roofing contractor" (an implied rating claim with no basis); repeated "Central Ohio's premier ... contractor" (index.html:7, services/roof-replacement-columbus.html:7, locations/upper-arlington-oh.html:7, locations/dublin-oh.html:7); "transferable 50-year non-prorated warranties" and "our 10-year Matchwork Workmanship Guarantee" (index.html:135, :227, plus locations/dublin-oh.html:106, services/roof-replacement-columbus.html:145); "100% white-glove property care", "1-day professional tear-off", "100% magnetic nail cleanup"; "high-precision aerial drone takeoff" (services/roof-replacement-columbus.html:300) implying owned drone capability; portfolio-map id 5 "70-year architectural lifespan".

---

## AUDIT B DETAIL

### 8. Internal links — PASS, clean
Every `href`/`src` across all 16 pages was extracted, external/`mailto:`/`tel:`/fragment/`data:` schemes excluded, and each remaining path resolved (root-relative against `site-src/docs/`, relative against the containing file, trailing `/` -> `index.html`). **Zero broken internal links.** `/blog/` correctly resolves to `blog/index.html`.

### 9. sitemap.xml — PASS, clean, both directions
16 `<loc>` entries, all resolving to an existing file:
`/` -> index.html; `/portfolio-map.html`; `/services/roof-replacement-columbus.html`; `/services/storm-damage-insurance-claims.html`; `/services/shingle-matching-test.html`; `/blog/` -> blog/index.html; `/blog/shingle-granule-loss-columbus.html`; `/blog/nail-pops-roof-leaks-powell-dublin.html`; `/blog/hail-damage-vs-blistering-ohio.html`; `/locations/dublin-oh.html`; `/locations/upper-arlington-oh.html`; `/locations/new-albany-oh.html`; `/locations/powell-oh.html`; `/locations/westerville-oh.html`; `/service-areas.html`; `/referral.html`.

- In sitemap but no file: **none**
- File on disk but not in sitemap: **none**

Both new pages (service-areas.html, referral.html) are correctly registered.

### 10. service-areas + referral in nav AND footer on every page — FAIL
Per-page result (nav = first `<nav>`/`<header>` region; footer = `<footer>` region):

| Page | service-areas nav | service-areas footer | referral nav | referral footer |
|---|---|---|---|---|
| index.html | Y | Y | **N** | Y |
| service-areas.html | Y | Y | Y | Y |
| referral.html | Y | Y | Y | Y |
| portfolio-map.html | Y | **N** | Y | **N** |
| services/roof-replacement-columbus.html | Y | Y | **N** | Y |
| services/shingle-matching-test.html | Y | Y | **N** | Y |
| services/storm-damage-insurance-claims.html | Y | Y | **N** | Y |
| locations/dublin-oh.html | Y | Y | Y | Y |
| locations/upper-arlington-oh.html | Y | Y | Y | Y |
| locations/new-albany-oh.html | Y | Y | Y | Y |
| locations/powell-oh.html | Y | Y | Y | Y |
| locations/westerville-oh.html | Y | Y | Y | Y |
| blog/index.html | Y | **N** | **N (absent from entire page)** | **N** |
| blog/hail-damage-vs-blistering-ohio.html | Y | **N** | Y | **N** |
| blog/nail-pops-roof-leaks-powell-dublin.html | Y | **N** | Y | **N** |
| blog/shingle-granule-loss-columbus.html | Y | **N** | Y | **N** |

Root causes:
- **The 4 blog pages and portfolio-map.html have link-free footers** — their `<footer>` blocks contain zero `<a href>` of any kind, so they are missing BOTH links. Footer start lines: `blog/index.html:154`, `blog/hail-damage-vs-blistering-ohio.html:111`, `blog/nail-pops-roof-leaks-powell-dublin.html:98`, `blog/shingle-granule-loss-columbus.html:154`, `portfolio-map.html:247`.
- **referral.html is missing from the nav** of index.html (nav at `index.html:109`), services/roof-replacement-columbus.html, services/shingle-matching-test.html (nav at `:94`), services/storm-damage-insurance-claims.html.
- **`blog/index.html` never links to referral.html at all** — nav at `blog/index.html:34` has no referral entry and the string `referral.html` does not appear anywhere in that file. It is the only page in the site with zero path to the referral page.

4 of 16 pages fully satisfy the requirement (service-areas.html, referral.html, and the 5 locations pages satisfy it — 7 pages; the 9 remaining are deficient). Precisely: **7 pages PASS, 9 pages FAIL.**

### 11. Well-formedness — PASS, clean
All 16 files parsed with `python3` `html.parser` under a tag-balance stack (void elements excluded). **No parse failures, no stray end tags, no tags left open at EOF, no mis-nesting detected in any file.** service-areas.html and referral.html both clean.

---

## NOT CHECKED / LIMITS
- The encrypted `/docs/` build was not opened or compared; whether these source strings survive into the shipped ciphertext is UNVERIFIED here.
- Whether `claims@matchworkroofing.com` is a live mailbox is UNVERIFIED (no mail access).
- Whether the 8 portfolio-map projects correspond to real completed jobs is UNVERIFIED — flagged on the grounds that the specificity (exact coordinates, HOA approvals) is unverifiable from the repo.
- Whether the 50-year/10-year warranty and "Master CertainTeed" claims are contractually backed is UNVERIFIED.
- CSS/JS-injected text (none found beyond portfolio-map's JS `projects` array, which WAS audited) — any server-side or runtime-fetched copy would not appear in this grep.

---

## RAW GREP APPENDIX

### certif*
services/roof-replacement-columbus.html:7:  <meta name="description" content="Central Ohio's premier residential roof replacement contractor. Certified CertainTeed & Owens Corning systems, transparent pricing, 50-year warranties, and flexible financing in Columbus, OH.">
services/roof-replacement-columbus.html:228:          <p class="text-slate-600 text-xs leading-relaxed my-4">Heavier grade Max Def color granules with 130 mph wind certification. Upgraded starter course and high-definition ridge cap protection.</p>
services/shingle-matching-test.html:7:  <meta name="description" content="Central Ohio's forensic shingle match testing experts. We pull sample shingles for certified ITEL laboratory analysis to prove discontinued shingles and secure 100% full roof replacements under OAC 3901-1-54.">
services/shingle-matching-test.html:35:        "description": "Certified laboratory shingle identification and discontinuation reporting for insurance claim matching disputes under Ohio Administrative Code 3901-1-54.",
services/shingle-matching-test.html:76:      <div><span>📍 Central Ohio Forensic Shingle Testing Center</span> | <span>🔬 Certified ITEL Laboratory Partner</span></div>
services/shingle-matching-test.html:129:          Don't allow your insurance carrier to force mismatched patch repairs on your home. We extract a sample shingle, send it for certified ITEL laboratory analysis, and prove product discontinuation under Ohio matching law OAC 3901-1-54.
services/shingle-matching-test.html:144:        <p class="text-slate-500 text-xs mb-5">We extract a sample, water-seal the test area, and deliver certified lab results.</p>
services/storm-damage-insurance-claims.html:137:          Insurance adjusters frequently write lowball estimates for single-slope or spot repairs. Matchwork Roofing uses Ohio Administrative Code 3901-1-54 and certified laboratory testing to mandate full roof replacement coverage.
services/storm-damage-insurance-claims.html:212:            <span><strong>Starter Course Shingles:</strong> Required for wind resistance certification, often missing from initial adjuster scopes.</span>

### manufacturer branding
portfolio-map.html:7:  <meta name="description" content="Explore recent Matchwork Roofing installations across Columbus, Dublin, Upper Arlington, New Albany, and Powell. Filter by CertainTeed shingle color, luxury slate, and metal systems.">
portfolio-map.html:97:        title: "CertainTeed Landmark PRO (Moire Black)",
portfolio-map.html:103:        details: "Full tear-off, 6-layer CertainTeed system, high-definition ridge caps, copper valley flashing, Muirfield ARB approved.",
portfolio-map.html:108:        title: "CertainTeed Grand Manor Luxury Slate Profile",
portfolio-map.html:125:        details: "CertainTeed Landmark PRO combined with matte black standing seam metal over low-slope front porch and dormers.",
portfolio-map.html:130:        title: "CertainTeed Landmark PRO (Weathered Wood)",
portfolio-map.html:152:        title: "CertainTeed Landmark PRO (Colonial Slate)",
portfolio-map.html:163:        title: "CertainTeed Grand Manor (Black Pearl)",
portfolio-map.html:174:        title: "CertainTeed Landmark PRO (Burnt Sienna)",
index.html:7:  <meta name="description" content="Central Ohio's premier residential roofing contractor. Architectural CertainTeed systems, designer slate profiles, white-glove property care, and forensic insurance restoration in Columbus, Dublin, Upper Arlington, & New Albany.">
index.html:135:          We engineer and install premier residential roofing systems tailored to Central Ohio's finest architectural homes. Master CertainTeed installations, designer slate profiles, 100% white-glove property care, and transferable 50-year non-prorated warranties.
index.html:227:        <p class="text-slate-600 text-xs leading-relaxed">Backed directly by CertainTeed and Owens Corning with transferable 50-year non-prorated material protection plus our 10-year Matchwork Workmanship Guarantee.</p>
index.html:246:            <h3 class="text-2xl font-black text-blue-950">CertainTeed Landmark PRO</h3>
index.html:266:            <h3 class="text-2xl font-black text-blue-950">CertainTeed Grand Manor</h3>
blog/hail-damage-vs-blistering-ohio.html:92:        If your damaged shingle is discontinued (e.g. older Owens Corning Oakridge or CertainTeed Horizon lines), the carrier cannot force a single-slope patch with a mismatched shingle. They must replace the entire roof to maintain architectural uniformity.
blog/nail-pops-roof-leaks-powell-dublin.html:78:          <div><strong class="text-blue-950">Prevention Standard:</strong> Matchwork installs CertainTeed NailTrak® wide-fastening systems with ring-shank nails to eliminate fastener back-out permanently.</div>
blog/shingle-granule-loss-columbus.html:104:          <div><strong class="text-blue-950">Recommended Action:</strong> Full architectural replacement with CertainTeed Landmark PRO to restore Class A fire rating and 130 MPH wind warranty.</div>
locations/powell-oh.html:7:  <meta name="description" content="Powell, OH roofing contractor serving Golf Village, The Retreat, and Scioto Reserve (43065). CertainTeed architectural shingles, storm damage inspection, and OAC 3901-1-54 claim matching.">
locations/new-albany-oh.html:105:          Preserving the Georgian architectural aesthetic of New Albany. We handle ARB approval submissions, heavy-gauge copper flashing, CertainTeed Grand Manor installations, and forensic insurance claim defense.
locations/upper-arlington-oh.html:7:  <meta name="description" content="Upper Arlington's premier roofing contractor. Historical district compliance, CertainTeed Grand Manor luxury shingles, copper flashing, and insurance storm restoration across UA (43220 / 43221).">
locations/dublin-oh.html:7:  <meta name="description" content="Premier Dublin, OH residential roofing contractor. CertainTeed Landmark PRO & Grand Manor installations, Muirfield Village ARB compliance, 50-year warranties, and storm restoration across 43016 & 43017.">
locations/dublin-oh.html:106:          From Muirfield Village to Tartan Fields, we install high-definition CertainTeed Landmark PRO and luxury Grand Manor slate-profile shingles with strict HOA architectural compliance, white-glove landscape protection, and 50-year non-prorated warranties.
services/roof-replacement-columbus.html:7:  <meta name="description" content="Central Ohio's premier residential roof replacement contractor. Certified CertainTeed & Owens Corning systems, transparent pricing, 50-year warranties, and flexible financing in Columbus, OH.">
services/roof-replacement-columbus.html:145:          Upgrade your home with architectural-grade CertainTeed and Owens Corning roofing systems. 1-day professional tear-off, 100% magnetic nail cleanup, ice-and-water shield protection, and transferable 50-year non-prorated warranties.
services/roof-replacement-columbus.html:206:          <h3 class="text-2xl font-black text-blue-950 mb-1">CertainTeed Landmark</h3>
services/roof-replacement-columbus.html:245:          <h3 class="text-2xl font-black text-blue-950 mb-1">CertainTeed Grand Manor</h3>
locations/westerville-oh.html:105:          From Highland Lakes to Uptown historic homes, we provide CertainTeed architectural shingle replacements, ice dam defense near Hoover Reservoir, and full insurance claim restoration under Ohio matching rule OAC 3901-1-54.
services/shingle-matching-test.html:199:        <p class="text-xs text-slate-600 leading-relaxed">Manufacturers regularly retire older shingle molds (e.g. CertainTeed Horizon, Atlas Chalet, GAF Timberline 30). Once discontinued, replacement stock is legally unavailable.</p>
services/shingle-matching-test.html:220:          <h4 class="font-bold text-lg text-slate-900 mt-2 mb-1">CertainTeed Horizon</h4>
services/shingle-matching-test.html:225:          <h4 class="font-bold text-lg text-slate-900 mt-2 mb-1">Atlas Chalet</h4>
services/shingle-matching-test.html:230:          <h4 class="font-bold text-lg text-slate-900 mt-2 mb-1">Owens Corning Prominence</h4>

### financing
index.html:114:        <a href="#pricing" class="hover:text-blue-950 transition">Financing</a>
index.html:151:            <span class="text-amber-400 font-bold text-base block">0% APR</span>
index.html:152:            Flexible Financing
index.html:299:  <!-- Flexible Financing & Custom Proposals -->
index.html:303:        <span class="text-amber-400 text-xs font-black uppercase tracking-wider">Bespoke Investment & Financing</span>
index.html:304:        <h2 class="text-3xl md:text-4xl font-black tracking-tight">Custom Architectural Proposals. Zero Guesswork. 0% APR Financing.</h2>
index.html:309:          <div><strong class="text-amber-400 text-sm block">0% APR</strong> for 12 or 24 Months</div>
index.html:310:          <div><strong class="text-amber-400 text-sm block">Up to 120 Mos</strong> Low Monthly Payment Plans</div>
services/storm-damage-insurance-claims.html:275:        Under Ohio Revised Code Section 3999.22, it is illegal for a roofing contractor to pay, rebate, waive, or promise to pay all or part of an insurance deductible. Matchwork Roofing operates with 100% legal compliance: we work directly with your insurer’s Xactimate line items to ensure full scope coverage, and your financial obligation is strictly your legal insurance policy deductible.
services/roof-replacement-columbus.html:7:  <meta name="description" content="Central Ohio's premier residential roof replacement contractor. Certified CertainTeed & Owens Corning systems, transparent pricing, 50-year warranties, and flexible financing in Columbus, OH.">
services/roof-replacement-columbus.html:62:              "text": "Roof replacement pricing is customized to each home based on exact digital aerial drone measurements, roof pitch, structural decking condition, and selected architectural or luxury material tier. Matchwork provides detailed, itemized fixed-price proposals with 0% APR financing options."
services/roof-replacement-columbus.html:300:        <p class="text-slate-600 text-xs leading-relaxed">We perform a high-precision aerial drone takeoff to calculate exact roof facets, pitch, and valley measurements. We then present an itemized, fixed-price proposal with physical sample boards and 0% financing options.</p>
services/roof-replacement-columbus.html:307:        <h3 class="font-bold text-blue-950 mb-2">Do you offer roof financing?</h3>
services/roof-replacement-columbus.html:308:        <p class="text-slate-600 text-xs leading-relaxed">Yes. We provide 0% interest promotional financing for 12 or 24 months and low-monthly-payment options up to 120 months through top home improvement lenders.</p>

### warranty/superlative/other claims
portfolio-map.html:147:        details: "Concealed fastener standing seam system, 130+ MPH wind rating, 70-year architectural lifespan.",
index.html:6:  <title>Matchwork Roofing | Columbus OH Premier Architectural Roofing & Craftsmanship</title>
index.html:7:  <meta name="description" content="Central Ohio's premier residential roofing contractor. Architectural CertainTeed systems, designer slate profiles, white-glove property care, and forensic insurance restoration in Columbus, Dublin, Upper Arlington, & New Albany.">
index.html:88:        <span>📍 Serving Columbus & Central Ohio's Premier Neighborhoods</span>
index.html:90:        <span class="hidden md:inline text-emerald-400 font-medium">⭐ 50-Year Non-Prorated System Warranties</span>
index.html:135:          We engineer and install premier residential roofing systems tailored to Central Ohio's finest architectural homes. Master CertainTeed installations, designer slate profiles, 100% white-glove property care, and transferable 50-year non-prorated warranties.
index.html:147:            <span class="text-amber-400 font-bold text-base block">50-Year</span>
index.html:148:            Non-Prorated Coverage
index.html:155:            <span class="text-amber-400 font-bold text-base block">White-Glove</span>
index.html:167:        <p class="text-slate-500 text-xs mb-6">Schedule your comprehensive aerial drone measurement, color consultation, and written proposal.</p>
index.html:221:        <h3 class="font-bold text-lg text-blue-950">White-Glove Property Care</h3>
index.html:226:        <h3 class="font-bold text-lg text-blue-950">50-Year Non-Prorated Warranty</h3>
index.html:227:        <p class="text-slate-600 text-xs leading-relaxed">Backed directly by CertainTeed and Owens Corning with transferable 50-year non-prorated material protection plus our 10-year Matchwork Workmanship Guarantee.</p>
index.html:238:        <p class="text-slate-600 text-xs mt-2">Every home has distinct architectural character. We install the nation's premier material collections:</p>
index.html:247:            <p class="text-slate-600 text-xs leading-relaxed">Heavier dual-layer laminate shingles engineered with Max Def color granules for rich depth and 130 MPH wind resistance. Central Ohio's top retail choice.</p>
index.html:306:          Every home has unique pitch, architectural details, and material specifications. We conduct high-precision aerial drone takeoffs and deliver a transparent, itemized written proposal with guaranteed fixed pricing and zero surprise change orders.
index.html:320:              <strong class="text-blue-950 block">Digital Aerial Drone Takeoff</strong>
index.html:335:              <span>Clear written contract backed by our 50-year warranty guarantee.</span>
index.html:340:          Schedule Free Drone Measurement & Proposal
index.html:449:        <p class="text-slate-500 leading-relaxed">Central Ohio's premier architectural residential roofing contractor and exterior craftsmanship specialists.</p>
service-areas.html:135:        Matchwork Roofing serves Columbus and the suburban communities that ring it — architectural roof replacements, designer slate profiles, storm damage restoration, and ITEL shingle match testing. Same craftsmanship standard and the same white-glove property care whether your home sits on a Dublin cul-de-sac or a century-old Clintonville street.
referral.html:26:      <div><span>📍 Serving Columbus &amp; Central Ohio's Premier Neighborhoods</span> | <span>🤝 It Pays to Have Friends</span></div>
referral.html:77:          Know a neighbor with curling shingles, a client closing on a house, or a friend still arguing with an adjuster? Send them our way. We'll bring the same architectural craftsmanship, white-glove property care, and straight answers we bring to every Central Ohio roof — and you get thanked for it.
referral.html:232:        <p class="text-slate-500 leading-relaxed">Central Ohio's premier architectural residential roofing contractor and exterior craftsmanship specialists.</p>
blog/nail-pops-roof-leaks-powell-dublin.html:88:        Schedule a detailed drone measurement and physical roof inspection across Powell, Dublin, Upper Arlington, or New Albany.
blog/index.html:145:        Schedule a complimentary, high-resolution aerial drone measurement and forensic photo audit with our team.
blog/shingle-granule-loss-columbus.html:99:          During an aerial drone audit in Upper Arlington (43221), our team documented extensive bald patches along south-facing roof slopes where sun exposure was highest.
blog/shingle-granule-loss-columbus.html:104:          <div><strong class="text-blue-950">Recommended Action:</strong> Full architectural replacement with CertainTeed Landmark PRO to restore Class A fire rating and 130 MPH wind warranty.</div>
blog/shingle-granule-loss-columbus.html:135:        If your shingles are displaying bald spots or exposing fiberglass, spot repairs are generally ineffective because the entire slope's asphalt has aged uniformly. A professional drone inspection can measure exact facet wear and identify whether insurance coverage or a scheduled architectural replacement is the best path forward.
blog/shingle-granule-loss-columbus.html:144:        Matchwork Roofing provides complimentary high-resolution drone photo audits. We will document your shingle granule depth and send you an itemized report.
blog/shingle-granule-loss-columbus.html:147:        Schedule Free Drone Photo Audit
locations/new-albany-oh.html:120:        <p class="text-slate-500 text-xs mb-5">Estate-level drone inspection & color board preparation.</p>
locations/dublin-oh.html:7:  <meta name="description" content="Premier Dublin, OH residential roofing contractor. CertainTeed Landmark PRO & Grand Manor installations, Muirfield Village ARB compliance, 50-year warranties, and storm restoration across 43016 & 43017.">
locations/dublin-oh.html:106:          From Muirfield Village to Tartan Fields, we install high-definition CertainTeed Landmark PRO and luxury Grand Manor slate-profile shingles with strict HOA architectural compliance, white-glove landscape protection, and 50-year non-prorated warranties.
locations/dublin-oh.html:121:        <p class="text-slate-500 text-xs mb-5">Drone inspection, color samples, and itemized proposal.</p>
locations/powell-oh.html:120:        <p class="text-slate-500 text-xs mb-5">Drone storm audit & high-definition photo report.</p>
locations/upper-arlington-oh.html:7:  <meta name="description" content="Upper Arlington's premier roofing contractor. Historical district compliance, CertainTeed Grand Manor luxury shingles, copper flashing, and insurance storm restoration across UA (43220 / 43221).">
locations/westerville-oh.html:7:  <meta name="description" content="Top-rated Westerville, OH roofing contractor serving Uptown Westerville, Highland Lakes, and Hoover Reservoir (43081 / 43082). Complete roof replacement, storm repairs, and OAC 3901-1-54 insurance matching.">
services/roof-replacement-columbus.html:7:  <meta name="description" content="Central Ohio's premier residential roof replacement contractor. Certified CertainTeed & Owens Corning systems, transparent pricing, 50-year warranties, and flexible financing in Columbus, OH.">
services/roof-replacement-columbus.html:44:        "description": "Complete tear-off and installation of architectural and luxury asphalt shingle systems with 50-year transferable warranties across Central Ohio.",
services/roof-replacement-columbus.html:62:              "text": "Roof replacement pricing is customized to each home based on exact digital aerial drone measurements, roof pitch, structural decking condition, and selected architectural or luxury material tier. Matchwork provides detailed, itemized fixed-price proposals with 0% APR financing options."
services/roof-replacement-columbus.html:78:              "text": "We install complete manufacturer roofing systems backed by 50-year non-prorated manufacturer material warranties and our 10-year Matchwork Workmanship Guarantee."
services/roof-replacement-columbus.html:92:      <div><span>📍 Serving Columbus & Central Ohio Suburbs</span> | <span>⭐ 50-Year Non-Prorated Warranty Protection</span></div>
services/roof-replacement-columbus.html:145:          Upgrade your home with architectural-grade CertainTeed and Owens Corning roofing systems. 1-day professional tear-off, 100% magnetic nail cleanup, ice-and-water shield protection, and transferable 50-year non-prorated warranties.
services/roof-replacement-columbus.html:228:          <p class="text-slate-600 text-xs leading-relaxed my-4">Heavier grade Max Def color granules with 130 mph wind certification. Upgraded starter course and high-definition ridge cap protection.</p>
services/roof-replacement-columbus.html:231:            <li class="flex items-center gap-2">✓ 130 MPH Wind Warranty Standard</li>
services/roof-replacement-columbus.html:233:            <li class="flex items-center gap-2">✓ 50-Year Non-Prorated Manufacturer Coverage</li>
services/roof-replacement-columbus.html:300:        <p class="text-slate-600 text-xs leading-relaxed">We perform a high-precision aerial drone takeoff to calculate exact roof facets, pitch, and valley measurements. We then present an itemized, fixed-price proposal with physical sample boards and 0% financing options.</p>
services/storm-damage-insurance-claims.html:247:          <p class="text-xs text-slate-600 leading-relaxed">High-definition 4K drone photography and 100-sq-ft test square documentation of hail hits and wind creases.</p>
services/storm-damage-insurance-claims.html:262:          <p class="text-xs text-slate-600 leading-relaxed">Complete tear-off and replacement in 1 day with 50-year warranty registration and zero out-of-pocket beyond your deductible.</p>
services/storm-damage-insurance-claims.html:275:        Under Ohio Revised Code Section 3999.22, it is illegal for a roofing contractor to pay, rebate, waive, or promise to pay all or part of an insurance deductible. Matchwork Roofing operates with 100% legal compliance: we work directly with your insurer’s Xactimate line items to ensure full scope coverage, and your financial obligation is strictly your legal insurance policy deductible.

### emails
referral.html:29:        <span>info@matchworkroofing.com</span>
referral.html:162:            <input type="email" id="your-email" name="your-email" placeholder="you@example.com" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-950 outline-none">
referral.html:220:        <a href="mailto:info@matchworkroofing.com" class="block text-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg border border-white/20 text-xs transition">
referral.html:221:          ✉️ info@matchworkroofing.com
referral.html:258:        <p>✉️ info@matchworkroofing.com</p>
referral.html:311:        window.location.href = 'mailto:info@matchworkroofing.com'
service-areas.html:20:        "email": "info@matchworkroofing.com",
service-areas.html:88:        <span>info@matchworkroofing.com</span>
service-areas.html:255:        <p class="text-center text-slate-400 text-xs pt-1">✉️ info@matchworkroofing.com</p>
service-areas.html:291:        <p>✉️ info@matchworkroofing.com</p>
index.html:94:        <span class="hidden sm:inline">info@matchworkroofing.com</span>
index.html:475:        <p>✉️ info@matchworkroofing.com</p>
blog/index.html:19:        <span>info@matchworkroofing.com</span>
locations/new-albany-oh.html:55:        <span>info@matchworkroofing.com</span>
locations/new-albany-oh.html:178:        <p>✉️ info@matchworkroofing.com</p>
locations/powell-oh.html:55:        <span>info@matchworkroofing.com</span>
locations/powell-oh.html:183:        <p>✉️ info@matchworkroofing.com</p>
locations/upper-arlington-oh.html:55:        <span>info@matchworkroofing.com</span>
locations/upper-arlington-oh.html:183:        <p>✉️ info@matchworkroofing.com</p>
locations/dublin-oh.html:56:        <span>info@matchworkroofing.com</span>
locations/dublin-oh.html:185:        <p>✉️ info@matchworkroofing.com</p>
services/roof-replacement-columbus.html:95:        <span>info@matchworkroofing.com</span>
services/roof-replacement-columbus.html:343:        <p>✉️ info@matchworkroofing.com</p>
services/storm-damage-insurance-claims.html:87:        <span>claims@matchworkroofing.com</span>
services/storm-damage-insurance-claims.html:325:        <p>✉️ claims@matchworkroofing.com</p>
services/shingle-matching-test.html:79:        <span>claims@matchworkroofing.com</span>
services/shingle-matching-test.html:267:        <p>✉️ claims@matchworkroofing.com</p>
locations/westerville-oh.html:55:        <span>info@matchworkroofing.com</span>
locations/westerville-oh.html:183:        <p>✉️ info@matchworkroofing.com</p>

### phone strings
index.html:180:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-950 outline-none">
referral.html:166:            <input type="tel" id="your-phone" name="your-phone" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-950 outline-none">
referral.html:186:                <input type="tel" id="referral-phone" name="referral-phone" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-950 outline-none">
locations/new-albany-oh.html:133:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none">
locations/dublin-oh.html:134:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-950 outline-none">
locations/powell-oh.html:133:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none">
services/roof-replacement-columbus.html:173:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none">
locations/westerville-oh.html:133:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none">
services/shingle-matching-test.html:157:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none">
locations/upper-arlington-oh.html:133:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none">
services/storm-damage-insurance-claims.html:165:              <input type="tel" placeholder="(614) 000-0000" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none">
